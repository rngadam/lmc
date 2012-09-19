# Plain PDE Formatter

fs = require('fs')

exports.init = ->

  extensions: ['pde']
  assetType: 'pde'
  contentType: 'text/plain'

  compile: (path, options, cb) ->

    input = fs.readFileSync(path, 'utf8')

    cb(input)
