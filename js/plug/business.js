"use strict";

function userLogout(obj) {
	if(!common.validate(obj)) {
		return false;
	} else {
		common.executeLogout(0, obj);
	}
}

function startHome(data) {
	$.ui.hideMask(); //加载完相关信息后关闭mask
	common.gotoPage("common", "home");
}

function sixtyLog(loginfo) {
	if(G_ENV != 3) {
		if(G_LOG_TYPE == 0) {
			console.log(loginfo);
		} else if(G_LOG_TYPE == 1) {
			alert(loginfo);
		}
	}
}

//时间格式转换
function timeToStr(ts) {
	if(isNaN(ts)) {
		return "--:--:--";
	}
	var h = parseInt(ts / 3600);
	var m = parseInt((ts % 3600) / 60);
	var s = parseInt(ts % 60);
	return(h + ":" + m + ":" + s);
}
//批量上传图片方式
function galleryImgsSelected(obj) {
	var thisObj = obj,
		title = $(obj).attr("data-title"),
		imgLiLength = "",
		leaveImgLiLength;
	imgLiLength = $(obj).parent().find("li").length - 1;
	leaveImgLiLength = 3 - imgLiLength;
	if(imgLiLength < 3) {
		if(plus) {
			var buttons = [{
				title: "从手机相册选择"
			}, {
				title: "拍照"
			}];
			plus.nativeUI.actionSheet({
				title: title,
				cancel: "取消",
				buttons: buttons
			}, function(selected) { /*actionSheet 按钮点击事件*/
				switch(selected.index) {
					case 0:
						break;
					case 1:
						plus.gallery.pick(function(e) {
							for(var i in e.files) {
								//i用于批量上传多个文件名的重名问题,最后参数selected.index用于判断是拍照还是相册选择
								console.log("plus相册返回图片本地路径 " + i + e.files[i]);
								uploadSelectedPicture(e.files[i], thisObj, i, selected.index);
							}
						}, function(e) {
							console.log("取消选择图片");
						}, {
							filter: "image",
							multiple: true,
							maximum: leaveImgLiLength,
							system: false,
							onmaxed: function() {
								plus.nativeUI.alert("最多只能选择" + leaveImgLiLength + "张图片");
							}
						});
						break;
					case 2:
						plus.camera.getCamera().captureImage(function(filepath) {
							console.log("plus拍照返回图片本地路径 " + filepath);
							uploadSelectedPicture(filepath, thisObj, 0, selected.index);
						});
						break;
					default:
						break;
				}
			});
		}
	} else {
		$.ui.popup("对不起，最多能上传三张图片！")
	}
}
/**
 * 
 * @param  filepath 上传图片的本地绝对路径
 * @param  uploadDiv 触发actionsheet的div
 * @param  fileindex 批量上传图片的下标，用于压缩后图片的拼接处
 * @param  choiceIndex 判断是拍照还是相册的下标
 * 批量上传图像
 */
function uploadSelectedPicture(filepath, uploadDiv, fileindex, choiceIndex) {
	$.ui.showMask();
	var posturl = $(uploadDiv).attr("data-posturl");
	var suffix = filepath.substring(filepath.lastIndexOf(".") + 1);
	var newname = common.getlocalStorageItemStr("userinfo", "id") + (new Date().getTime());
	var picName = newname + fileindex + "." + suffix;
	plus.zip.compressImage({
			src: filepath,
			dst: "_doc/image/" + picName,
			overwrite: true,
			width: '500px',
			format: suffix,
			quality: 100
		},
		function(e) {
			var task = plus.uploader.createUpload(
				webContent.rootUrl + posturl, {
					method: "POST"
				},
				function(t, status) { //上传完成
					$.ui.hideMask();
					if(status == 200) {
						var data = $.parseJSON(t.responseText);
						if(data.failed) {
							$.ui.popup(data.failed.message);
						} else {
							var li = "";
							var imgUl = $(uploadDiv).parent();
							var liId = $.ui.activeDiv.id + newname + fileindex;
							li = "<li id='" + liId + "'>" +
								"<img src='" + e.target + "'/>" +
								"<input type='hidden' name='filename' value='" + picName + "'/>" +
								"</li>"
							$(imgUl).prepend(li);
							deleteOnePicture(liId, picName); //绑定长按删除事件
							var imgLiLength = $(uploadDiv).parent().find("li").length - 1;
							if(imgLiLength >= 3) {
								$(uploadDiv).remove();
							}
						}
					} else {
						$.ui.popup("上传图片失败，请重试,status为" + status);
					}
					plus.io.resolveLocalFileSystemURL(filepath, function(entry) {
						if(choiceIndex == 2) { //如果是拍照上传图片则删除源文件
							entry.remove();
						}
					}, function(e) {});
				}
			);
			task.addData("userid", common.getlocalStorageItemStr("userinfo", "id"));
			task.addData("sixtytoken", common.getlocalStorageItemStr("token"));
			task.addFile(e.target, {
				key: "file"
			});
			console.log("压缩成功后图片下标" + fileindex + e.target);
			console.log("压缩成功后图片对象e.target " + e.target);
			console.log("压缩成功后图片路径picName " + picName);
			task.start();
		},
		function(err) {
			$.ui.hideMask();
			$.ui.popup("压缩图片失败，请重试");
			console.log("压缩图片失败图片下标" + fileindex);
			console.log("压缩图片失败错误编码" + err.code);
			console.log("压缩图片失败错误描述" + err.message);
		}
	);
}
/**
 * 
 * @param  aFilepath 上传图片的本地绝对路径构成的数组
 * @param  imgIndex aFilepath数组开始的序号
 * @param  aImgBack 返回的上传图片名称数组
 * @param  callback 回调
 * 批量上传图像 for 社区 by 欧君仁杰 2017.05.09
 */
function uploadPicturesToCommunity(aFilepath, imgIndex, aImgBack, callback) {
	$.ui.showMask("发送中");
	var posturl = webContent.rootUrl; //上传图片到的图片服务器
	var suffix = aFilepath[imgIndex].substring(aFilepath[imgIndex].lastIndexOf(".") + 1);
	var newname = common.getlocalStorageItemStr("userinfo", "id") + (new Date().getTime());
	var picName = newname + "." + suffix;
	var totalNum = aFilepath.length;

	plus.zip.compressImage({
			src: aFilepath[imgIndex],
			dst: "_doc/image/" + picName,
			overwrite: true,
			width: '500px',
			format: suffix,
			quality: 100
		},
		function(e) {
			var task = plus.uploader.createUpload(
				webContent.rootUrl + "upload/imgs", {
					method: "POST"
				},
				function(t, status) { //上传完成
					$.ui.hideMask();
					if(status == 200) {
						var data = $.parseJSON(t.responseText);
						if(data.failed) {
							$.ui.popup(data.failed.message);
						} else {
							//							if(imgIndex == totalNum){
							//								callback();
							//							}
							console.log(data);
							aImgBack.push(data.data);
							if(imgIndex == aFilepath.length - 1) {
								callback(aImgBack);
								return
							}
							uploadPicturesToCommunity(aFilepath, ++imgIndex, aImgBack, callback);
						}
					} else {
						$.ui.popup("上传图片失败，请重试,status为" + status);
					}
					//					plus.io.resolveLocalFileSystemURL(aFilepath[imgIndex], function(entry) {
					//						if(choiceIndex == 2) { //如果是拍照上传图片则删除源文件
					//							entry.remove();
					//						}
					//					}, function(e) {});
				}
			);
			task.addData("userid", common.getlocalStorageItemStr("userinfo", "id"));
			task.addData("sixtytoken", common.getlocalStorageItemStr("token"));
			task.addFile(e.target, {
				key: "file"
			});
			console.log("压缩成功后图片下标" + e.target);
			console.log("压缩成功后图片对象e.target " + e.target);
			console.log("压缩成功后图片路径picName " + picName);
			task.start();
		},
		function(err) {
			$.ui.hideMask();
			$.ui.popup("压缩图片失败，请重试");
			console.log("压缩图片失败图片下标" + fileindex);
			console.log("压缩图片失败错误编码" + err.code);
			console.log("压缩图片失败错误描述" + err.message);
		}
	);
}
//长按删除单张图片
function deleteOnePicture(liId, pictureName) {
	$("#" + liId + "").on("longTap", function() {
		var that = this;
		var params = {};
		params.oldFileName = pictureName;
		$.ui.popup({
			title: "删除确认",
			message: "您确定删除该图片吗？",
			cancelText: "取消",
			cancelOnly: false,
			doneText: "确定",
			doneCallback: function() {
				$.post(
					webContent.rootUrl + "none/attachment/canceldeal",
					$.param(params),
					function(data) {
						if(data.hasOwnProperty("failed")) {
							$.ui.popup(data.failed.message);
						} else {
							var picUl = $(that).parent("ul");
							$(that).remove();
							$.ui.popup("成功删除!");
							if(picUl.find("li a").length == 0 && picUl.find("li").length < 3) {
								var li = "";
								li = "<li  onclick='galleryImgsSelected(this);' data-title='上传图片' data-fromfield='pictureid' data-posturl='none/attachment/uploaddeal'>" +
									"<a href=''><i class='iconfont icon-picture'></i></a>" +
									"</li>"
								picUl.append(li);
							}
						}
					}
				)
			}
		});
	})
}
//图片filename拼接成一个字符串
function splitName(type) {
	var str = "";
	if(type == "filename") {
		//遍历name为filename的所有input元素
		$("#" + $.ui.activeDiv.id + " input[name='filename']").each(function() {
			str += $(this).val() + ",";
		});
	} else if(type == "audioname") {
		//遍历name为filename的所有input元素
		$("#" + $.ui.activeDiv.id + " input[name='audioname']").each(function() {
			str += $(this).val() + ",";
		});
	}
	//去掉最后一个逗号(如果不需要去掉，就不用写)
	if(str.length > 0) {
		str = str.substr(0, str.length - 1);
	}
	return str;
}

function loginImgOnOrOff(obj) {
	if(obj.value == "") {
		$(obj).parent().find("i").removeClass("loginImgOn");
	} else {
		$(obj).parent().find("i").addClass("loginImgOn");
	}
}
//进入页面时，回滚到顶部
function pageScrollToTop() {
	$("#" + $.ui.activeDiv.id).scroller({
		verticalScroll: true,
		horizontalScroll: false,
		autoEnable: true
	}).scrollToTop(0);
}

//判断是手机端设备还是ipad
function isMobileDev() {
	//	console.log(navigator.userAgent)
	//	console.log(window.innerWidth)
	if((navigator.userAgent.match(/(pad|pod|iPod|iPad)/i)) || window.innerWidth >= 768) {
		$("#" + $.ui.activeDiv.id + "Form").removeClass("default-padding-top").addClass("pad-padding-top");
		return false;
	} else {
		return true;
	}
}
//文本超出一定长度，省略处理
function textEllipsis(val, vallength) {
	if(!val || val.length <= 0) {
		val = "暂无描述";
	} else {
		if(val.length > vallength) {
			val = val.substring(0, vallength) + "……";
		}
	}
	return val;
}

//绑定切换radio事件
function toggleRadioValue() {
	$("#" + $.ui.activeDiv.id + " .sixty-radio-item").on('click', function() {
		var sex = $(this).attr("data-radio");
		$("#" + $.ui.activeDiv.id + " input[name='sexType']").val(sex);
		$(this).parents().find(".sixty-radio-item label").removeClass("active");
		$(this).find("label").addClass("active");
	});
}
//初始化radio事件
function initRadioValue(val) {
	var sex = val;
	if(sex == undefined || sex == null || sex == "" || sex == "undefined") {
		sex = 2;
	}
	$("#" + $.ui.activeDiv.id + "  input[name='sexType']").val(sex);
	$.each($("#" + $.ui.activeDiv.id + " .sixty-radio-item"), function(i, n) {
		var radiovalue = $(n).attr("data-radio");
		if(sex == radiovalue) {
			$("#" + $.ui.activeDiv.id + " .sixty-radio-item label").removeClass("active");
			$(n).find("label").addClass("active");
			return '';
		}
	});
}

//绑定清除事件
function clearContent() {
	$(".icon-img-clear").on("click", function() {
		var inputObj = $(this).parents(".sixty-input-item").find("input");
		if($(inputObj).val().length > 0) {
			$(inputObj).val('');
			$(this).hide();
		}
	})
}
//判断显示或隐藏清除按钮
function ShowOrHideClearIcon() {
	var inputObj = $(".icon-img-clear").parents(".sixty-input-item").find("input");
	$(inputObj).on("input", function() {
		if($(this).val().length > 0) {
			$(this).parents(".sixty-input-item").find(".icon-img-clear").show();
		} else {
			$(this).parents(".sixty-input-item").find(".icon-img-clear").hide();
		}
	})
}

//时间转换--(刚刚，1分钟前，1小时前等)
function diffDateTime(time) {
	var dateTimeStamp = ((typeof time) == "string") ? Date.parse(time.replace(/-/gi, "/")) : time;
	//JavaScript函数：
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;
	var year = month * 12;

	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if(diffValue < 0) {
		return "刚刚"
	}
	var yearC = Math.floor(diffValue / year);
	var monthC = Math.floor(diffValue / month);
	var weekC = Math.floor(diffValue / (day * 7));
	var dayC = Math.floor(diffValue / day);
	var hourC = Math.floor(diffValue / hour);
	var minC = Math.floor(diffValue / minute);
	var result;
	if(yearC >= 1) {
		result = yearC + "年前";
	} else if(monthC >= 1) {
		result = monthC + "月前";
	} else if(weekC >= 1) {
		result = weekC + "周前";
	} else if(dayC >= 1) {
		result = dayC + "天前";
	} else if(hourC >= 1) {
		result = hourC + "小时前";
	} else if(minC >= 1) {
		result = minC + "分钟前";
	} else
		result = "刚刚";
	return result;

}