;
(function() {
	var ajaxFuncs = {
		post: function(allparams) { //封装post方法
			$.ui.showMask(msgCode.loadingTip);
			console.log('post 请求信息==== urlname' + allparams.urlname + 'jsondata==' + JSON.stringify(allparams.params));
			var urlname = allparams.urlname,
				params = allparams.params,
				funcs = allparams.funcs,
				urlHead = webContent.rootUrl;
			if(params == undefined || params == null) {
				params = {};
			}
			$.post(
				urlHead + urlname,
				params,
				function(data) {
					ajaxFuncs.success(data, funcs);
				},
				function(jqXHR, textStatus, errorThrown) {
					ajaxFuncs.error(jqXHR, textStatus, errorThrown);
				});
		},
		put: function(allparams) { //封装post方法
			$.ui.showMask(msgCode.loadingTip);
			console.log('put 请求信息==== urlname' + allparams.urlname + 'jsondata==' + JSON.stringify(allparams.params));
			var urlname = allparams.urlname,
				params = allparams.params,
				funcs = allparams.funcs,
				urlHead = webContent.rootUrl;
			if(params == undefined || params == null) {
				params = {};
			}
			$.put(
				urlHead + urlname,
				params,
				function(data) {
					ajaxFuncs.success(data, funcs);
				},
				function(jqXHR, textStatus, errorThrown) {
					ajaxFuncs.error(jqXHR, textStatus, errorThrown);
				});
		},
		get: function(allparams) {
			//			console.log('get 请求信息==== urlname' + allparams.urlname + 'jsondata==' + JSON.stringify(allparams.params));
			$.ui.showMask(msgCode.loadingTip);
			var urlname = allparams.urlname,
				funcs = allparams.funcs,
				urlHead = webContent.rootUrl;
			var allurl = urlHead + urlname;
			$.get(allurl, function(data) {
					ajaxFuncs.success(data, funcs);
				},
				function(jqXHR, textStatus, errorThrown) {
					ajaxFuncs.error(jqXHR, textStatus, errorThrown);
				});
		},
		delete: function(allparams) {
			//			console.log('delete 请求信息==== urlname' + allparams.urlname + 'jsondata==' + JSON.stringify(allparams.params));
			$.ui.showMask(msgCode.loadingTip);
			var urlname = allparams.urlname,
				funcs = allparams.funcs,
				urlHead = webContent.rootUrl;
			var allurl = urlHead + urlname;
			$.delete(allurl, function(data) {
					ajaxFuncs.success(data, funcs);
				},
				function(jqXHR, textStatus, errorThrown) {
					ajaxFuncs.error(jqXHR, textStatus, errorThrown);
				});
		},
		success: function(data, funcs) {
			$.ui.hideMask();
			if(!common.isJson(data)) {
				data = JSON.parse(data);
			}
			console.log(' 返回信息====data==' + JSON.stringify(data));
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
						$.ui.popup(msgCode.returnCode['' + data.codeMessage.code + '']);
					} else {
						$.ui.popup(data.message);
					}
				}
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			if(textStatus == "timeout") {
				common.gotoLogin(true, "加载超时，请重试");
			} else {
				//				common.gotoLogin(true, "无法连接服务器");

			}
		}
	};
	window.ajaxFuncs = ajaxFuncs;
})();