angular.module('hackathon').config(function($routeProvider, getTemplateUrl) {
    const emptyController = ['LoadingService', function(LoadingService) {
        LoadingService.hide();
    }];

    $routeProvider
        .when('/', {
            controller: 'HomeController',
            controllerAs: 'HomeCtrl',
            templateUrl: getTemplateUrl('home/home.html'),
        })
        .when('/login', {
            controller: 'LoginController',
            controllerAs: 'Login',
            templateUrl: getTemplateUrl('auth/login.html'),
        })
        .when('/clients', {
            controller: 'ClientListController',
            controllerAs: 'ListCtrl',
            templateUrl: getTemplateUrl('clients/list.html'),
        })
        .when('/clients/:id', {
            controller: 'ViewClientController',
            controllerAs: 'ViewCtrl',
            templateUrl: getTemplateUrl('clients/view.html'),
        })
        .otherwise({
            controller: emptyController,
            templateUrl: getTemplateUrl('404.html'),
        });
});
