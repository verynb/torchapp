String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2); //
}

if(typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function(str) {
		return this.slice(-str.length) == str;
	};
};
(function() {
	var lastObj,
		leaveInput = true,
		timezone = 8;
	var common = {
		//readOnly：页面是否只读，true只读，false可编辑
		//noback：是否清楚后退的历史记录，true清除，false不清除
		//isback：打开页面时的动画方向，true反方向，false正向
		//forceflash：是否强制刷新页面，true强制刷新，false不强制刷新
		loadPage: function(obj, readOnly, noback, isback, forceflash) {
			var fulltkey = $(obj).attr("data-tkey"),
				tkey = fulltkey.split("-")[0],
				dir = $(obj).attr("data-dir"),
				trans = $(obj).attr("data-transition");
			if($.ui.activeDiv.id != tkey || forceflash) { //当前页面不能执行刷新操作
				if(trans == "" || trans == undefined || trans == null || trans == "null") {
					trans = "slide";
				}
				var div = "#" + tkey + "Content";
				$(div).empty();
				$.ajax({
					type: "post",
					url: webContent.rootDir + dir + "/" + tkey + ".html",
					success: function(pagecontent) {
						$(div).html(pagecontent);
						$.ui.loadContent(tkey, (noback == undefined || noback == false) ? false : true, isback == undefined ? false : true, trans);
						//加载页面load方法
						if(window["load" + tkey] && $.isFunction(eval("load" + tkey))) {
							eval("load" + tkey).call(this, obj, readOnly, {
								fulltkey: fulltkey
							});
						}
					},
					error: function(message) {
						console.log("can not find the file." + dir + "文件夹下" + fulltkey);
					}
				});
			}
		},
		inputGetBlur: function() {
			leaveInput = true;
		},
		inputGetFocus: function(obj) {
			if(lastObj != obj || leaveInput) {
				try {
					obj.selectionStart = obj.value.length;
					obj.selectionEnd = obj.value.length;
				} catch(e) {
					console.log("不支持selectionStart");
				}
				leaveInput = false;
			}
			lastObj = obj;
		},
		checkVersion: function() {
			var that = this;
			$.getJSON(
				webContent.rootUrl + "base/currentversion?env=" + G_ENV + "&usertype=" + G_USERTYPE,
				function(data) {
					if(data.failed) {} else {
						that.autoUpgrate(data);
					}
				},
				function(error) {}
			);
		},
		autoUpgrate: function(data, callback) {
			var that = this;
			if(G_ISBROWSE) {
				if($.isFunction(callback)) {
					callback.call();
				}
				return;
			}
			var appid = plus.runtime.appid;
			plus.runtime.getProperty(appid, function(wgtinfo) {
				var currentVer = wgtinfo.version;
				if((data.isForce == true && currentVer < data.version) || data.force == false && currentVer != data.version) {
					//					if($.ui.activeDiv.id != "login") {
					//						that.executeLogout(1);
					//					}
					$.ui.popup({
						title: "有新版本",
						message: "版本(" + data.version + ")已发布，请及时升级。<br><p style='font-size:12px;'>提示：若不升级，将无法继续使用!</p>",
						cancelText: "退出",
						cancelOnly: false,
						doneText: "升级",
						doneCallback: function() {
							if($.os.ios) {
								that.upgradeios(data);
							} else {
								that.upgrade(data);
							}
						},
						cancelCallback: function() {
							$.ui.hideMask();
						}
					});
				} else {
					if($.isFunction(callback)) {
						callback.call();
					}
				}
			});
		},
		upgradeios: function(data) {
			location.href = G_APPDOWNURL;
		},
		//版本更新
		upgrade: function(data) {
			if(G_ISBROWSE) return;
			$("#fadeWrapper").show(); //$("#versionHide").css({"display":"block","height":window.innerHeight,"width":window.innerWidth});
			$.ui.showMask("开始升级应用...");
			var downloadurl = data.url;
			var options = {
				method: "GET"
			};
			var download = plus.downloader.createDownload(downloadurl, options, function(f, status) {
				if(status == 200) {
					$.ui.showMask("正在安装，请稍候...");
					plus.runtime.install(f.filename, {
							force: true
						},
						function() { //widgeInfo
							plus.runtime.restart();
						},
						function(error) {
							$.ui.popup("安装版本(" + data.ver + ")失败[" + error.code + "]，请稍后再试.");
							$.ui.hideMask();
							$("#fadeWrapper").hide(); //$("#versionHide").css("display","none");
							plus.runtime.quit();
						}
					);
				}
			});
			download.addEventListener("statechanged", function(task, status) {
				switch(task.state) {
					case 1:
						$.ui.showMask("查找升级包...");
						break;
					case 2:
						$.ui.showMask("连接到服务器...");
						$("#fadeWrapper").show(); //$("#versionHide").css({"display":"block","height":window.innerHeight,"width":window.innerWidth});
						break;
					case 3:
						$.ui.showMask("已下载:" + (100 * task.downloadedSize / task.totalSize).toFixed(0) + "%");
						break;
					case 4:
						if(status == 200) {
							$.ui.showMask("下载完毕，开始安装.");
						} else {
							$.ui.hideMask();
							$.ui.popup("下载(" + data.ver + ")安装文件失败，请稍后再试.");
							plus.runtime.quit();
							$("#fadeWrapper").hide(); //$("#versionHide").css("display","none");
						}
						break;
				}
			}, false);
			download.start();
		},
		afterLogout: function() {
			//			bot.stopLogin();
			push.logout();
		},
		silenceLogin: function() {
			var that = this;
			/*if(!G_ISBROWSE && G_PLUSUIREADY < 2) {
				return;
			}
			var store = window.localStorage,
				phone = common.getlocalStorageItemStr("userinfo", "phone"),
				token = common.getlocalStorageItemStr("token"),
				params = {};
			if(phone == null || token == null || phone == "" || token == "" || phone == undefined || token == undefined || phone == "undefined" || token == "undefined") {
				that.gotoLogin(true);
			} else {
				params = {
					phone: phone
				};
				that.executeLogin($.param(params), 1); //1自动登录 ， 0 手动登录 ，
			}*/
			that.gotoLogin(true);
		},
		gotoLogin: function(clear, message) {
			var that = this;
			$.ui.hideMask();
			common.gotoPage("common", "login");
			$.ui.clearHistory();
			if(message && message.length > 0 && message != "undefined" && message != "null") {
				$.ui.popup(message);
			}
		},
		executeLogin: function(params, logintype) {
			var that = this;
			$.ui.showMask("登录中...");

			ajaxFuncs.post({
				urlname: "/api/authenticate",
				params: params,
				funcs: {
					funcSuccessful: function(data) {
						window.localStorage.setItem(G_COMKEY + ".token", data.authorization);
						window.localStorage.setItem(G_COMKEY + ".userId", data.userId);
						window.localStorage.setItem(G_COMKEY + ".userType", data.userType);
						window.localStorage.setItem(G_COMKEY + ".userName", data.userName);
						window.localStorage.setItem(G_COMKEY + ".mobile", data.mobile);
						window.localStorage.setItem(G_COMKEY + ".role", JSON.stringify(data.role));
						if(G_CHECKVERONSTART) {
							that.autoUpgrate(data.version, function() {
								that.afterLogin(logintype);
							});
						} else {
							that.afterLogin(logintype);
						}
					}
				}
			});

		},
		afterLogin: function(logintype) {
			$("#login input[name='username']").val("");
			$("#login input[name='password']").val("");
			$("#login").find("i").removeClass("loginImgOn"); //取消登录小图标高亮状态
			$.ui.clearHistory();
			if(G_BINDPUSH) {
				push.bind(logintype, function() {
					startHome();
				});
			} else {
				startHome();
			}
		},
		/*原生日期 2014-01-01*/
		pickDateYMD: function(obj) {
			var that = this;
			var minDate = $(obj).attr("data-minDate");
			try {
				if(plus) {
					var today = that.formatTime(G_SERVERTIME, 5); //2014-07-14 16:09
					var defaultTime = (obj.value == "" ? today : obj.value);
					var dDate = new Date();
					dDate.setFullYear(defaultTime.substring(0, 4), parseInt(defaultTime.substring(5, 7)) - 1, defaultTime.substring(8, 10)); //设置默认选中日期
					var minDate = new Date();
					minDate.setFullYear(minDate, 0, 1);
					var maxDate = new Date();
					maxDate.setFullYear(today.substring(0, 4), 11, 31);
					plus.nativeUI.pickDate(function(e) {
						var d = e.date; //被选中日期
						var choose_y = d.getFullYear();
						var choose_m = d.getMonth() + 1 < 10 ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1);
						var choose_d = d.getDate() < 10 ? ("0" + d.getDate()) : d.getDate();
						obj.value = choose_y + "-" + choose_m + "-" + choose_d;
						$(obj).attr("readonly", "readonly");
					}, function(e) {
						//console.log( "未选择日期："+e.message );
					}, {
						title: "请选择日期",
						date: dDate,
						minDate: minDate,
						maxDate: maxDate
					});
				}
			} catch(e) { //调用h5的
				console.log("不支持plus");
				$(obj).removeAttr("onclick");
				$(obj).removeAttr("readonly");
				$(obj).attr("type", "date");
			}
		},
		//type决定返回不同精度的时间字符串
		/*
		 *1：年
		 *2：年-月
		 *3：年-月-日
		 *4：年-月-日 时
		 *5：年-月-日 时:分
		 *6：年-月-日 时:分:秒
		 * */
		formatTime: function(seconds, type) { //秒
			var d = new Date(seconds * 1000);
			var year = d.getFullYear();
			var month = d.getMonth(); //0-11
			var day = d.getDate(); //1-31
			var hour = d.getHours(); //0-23
			var minute = d.getMinutes(); //0-59
			var second = d.getSeconds(); //0-59
			month = (month + 1 < 10 ? ("0" + (month + 1)) : (month + 1));
			day = (day < 10 ? ("0" + day) : day);
			hour = (hour < 10 ? ("0" + hour) : hour);
			minute = (minute < 10 ? ("0" + minute) : minute);
			second = (second < 10 ? ("0" + second) : second);
			var time = "";
			if(type == 1) {
				time = year + "";
			} else if(type == 2) {
				time = year + "-" + month;
			} else if(type == 3) {
				time = year + "-" + month + "-" + day;
			} else if(type == 4) {
				time = year + "-" + month + "-" + day + " " + hour;
			} else if(type == 5) {
				time = year + "-" + month + "-" + day + " " + hour + ":" + minute;
			} else if(type == 6) {
				time = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
			}
			return time;
		},
		/*原生时间   00:00*/
		pickTimeHM: function(obj, way) {
			try {
				if(plus) {
					var defaultTime = (obj.value == "" ? (way == "start" ? "00:00" : "23:59") : obj.value);
					var dTime = new Date();
					dTime.setHours(defaultTime.split(":")[0], defaultTime.split(":")[1]);
					plus.nativeUI.pickTime(function(e) {
						var d = e.date; //被选择时间
						var choose_h = d.getHours(); //获取选择的小时
						var choose_m = d.getMinutes(); //获取选择的分钟
						choose_h = (choose_h < 10 ? ("0" + choose_h) : choose_h);
						choose_m = (choose_m < 10 ? ("0" + choose_m) : choose_m);
						obj.value = choose_h + ":" + choose_m;
						$(obj).attr("readonly", "readonly");
					}, function(e) {
						//console.log( "取消选择时间！" );
					}, {
						title: "请选择时间",
						is24Hour: true,
						time: dTime
					});
				}
			} catch(e) { //手动输入吧
				console.log("不支持plus");
				$(obj).removeAttr("onclick");
				$(obj).removeAttr("readonly");
			}
		},
		/**
		 * 
		 * @param  currentTime
		 * @param  oldTime 
		 * 传入日期格式为年/月/日
		 */
		timeDifference: function(oldTime) {
			var yearHaoMiao = 365 * 24 * 60 * 60 * 1000;
			var oldTimeHaoMiao = (new Date(oldTime)).getTime(); //将日期转为毫秒数
			var currentTimeHaoMiao = new Date().getTime(); //获取当前日期并转为毫秒数
			var age = parseInt((currentTimeHaoMiao - oldTimeHaoMiao) / yearHaoMiao);
			return age;
		},
		fewDaysAgo: function(fewDate) {
			var dayHaoMiao = parseInt(fewDate) * 24 * 60 * 60 * 1000;
			var currentTimeHaoMiao = new Date().getTime(); //获取当前日期并转为毫秒数
			var syMiao = parseInt(currentTimeHaoMiao - dayHaoMiao) / 1000;
			console.log('syHaoMiao===' + syMiao);
			var getFormatTime = common.formatTime(syMiao, 3);
			return getFormatTime;
		},
		removeSubmitedFlag: function(obj, msg) {
			$(obj).removeAttr("submited");
			if(msg && msg.length > 0) {
				common.toast(msg);
			}
		},
		validate: function(form, obj) {
			var that = this;
			if(obj != undefined && $(obj).attr("submited") != null) {
				return false;
			}
			$(obj).attr("submited", "true");
			if(form == undefined) {
				return true;
			}
			var formAFObj = $(form);
			var eles = formAFObj.find("input");
			var ele;
			for(var i = 0; i < eles.length; i++) {
				ele = eles[i];
				$(ele).val(ele.value.trim());
				if($(ele).attr("required") != undefined && $(ele).attr("required") != null && (ele.value == undefined || ele.value.trim().length < 1)) {
					that.removeSubmitedFlag(obj, $(ele).attr("data-warning"));
					return false;
				}
				var dataLength = $(ele).attr("data-length");
				if(dataLength != null && $(ele).val().length > dataLength) {
					var tipMsg = "最大字符长度不超过" + dataLength + "个字符";
					common.removeSubmitedFlag(obj, tipMsg);
					return false;
				}
				var check = $(ele).attr("data-check");
				if(check != null && check.length > 0 && ele.value.length > 0) {
					var val = that.getValue(ele, form);
					if(!(new RegExp(check)).test(val)) {
						that.removeSubmitedFlag(obj, $(ele).attr("data-warning-check"));
						return false;
					}
				}
			}
			eles = formAFObj.find("textarea");
			for(var i = 0; i < eles.length; i++) {
				ele = eles[i];
				if($(ele).attr("required") == "required" && (ele.value == undefined || ele.value.trim().length < 1)) {
					that.removeSubmitedFlag(obj, $(ele).attr("data-warning"));
					return false;
				}

				var check = $(ele).attr("data-check");
				if(check != null && check.length > 0 && ele.value.length > 0) {
					var val = that.getValue(ele, form);
					if(!(new RegExp(check)).test(val)) {
						that.removeSubmitedFlag(obj, $(ele).attr("data-warning"));
						return false;
					}
				}
			}
			eles = formAFObj.find("select");
			for(var i = 0; i < eles.length; i++) {
				ele = eles[i];
				if($(ele).attr("required") == "required") {
					if(ele.selectedIndex < 1) {
						that.removeSubmitedFlag(obj, $(ele).attr("data-warning"));
						return false;
					}
				}
				var check = $(ele).attr("data-check");
				if(check != null && check.length > 0) {
					var val = that.getValue(ele, form);
					if(!(new RegExp(check)).test(val)) {
						that.removeSubmitedFlag(obj, $(ele).attr("data-warning"));
						return false;
					}
				}
			}
			return true;
		},
		getValue: function(el, form) {
			//取得表单元素的类型
			var sType = el.type;
			switch(sType) {
				case "text":
				case "number":
				case "hidden":
				case "time":
				case "date":
				case "datetime":
				case "password":
				case "file":
				case "textarea":
					return el.value;
				case "checkbox":
				case "radio":
					return getValueChoose(el, form);
				case "select-one":
				case "select-multiple":
					return getValueSel(el, form);
			}
			//取得radio,checkbox的选中数,用"0"来表示选中的个数,我们写正则的时候就可以通过0{1,}来表示选中个数
			function getValueChoose(el, form) {
				var sValue = "";
				//取得第一个元素的name,搜索这个元素组
				var tmpels = $(form).find("input[name=" + el.name + "]");
				for(var i = 0; i < tmpels.length; i++) {
					if(tmpels[i].checked) {
						sValue += "0";
					}
				}
				return sValue;
			}
			//取得select的选中数,用"0"来表示选中的个数,我们写正则的时候就可以通过0{1,}来表示选中个数
			function getValueSel(el, form) {
				var sValue = "";
				for(var i = 0; i < el.options.length; i++) {
					//单选下拉框提示选项设置为value=""
					if(el.options[i].selected && el.options[i].value != "") {
						sValue += "0";
					}
				}
				return sValue;
			}
		},
		executeLogout: function(logouttype, obj) {
			var that = this;
			that.gotoLogin(true);
			$("#header #navButtonIndex").hide();
			//			$("#header #navmsgIndex").hide();
			$.ajax({
				url: webContent.rootUrl + "user/logout",
				success: function(data) {
					window.localStorage.removeItem(G_COMKEY + ".token");
					window.localStorage.removeItem(G_COMKEY + ".password");
					window.localStorage.clear();
					that.afterLogout(); //自己退出和被他人挤下都会经过此方法
				},
				error: function(data) {
					window.localStorage.removeItem(G_COMKEY + ".token");
					that.afterLogout();
				}
			});
		},
		backOrExit: function() {
			var that = this;
			//监听返回按钮事件
			var first = null;
			// Android处理返回键
			plus.key.addEventListener('backbutton', function() {
				var netstatus = G_ISBROWSE ? 2 : plus.networkinfo.getCurrentType(); //获取当前网络状态
				if(netstatus == 1 || netstatus == 0) { //断网
					$.ui.popup("当前已断网，不能返回！");
				} else { //有网
					if(!first) {
						first = new Date().getTime();
						if($("#af_actionsheet").css("display") == "block") { //取消actionsheet菜单
							var aLength = $("#af_actionsheet").find("a").length;
							$($("#af_actionsheet").find("a").get(aLength - 1)).trigger("click");
							first = null;
							return;
						}
						if($("#topRightMenu").css("display") == "block") {
							$("#topRightMenu").toggle();
							$("#transparentWrapper").hide();
							first = null;
							return;
						}
						if($("#wShowDiv").css("display") == "block") {
							first = null;
							return;
						}

						if($.ui.history.length == 0) {
							common.toast("再点一次退出应用");
							setTimeout(function() {
								first = null;
							}, 2000);
						} else {
							$.ui.goBack();
							first = null;
						}
					} else {
						if(new Date().getTime() - first < 2000) {
							// that.executeLogout(0);
							plus.runtime.quit();
						}
					}
				} //end of else-有网
			}, false);
		},
		/*重置右上角菜单，帮助*/
		resetTopRightMenu: function(param) {
			var dir = param ? (param.dir ? param.dir : "") : "";
			var tkey = param ? (param.tkey ? param.tkey : "") : "";
			$("#topRightMenu ul").empty(); //先清空右上角菜单
			$("#aside_menu .y-scroll div").html("");
			//右侧帮助不只有用户帮助内容，而且有用户反馈入口，所以除了指定页面，右侧帮助均不得隐藏
			if(tkey != "login" && tkey != "findbackpassword" && tkey != "resetnewpassword" && tkey != "RelatedAccount") {
				$("#header #navButtonIndex").show();
				//				$("#header #navmsgIndex").show();
			} else {
				$("#header #navButtonIndex").hide();
				//				$("#header #navmsgIndex").hide();
			}
			if(dir == "" || tkey == "") { //如果以后在列表页也需要帮助或者子菜单，则需要给此类json文件指定固定目录，目前只要dir或者tkey没有则均无帮助和右上角子菜单
				$("#header #topRightMenuBtn").hide(); //右上角子菜单
			} else {
				$.ajax({
					type: "post",
					url: webContent.rootDir + "help/" + dir + "/" + tkey + ".json",
					dataType: "json",
					success: function(data) {
						$("#topRightMenu ul").empty(); //先清空右上角菜单
						if(data.menu) { //menu子元素的key是菜单不显示的条件
							var li = "",
								temp;
							for(var i = 0; i < data.menu.length; i++) {
								if($(data.menu[i].liText).attr("data-show")) {
									temp = FindUserRights(tkey, $(data.menu[i].liText).attr("data-show")); //具体菜单还得看这个人的权限
								} else {
									temp = true;
								}
								if(temp) {
									$("#topRightMenu ul").append(data.menu[i].liText);
								}
							}
						}
						var defaultPage = $("#" + tkey).attr("data-defaultpage");
						if(defaultPage) { //panel上有data-defaultpage属性，且有值
							$("#topRightMenu ul").append("<li data-dir='" + dir + "' data-tkey='" + tkey + "' onclick='toggleTopRightMenu(); SetDeaultPage(this," + defaultPage + ")'>设为默认页面</li>");
						}
						if($("#topRightMenu ul li").length > 0) {
							$("#header #topRightMenuBtn").show();
						} else {
							$("#header #topRightMenuBtn").hide();
						}

						if(data.help) {
							$("#aside_menu .y-scroll div").html(data.help);
						} else {
							$("#aside_menu .y-scroll div").html("当前页面无帮助内容");
						}
					},
					error: function(message) { //虽然help下无文件，但也可能有设置默认页面菜单
						$("#topRightMenu ul").empty(); //先清空右上角菜单
						var defaultPage = $("#" + tkey).attr("data-defaultpage");
						if(defaultPage) {
							$("#topRightMenu ul").append("<li data-dir='" + dir + "' data-tkey='" + tkey + "' onclick='toggleTopRightMenu(); SetDeaultPage(this," + defaultPage + ")'>设为默认页面</li>");
						}
						if($("#topRightMenu ul li").length > 0) {
							$("#header #topRightMenuBtn").show();
						} else {
							$("#header #topRightMenuBtn").hide();
						}
					}
				});
			}
		},
		toggleTopRightMenu: function() {
			if($("#topRightMenu ul").find("li").length == 0) {
				return;
			}
			$("#topRightMenu").toggle();
			if($("#topRightMenu").css("display") == "block") {
				$("#transparentWrapper").show();
			} else {
				$("#transparentWrapper").hide();
			}
		},
		checkEndTime: function(start, end) {
			var startTime = start;
			var start = new Date(startTime.replace("-", "/").replace("-", "/"));
			var endTime = end;
			var end = new Date(endTime.replace("-", "/").replace("-", "/"));
			if(end < start) {
				return false;
			}
			return true;
		},
		nowDate: function() {
			var currentTimeHaoMiao = new Date().getTime(); //获取当前日期并转为毫秒数
			var syMiao = parseInt(currentTimeHaoMiao) / 1000;
			console.log('syHaoMiao===' + syMiao);
			var getFormatTime = common.formatTime(syMiao, 3);
			return getFormatTime;
		},
		timeDifferenceFormat: function(time, alltime) {
			var time = time;
			var alltime = alltime;
			var ordertime = new Date(time);
			nowtime = new Date();
			remainingtime = alltime - (nowtime - ordertime) / 1000 / 60 / 60;
			if(alltime < 1) {
				remainmintue = parseInt(remainingtime * 60);
			} else {
				remainday = parseInt(remainingtime / 24);
				remainhour = parseInt(remainingtime % 24);
			}
			if(alltime == 24) {
				return remainhour;
			} else if(alltime == 168) {
				return remainday + '天' + remainhour + '小时';
			} else if(alltime <= 1) {
				return remainmintue;
			}
		},
		pageFixed: function(pageName) {
			/*用于新页面中content部分需要fixed效果*/
			console.log($("#" + pageName + " .page-fixed-header").height());
			if(!isNaN(parseInt($('#navbar').height()))) {
				if(G_USERTYPE == '3') {
					var bodyVal = $(window).height() - ($("#" + pageName + " .page-fixed-header").height() + $('#header').height() + $('#footermaintodo').height()) - 4 - (2 * 14);
				} else {
					var bodyVal = $(window).height() - ($("#" + pageName + " .page-fixed-header").height() + $('#header').height() + $('#footermaintodo').height()) - 4;
				}
			} else {
				if(G_USERTYPE == '3') {
					var bodyVal = $(window).height() - ($("#" + pageName + " .page-fixed-header").height() + $('#header').height()) - 4 - (2 * 14);
				} else {
					var bodyVal = $(window).height() - ($("#" + pageName + " .page-fixed-header").height() + $('#header').height()) - 4;
				}
			}
			console.log('page-fixed-body的高度为=' + bodyVal);
			$('.page-fixed-body').height(bodyVal);
			this.addScroller('page-fixed-body');
		},
		toast: function(msg) {
			var opt = {
				duration: 'short',
				align: 'center',
				verticalAlign: 'bottom'
			}
			plus.nativeUI.toast(msg, opt);
			$.ui.blockUI(.1); /* 弹出mask(toast)时让ui失去焦点：*/
			setTimeout(function() {
				$.unblockUI();
			}, 2000);
		},
		randNum: function(n) {
			if(n == undefined)
				n = 10;
			var rnd = "";
			for(var i = 0; i < n; i++) {
				rnd += Math.floor(Math.random() * 10);
			}
			return rnd;
		},
		currentTimeMillis: function() {
			var date = new Date();
			var yy = date.getFullYear();
			var MM = date.getMonth();
			var dd = date.getDate();
			var hh = date.getHours();
			var mm = date.getMinutes();
			var ss = date.getSeconds();
			var sss = date.getMilliseconds();
			return Date.UTC(yy, MM, dd, hh, mm, ss, sss) - (timezone * 60 * 60 * 1000);
		},
		isJson: function(obj) {
			return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		},
		textareaAutoHeight: function(obj) {
			var aHeight = $($(obj).parent().find("a")[0]).height();
			$(obj).css("height", obj.scrollHeight);
			//			$($(obj).parent().find("a")[0]).css("margin-top", ($(obj).height() - aHeight) / 2 + "px");
		},
		bytesToSize: function(bytes, obj) {
			var size = 0;
			var danwei;
			if(bytes < 1024) {
				size = bytes;
				danwei = 'B';
			} else if(bytes < 1024 * 1024) {
				size = bytes / 1024;
				danwei = 'KB';
			} else if(bytes < 1024 * 1024 * 1024) {
				size = bytes / (1024 * 1024);
				danwei = 'M';
			} else {
				size = bytes / (1024 * 1024 * 1024);
				danwei = 'G';
			}
			$(obj).html(size.toFixed(2) + danwei);
		},
		getLocalCacheSize: function(obj) {
			var local_file_url = '_doc/';

			plus.io.resolveLocalFileSystemURL(local_file_url, function(entry) {
				var size;
				entry.getMetadata(function(metadata) {
					size = metadata.size;
					console.log('metadata.size=' + metadata.size);
				}, function() {
					size = '0';
				}, true);
				setTimeout(function() {
					common.bytesToSize(size, obj);
				}, 1000)
			}, function(e) {

			});
		},
		delLocalFolder: function() {
			var local_file_url = '_doc/';
			plus.io.resolveLocalFileSystemURL(local_file_url, function(entry) {
				entry.removeRecursively(function(succesCB) {
					sixtyLog('删除目录成功');
					common.toast('缓存清除成功');
					setTimeout(function() {
						common.getLocalCacheSize($('#clearnFileSize'));
					}, 1000)
				}, function(errorCB) {
					sixtyLog('删除目录失败');
					common.toast('缓存清除失败，请稍后重试');
				});
			}, function(e) {

			});
		},
		getlocalStorageItem: function(itemkey, jsonkey) {
			var result = "";
			if(itemkey) {
				result = window.localStorage.getItem(G_COMKEY + "." + itemkey);
				if(result == null || result == "" || result == undefined || result == "undefined") {
					result = "";
				} else if(jsonkey) {
					var jsonvalue = $.parseJSON(result);
					result = loadData.seekDatasource(jsonvalue, jsonkey);
				}
			}
			return result;
		},
		getlocalStorageItemStr: function(itemkey, jsonkey) {
			var that = this;
			return that.getlocalStorageItem(itemkey, jsonkey);
		},
		getlocalStorageItemJson: function(itemkey, jsonkey) {
			var that = this;
			return $.parseJSON(that.getlocalStorageItem(itemkey, jsonkey));
		},
		swichOffCheckbox: function(pageName) {
			$('#' + pageName + ' label').unbind('click');
			$('#' + pageName + ' label').on('click', function() {
				var labelForName = $(this).attr('for');
				if($(this).parent().find('#' + labelForName).attr('type') == 'radio') {
					$(this).parent().find('input[type="radio"]').removeAttr('checked');
					$(this).parent().find('#' + labelForName).attr('checked', 'checked');
				} else {
					if($(this).parent().find('input[type="checkbox"]').prop("checked")) {
						$(this).parent().find('input[type="checkbox"]').removeAttr('checked');
					} else {
						$(this).parent().find('input[type="checkbox"]').attr('checked', 'checked');
					}
				}
			});
		},
		commonFooterBtu: function(jsonData) {
			$("#navbar").show();
			$('#navbar footer').empty().append(jsonData.buttonHtml);
			var footercontainer;
			if(jsonData.hasOwnProperty("container")) {
				footercontainer = jsonData.container;
				var html = '';
				html += '<footer id="' + footercontainer + 'footer">';
				html += jsonData.buttonHtml;
				html += '</footer>';
				$('#afui').append(html);
				$('#afui #' + jsonData.container).attr('data-footer', footercontainer + 'footer');
			}
		},
		keyboardOutLook: function(el) {
			var nativeWebview, imm, InputMethodManager;
			var initNativeObjects = function() {
				if($.os.android) {
					var main = plus.android.runtimeMainActivity();
					var Context = plus.android.importClass("android.content.Context");
					InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
					imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
				} else {
					nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
				}
			};
			var showSoftInput = function() {
				if($.os.android) {
					imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
				} else {
					nativeWebview.plusCallMethod({
						"setKeyboardDisplayRequiresUserAction": false
					});
				}
				setTimeout(function() {
					//此处可写具体逻辑设置获取焦点的input
					var inputElem = document.querySelector(el);
					inputElem.focus();
				}, 200);
			};
			initNativeObjects();
			showSoftInput();
		},
		handleDefaultPage: function(jsonObj) { //缺省页面处理
			var defaultImgSrc = '',
				defaultDesc = '',
				type = jsonObj.type,
				desc = jsonObj.desc,
				imgSrc = jsonObj.imgSrc,
				_html = '',
				domObj = $("#" + $.ui.activeDiv.id + " .sixty-list-nodata");
			switch(type) {
				case 1:
					defaultImgSrc = "img/no_network.png";
					defaultDesc = "暂未检测到网络喔";
					break;
				case 2:
					defaultImgSrc = "img/no_data.png";
					defaultDesc = "暂无相关数据喔";
					break;
				case 3:
					defaultImgSrc = "img/no_order.png";
					defaultDesc = "暂无相关订单喔";
					break;
				case 4:
					defaultImgSrc = "img/no_function.png";
					defaultDesc = "抱歉，暂无此功能喔";
					break;
				default:
					break;
			}
			if(imgSrc && imgSrc.length > 0) {
				defaultImgSrc = imgSrc;
			}
			if(desc && desc.length > 0) {
				defaultDesc = desc;
			}
			_html += '<div class = "sixty-list-nodata">'
			_html += '<img src = "' + defaultImgSrc + '" alt = "图片说明" />'
			_html += '<p>' + defaultDesc + '</p>'
			_html += '</div>'
			$("#" + $.ui.activeDiv.id + "Content .sixty-list-nodata").remove();
			$("#" + $.ui.activeDiv.id + "Content").append(_html);
		},
		checkNetwork: function() { //检测网络状态
			var netType = plus.networkinfo.getCurrentType();
			if(netType == 1) { //无网络
				$.ui.popup(msgCode.noNetwork);
				return false;
			}
		},
		verifyStyle: function(obj, clickobj) { //单个文本框验证
			var check = $(obj).attr("data-check"),
				required = $(obj).attr("required"),
				dataLength = $(obj).attr("data-length"),
				val = $(obj).val();
			if(clickobj != undefined && $(clickobj).attr("submited") != null) {
				return false;
			}
			$(clickobj).attr("submited", "true");
			$(obj).val(val.trim());
			if(required != undefined && required != null && (val == undefined || val.trim().length < 1)) { //为空处理
				common.removeSubmitedFlag(clickobj, $(obj).attr("data-warning"));
				return false;
			}
			if(dataLength != null && val.length > dataLength) {
				var tipMsg = "最大字符长度不超过" + dataLength + "个字符";
				common.removeSubmitedFlag(clickobj, tipMsg);
				return false;
			}
			if(check != null && $(obj).val().length > 0) {
				if(!(new RegExp(check)).test(val)) {
					common.removeSubmitedFlag(clickobj, $(obj).attr("data-warning-check"));
					return false;
				}
			}
			return true;
		},
		serializeToJson: function(obj) {
			var data = $(obj).serialize();
			data = decodeURIComponent(data, true); //防止中文乱码  
			data = data.replace(/&/g, "\",\"");
			data = data.replace(/=/g, "\":\"");
			data = "{\"" + data + "\"}";
			return $.parseJSON(data);
		},
		gotoPage: function(dir, tkey) {
			var obj = document.createElement("a");
			$(obj).attr("data-dir", dir);
			$(obj).attr("data-tkey", tkey);
			$(obj).attr("data-transition", "slide");
			common.loadPage(obj, false, false, false, true);
		},
		moreMenu: function(obj) {
			var el_moreMenu = $(obj).parent().find('.moreMenu');
			if($(el_moreMenu).hasClass('active')) {
				$(el_moreMenu).removeClass('active');
			} else {
				$(el_moreMenu).addClass('active');
			}
		},
		moreMenuLi: function(obj) {
			var el_moreMenu = $(obj).parent().parent();
			if($(el_moreMenu).hasClass('active')) {
				$(el_moreMenu).removeClass('active');
			}
			common.loadPage($(obj));
		},
		pickImg: function(obj) {
			var el_obj = obj;
			var buttons = [{
				title: "拍照"
			}, {
				title: "从手机相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "修改照片",
				cancel: "取消",
				buttons: buttons
			}, function(selected) { /*actionSheet 按钮点击事件*/
				switch(selected.index) {
					case 0:
						break;
					case 1:
						plus.camera.getCamera().captureImage(function(filepath) {
							console.log(filepath)
							plus.io.resolveLocalFileSystemURL(filepath, function(entry) {
								var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。
								console.log(localurl);
								$(el_obj).attr("src", localurl);
							});
						});
						break;
					case 2:
						plus.gallery.pick(function(e) {
							console.log(e.files[0]);
							$(el_obj).attr("src", e.files[0]);
						}, function(e) {
							console.log("取消选择图片");
						}, {
							filter: "image",
							multiple: true
						});
						break;
					default:
						break;
				}
			});
		}
	};
	window.common = common;
})();