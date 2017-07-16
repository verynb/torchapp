"use strict";;
(function() {
	var pageCom = {
		volunteerRoles: function() {
			var titleName = "角色选择";
			ajaxFuncs.get({
				urlname: "/api/volunteerRoles",
				funcs: {
					funcSuccessful: function(data) {
						var buttons = [];
						for(var i = 0; i < data.roleDtos.length; i++) {
							var titVal = {};
							titVal.title = data.roleDtos[i].name;
							buttons.push(titVal);
						}
						plus.nativeUI.actionSheet({
							title: titleName,
							cancel: "取消",
							buttons: buttons
						}, function(selected) { /*actionSheet 按钮点击事件*/
							var buttonsobj = buttons[selected.index - 1];
							var typeval = buttonsobj.title;
							var typeid = selected.index;
							var container = "#" + $.ui.activeDiv.id;
							$(container + " span.roleName").text(typeval);
							$(container + " input[name='roleName']").val(typeval);
							$(container + " input[name='roleId']").val(typeid);
							$(container + " input[name='roleName']").attr("readonly", "readonly");
							var el_shool = $(container + " .isshool");
							if(typeval == "老师") {
								if($(el_shool).hasClass("hidden")) {
									$(container + " .isshool").removeClass('hidden');
									$(container + " .isshool").find("input[name='school']").attr('required', 'required');
								}
							} else {
								if(!$(el_shool).hasClass("hidden")) {
									$(container + " .isshool").addClass('hidden');
									$(container + " .isshool").find("input[name='school']").removeAttribute('required');
								}
							}
						});
					}
				}
			});
		},
		chooseSex: function() {
			var titleName = "性别选择";
			var buttons = [{
				'title': "男"
			}, {
				'title': "女"
			}];
			plus.nativeUI.actionSheet({
				title: titleName,
				cancel: "取消",
				buttons: buttons
			}, function(selected) { /*actionSheet 按钮点击事件*/
				var buttonsobj = buttons[selected.index - 1];
				var typeval = buttonsobj.title;
				var typeid = selected.index;
				var container = "#" + $.ui.activeDiv.id;
				$(container + " input[name='gender']").val(typeval);
				$(container + " input[name='gender']").attr("readonly", "readonly");
			});
		},
		chooseGrade: function() {
			var titleName = "年级选择";
			ajaxFuncs.get({
				urlname: "/api/gradeMoney",
				funcs: {
					funcSuccessful: function(data) {
						var buttons = [];
						for(var i = 0; i < data.gradeMoneyList.length; i++) {
							var titVal = {};
							titVal.title = data.gradeMoneyList[i].gradeName;
							buttons.push(titVal);
						}
						plus.nativeUI.actionSheet({
							title: titleName,
							cancel: "取消",
							buttons: buttons
						}, function(selected) { /*actionSheet 按钮点击事件*/
							var buttonsobj = buttons[selected.index - 1];
							var typeval = buttonsobj.title;
							var typeid = selected.index;
							var container = "#" + $.ui.activeDiv.id;
							$(container + " span.grade").text(typeval);
							$(container + " input[name='grade']").val(typeval);
							$(container + " input[name='grade']").attr("readonly", "readonly");
						});
					}
				}
			});
		},
		gradeMoney: function() {
			ajaxFuncs.get({
				urlname: "/api/gradeMoney",
				funcs: {
					funcSuccessful: function(data) {
						window.localStorage.setItem("gradeMoneyJsonstr", JSON.stringify(data.gradeMoneyList));
					}
				}
			});
		},
		gradeMoneyChoose: function(grade) {
			var gradeMoneyJsonstr = window.localStorage.getItem("gradeMoneyJsonstr");
			if(gradeMoneyJsonstr != undefined && gradeMoneyJsonstr != '') {
				var gradeMoney = JSON.parse(gradeMoneyJsonstr);
				for(var i = 0; i < gradeMoney.length; i++) {
					if(grade == gradeMoney[i].gradeName || grade == gradeMoney[i].id) {
						return gradeMoney[i].defaultMoney;
					}
				}
			} else {
				return '';
			}
		},
		downloadStuAndQ: function() {
			var createtime;
			$.ui.popup({
				title: "下载学生信息和审核标准",
				message: "请确定你本地离线家访数据均已提交，本数据下载后将覆盖原有数据。确定要继续下载？",
				cancelText: "取消",
				cancelOnly: false,
				doneText: "继续",
				doneCallback: function() {
					createtime = common.formatTime(G_SERVERTIME, 6);
					localStu.deleteStuAll();
					localSta.deleteStaAll();
					getStuInfo();
				},
				cancelCallback: function() {
					$.ui.hideMask();
				}
			});
			var progress = 0;

			function getStuInfo() {
				$.ui.showMask("开始下载学生信息");
				ajaxFuncs.get({
					urlname: "/api/release/" + relEditBatchNo,
					funcs: {
						funcSuccessful: function(data) {
							data = data.releaseList;
							var arr = [];
							for(var i = 0; i < data.length; i++) {
								progress = Math.floor(((i + 1) / data.length) * 100);
								$.ui.hideMask();
								$.ui.showMask('当前下载学生信息进度：' + progress + '%');
								arr = [];
								//batchId,studentId, name,stuJsonStrData,applicationForm,studentPhoto,familyPhoto,homePhoto,InteractivePhoto,visitInfo,createtime,updatetime
								arr.push((data[i].releaseId).toString());
								arr.push((data[i].studentId).toString());
								arr.push(data[i].studentName);
								arr.push(JSON.stringify(data[i]));
								arr.push('');
								arr.push('');
								arr.push('');
								arr.push('');
								arr.push('');
								arr.push('');
								arr.push('');
								arr.push('');
								arr.push('0');
								arr.push('0');
								arr.push(window.localStorage.getItem(G_COMKEY + ".userId"));
								arr.push(window.localStorage.getItem(G_COMKEY + ".userName"));
								arr.push(createtime);
								arr.push(createtime);
								localStu.insertStu(arr);
							}
							getAudits();
						}
					}
				});
			}

			function getAudits() {
				$.ui.hideMask();
				$.ui.showMask("开始下载审核标准");
				ajaxFuncs.get({
					urlname: "/api/audits",
					funcs: {
						funcSuccessful: function(data) {
							data = data.auditDtoList;
							var arraud = [];
							//	staid, title,staJsonStrData,createtime
							for(var j = 0; j < data.length; j++) {
								progress = Math.floor(((j + 1) / data.length) * 100);
								$.ui.hideMask();
								$.ui.showMask('当前下载学生审核标准：' + progress + '%');
								arraud = [];
								arraud.push((data[j].id).toString());
								arraud.push(data[j].title);
								arraud.push(JSON.stringify(data[j]));
								arraud.push(createtime);
								localSta.insertSta(arraud);
							}
							$.ui.hideMask();
						}
					}
				});
			}
		},
		stuStatusName: function(status) {
			/**
			 * 0.正常
			 * 1.结案
			 * 2.冻结
			 * 3.预发布
			 * 4.已发布
			 * 5.预订
			 * 6.已结队
			 */
			switch(status) {
				case 0:
					return "正常";
					break;
				case 1:
					return "结案";
					break;
				case 2:
					return "冻结";
					break;
				case 3:
					return "预发布";
					break;
				case 4:
					return "已发布";
					break;
				case 5:
					return "预订";
					break;
				case 6:
					return "已结队";
					break;
				default:
					break;
			}

		}
	};
	window.pageCom = pageCom;
})();