angular.module('hackathon').service('ApiService', ApiService);

function ApiService($http, $q, $log, $timeout) {
    function getExtraHeaders() {
        const headers = window.apiConfig.getAuthHeaders();
        headers['Accept'] = 'application/json';
        return headers;
    }

    const MAX_RETRIES = 3;

    let unresolvedRequests = 0;

    /**
     * Executes a HTTP request and makes some improvements on $http.
     *
     * The promise returned by Angular's $http has add-on methods 'success' and 'error', which
     * behave in unexpected ways when combined with the normal 'then' and 'catch' methods. Convert
     * the promise to a normal one so that 'success' and 'error' are unavailable.
     *
     * If the server responds with status 502 (bad gateway) or -1 (no connection), the request will
     * be attempted again.
     *
     * Options may have these properties:
     * - offlineRetryLimit, a number
     * - timeout, a number of milliseconds
     *
     * @return {Promise}
     */
    function execute(method, path, postData, options = {}) {
        const normalDeferred = $q.defer();

        const maxRetries = (options && typeof options.offlineRetryLimit === 'number' ? options.offlineRetryLimit : MAX_RETRIES);
        let retries = 0;

        const timeout = (options && typeof options.timeout !== 'undefined' ? options.timeout : undefined);

        unresolvedRequests++;

        function makeCallAndRetry() {
            $http({
                method,
                url: addBaseUrl(path),
                data: postData,
                headers: getExtraHeaders(),
                timeout,
            })
                .then(response => {
                    normalDeferred.resolve(response);
                    unresolvedRequests -= 1;
                })
                .catch(response => {
                    if (response &&
                            response.status &&
                            (response.status === 502 || response.status === -1) &&
                            retries < maxRetries) {
                        retries += 1;
                        $log.warn('Got status ' + response.status + ' from API request; retrying in 3 seconds', {method, path});
                        $timeout(() => makeCallAndRetry(method, path, postData), 3000);
                    } else {
                        normalDeferred.reject(response);
                        unresolvedRequests -= 1;
                    }
                });
        }

        makeCallAndRetry();

        return normalDeferred.promise;
    }

    function addBaseUrl(url) {
        return window.apiConfig.apiBaseUrl.replace(/\/$/, '') + url;
    }

    /**
     * Changes ISO-8601 strings to date objects, recursively.
     *
     * @param  {mixed} input
     * @return {mixed}
     */
    function contextualize(input) {
        if (typeof input === 'number' || typeof input ==='boolean' || input === null || input === undefined) {
            return input;
        } else if (typeof input === 'string') {
            if (window.parseIso8601.regex.test(input)) {
                return new Date(window.parseIso8601(input));
            } else {
                return input;
            }
        } else if (input instanceof Array) {
            return input.map(contextualize);
        } else if (input instanceof Object && input.constructor === Object) {
            for (let key in input) {
                input[key] = contextualize(input[key]);
            }
            return input;
        } else {
            $log.warn('Unexpected input given to contextualize: ' + input + ' (' + (typeof input) + ')');
            return input;
        }
    }

    const service = {
        get: function(path) {
            return execute('GET', path);
        },

        post: function(path, data, options = {}) {
            return execute('POST', path, data, options);
        },

        put: function(path, data) {
            return execute('PUT', path, data);
        },

        'delete': function(path) {
            return execute('DELETE', path);
        },

        getExtraHeaders,

        addBaseUrl,

        /**
         * Changes ISO-8601 strings to date objects, recursively.
         *
         * @param  {Object} object
         * @return {Object} The contextualized object.
         */
        contextualizeResponse(object) {
            object = angular.copy(object);
            return contextualize(object);
        },

        getUnresolvedRequests() {
            return unresolvedRequests;
        },
    };

    return service;
}
