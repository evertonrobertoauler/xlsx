var XLSX = require('./lib/xlsx');
var Workbook = require('./lib/workbook');
var Blob = require('blob');

function streamToBuffer(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

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
