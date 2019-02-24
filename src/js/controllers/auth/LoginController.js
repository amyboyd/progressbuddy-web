angular.module('hackathon').controller('LoginController', function(SecurityService, DocumentTitleService, LoadingService,
        NotificationService, ActiveUser, ApiService, $log) {
    SecurityService.requireLoggedOut();
    DocumentTitleService.set('Login');
    LoadingService.hide();

    const vm = this;

    vm.email = 'coach-bob@example.com';
    vm.password = 'pass1234';

    vm.login = () => {
        LoadingService.show();

        ApiService.post('/authentication/login', {email: vm.email, password: vm.password})
            .then(response => {
                ActiveUser.setAuthorization(response.data.user, response.data.authToken.token);
                SecurityService.redirectAfterLogin();
            })
            .catch(error => {
                NotificationService.error('Login failed. Please double check your email address and password were entered correctly.');
                $log.error('Error logging in', error);
            })
            .finally(LoadingService.hide);
    };
});
