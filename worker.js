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

var clicksub = buttonclick$.subscribe(function (clicktotal) {
    patchDOM({'selector': 'span#count', 'value': clicktotal})
  },
  errHandler,
  compHandler
)


var url$ = domevent$.filter(function (cmd) {
  return 'url' === cmd.cmd
})
  .map(function (cmd) { return cmd.url })

var urlsub = url$.subscribe(function (url) {
  console.log(url)
})


var allevent$ = domevent$.map(function (cmd) {
  return cmd.event.element
})

var eventsub = allevent$.subscribe(function (elem) {
    console.log(elem)
  },
  errHandler,
  compHandler
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

function errHandler (err) { console.log('Error %s', err) }
function compHandler () { console.log('Completed') }
