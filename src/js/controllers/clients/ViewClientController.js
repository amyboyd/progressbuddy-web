angular.module('hackathon').controller('ViewClientController', function($routeParams, $q, ApiService, SecurityService,
        LoadingService, DocumentTitleService, NotificationService) {
    SecurityService.requireLoggedIn();
    const id = $routeParams.id;
    const vm = this;

    const loadingPromise1 = ApiService.get('/clients/' + id)
        .then(response => {
            vm.client = response.data;
            DocumentTitleService.set(`Client: ${vm.client.name}`);
        });

    const loadingPromise2 = ApiService.get('/clients/' + id + '/appointments')
        .then(response => {
            vm.appointments = response.data;
        });

    const loadingPromise3 = ApiService.get('/clients/' + id + '/progress')
        .then(response => {
            vm.progress = response.data;
            console.log('vm.progress', vm.progress);
        });

    const loadingPromise4 = ApiService.get('/clients/' + id + '/events')
        .then(response => {
            vm.events = response.data;
            console.log('vm.events', vm.events);
        });

    $q.all([loadingPromise1, loadingPromise2, loadingPromise3, loadingPromise4])
        .catch(NotificationService.httpError)
        .finally(LoadingService.hide);
});
