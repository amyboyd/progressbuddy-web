angular.module('hackathon').service('DocumentTitleService', function($document) {
    return {
        set(newTitle) {
            $document[0].title = newTitle;
            $document[0].querySelector('head > title').textContent = newTitle;
        },
    };
});
