var createSheet = require('./create-sheet');

onmessage = function(e) {
  postMessage(createSheet(e.data.name, e.data.data, e.data.opt));
};
