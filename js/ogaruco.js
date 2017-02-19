//! ogaruco.js
//! version : 1.1
//! authors : howmori
//! license : MIT
//! howml.org

// LinkdataのデータセットIDを入力
var ldDataset = 'rdf1s4545i';

var dIdx = 3;
var dispDays = 7;
var menuData = [];
var menuIdx = 0;
var todayYyyyM;
var todayDInt;
var nextMonthYyyyM;

function getMenu(mmt) {
	// 今月
	todayYyyyM = mmt.format('YYYY_M');
	todayDInt = parseInt(mmt.format('D'));
	console.log('todayYyyyM = ' + todayYyyyM);
	console.log('todayDInt = ' + todayDInt);
	// 翌月
	mmt.add(1, 'months');
	nextMonthYyyyM = mmt.format('YYYY_M');
	// 今月のデータを取得
	getMenuFromLinkData(todayYyyyM).then(thisMonthSuccess, linkDataError);
}

function thisMonthSuccess(data) {
	var lines = data.split("\n");
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].indexOf('#') == 0) {
			continue;
		}
		if (menuIdx >= dispDays) {
			break;
		}
		var properties = lines[i].trim().split("\t");
		if (properties[dIdx] >= todayDInt) {
			menuData[menuIdx] = properties;
			setDateLabel(menuIdx);
			menuIdx++;
		}
	}
	// 日数が足りていなければ翌月のデータを取得
	if (menuIdx >= dispDays) {
		writeFirstDay();
	} else {
		getMenuFromLinkData(nextMonthYyyyM).then(nextMonthSuccess, linkDataError);
	}
}

function nextMonthSuccess(data) {
	var lines = data.split("\n");
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].indexOf('#') == 0) {
			continue;
		}
		if (menuIdx > todayDInt) {
			break;
		}
		var properties = lines[i].trim().split("\t");
		menuData[menuIdx] = properties;
		setDateLabel(menuIdx);
		menuIdx++;
	}
	writeFirstDay();
}

function linkDataError(error) {
	alert('Error retrieving csv file');
}

function getMenuFromLinkData(yyyy_m) {
	return new Promise(function(resolve, reject){
		var tableName = 'hkd_mori_kyushoku_' + yyyy_m;
		var dataUrl = 'http://linkdata.org/api/1/' + ldDataset + '/' + tableName + '_tsv.txt';
		$.ajax ({
			type:'GET',
			url: dataUrl,
			dataType:'jsonp',
			success: function(data) {
				resolve(data);
			},
			error: function(error) {
				reject(error);
			}
		});
	});
}

function writeFirstDay() {
	// メニューを書く
	setMenuToTarget(0);
	setMenuToTarget(1);
	setMenuToTarget(2);
	setMenuToTarget(3);
	setMenuToTarget(4);
	setMenuToTarget(5);
	setMenuToTarget(6);
}

function setDateLabel(targetIdx) {
	var targetDateDiv = $('#day' + targetIdx + ' .days');
	targetDateDiv.html('<a class="list-group-item" data-toggle="collapse" data-parent="#ogaruco" href="#lg' + targetIdx +'">' +  
	menuData[targetIdx][2] + '/' + menuData[targetIdx][3] + ' (' + menuData[targetIdx][4] + ')'
	+ '</a>');
}

function setMenuToTarget(targetIdx) {
	var targetLi = $('#lg' + targetIdx);
	var divMenu = $('<div class="panel-body">');
	if (menuData[targetIdx][5] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][5]  + '</div>'));
	}
	if (menuData[targetIdx][6] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][6]  + '</div>'));
	}
	if (menuData[targetIdx][7] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][7]  + '</div>'));
	}
	if (menuData[targetIdx][8] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][8]  + '</div>'));
	}
	if (menuData[targetIdx][9] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][9]  + '</div>'));
	}
	if (menuData[targetIdx][10] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][10]  + '</div>'));
	}
	if (menuData[targetIdx][11] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][11]  + '</div>'));
	}
	var monthSlice = (("0" + menuData[targetIdx][2]).slice(-2));
	var daySlice = (("0" + menuData[targetIdx][3]).slice(-2));
	var MailDate = menuData[targetIdx][1] + monthSlice + daySlice;
	divMenu.append($('<a href="https://www.google.com/calendar/gp?pli=1#~calendar:view=e&bm=1&action=TEMPLATE&text=オガルコリマインダー&dates=' + MailDate + '/' + MailDate + '&details=' + 
	menuData[targetIdx][5] + '%0D%0A' + 
	menuData[targetIdx][6] + '%0D%0A' + 
	menuData[targetIdx][7] + '%0D%0A' + 
	menuData[targetIdx][8] + '%0D%0A' + 
	menuData[targetIdx][9] + '%0D%0A' + 
	menuData[targetIdx][10] + '%0D%0A' + 
	menuData[targetIdx][11] + '%0D%0A' +  
	'&trp=undefined&trp=true&sprop=" target="_blank"  class="btn btn-default center-block" role="button">Googleカレンダーに登録</a>'));
	 $(targetLi).append(divMenu);
}

$(function() {
	var mmt = moment();
	mmt.subtract(3, 'days');
	var menu = getMenu(mmt);
});
