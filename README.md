
# influxdb

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Batch your InfluxDB UDP writes to not flood your network with calls.
With a minimum byte size, tiny UDP writes are avoided.

## API

### const client = InfluxDB(options)

```js
const client = InfluxDB(options)
```

Options:

- `.port` - influxdb port
- `.host` - influxdb host
- `.minlength=1500` - don't send data until this approximate packet size is reached
- `.maxlength=10000` - prematurely send data if the approximate package size is larger than this
- `.interval=1000` - interval to send packets

### client.send(database, documents)

Send documents to a database.
You could send one document or multiple.

```js
client.send('my.database', {
  user: 'asdf'
})

client.send('my.other.database', [
  {
    user: 1
  },
  {
    user: 2
  }
])
```

[npm-image]: https://img.shields.io/npm/v/collector-influxdb.svg?style=flat-square
[npm-url]: https://npmjs.org/package/collector-influxdb
[github-tag]: http://img.shields.io/github/tag/collectors/influxdb.svg?style=flat-square
[github-url]: https://github.com/collectors/influxdb/tags
[travis-image]: https://img.shields.io/travis/collectors/influxdb.svg?style=flat-square
[travis-url]: https://travis-ci.org/collectors/influxdb
[coveralls-image]: https://img.shields.io/coveralls/collectors/influxdb.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/collectors/influxdb
[david-image]: http://img.shields.io/david/collectors/influxdb.svg?style=flat-square
[david-url]: https://david-dm.org/collectors/influxdb
[license-image]: http://img.shields.io/npm/l/collector-influxdb.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/collector-influxdb.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/collector-influxdb
[gittip-image]: https://img.shields.io/gratipay/jonathanong.svg?style=flat-square
[gittip-url]: https://gratipay.com/jonathanong/
