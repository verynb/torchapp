var loadData = function() {
	//{data:xxx,container:xxx,readOnly:xxx,buttons:xxxx,.....}
	var
		flashDivSet = function(params) {
			var data = params.data;
			var container = params.container;
			var buttons = params.buttons;
			var readOnly = params.readOnly == undefined ? true : params.readOnly;
			//根据状态筛选右上角菜单
			var rightMenuLi = $("#topRightMenu ul").find("li");
			var removeCount = 0;
			for(var i = 0; i < rightMenuLi.length; i++) {
				var liCaseField = $(rightMenuLi[i]).attr("data-caseField") ? $(rightMenuLi[i]).attr("data-caseField") : "";
				if(liCaseField.indexOf("==") > 0) {
					if(seekDatasource(data, liCaseField.split("==")[0]) == liCaseField.split("==")[1]) {
						$(rightMenuLi[i]).remove();
						removeCount++;
					}
				} else if(liCaseField.indexOf(">=") > 0) {
					if(seekDatasource(data, liCaseField.split(">=")[0]) >= liCaseField.split(">=")[1]) {
						$(rightMenuLi[i]).remove();
						removeCount++;
					}
				} else if(liCaseField.indexOf(">") > 0) {
					if(seekDatasource(data, liCaseField.split(">")[0]) > liCaseField.split(">")[1]) {
						$(rightMenuLi[i]).remove();
						removeCount++;
					}
				} else if(liCaseField.indexOf("<=") > 0) {
					if(seekDatasource(data, liCaseField.split("<=")[0]) <= liCaseField.split("<=")[1]) {
						$(rightMenuLi[i]).remove();
						removeCount++;
					}
				} else if(liCaseField.indexOf("<") > 0) {
					if(seekDatasource(data, liCaseField.split("<")[0]) < liCaseField.split("<")[1]) {
						$(rightMenuLi[i]).remove();
						removeCount++;
					}
				}
			}
			if(removeCount >= rightMenuLi.length) {
				$("#header #topRightMenuBtn").hide(); //隐藏右上角子菜单
			}

			if(params != undefined && params.hasOwnProperty("caseField") && data != null) {
				if(params["caseField"].indexOf("==") > 0) {
					if(seekDatasource(data, params["caseField"].split("==")[0]) == params["caseField"].split("==")[1]) readOnly = true;
				} else if(params["caseField"].indexOf(">=") > 0) {
					if(seekDatasource(data, params["caseField"].split(">=")[0]) >= params["caseField"].split(">=")[1]) readOnly = true;
				} else if(params["caseField"].indexOf(">") > 0) {
					if(seekDatasource(data, params["caseField"].split(">")[0]) > params["caseField"].split(">")[1]) readOnly = true;
				} else if(params["caseField"].indexOf("<=") > 0) {
					if(seekDatasource(data, params["caseField"].split("<=")[0]) <= params["caseField"].split("<=")[1]) readOnly = true;
				} else if(params["caseField"].indexOf("<") > 0) {
					if(seekDatasource(data, params["caseField"].split("<")[0]) < params["caseField"].split("<")[1]) readOnly = true;
				} else {
					if(seekDatasource(data, params["caseField"]) != null && seekDatasource(data, params["caseField"]).length > 0 && seekDatasource(data, params["caseField"]) != "--") readOnly = true;
				}
			}
			params.readOnly = readOnly;
			var ctns = $("#" + container + " .datasource");
			for(var i = 0; i < ctns.length; i++) {
				var ctn = ctns[i];
				var datasource = $(ctn).attr("data-datasource");
				if(datasource != null) {
					if(datasource == "default" || datasource == "") {
						flashDiv(data, "#" + container + " #" + ctn.id, params);
					} else {
						flashDiv(seekDatasource(data, datasource), "#" + container + " #" + ctn.id, params);
					}
				}
				if(params.callback && $.isFunction(params.callback)) {
					params.callback(params);
				}
			}
			//*********************
			var showfooter = false;
			var buttonInPage = true;
			var footerbarid = container + "footerbar";
			var div = '';
			if(buttons != null && buttons != undefined) {
				var btnContainer = "";
				if(params != undefined && params.hasOwnProperty("barbutton")) {
					btnContainer = "#navbar footer";
					buttonInPage = false;
				} else {
					btnContainer = "#" + container + " #buttons";
					buttonInPage = true;
				}
				if(buttonInPage) {
					$("#navbar").hide();
					if(params != undefined && params.hasOwnProperty("showfootbar")) {
						$("#navbar").show();
						showfooter = true;
					}
				} else {
					$("#navbar").show();
					showfooter = true;
				}
				$(btnContainer).empty();
				//				if(readOnly) {
				//					if(buttons.hasOwnProperty("viewbutton")) {
				//						$(btnContainer).append(buttons.viewbutton);
				//					}
				//				} else {
				if($.isObject(buttons)) {
					//						$(btnContainer).append(buttons.hasOwnProperty("nextbutton") ? buttons.nextbutton + buttons.submitbutton : buttons.submitbutton);
					for(var key in buttons) {
						div += buttons[key];
					}
				} else {
					div = buttons;
				}
				$(btnContainer).append(div);
				if($("#afui #" + footerbarid).length < 1) {
					$("#afui").append("<footer id='" + footerbarid + "'></footer>");
					$("#" + footerbarid).append(div);
					$("#" + container).attr("data-footer", footerbarid);
				}
				//				}
				if(!buttonInPage) {
					//					var btns = $(btnContainer).find("a").length;
					//					$(btnContainer + " a").css("width", 1 / btns * 100 + "%");
					//					$(btnContainer + " a").addClass("footer");
				}

			} else {
				if(params != undefined && params.hasOwnProperty("showfootbar")) {
					$("#navbar").show();
					showfooter = true;
				} else {
					$("#navbar").hide();
				}
			}
			if(buttonInPage && showfooter && params.bartab) {
				var bars = $("#navbar footer a");
				var bartab = params.bartab;
				for(var bartabkey in bartab) {
					$(bars).attr("data-" + bartabkey, bartab[bartabkey]);
				}
			}
		},
		flashDiv = function(data, divid, params) {
			var isloop = ($(divid).attr("data-isloop") != null);
			if(isloop) {
				flashLoopDiv(data, divid, params);
			} else {
				flashSingleDiv(data, divid, params);
			}
			flashToNoType($(divid), data, params);
		},
		flashSingleDiv = function(data, divid, params) {
			if(data != null && data.hasOwnProperty("id")) $(divid).attr("data-primarykey", data.id)

			var packs = $(divid + " .fromfield")
			for(var i = 0; i < packs.length; i++) {
				var tag = $(packs[i]).get(0).tagName.toLowerCase();
				if(tag == "input") {
					var type = $(packs[i]).get(0).type.toLowerCase();
					if(type == "button") {

					} else if(type == "checkbox") {
						flashToCheckbox(packs[i], data, params);
					} else if(type == "file") {

					} else if(type == "hidden") {
						flashToText(packs[i], data, params);
					} else if(type == "image") {

					} else if(type == "number") {
						flashToText(packs[i], data, params);
					} else if(type == "password") {

					} else if(type == "radio") {
						flashToRadio(packs[i], data, params);
					} else if(type == "reset") {

					} else if(type == "submit") {

					} else if(type == "text") {
						flashToText(packs[i], data, params);
					}
				} else {
					if(tag == "div" && $(packs[i]).attr("data-datasource") != undefined && $(packs[i]).attr("data-datasource").length > 1) { //自定义的select
						flashToMySelect(packs[i], data, params);
					} else if(tag == "img") {
						flashToImg(packs[i], data, params);
					} else {
						flashToNoType(packs[i], data, params); //放入到对象的text
					}
				}
			}
		},
		flashLoopDiv = function(data, divid, params) {
			var div = $(divid);
			var substringLength = $(divid).get(0).tagName.length + 1;
			var divContent = $(div).html().trim();
			var curid = $(div).attr("id");
			$(div).empty();
			for(var i = 0; i < data.length; i++) {
				var newHtml1 = divContent.substring(0, substringLength);
				var newHtml2 = divContent.substring(substringLength);
				var newHtml3 = ' id="' + curid + "_" + i + '" ';
				$(div).append(newHtml1 + newHtml3 + newHtml2);
				flashDiv(data[i], divid + " #" + curid + "_" + i, params);
			}
		},
		seekDatasource = function(data, sourcekey) {
			if(data == null || sourcekey == null || sourcekey.length < 1) return "";
			var dotposi = sourcekey.indexOf(".");
			return dotposi < 0 ? data.hasOwnProperty(sourcekey) ? data[sourcekey] : "" : data.hasOwnProperty(sourcekey.substring(0, dotposi)) ? seekDatasource(data[sourcekey.substring(0, dotposi)], sourcekey.substring(dotposi + 1)) : "";
		},
		getFieldValue = function(obj, data, params) {
			var fromfield = $(obj).attr("data-fromfield");
			var composefield = $(obj).attr("data-composefield");
			if(fromfield) {
				return getSingleFieldValue(obj, data, params);
			} else if(composefield) {
				return getComposeFieldValue(obj, data, params);
			} else {
				return "";
			}
		},
		getSingleFieldValue = function(obj, data, params) {
			var fromfield = $(obj).attr("data-fromfield");
			if(fromfield == undefined || fromfield == null || fromfield.length < 1)
				return "";
			var unionchar = $(obj).attr("data-unionchar") || G_SPLITCHAR;
			var value = "";
			var fields = fromfield.split(",");
			for(var j = 0; j < fields.length; j++) {
				var tmpval = "";
				var transto = "";
				var field = fields[j];
				var transfield = field.split("|");
				if(transfield.length <= 1) {
					tmpval = seekDatasource(data, field);
				} else {
					transto = transfield[1].substring(5); //0-4转义方式，5为:,后面为参数

					switch(transfield[1].substring(0, 4)) {
						case "tran":
							//判断是否存在范围改值
							var scopekeyArr = [];
							var scopeNum = 0;
							for(var key in translateValue[transto]) {
								if(key.indexOf("~") > -1) {
									var temp = key.split("~");
									scopekeyArr[scopeNum] = {
										keyValue: key,
										min: parseInt(temp[0]),
										max: parseInt(temp[1])
									};
									scopeNum++;
								}
							}
							if(translateValue[transto][data[transfield[0]]]) {
								tmpval = seekDatasource(data, transfield[0]);
							} else { //范围key
								for(var k = 0; k < scopekeyArr.length; k++) {
									if(data[transfield[0]] >= scopekeyArr[k].min && data[transfield[0]] <= scopekeyArr[k].max) {
										tmpval = translateValue[transto][scopekeyArr[k].keyValue];
										break;
									}
								}
							}
							break;
						case "posi":
							var temp = seekDatasource(data, transfield[0]);
							if(temp != null && temp != undefined && temp.length > 0) {
								if(transto.split("-").length > 1) {
									tmpval = temp.substring(parseInt(transto.split("-")[0]), parseInt(transto.split("-")[1]));
								} else {
									tmpval = temp.substring(parseInt(transto));
								}
							}
							break;
						default:
							tempvalue = seekDatasource(data, transfield[0]);
					}
				}
				value += (tmpval == null ? "" : tmpval) + (j >= fields.length - 1 ? "" : unionchar); //不是最后一个要加连接符
			}
			if(value.replaceAll(unionchar, "") == "") {
				value = "";
			} else if(value.lastIndexOf(unionchar) == value.length - 1) {
				value = value.substring(0, value.lastIndexOf(unionchar));
			}
			return value;
		},
		getComposeFieldValue = function(obj, data, params) {
			var composefield = $(obj).attr("data-composefield");
			if(composefield == undefined || composefield == null || composefield.length < 1)
				return "";
			var unionchar = "_";
			var value = "";
			var fields = composefield.split("|")[0].split(",");
			for(var j = 0; j < fields.length; j++) {
				var tmpval = "";
				var field = fields[j];
				tmpval = seekDatasource(data, field);
				value += (tmpval == null ? "" : tmpval) + (j >= fields.length - 1 ? "" : unionchar); //不是最后一个要加连接符
			}
			if(value.lastIndexOf(unionchar) == value.length - 1) {
				value = value.substring(0, value.lastIndexOf(unionchar));
			}
			if(composefield.split("|").length > 1) {
				var transto = composefield.split("|")[1].substring(5); //0-4转义方式，5为:,后面为参数
				switch(composefield.split("|")[1].substring(0, 4)) {
					case "tran":
						if(translateValue[transto][value]) {
							value = translateValue[transto][value];
						} else { //范围key
							value = "";
						}
						break;
					case "posi":
						if(transto.split("-").length > 1) {
							value = value.substring(parseInt(transto.split("-")[0]), parseInt(transto.split("-")[1]));
						} else {
							value = value.substring(parseInt(transto));
						}
						break;
					case "oper":

						break;
					default:
				}
			}
			return value;
		},
		addParamsValue = function(obj, data, params) {
			var fields = $(obj).attr("data-paramsvalue").split(",");
			for(var i = 0; i < fields.length; i++) {
				$(obj).attr("data-" + fields[i], seekDatasource(data, fields[i]));
			}
		},
		flashToNoType = function(obj, data, params) {
			var defaultvalue = $(obj).attr("data-defaultvalue");
			var unionchar = $(obj).attr("data-unionchar") || G_SPLITCHAR;
			var maxlength = $(obj).attr("data-maxlength");
			var hasnofromfield = (($(obj).attr("data-fromfield") || $(obj).attr("data-composefield")) == null);
			var addtype = hasnofromfield ? "none" : ($(obj).attr("data-addtype") || "put").split("|");
			var value = getFieldValue(obj, data, params);
			var valueArr = value.split(unionchar)
			var ovalue = $(obj).text();
			if(maxlength && value.length > 0) {
				value = value.substring(0, maxlength) + "……";
			}
			if((value == undefined || value == null || value.length < 1) && defaultvalue != undefined) {
				value = defaultvalue;
			}
			switch(addtype[0]) {
				case "append":
					$(obj).text(ovalue + value);
					break;
				case "preappend":
					$(obj).text(value + ovalue);
					break;
				case "replace":
					$(obj).text(ovalue.replaceAll(addtype[1], value));
					break;
				case "put":
					$(obj).text(value);
					break;
				case "operate":
					var arrlength = valueArr.length,
						result = 0;
					if(arrlength > 0) {
						for(var i = 0; i < arrlength; i++) {
							arritem = valueArr[i];
							if(arritem == "" || arritem == undefined || arritem == null) {
								arritem = 0;
							}
							if(addtype[1] == "add") {
								result += parseFloat(arritem);
							}
						}
					}
					$(obj).text(result);
					break;
				case "none":
					break;
				default:
			}
			var paramsvalue = $(obj).attr("data-paramsvalue");
			if(paramsvalue != undefined && paramsvalue != null && paramsvalue.length > 0) {
				addParamsValue(obj, data, params);
			}
			var jsonvalue = $(obj).attr("data-json");
			if(jsonvalue != undefined && jsonvalue != null) {
				if(jsonvalue.length < 1 || jsonvalue == "all") {
					$(obj).attr("data-json", JSON.stringify(data));
				} else {
					$(obj).attr("data-json", JSON.stringify(seekDatasource(data, jsonvalue)));
				}
			}
		},
		flashToText  = function(obj, data, params) {
			var readOnly = params.readOnly;
			if(!readOnly && !$(obj).attr("readonly")) {
				$(obj).attr("onfocus", $(obj).attr("onfocus") == null ? "common.inputGetFocus(this);" : ($(obj).attr("onfocus") + ";common.inputGetFocus(this);"));
				$(obj).attr("onblur", $(obj).attr("onblur") == null ? "common.inputGetBlur(this);" : ($(obj).attr("onblur") + ";common.inputGetBlur(this);"));
			}
			var defaultvalue = $(obj).attr("data-defaultvalue");
			var fromfield = $(obj).attr("data-fromfield");
			var namefield = $(obj).attr("name");
			if(data == null) {
				if(defaultvalue != null && !readOnly) {
					$(obj).attr("value", defaultvalue);
				}
			} else {
				var value = "";
				var tmpval = "";
				if(fromfield != null && fromfield.length > 0) {
					value = getFieldValue(obj, data, params);
				} else {
					tmpval = seekDatasource(data, namefield);
					value = ((tmpval == "" && !readOnly) ? defaultvalue == null ? "" : defaultvalue : tmpval);
				}
				if($(obj).attr("data-fixededitabled") != null) {
					$(obj).removeAttr("readonly")
					$(obj).removeAttr("disabled")
				} else if($(obj).attr("data-fixeddisabled") != null && data != null) { //新建的时候该项不起效果
					$(obj).attr("readonly", "readonly")
					$(obj).removeAttr("placeholder");
					$(obj).removeAttr("onclick");
				} else {
					if(readOnly) {
						$(obj).attr("readonly", "readonly")
						$(obj).removeAttr("placeholder");
						$(obj).removeAttr("onclick");
					} else {
						$(obj).removeAttr("readonly");
						$(obj).removeAttr("disabled");
					}
				}
				$(obj).attr("value", value);
				var paramsvalue = $(obj).attr("data-paramsvalue");
				if(paramsvalue != undefined && paramsvalue != null && paramsvalue.length > 0) {
					addParamsValue(obj, data, params);
				}
				var jsonvalue = $(obj).attr("data-json");
				if(jsonvalue != undefined && jsonvalue != null) {
					if(jsonvalue.length < 1 || jsonvalue == "all") {
						$(obj).attr("data-json", JSON.stringify(data));
					} else {
						$(obj).attr("data-json", JSON.stringify(seekDatasource(data, jsonvalue)));
					}
				}
			}
		},
		flashToCheckbox = function(obj, data, params) {
			var readOnly = params.readOnly;
			var defaultvalue = $(obj).attr("data-defaultvalue");
			var fromfield = $(obj).attr("data-fromfield");
			var namefield = $(obj).attr("name");
			if(data == null) {

			} else {
				var value = "";
				var tmpval = "";
				if(fromfield != null && fromfield.length > 0) {
					value = getFieldValue(obj, data, params);
				} else {
					tmpval = seekDatasource(data, namefield);
					value = ((tmpval == "" && !readOnly) ? defaultvalue == null ? "" : defaultvalue : tmpval);
				}
				if(value != "0" && value != "false" && value != "off" && value != false) {
					$(obj).attr("checked", "checked");
					if($(obj).parent().hasClass("myToggleOnOff")) { //TODO://改成项目定义的class
						$(obj).parent().removeClass("myToggleOff");
						$(obj).parent().addClass("myToggleOn");
						$(obj).parent().find("p")[0].innerHTML = $(obj).parent().attr("data-on");
					}
				} else {
					$(obj).removeAttr("checked");
					if($(obj).hasClass("quality")) { //TODO://改成项目定义的class
						$(obj).parent().removeClass("labelBeforeChecked");
						$(obj).parent().addClass("labelBefore");
					}
				}
				if($(obj).attr("data-fixededitabled") != null) {
					$(obj).removeAttr("readonly");
					$(obj).removeAttr("disabled");
				} else if($(obj).attr("data-fixeddisabled") != null && data != null) { //新建的时候该项不起效果
					$(obj).attr("disabled", "disabled");
				} else {
					if(readOnly) {
						$(obj).attr("disabled", "disabled");
					} else {
						$(obj).removeAttr("readonly");
						$(obj).removeAttr("disabled");
					}
				}
				var paramsvalue = $(obj).attr("data-paramsvalue");
				if(paramsvalue != undefined && paramsvalue != null && paramsvalue.length > 0) {
					addParamsValue(obj, data, params);
				}
				var jsonvalue = $(obj).attr("data-json");
				if(jsonvalue != undefined && jsonvalue != null) {
					if(jsonvalue.length < 1 || jsonvalue == "all") {
						$(obj).attr("data-json", JSON.stringify(data));
					} else {
						$(obj).attr("data-json", JSON.stringify(seekDatasource(data, jsonvalue)));
					}
				}
			}
		},
		flashToRadio = function(obj, data, params) {
			var readOnly = params.readOnly;
			var defaultvalue = $(obj).attr("data-defaultvalue");
			var fromfield = $(obj).attr("data-fromfield");
			var namefield = $(obj).attr("name");
			if(data == null) {

			} else {
				var value = "";
				var tmpval = "";
				if(fromfield != null && fromfield.length > 0) {
					value = getFieldValue(obj, data, params);
				} else {
					tmpval = seekDatasource(data, namefield);
					value = ((tmpval == "" && !readOnly) ? defaultvalue == null ? "" : defaultvalue : tmpval);
				}
				if(value == $(obj).attr("value")) {
					$(obj).attr("checked", "checked");
					$(obj).parent().removeClass("labelBeforeRadio"); //TODO:改成项目的class
					$(obj).parent().addClass("labelBeforeRadioChecked");
				} else {
					$(obj).removeAttr("checked");
					$(obj).parent().removeClass("labelBeforeRadioChecked"); //TODO:改成项目的class
					$(obj).parent().addClass("labelBeforeRadio");
				}
				if($(obj).attr("data-fixededitabled") != null) {
					$(obj).removeAttr("readonly");
					$(obj).removeAttr("disabled");
				} else if($(obj).attr("data-fixeddisabled") != null && data != null) { //新建的时候该项不起效果
					$(obj).attr("disabled", "disabled");
				} else {
					if(readOnly) {
						$(obj).attr("disabled", "disabled");
					} else {
						$(obj).removeAttr("readonly");
						$(obj).removeAttr("disabled");
					}
				}
				var paramsvalue = $(obj).attr("data-paramsvalue");
				if(paramsvalue != undefined && paramsvalue != null && paramsvalue.length > 0) {
					addParamsValue(obj, data, params);
				}
				var jsonvalue = $(obj).attr("data-json");
				if(jsonvalue != undefined && jsonvalue != null) {
					if(jsonvalue.length < 1 || jsonvalue == "all") {
						$(obj).attr("data-json", JSON.stringify(data));
					} else {
						$(obj).attr("data-json", JSON.stringify(seekDatasource(data, jsonvalue)));
					}
				}
			}
		},
		flashToMySelect = function(obj, data, params) {

		},
		flashToImg = function(img, data, params) {
			var fromfield = $(img).attr("data-fromfield");
			var imgtype = $(img).attr("data-imgtype");
			var pictureid = getFieldValue(img, data, params);
			var title = $(img).attr("data-title");
			var onlyimg = $(img).attr("data-onlyimg");
			var readOnly = params.readOnly;
			var imgsize = '';
			var srcValue = '';
			switch(imgtype) {
				case "1":
					imgsize = "50x50";
					break;
				case "2":
					imgsize = "100x100";
					break;
				case "3":
					imgsize = "200x200";
					break;
				default:
					break;
			}
			if(pictureid) {
				if(imgsize.length < 0) {
					srcValue = G_IMGPREFIX + pictureid;
				} else {
					srcValue = G_IMGPREFIX + imgsize + pictureid;
				}
				$(img).attr("src", srcValue);
			}
			if($(img).attr("data-fixeddisabled") != null && data != null) {
				$(img).removeAttr("readonly");
				$(img).removeAttr("onclick");
			} else if(!readOnly) { //非可读情况
				$(img).bind('tap', function() {
					var thisimg = this;
					common.pickImg(thisimg, function(picImgArr) {
						if(onlyimg && onlyimg == "only") {
							$(img).attr("src", picImgArr[0]);
						} else {
							for(var i = 0; i < picImgArr; i++) {
								$(img).attr("src", picImgArr[i]);
							}
						}
					})
				});
			}
			var paramsvalue = $(img).attr("data-paramsvalue");
			if(paramsvalue != undefined && paramsvalue != null && paramsvalue.length > 0) {
				addParamsValue(img, data, params);
			}
			var jsonvalue = $(img).attr("data-json");
			if(jsonvalue != undefined && jsonvalue != null) {
				if(jsonvalue.length < 1 || jsonvalue == "all") {
					$(img).attr("data-json", JSON.stringify(data));
				} else {
					$(img).attr("data-json", JSON.stringify(seekDatasource(data, jsonvalue)));
				}
			}
		},
		loadLocalFile = function(type, filename, callback) {
			if(filename == undefined || filename == null || filename.length < 1) {
				callback.call(null, false);
			} else {
				var local_file_url = (type == "image" ? "_doc/image/" : "_doc/audio/") + filename;
				local_file_url = 'file://' + plus.io.convertLocalFileSystemURL(local_file_url);
				plus.io.resolveLocalFileSystemURL(local_file_url, function(entry) {
					callback.call(null, true);
				}, function(e) {
					if(type == "image") {
						downloadPicture(filename, callback);
						console.log("download");
					} else if(type = "audio") {
						downloadAudio(filename, callback);
					}
				});
			}
		},
		downloadPicture = function(filename, callback) {
			var params = {};
			params.filename = filename;
			$.post(
				webContent.rootUrl + "attachment/downloadfileasbase64",
				$.param(params),
				function(data) {
					if(data.hasOwnProperty("failed")) {
						callback(false);
					} else {
						var base64code = data.data.base64code;
						var bitmap = new plus.nativeObj.Bitmap("picture");
						bitmap.loadBase64Data(base64code, function() {
							sixtyLog("加载Base64图片数据成功");
							bitmap.save("_doc/image/" + filename, {}, function(i) {
								sixtyLog("save base64 successful:" + JSON.stringify(i));
								callback(true);
							}, function(se) {
								sixtyLog("save base64 failed:" + JSON.stringify(se));
								callback(false);
							});
						}, function(de) {
							sixtyLog('加载Base64图片数据失败：' + JSON.stringify(e));
							callback(false);
						});
					}
				}, "json");
		},
		downloadAudio = function(filename, callback) {
			var params = {};
			params.filename = filename;
			$.post(
				webContent.rootUrl + "attachment/downloadfileasbase64",
				$.param(params),
				function(data) {
					if(data.hasOwnProperty("failed")) {
						callback(false);
					} else {
						var base64code = data.data.base64code;
						var dirPath = plus.io.convertLocalFileSystemURL("_doc/audio/");
						var fullPath = plus.io.convertLocalFileSystemURL("_doc/audio/" + filename);
						if($.os.android) {
							var Base64 = plus.android.importClass("android.util.Base64");
							var File = plus.android.importClass("java.io.File");
							var FileOutputStream = plus.android.importClass("java.io.FileOutputStream");
							var dir = new File(dirPath);
							if(!dir.exists()) dir.mkdirs();
							try {
								var out = new FileOutputStream(fullPath);
								var bytes = Base64.decode(base64code, Base64.DEFAULT);
								out.write(bytes);
								out.close();
								callback && callback(true);
							} catch(e) {
								sixtyLog(e.message);
							}
						} else if($.os.ios) {
							plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
								fs.root.getFile("/audio/" + filename, {
									create: true
								}, function(entry) {
									var NSData = plus.ios.importClass('NSData');
									var nsData = new NSData();
									nsData = nsData.initWithBase64EncodedStringoptions(base64code.replaceAll("\n", ""), 0);
									if(nsData) {
										nsData.plusCallMethod({
											writeToFile: fullPath,
											atomically: true
										});
										plus.ios.deleteObject(nsData);
									}
									callback && callback(true);
								})
							})
						}
					}
				}, "json");
		},
		uploadPicture = function(filepath, img) {
			$.ui.showMask();
			var posturl = $(img).attr("data-posturl");
			sixtyLog(filepath);
			var suffix = filepath.substring(filepath.lastIndexOf(".") + 1);
			var newname = common.getlocalStorageItemStr("userinfo", "id") + (new Date().getTime());
			plus.zip.compressImage({
					src: filepath,
					dst: "_doc/image/" + newname + "." + suffix,
					overwrite: true,
					width: '500px',
					format: suffix,
					quality: 100
				},
				function(e) {
					var task = plus.uploader.createUpload(webContent.rootUrl + posturl, {
							method: "POST"
						},
						function(t, status) { //上传完成
							$.ui.hideMask();
							if(status == 200) {
								var data = $.parseJSON(t.responseText);
								if(data.failed) {
									$.ui.popup(data.failed.message);
								} else {
									sixtyLog("zip as to:" + e.target);
									$(img).attr("src", e.target);
									$($(img).parent().find("input[name=pictureid]")[0]).val(newname + "." + suffix);
								}
							} else {
								$.ui.popup("上传图片失败，请重试");
							}
							plus.io.resolveLocalFileSystemURL(filepath, function(entry) {
								entry.remove();
							}, function(e) {});
						});
					task.addData("userid", common.getlocalStorageItemStr("userinfo", "id"));
					task.addData("sixtytoken", common.getlocalStorageItemStr("token"));
					task.addData("oldfileid", $($(img).parent().find("input[name=pictureid]")[0]).val());
					task.addFile(e.target, {
						key: "file"
					});
					task.start();
				},
				function(err) {
					$.ui.hideMask();
					sixtyLog(JSON.stringify(err));
					$.ui.popup("压缩图片失败，请重试");
				}
			);
		};

	return {
		//{data:xxx,container:xxx,readOnly:xxx,buttons:xxxx,.....}
		load: function(params) { //如果是url，通过ajax获取数据后再加载数据，其它情况直接加载
			if(params.hasOwnProperty("data") && !$.isObject(params.data) && params.data.length > 1) {
				$.ui.showMask(msgCode.customizeCode.loadingTip);
				var urlHead = webContent.rootUrl;
				var paramsData = params.paramsData;
				params.mockupsvr ? (urlHead = webContent.mockupsvr) : urlHead;
				if(!paramsData) paramsData = {};
				ajaxFuncs.post({
					urlname: params.data,
					params: paramsData,
					funcs: {
						funcSuccessful: function(data) {
							$.ui.hideMask();
							params.data = data;
							flashDivSet(params);
						}
					}
				});
			} else {
				flashDivSet(params);
			}
		},
		seekDatasource: seekDatasource,
		flashDivSet: flashDivSet,
		flashDiv: flashDiv,
		flashSingleDiv: flashSingleDiv,
		flashLoopDiv: flashLoopDiv,
		flashToNoType: flashToNoType,
		flashToText: flashToText,
		flashToCheckbox: flashToCheckbox,
		flashToRadio: flashToRadio,
		flashToMySelect: flashToMySelect,
		flashToImg: flashToImg,
		loadLocalFile: loadLocalFile,
		downloadPicture: downloadPicture,
		downloadAudio: downloadAudio,
		uploadPicture: uploadPicture
	};
}();