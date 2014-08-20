var path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          ignore: [
            'node_modules/**',
            'plugins/**'
          ],
          ext: 'js'
        }
      }
    },
    watch: {
      serverJS: {
         files: ['plugins/**/*.js'],
         tasks: ['newer:jshint:server']
      }
    },
    jshint: {
      server: {
        options: {
          jshintrc: '.jshintrc-server'
        },
        src: [
          'plugins/**/*.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('lint', ['jshint']);
};
