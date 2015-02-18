'use strict';

var paths = {
	js: ['*.js', 'app/**/*.js']
};

module.exports = function(grunt) {

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['public/build'],
		watch: {
			js: {
				files: paths.js,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			all: {
				src: paths.js,
				options: {
					strict: true,
					quotmark: 'single',
					noempty: true,
					node: true,
					undef: true,
					//unused: true,
					globalstrict: true,
					globals: {
						require: false,
						module: false,
						console: false,
						__dirname: false,
						process: false,
						exports: false,
					}
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					args: [],
					ignore: ['node_modules/**'],
					ext: 'js',
					//nodeArgs: ['--debug'],
					delayTime: 1,
					env: {
						PORT: require('./app/config/config').port
					},
					cwd: __dirname
				}
			}
		},
		concurrent: {
			tasks: ['jshint', 'nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			dev: {
				NODE_ENV: 'development'
			}
		}
	});

	//Load NPM tasks
	require('load-grunt-tasks')(grunt);

	//Default task(s).
	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('dev', ['env:dev', 'concurrent']);
	grunt.registerTask('test', ['env:test', 'concurrent']);
};
