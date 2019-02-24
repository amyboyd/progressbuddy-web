angular.module('hackathon').service('LoadingService', function($document) {
    const animation = $document[0].querySelector('.loading-animation');

    // There will be no animation if running Karma unit tests.
    if (!animation) {
        return {
            show: () => {},
            hide: () => {},
        };
    }

    function setDisplay(value) {
        window.requestAnimationFrame(() => animation.style.display = value);
    }

    return {
        show: () => setDisplay('block'),
        hide: () => setDisplay('none'),
    };
});
