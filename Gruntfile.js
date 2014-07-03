'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: require('./package.json'),
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: true
      },
      src_ci: ['./tags.js'],
      gruntfile_ci: ['./Gruntfile.js'],
      test_ci: ['./test/tags.spec.js'],
      src: {
        options: {
          force: true
        },
        src: ['./tags.js']
      },
      gruntfile: {
        options: {
          force: true
        },
        src: ['./Gruntfile.js']
      },
      test: {
        options: {
          force: true
        },
        src: ['./test/tags.spec.js']
      }

    },
    'bower-install-simple': {
      options: {
        directory: './test/support/'
      }
    },
    watch: {
      src: {
        files: [
          './tags.js',
          './tags.html'
        ],
        tasks: ['jshint:src', 'bower-install-simple', 'karma:dev:run']
      },
      test: {
        files: ['./test/tags.spec.js'],
        tasks: ['jshint:test', 'bower-install-simple', 'karma:dev:run']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile']
      }
    },
    html2js: {
      options: {
        base: '.'
      },
      templates: {
        src: 'tags.html',
        dest: 'temp/tags.html.js',
        module: 'badwing.tags.templates'
      }
    },
    less: {
      dist: {
        options: {
          yuicompress: false
        },
        files: {
          "./demo/css/tags.css": "demo/less/tags.less"
        }
      }
    },
    uglify: {
      options: {
        report: 'min',
        sourceMap: false
      },
      distMin: {
        files: {
          './tags.min.js': ['tags.js']
        }
      },
      // Just concatinate
      distTpls: {
        options: {
          preserveComments: true,
          mangle: false, 
          compress: false,
        },
        files: {
          './tags.tpls.js': ['temp/templates.js', 'tags.js']
        }
      },
      distMinTpls: {
        files: {
          './tags.tpls.min.js': ['temp/templates.js', 'tags.js']
        }
      }
    },
    karma: {
      options: {
        frameworks: ['mocha', 'chai-sinon'],
        files: [
          './test/support/jquery/dist/jquery.js',
          './test/support/angular/angular.js',
          './test/support/angular-mocks/angular-mocks.js',
          './test/support/angular-bootstrap/ui-bootstrap-tpls.js',
          './temp/tags.html.js',
          './tags.js',
          './test/tags.spec.js'
        ],
        browsers: ['PhantomJS'],
        reporters: ['story'],
        basePath: '.',
        logLevel: 'DEBUG',
        port: 9876
      },
      continuous: {
        options: {
          singleRun: true
        }
      },
      dev: {
        options: {
          background: true
        }
      }
    },
    devUpdate: {
      options: {
        semver: false
      },
      report: {
      },
      upgrade: {
        options: {
          updateType: 'prompt'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test',
    [
      'build', 'jshint:src_ci', 'jshint:gruntfile_ci', 'jshint:test_ci',
      'bower-install-simple', 'karma:continuous'
    ]);
  grunt.registerTask('dev',
    ['build', 'jshint', 'bower-install-simple', 'karma:dev', 'watch']);
  grunt.registerTask('build', ['less', 'html2js', 'uglify', 'uglify:distTpls']);
  grunt.registerTask('default', ['build']);

};
