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
		var tableName = 'ogaru_' + yyyy_m;
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
	var targetDateDiv = $('li#day' + targetIdx + ' .days');
	targetDateDiv.text(menuData[targetIdx][2] + '/' + menuData[targetIdx][3] + ' (' + menuData[targetIdx][4] + ')');
	var targetSpecialDiv = $('li#day' + targetIdx + ' .special');
	if (menuData[targetIdx][11] != undefined) {
			targetSpecialDiv.text(menuData[targetIdx][11]);	
	}
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
	 $(targetLi).append(divMenu);
}

$(function() {
	var mmt = moment();
	mmt.subtract(3, 'days');
	var menu = getMenu(mmt);
});
