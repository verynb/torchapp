"use strict";;
(function() {
	var homePage = {
		initHomeMenu: function() {
			/*director理事/trustee监事/finance财务/secretary秘书/support后勤/teacher老师*/
			var userStatus = 3;
			var role = window.localStorage.getItem(G_COMKEY + ".role");
			var userType = window.localStorage.getItem(G_COMKEY + ".userType");
			role = JSON.parse(role);
			if(userType == 0) {
				if(role.roleCode == "teacher") {
					userStatus = 2;
				} else {
					userStatus = 1;
				}
			} else if(userType == 1) {
				userStatus = 3;
			}
			var outMenu;
			var volunteer = {
				"list": [{
					"icon": "icon-volunteer",
					"title": "义工维护",
					"dir": "general",
					"tkey": "volList"
				}, {
					"icon": "icon-support",
					"title": "资助人维护",
					"dir": "general",
					"tkey": "supList"
				}, {
					"icon": "icon-school",
					"title": "学校维护",
					"dir": "general",
					"tkey": "schList"
				}, {
					"icon": "icon-stus",
					"title": "学生维护",
					"dir": "general",
					"tkey": "stuList"
				}, {
					"icon": "icon-release",
					"title": "发布资助",
					"dir": "general",
					"tkey": "relList"
				}, {
					"icon": "icon-record",
					"title": "发布记录",
					"dir": "general",
					"tkey": "relRecSearch"
				}]
			};

			var teacher = {
				"list": [{
					"icon": "icon-stus",
					"title": "学生维护",
					"dir": "general",
					"tkey": "stuList"
				}, {
					"icon": "icon-record",
					"title": "发布记录",
					"dir": "general",
					"tkey": "relRecSearch"
				}]
			};
			var sponsor = {
				"list": [{
					"icon": "icon-subscription",
					"title": "在线认捐",
					"dir": "general",
					"tkey": "subList"
				}, {
					"icon": "icon-record",
					"title": "认捐记录",
					"dir": "general",
					"tkey": "subRecList"
				}]
			};
			switch(userStatus) {
				case 1:
					homePage.menuAddHtml(volunteer.list);
					break;
				case 2:
					homePage.menuAddHtml(teacher.list);
					break;
				case 3:
					homePage.menuAddHtml(sponsor.list);
					break;
				default:
					$("#home .list-box").empty();
					common.toast('对不起你没有任何权限');
					break;
			}
		},
		menuAddHtml: function(data) {
			var html = '';
			var G_LIFElISTNUM = 2;
			var bigContentNum = parseInt(data.length / G_LIFElISTNUM);
			if(data.length % G_LIFElISTNUM != 0) {
				bigContentNum = bigContentNum + 1;
			} else {
				bigContentNum = bigContentNum;
			}
			for(var i = 0; i < bigContentNum; i++) {
				html += '<div class="box-h list-item">';
				for(var j = i * G_LIFElISTNUM; j < G_LIFElISTNUM * (i + 1); j++) {
					if(j < data.length) {
						html += '<div class="box-flex item" data-tkey="' + data[j].tkey + '" data-dir="' + data[j].dir + '" data-transition="slide" onclick="common.loadPage(this,false)">';
						html += '<div class="row1 ' + data[j].icon + '"></div>';
						html += '<div class="row2">' + data[j].title + '</div>';
						html += '</div>';
					} else {
						oneListHtml += '<div class="sixty-box-flex item"></div>';
					}
				}
				html += '</div>';
			}
			$("#home .list-box").empty().append(html);
		}
	};
	window.homePage = homePage;
})();