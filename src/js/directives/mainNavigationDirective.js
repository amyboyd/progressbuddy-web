angular.module('hackathon').directive('mainNavigation', function($location, SecurityService, getDirectiveTemplateUrl) {
    return {
        restrict: 'E',
        templateUrl: getDirectiveTemplateUrl('main-navigation.html'),
        controllerAs: 'NavCtrl',
        controller() {
            const vm = this;

            vm.promptToLogout = SecurityService.promptToLogout;

            vm.isOnPage = function isOnPage(expected) {
                const actual = $location.url();
                if (actual === expected) {
                    return true;
                }

                if (expected.substring(expected.length - 1) === '*') {
                    if (actual.indexOf(expected.substring(0, expected.length - 1)) === 0) {
                        return true;
                    }
                }

                return false;
            };
        },
    };
});
