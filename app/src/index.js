var createSheet = require('./create-sheet');
var saveAs = require('./lib/FileSaver');

var xlsx = {createSheet: createSheet, saveAs: saveAs};
module.exports = xlsx;
