module.exports = function(grunt) {

	var mainJSFiles = ['public/site/scripts/jquery-*.js', 'public/site/scripts/rainbow*.js', 'public/site/scripts/main.js'];
	var galleryJSFiles = ['public/site/scripts/jquery.isotope*.js', 'public/site/scripts/gallery.js'];

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			options: {
				trace: true,
				style: 'compressed'
			},
			styles: {
				files: {
					'public/assets/styles/styles.css': ['public/site/sass/styles.scss'],
					'public/assets/styles/gallery.css': ['public/site/sass/gallery.scss']
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			main: {
				files: {
					'public/assets/scripts/main.min.js': mainJSFiles
				}
			},
			gallery: {
				files: {
					'public/assets/scripts/gallery.min.js': galleryJSFiles
				}
			}
		},

		watch: {
			sass: {
				files: ['public/site/sass/*.scss'],
				tasks: ['sass']
			},
			scripts_main: {
				files: mainJSFiles,
				tasks: ['uglify:main']
			},
			scripts_gallery: {
				files: galleryJSFiles,
				tasks: ['uglify:gallery']
			}
		}
	});

	//Load packages
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['sass', 'uglify', 'watch']);
};