angular.module('hackathon').controller('LogoutController', function(SecurityService) {
    SecurityService.doLogout();
});
