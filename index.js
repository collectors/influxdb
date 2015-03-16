'use strict'

const debug = require('debug')('collector-influxdb')
const InfluxUDP = require('influx-udp')
const exit = require('exit-then')

module.exports = Influx

function Influx(options) {
  if (!(this instanceof Influx)) return new Influx(options)

  let self = this

  options = options || {}
  this.client = new InfluxUDP(options)
  this.buffer = {}

  // don't flush until data is at least this length
  this.MIN_LENGTH = options.minlength || 1500
  // flush early if the data is larger than this
  this.MAX_LENGTH = options.maxlength || 10000
  // interval to check whether to flush data
  this.INTERVAL = options.interval || 1000

  exit.push(function () {
    self.flush(true)
  })
}

// trigger a flush after the timeout
Influx.prototype._timeout = function () {
  let self = this
  if (typeof this.TIMEOUT_ID === 'number') clearTimeout(this.TIMEOUT_ID)
  this.TIMEOUT_ID = setTimeout(function () {
    self.flush(true)
  }, this.INTERVAL)
  return this
}

Influx.prototype.send = function (series, docs) {
  let self = this
  let buffer = this.buffer

  // add these doc(s) to the buffer
  buffer[series] = (buffer[series] || []).concat(docs)

  // set the `.time` of every object if not already set
  // https://github.com/influxdb/influxdb/issues/841
  let now = Math.round(Date.now() / 1000)
  for (let data of buffer[series]) data.time = data.time || now

  // trigger a flush once per tick
  if (!this.flushing) {
    debug('queued flushing')
    this.flushing = true
    setImmediate(function () {
      self.flush()
    })
  }

  if (this.TIMEOUT_ID == null) this._timeout()

  return this
}

Influx.prototype.flush = function (flush) {
  debug('pre flushing')

  this.flushing = false

  if (flush) {
    // if forcing a flush but there's no buffer, flush later
    if (!Object.keys(this.buffer).length) return this._timeout()
  } else {
    // this is an estimated byte length - real byte length is probably smaller
    let length = Buffer.byteLength(JSON.stringify(this.buffer))
    // don't bother flushing when the buffer is too small
    debug('length: ' + length)
    if (length < this.MIN_LENGTH) return this
    if (length > this.MAX_LENGTH) flush = true
  }

  if (!flush) return this

  debug('flushing')

  this._timeout()
  this.client.send(this.buffer)
  this.buffer = {}
  return this
}
