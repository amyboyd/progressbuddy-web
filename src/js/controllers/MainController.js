angular.module('hackathon').controller('MainController', function() {
    if (!window.config.isProtractor) {
        window.setTimeout(() => {
            const main = document.querySelector('.layout-container > main');
            main.addEventListener('scroll', function() {
                if (main.scrollTop > 0) {
                    main.classList.add('scrolled');
                } else {
                    main.classList.remove('scrolled');
                }
            });
        }, 10);
    }
});
