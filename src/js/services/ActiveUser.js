angular.module('hackathon').service('ActiveUser', ActiveUser);

function ActiveUser($q, ApiService) {
    let currentUser = null;

    function verifyUserIsPresent() {
        if (!currentUser) {
            throw new Error('Current user expected but is not present');
        }
    }

    function updateCachedUser() {
        window.apiConfig.updateCachedUser(currentUser);
    }

    // Initialize the cached user when the app is opened, and update the user to ensure the cached
    // user isn't too out of date.
    currentUser = window.apiConfig.getCachedUser();

    const cachedAuthHeaders = window.apiConfig.getAuthHeaders();
    let abortInitialUserUpdate = false;
    if (Object.keys(cachedAuthHeaders).length === 2) {
        ApiService.get('/self').then(response => {
            if (abortInitialUserUpdate) {
                return;
            }

            if (response.data.user) {
                const refreshedUser = response.data.user;
                currentUser = refreshedUser;
                updateCachedUser(refreshedUser);
            }
        });
    }

    const service = {
        refresh() {
            if (!service.isLoggedIn()) {
                return;
            }

            return ApiService.get('/self')
                .then(response => {
                    if (response.data.user) {
                        const refreshedUser = response.data.user;
                        currentUser = refreshedUser;
                        updateCachedUser(refreshedUser);
                        return refreshedUser;
                    }
                });
        },

        setAuthorization(user, authToken) {
            window.apiConfig.setAuthDetails(user, authToken);
            currentUser = user;
        },

        isLoggedIn() {
            return !!currentUser;
        },

        hasRole(role) {
            return currentUser && currentUser.role === role;
        },

        /**
         * @return {Promise}
         */
        logout() {
            currentUser = null;
            window.apiConfig.clearAuthDetails();
            abortInitialUserUpdate = true;

            const deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        },

        getNullable() {
            return currentUser;
        },

        getOrThrow() {
            verifyUserIsPresent();

            return currentUser;
        },

        /**
         * Updates the local user.
         *
         * Persisting the given changes must be done separately through the core API.
         */
        update(changes) {
            verifyUserIsPresent();

            for (let key in changes) {
                currentUser[key] = changes[key];
            }

            updateCachedUser();
        },
    };

    return service;
}
