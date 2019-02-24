angular.module('hackathon').controller('ClientListController', function(ApiService, DocumentTitleService, LoadingService,
        NotificationService, SecurityService, $rootScope, ActiveUser) {
    SecurityService.requireLoggedIn();
    DocumentTitleService.set('clients');
    const vm = this;

    const activeUser = ActiveUser.getOrThrow();
    const coachId = activeUser.coach.coachID;

    ApiService.get(`/coaches/${coachId}/clients`)
        .then(response => {
            vm.clients = response.data;
            vm.count = response.data.length;
        })
        .catch(NotificationService.httpError)
        .finally(LoadingService.hide);
});
