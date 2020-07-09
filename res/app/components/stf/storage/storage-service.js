var Promise = require('bluebird')

module.exports = function StorageServiceFactory($http, $upload) {
  var service = {}

  service.storeUrl = function(type, url) {
    return $http({
      url: '/s/download/' + type
    , method: 'POST'
    , data: {
        url: url
      }
    })
  }

  service.storeFile = function(type, files, options) {

    var resolver = Promise.defer()
    var input = options.filter ? files.filter(options.filter) : files
    if (input.length) {
      $upload.upload({
          url: '/stf/s/upload/' + type
        , method: 'POST'
        , file: input
        })
        .then(
          function(value) {
            resolver.resolve(value)
          }
        , function(err) {
            resolver.reject(err)
          }
        , function(progressEvent) {
            resolver.progress(progressEvent)
          }
        )
    }
    else {
      var err = new Error('No input files')
      err.code = 'no_input_files'
      resolver.reject(err)
    }

    return resolver.promise
  }

  service.storeIosFile = function(type, files, deviceId, bundleId, options) {
    var resolver = Promise.defer()
    var input = options.filter ? files.filter(options.filter) : files
    if (input.length) {
      $upload.upload({
        url: '/stf/s/uploadIos/' + type + '/' + deviceId + '/' + bundleId
        , method: 'POST'
        , file: input
      })
        .then(
          function(value) {
            resolver.resolve(value)
          }
          , function(err) {
            resolver.reject(err)
          }
          , function(progressEvent) {
            resolver.progress(progressEvent)
          }
        )
    }
    else {
      var err = new Error('No input files')
      err.code = 'no_input_files'
      resolver.reject(err)
    }

    return resolver.promise
  }

  return service
}
