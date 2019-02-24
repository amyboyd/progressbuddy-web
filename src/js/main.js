const angularDependencies = [
    'ngRoute',
    'ngSanitize',
];

angular.module('hackathon', angularDependencies);

angular.module('hackathon').run(function($rootScope, $location, $log, LoadingService, ApiService, ActiveUser, SecurityService) {
    $rootScope.$on('$routeChangeStart', function(event, oldRoute, newRoute) {
        LoadingService.show();
    });

    $rootScope.$on('$routeChangeError', function (route, error) {
        if (error && error.type === 'loginRequired') {
            $location.url('/login');
            return;
        }
    });

    $rootScope.isLoggedIn = ActiveUser.isLoggedIn;

    // Ensure the user's authentication is still valid.
    if (ActiveUser.isLoggedIn()) {
        ApiService.get('/authentication/self')
            .then(response => {
                ActiveUser.setAuthorization(response.data.user, window.apiConfig.getAuthToken());
            })
            .catch(error => {
                if (error && error.status === -1) {
                    // User is offline.
                    return;
                }

                // The user's ID or auth token is no longer valid.
                SecurityService.doLogout();
            });
    }
});

const templateCacheBuster = '?cacheBuster=' + Date.now();
angular.module('hackathon').constant('getDirectiveTemplateUrl', (path) => '/js/directives/' + path + templateCacheBuster);
angular.module('hackathon').constant('getTemplateUrl', (path) => '/js/controllers/' + path + templateCacheBuster);
angular.module('hackathon').constant('humanizeDuration', (durationInMs) => {
    return window.humanizeDuration(durationInMs, {
        largest: 1,
        units: ['w', 'd', 'h', 'm', 's'],
        round: true,
    });
});
angular.module('hackathon').constant('isId', input => {
    return typeof input === 'string' && input.length === 24;
});

if (window.config.isMapEnabled) {
    angular.module('hackathon').config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: window.config.googleMapsKey,
            v: '3.30',
        });
    });
}
