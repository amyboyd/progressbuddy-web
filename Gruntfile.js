const fs = require('fs');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    const configFilePath = 'config/config-' + (process.env.CONFIG_FILE || 'local') + '.js';
    if (!fs.existsSync(configFilePath)) {
        console.log('Config file does not exist: ' + configFilePath);
        process.exit(1);
    } else {
        console.log('Using config file:', configFilePath);
    }

    const gruntConfig = {
        babel: {
            options: {
                sourceMap: false,
                presets: ['env'],
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/',
                        src: ['**/*.js'],
                        dest: '.tmp/js/individual-files',
                    },
                ],
            },
        },

        concat: {
            appJs: {
                files: {
                    'dist/js/main.js': [
                        configFilePath,
                        '.tmp/js/individual-files/main.js',
                        '.tmp/js/individual-files/api-lib-integration.js',
                        '.tmp/js/individual-files/**/*.js',
                    ],
                },
            },
            dependencyJs: {
                files: {
                    'dist/js/dependencies.min.js': [
                        'node_modules/angular/angular.min.js',
                        'node_modules/angular-route/angular-route.min.js',
                        'node_modules/lodash/lodash.min.js',
                        'node_modules/angular-sanitize/angular-sanitize.min.js',
                    ],
                },
            },
        },

        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'src/images',
                    dest: 'dist/images',
                    src: '*',
                }],
            },
            appCss: {
                files: [{
                    expand: true,
                    cwd: 'src/styles',
                    dest: 'dist/css',
                    src: 'main.css',
                }],
            },
            fontAwesomeFonts: {
                files: [{
                    expand: true,
                    cwd: 'node_modules/font-awesome/fonts',
                    dest: 'dist/fonts',
                    src: 'fontawesome*',
                }],
            },
            html: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    dest: 'dist',
                    src: '**/*.html',
                }],
            },
            robotsTxt: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    dest: 'dist/',
                    src: 'robots.txt',
                }],
            },
        },

        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            dist: {
                files: {
                    'dist/js/main.js': ['dist/js/main.js'],
                },
            },
        },

        uglify: {
            options: {
                mangle: true,
            },
            dist: {
                files: {
                    'dist/js/main.min.js': 'dist/js/main.js',
                },
            },
        },

        less: {
            appCss: {
                files: {
                    '.tmp/css/main.css': 'src/styles/main.less',
                },
            },
        },

        cssmin: {
            options: {
                level: {1: {specialComments: 0}},
            },
            appCss: {
                files: {
                    'dist/css/main.min.css': '.tmp/css/main.css',
                },
            },
            dependencyCss: {
                files: {
                    'dist/css/dependencies.min.css': [
                        'node_modules/font-awesome/css/font-awesome.css',
                    ],
                },
            },
        },

        watch: {
            js: {
                files: [
                    'src/js/**/*.js',
                    configFilePath,
                ],
                tasks: ['js'],
            },
            html: {
                files: ['src/**/*.html'],
                tasks: ['html'],
            },
            css: {
                files: ['src/styles/**/*.less'],
                tasks: ['css'],
            },
        },
    };

    // Ensure all the NPM dependency files exist, because Grunt doesn't error or even warn when
    // a file is missing, causing a debugging nightmare.
    const dependencyFiles = gruntConfig.concat.dependencyJs.files['dist/js/dependencies.min.js'];
    dependencyFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            console.log('Dependency file does not exist: ' + file);
            process.exit(1);
        }
    });

    grunt.initConfig(gruntConfig);

    grunt.registerTask('default', [
        'build',
        'watch',
    ]);
    grunt.registerTask('build', [
        'js',
        'css',
        'images',
        'html',
        'copy:robotsTxt',
    ]);
    grunt.registerTask('js', [
        'babel',
        'concat:appJs',
        'concat:dependencyJs',
        'ngAnnotate',
        'uglify',
        'bust-cache',
    ]);
    grunt.registerTask('css', [
        'less',
        'cssmin',
        'copy:appCss',
        'bust-cache',
    ]);
    grunt.registerTask('images', [
        'copy:images',
        'copy:fontAwesomeFonts',
        'bust-cache',
    ]);
    grunt.registerTask('html', [
        'copy:html',
        'bust-cache',
    ]);

    grunt.registerTask('bust-cache', function() {
        if (!fs.existsSync('dist/index.html')) {
            return;
        }

        const version = Date.now();
        const index = fs.readFileSync('dist/index.html', 'utf8');
        const updated = index
            .replace(/\.css(\?version=\d+)?" \/>/g, `.css?version=${version}" />`)
            .replace(/\.js(\?version=\d+)?">/g, `.js?version=${version}">`);

        if (index !== updated) {
            fs.writeFileSync('dist/index.html', updated);
            console.log('Updated cache buster');
        } else {
            console.log('index', index);
            console.log('updated', updated);
            throw new Error('Unable to update cache buster');
        }
    });
};
