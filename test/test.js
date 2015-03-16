'use strict'

var client = require('..')()

client.send('asdf', {
  test: 1
})

client.send('asdf', [
  {
    test: 2
  },
  {
    test: 3
  }
])

setTimeout(function () {
  process.exit(0)
}, 2000)
