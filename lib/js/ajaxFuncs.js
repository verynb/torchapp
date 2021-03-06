;
(function() {
	var ajaxFuncs = {
		post: function(allparams) { //封装post方法
			$.ui.showMask(msgCode.customizeCode.loadingTip);
			//			console.log('post 请求信息==== urlname' + allparams.urlname + 'jsondata==' + JSON.stringify(allparams.params));
			var urlname = allparams.urlname,
				params = allparams.params,
				funcs = allparams.funcs,
				clickObj = allparams.clickobj,
				urlHead = webContent.rootUrl;
			if(params == undefined || params == null) {
				params = {};
			}
			var allurl = urlHead + urlname;
			$.post(
				allurl,
				params,
				function(data) {
					common.removeSubmitedFlag(clickObj);
					ajaxFuncs.success(data, funcs, allurl);
				},
				function(jqXHR, textStatus, errorThrown) {
					common.removeSubmitedFlag(clickObj);
					ajaxFuncs.error(jqXHR, textStatus, errorThrown);
				});
		},
		put: function(allparams) { //封装post方法
			$.ui.showMask(msgCode.customizeCode.loadingTip);
			console.log('put 请求信息==== urlname' + allparams.urlname + 'jsondata==' + JSON.stringify(allparams.params));
			var urlname = allparams.urlname,
				params = allparams.params,
				funcs = allparams.funcs,
				clickObj = allparams.clickobj,
				urlHead = webContent.rootUrl;
			if(params == undefined || params == null) {
				params = {};
			}
			var allurl = urlHead + urlname;
			$.put(
				allurl,
				params,
				function(data) {
					common.removeSubmitedFlag(clickObj);
					ajaxFuncs.success(data, funcs, allurl);
				},
				function(jqXHR, textStatus, errorThrown) {
					common.removeSubmitedFlag(clickObj);
					ajaxFuncs.error(jqXHR, textStatus, errorThrown);
				});
		},
		get: function(allparams) {
			//			console.log('get 请求信息==== urlname' + allparams.urlname + 'jsondata==' + JSON.stringify(allparams.params));
			//			$.ui.showMask(msgCode.customizeCode.loadingTip);
			var urlname = allparams.urlname,
				funcs = allparams.funcs,
				urlHead = webContent.rootUrl;
			var allurl = urlHead + urlname;
			$.get(allurl, function(data) {
					ajaxFuncs.success(data, funcs, allurl);
				},
				function(jqXHR, textStatus, errorThrown) {
					ajaxFuncs.error(jqXHR, textStatus, errorThrown);
				});
		},
		delete: function(allparams) {
			//			console.log('delete 请求信息==== urlname' + allparams.urlname + 'jsondata==' + JSON.stringify(allparams.params));
			$.ui.showMask(msgCode.customizeCode.loadingTip);
			var urlname = allparams.urlname,
				funcs = allparams.funcs,
				clickObj = allparams.clickobj,
				urlHead = webContent.rootUrl;
			var allurl = urlHead + urlname;
			$.delete(allurl, function(data) {
					common.removeSubmitedFlag(clickObj);
					ajaxFuncs.success(data, funcs, allurl);
				},
				function(jqXHR, textStatus, errorThrown) {
					common.removeSubmitedFlag(clickObj);
					ajaxFuncs.error(jqXHR, textStatus, errorThrown);
				});
		},
		success: function(data, funcs, url) {
			$.ui.hideMask();
			if(!common.isJson(data)) {
				data = JSON.parse(data);
			}
			console.log(' 返回信息== url==>' + url + '   data==>' + JSON.stringify(data));
			if(data.hasOwnProperty("codeMessage")) {
				if(data.codeMessage.code == "success") {
					if(funcs && $.isObject(funcs) && funcs.funcSuccessful != undefined) {
						funcs.funcSuccessful(data);
					}
				} else {
					if(funcs && $.isObject(funcs) && funcs.funcError != undefined) {
						funcs.funcError(data);
					} else {
						$.ui.hideMask();
						if((msgCode.returnCode['' + data.codeMessage.code + '']) != undefined) {
							common.toast(msgCode.returnCode['' + data.codeMessage.code + '']);
						} else {
							common.toast(data.codeMessage.message);
						}
					}
				}
			} else {
				if(funcs && $.isObject(funcs) && funcs.funcSuccessful != undefined) {
					funcs.funcSuccessful(data);
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			$.ui.hideMask();
			if(textStatus == "timeout") {
				common.gotoLogin(true, "加载超时，请重试");
			} else {
				common.toast("未知错误，请联系管理员");
			}
		}
	};
	window.ajaxFuncs = ajaxFuncs;
})();