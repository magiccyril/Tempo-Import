var path     = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , tempo    = { start: { month: 9, day: 1 } }
  , ejp      = { start: { month: 9, day: 1 } }
  , apikey   = 'APIKEY';

module.exports = {
  tempo: tempo,
  ejp: ejp,
  apikey: apikey
}
