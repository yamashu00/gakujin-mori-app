// 岳人の森 数学MAP — 共有データ用のシンプルなAPI（Google Apps Script）
// スプレッドシートを簡易DBとして使い、doGet/doPostでJSONをやり取りする。

var HEADERS = [
  'id', 'team', 'createdAt', 'updatedAt', 'name', 'category',
  'lat', 'lng', 'gpsAccuracy', 'distance', 'angle', 'eyeHeight',
  'height', 'notes',
];

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty('SHEET_ID');
  var ss;
  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (e) {
      ssId = null;
    }
  }
  if (!ssId) {
    ss = SpreadsheetApp.create('岳人の森 数学MAP データ');
    props.setProperty('SHEET_ID', ss.getId());
    var sheet = ss.getActiveSheet();
    sheet.setName('Discoveries');
    sheet.appendRow(HEADERS);
  }
  var sheet = ss.getSheetByName('Discoveries');
  if (!sheet) {
    sheet = ss.insertSheet('Discoveries');
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[i][j];
    }
    if (obj.id) rows.push(obj);
  }
  return jsonOut_({ discoveries: rows });
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (!data.id) {
    return jsonOut_({ ok: false, error: 'id is required' });
  }
  var sheet = getSheet_();
  var range = sheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var idIdx = headers.indexOf('id');
  var rowIndex = -1;
  for (var i = 1; i < values.length; i++) {
    if (values[i][idIdx] === data.id) {
      rowIndex = i + 1;
      break;
    }
  }
  var row = headers.map(function (h) {
    if (h === 'updatedAt') return new Date().toISOString();
    return data[h] !== undefined && data[h] !== null ? data[h] : '';
  });
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  return jsonOut_({ ok: true });
}

// デプロイ前に一度これを実行して認可(OAuth同意)を済ませておく。
function setup() {
  var sheet = getSheet_();
  Logger.log('Sheet URL: ' + sheet.getParent().getUrl());
}
