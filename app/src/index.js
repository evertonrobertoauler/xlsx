var createSheet = require('./create-sheet');
var saveAs = require('./lib/FileSaver');
var streamToBuffer = require('./stream-to-buffer');

var xlsx = {createSheet: createSheet, saveAs: saveAs, streamToBuffer: streamToBuffer};
module.exports = xlsx;
