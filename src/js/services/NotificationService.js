angular.module('hackathon').service('NotificationService', function() {
    return {
        error(message) {
            window.alert(message);
        },

        success(message = 'Done') {
            if (typeof message !== 'string') {
                message = 'Done';
            }

            window.alert(message);
        },

        httpError(response) {
            const message = response && response.data && response.data.message ?
                response.data.message :
                'Sorry, an error occurred.';
            window.alert(message);
        },
    };
});
