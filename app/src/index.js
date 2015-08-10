var XLSX = require('./lib/xlsx');
var Workbook = require('./lib/workbook');
var Blob = require('blob');
var saveAs = require('./lib/FileSaver');

function streamToBuffer(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function gerar(planilha, linhas, merge) {

  var workbook = Workbook().addRowsToSheet(planilha, linhas).finalize();

  (merge || []).map(function(merge) {
    workbook.mergeCells(planilha, merge);
  });

  workbook.finalize();

  var stream = XLSX.write(workbook, {bookType: 'xlsx', bookSST: true, type: 'binary'});
  return (new Blob([streamToBuffer(stream)], {type: "application/octet-stream"}));
}

var xlsx = {gerar: gerar, saveAs: saveAs};
module.exports = xlsx;
