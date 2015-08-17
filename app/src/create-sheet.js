var XLSX = require('./lib/xlsx');
var Workbook = require('./lib/workbook');
var streamToBuffer = require('./stream-to-buffer');

function createSheet(name, data, opt) {
  var workbook = Workbook().addRowsToSheet(name, data);

  var merge = opt && opt.mergeConfig || [];
  var width = opt && opt.widthConfig || [];

  merge.map(function(merge) {
    workbook.mergeCells(name, merge);
  });

  width.map(function(value, key) {
    workbook.setColWidthPixels(name, key, value);
  });

  workbook.finalize();

  var stream = XLSX.write(workbook, {bookType: 'xlsx', bookSST: true, type: 'binary'});
  return (new Blob([streamToBuffer(stream)], {type: "application/octet-stream"}));
}

module.exports = createSheet;
