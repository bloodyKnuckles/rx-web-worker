var patchDOM = require('virtual-dom/patch')
var fromJSON = require('vdom-as-json/fromJson')

console.log('main init')
var rootnode = document.documentElement

var worker = new Worker("./workerB.js")
worker.addEventListener('message', function (evt) {
  //console.log('i got: ', evt.data)
  evt.data.forEach(function (cmd) {
    switch ( cmd.cmd ) {
      case 'event': workerHandler(cmd.event); break
      case 'patch': patchHandler(fromJSON(cmd.patch)); break;
    }
  })
}, false)
//worker.postMessage({cmd: 'init', absurl: location.origin + location.pathname})

function patchHandler (patch) {
console.log(patch)
  window.requestAnimationFrame(function () {
    //patchDOM(rootnode, patch)
  })
}

function workerHandler (evtinfo) {
  document.querySelector(evtinfo.element).addEventListener(evtinfo.event, function (evt) {
    //console.log(evt)
    worker.postMessage(
      {
        cmd: 'event',
        'event': {
          'element': evtinfo.element,
          'response': evtinfo.response.split('.').reduce(function (obj, ii) { return obj[ii] }, evt)
        }
      }
    )
  }, false)
}

