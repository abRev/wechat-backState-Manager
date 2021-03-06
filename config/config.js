var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'backstatemanager'
    },
    port: process.env.PORT || 3008,
    db: 'mongodb://localhost/backstatemanager-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'backstatemanager'
    },
    port: process.env.PORT || 3008,
    db: 'mongodb://localhost/backstatemanager-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'backstatemanager'
    },
    port: process.env.PORT || 3008,
    db: 'mongodb://localhost/backstatemanager-production'
  }
};

module.exports = config[env];
