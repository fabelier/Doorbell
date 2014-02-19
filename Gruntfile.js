/* global module:false */
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: false,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					__dirname: false,
					Buffer: false,
					console: false,
					require: false
				}
			},
			files: [ 'Gruntfile.js', 'index.js' ]
		},

		nodemon: {
			dev: {
				script: 'index.js'
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-nodemon' );

	grunt.registerTask( 'default', [ 'jshint' ] );
	grunt.registerTask( 'serve', ['nodemon']);
};
