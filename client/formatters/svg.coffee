# Plain SVG Formatter

fs = require('fs')

exports.init = ->

  extensions: ['svg']
  assetType: 'svg'
  contentType: 'image/svg+xml'

  compile: (path, options, cb) ->

    input = fs.readFileSync(path, 'utf8')

    cb(input)
