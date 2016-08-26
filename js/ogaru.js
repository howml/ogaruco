//Linkdataのデータセットのコードを入力
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
		var dataUrl = '//linkdata.org/api/1/' + ldDataset + '/' + tableName + '_tsv.txt';
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
	// 今日の分だけメニューを書く
	setMenuToTarget(0);
}

function setDateLabel(targetIdx) {
	var targetDateDiv = $('li#day' + targetIdx + ' h2.menu-date');
	targetDateDiv.text(menuData[targetIdx][2] + '/' + menuData[targetIdx][3] + ' (' + menuData[targetIdx][4] + ')');
}

function setMenuToTarget(targetIdx) {
	var targetLi = $('li#day' + targetIdx);
	var divMenu = $('<div class="menu">');
	if (menuData[targetIdx][5] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][5]  + '<div>'));
	}
	if (menuData[targetIdx][6] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][6]  + '<div>'));
	}
	if (menuData[targetIdx][7] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][7]  + '<div>'));
	}
	if (menuData[targetIdx][8] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][8]  + '<div>'));
	}
	if (menuData[targetIdx][9] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][9]  + '<div>'));
	}
	if (menuData[targetIdx][10] != undefined) {
		divMenu.append($('<div>' + menuData[targetIdx][10]  + '<div>'));
	}
	$(targetLi).append(divMenu);
}

$(function() {
	var now = moment();

	// stub
	// now = moment('2016-8-18', 'YYYY-M-D');

	var menu = getMenu(now);
});

$('.menu li').click(function() {
	$('.menu li.active div.menu').remove();
	$('.menu li.active').removeClass('active');
	$(this).addClass('active');
	var idName = $(this).attr("id");
	var targetIdx = idName.substr(3);
	setMenuToTarget(targetIdx);
});
