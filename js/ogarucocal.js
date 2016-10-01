//! ogarucocal.js
//! version : 1.0
//! authors : howmori
//! license : MIT
//! howml.org

// LinkdataのデータセットIDを入力
var dataUrl = 'http://linkdata.org/api/1/rdf1s4558i/child_jigyo_013455_2016_tsv.txt';
		
var dIdx = 2;
var dispDays = 11;
var menuData = [];
var menuIdx = 0;
var todayYyyyM;
var todayDInt;
var nextMonthYyyyM;

function getMenu(mmt) {
	// 今月
	todayYyyyM = mmt.format('YYYY_M');
	todayDInt = parseInt(mmt.format('M'));
	console.log('todayYyyyM = ' + todayYyyyM);
	console.log('todayDInt = ' + todayDInt);
	// 翌月
//	mmt.add(1, 'months');
//	nextMonthYyyyM = mmt.format('YYYY_M');
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

function getMenuFromLinkData() {
	return new Promise(function(resolve, reject){
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
	var targetDateDiv = $('li#day' + targetIdx + ' .days');
	targetDateDiv.html(menuData[targetIdx][2] + '/' + menuData[targetIdx][3] + '<span class="coll-h-desc">' + menuData[targetIdx][4] + '</span>');
	var targetGcalDiv = $('li#day' + targetIdx + ' .gcal');	
	var monthslice = (("0" + menuData[targetIdx][2]).slice(-2));
	var MailDate = menuData[targetIdx][1] + monthslice + menuData[targetIdx][3];
	targetGcalDiv.html('<a href="https://www.google.com/calendar/gp?pli=1#~calendar:view=e&bm=1&action=TEMPLATE&text=オガルコリマインダー&dates=' + 
	MailDate + '/' + MailDate + 
	'&details=' + 
	menuData[targetIdx][5] + '%0D%0A' + 
	menuData[targetIdx][6] + '%0D%0A' + 
	menuData[targetIdx][7] + '%0D%0A' + 
	menuData[targetIdx][8] + '%0D%0A' + 
	menuData[targetIdx][9] + '%0D%0A' + 
	menuData[targetIdx][10] + '%0D%0A' + 
	menuData[targetIdx][11] + '%0D%0A' +  
	'&trp=undefined&trp=true&sprop=" target="_blank"><i class="material-icons">today</i></a>');
}

function setMenuToTarget(targetIdx) {
	var targetLi = $('li#day' + targetIdx);
	var divMenu = $('<div class="collapsible-body">');	
	var tableMenu = $('<table>');
	var timeSch = menuData[targetIdx][5] + 'から' + menuData[targetIdx][6] + 'まで'
	tableMenu.append($('<tr><th>予定時間</th><td>' + timeSch + '</td></tr>'));
	tableMenu.append($('<tr><th>場所</th><td>' + menuData[targetIdx][7]  + '</td></tr>'));
	if (menuData[targetIdx][8] != undefined) {
		tableMenu.append($('<tr><th>対象者</th><td>' + menuData[targetIdx][8]  + '</td></tr>'));
	}
	if (menuData[targetIdx][9] != undefined) {
		tableMenu.append($('<tr><th>内容</th><td>' + menuData[targetIdx][9]  + '</td></tr>'));
	}
	if (menuData[targetIdx][10] != undefined) {
		tableMenu.append($('<tr><th>予約</th><td>' + menuData[targetIdx][10]  + '</td></tr>'));
	}
	if (menuData[targetIdx][11] != undefined) {
		tableMenu.append($('<tr><th>備考</th><td>' + menuData[targetIdx][11]  + '</td></tr>'));
	}
	tableMenu.append($('<tr><th>問い合わせ</th><td><a href="" class="waves-effect waves-light white-text btn-flat"><i class="material-icons left">phone</i>電話をかける</a></td></tr>'));
	 $(targetLi).append(divMenu);
	 $(divMenu).append(tableMenu);	 
}

$(function() {
	var mmt = moment();
	mmt.subtract(0, 'days');
	var menu = getMenu(mmt);
});
