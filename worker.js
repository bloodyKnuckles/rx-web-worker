Rx = require('rx-lite')

console.log('worker init')

var domevent$ = Rx.Observable.fromEvent(self, 'message', function (evt) {
  return evt.data
})

var buttonclick$ = domevent$.filter(function (cmd) {
  return 'event' === cmd.cmd &&
    ('button#down' === cmd.event.element || 'button#up' === cmd.event.element)
})
  .map(function (cmd) { return parseInt(cmd.event.response, 10) })
  .scan(function (prev, next) { return prev + next })

var clicksub = buttonclick$.subscribe(
  function (clicktotal) {
    patchDOM('patch ' + clicktotal)
  },
  function (err) { console.log('Error: %s', err) },
  function () { console.log('Completed') }
)

self.postMessage(
  [
    {cmd: 'event', 'event': {'element': 'button#down', 'event': 'click', 'response': 'target.value'}},
    {cmd: 'event', 'event': {'element': 'button#up', 'event': 'click', 'response': 'target.value'}}
  ]
)

function patchDOM (patch) {
  self.postMessage([{cmd: 'patch', 'patch': patch}])
}
