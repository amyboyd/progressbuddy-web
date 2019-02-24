angular.module('hackathon').directive('rowHref', function($location) {
    return {
        restrict: 'A',
        scope: {
            href: '@rowHref',
        },
        link(scope, element) {
            element[0].addEventListener('click', event => {
                const useNewTab = event.metaKey === true || event.shiftKey === true;

                if (useNewTab) {
                    window.open(scope.href);
                } else {
                    $location.url(scope.href);
                    scope.$apply();
                }
            });
        },
    };
});
