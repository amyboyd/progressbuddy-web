angular.module('hackathon').controller('HomeController', function(DocumentTitleService, SecurityService, LoadingService,
        $location) {
    SecurityService.requireLoggedIn();
    DocumentTitleService.set(null);
    LoadingService.hide();

    $location.url('/clients');
});
