# Plain SVG Formatter

fs = require('fs')

exports.init = ->

  extensions: ['png']
  assetType: 'png'
  contentType: 'image/png'

  compile: (path, options, cb) ->

    input = fs.readFileSync(path, 'utf8')

    cb(input)
