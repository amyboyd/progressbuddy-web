angular.module('hackathon').filter('getPrettyTicketStatus', function () {
    return function(status) {
        if (!status) {
            return null;
        }
        switch (status) {
            case 'NEW':
                return 'New';
            case 'IN_PROGRESS':
                return 'In progress';
            case 'CLOSED':
                return 'Closed';
            case 'DELETED':
                return 'Deleted';
            default:
                throw new Error('Unexpected ticket status: ' + status);
        }
    };
});

