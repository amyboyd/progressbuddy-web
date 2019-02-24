angular.module('hackathon').service('SecurityService', function($location, ActiveUser, $rootScope, ApiService, $log) {
    let globalPermissions;

    let teamAccountCount;
    if (window.localStorage.getItem('teamAccountCount')) {
        teamAccountCount = Number(window.localStorage.getItem('teamAccountCount'));
    }

    const service = {
        isLoggedIn() {
            return ActiveUser.isLoggedIn();
        },

        /**
         * Setting this property will cause the user to be redirected to the given URL after the
         * user authenticates (either via login or registration).
         */
        urlToForwardToAfterLogin: undefined,

        requireLoggedIn() {
            if (!this.isLoggedIn()) {
                this.urlToForwardToAfterLogin = $location.url();
                this.broadcastSecurityError('loginRequired');
            }
        },

        requireLoggedOut() {
            if (this.isLoggedIn()) {
                $log.warn('Required logged out user but is logged in');
                $location.url('/');
                throw new Error('Required logged out user but is logged in');
            }
        },

        broadcastSecurityError(type) {
            $log.warn('Security error', type);

            // The `$routeChangeError` event is handled elsewhere and redirects to an
            // appropriate page based on the security error type.
            $rootScope.$broadcast('$routeChangeError', {type});

            // Throw an error to prevent the controller executing any further.
            throw new Error('Security error: ' + type);
        },

        redirectAfterLogin() {
            const forwardTo = service.urlToForwardToAfterLogin;
            if (forwardTo) {
                $log.debug('Forwarding to URL after login', forwardTo);
                $location.url(forwardTo);
                return;
            }

            $location.url('/');
        },

        promptToLogout() {
            if (!window.confirm('Are you sure you want to log out?')) {
                return;
            }
            service.doLogout();
        },

        doLogout() {
            ActiveUser.logout();
            window.location = '/#/login';
        },
    };

    return service;
});
