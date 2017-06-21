关于post方法的使用：
1、以前的接口,post方式参数必须序列化
	$.post(
		webContent.rootUrl + "sponsororder/pulldatabyitemtype",(接口名)
		$.param(params),(参数序列化，没有可不传)
		function(data) {
			$.ui.hideMask();
			if(data.hasOwnProperty("failed")) {
				$.ui.popup(data.failed.message);
			} else {
				funcs.funcSuccessful(data);
			}
		},"json");(第四个参数是"json"字符串)

2、新接口全部用post方式，封装函数如下：
	var funcs = {};
	funcs.funcSuccessful = allOrders_init;(回调函数)
	common.encapsulatePost({
		clickobj:$("#login #loginbutton"),(点击对象)
		urlname: url,(接口名,必传)
		params:params,(参数)
		funcs: funcs,(成功后的回调)
		contentType: G_CONTENTTYPE(必传)
	});
	
	loadData.load({
		data: "user/evaluationbyuserid",
		container: $.ui.activeDiv.id,
		contentType: G_CONTENTTYPE,(新增必填)
		paramsData: params,(新增，所传参数)
		readOnly: true,
		callback: function(params) {
			if(initFlag) {
				initFlag = false;
				evaluationList_dataInit(params);
			}
		}
	});
	
	
/*-------需要修改---------*/







common.encapsulatePost({
	urlname: "gateway/queryGateWay",
	funcs: {
		funcSuccessful: function(data) {
			console.log("getgateway :" + JSON.stringify(data));
			if(common.isJson(data)) {
				data = data;
			} else {
				data = JSON.parse(data);
			}
			if(data.success == false) {

			} else {
				console.log('gateway 获取成功');
				for(var i = 0; i < data.data.list.length; i++) {
					if(data.data.list[i].status == 1) {
						window.localStorage.setItem(G_COMKEY + ".gatewayid", data.data.list[i].gateWay);
						window.localStorage.setItem(G_COMKEY + ".gatewayName", data.data.list[i].name);
					}
				}
			}
		}
	},
	contentType: G_CONTENTTYPE
});



common.encapsulatePost({
	urlname: "gateway/adGateWay",
	params: jsondata,
	funcs: {
		funcSuccessful: function(data) {
			if(common.isJson(data)) {
				data = data;
			} else {
				data = JSON.parse(data);
			}
			console.log("savegateway :" + JSON.stringify(data));
			if(data.success == false) {

			} else {
				console.log('gateway 保存成功');
			}
		}
	},
	contentType: G_CONTENTTYPE
});



common.encapsulatePost({
	urlname: "/none/registsponsor",
	params: param,
	funcs: {
		funcSuccessful: function(data) {
			if(data.success == false) {

			} else {
				$.ui.popup("验证码已发送至手机" + phone);
				var isregisted = data.registedService;
				if(isregisted) {
					$("#registerButton").attr("data-isregisted", isregisted);
				}
			}
		}
	},
	contentType: G_CONTENTTYPE
});


common.serializeToJson("#login #loginForm")


common.encapsulatePost({
			clickobj: $("#findPwd #getCode"),
			urlname: "none/forgetpassbuildmsg",
			params: param,
			funcs: {
				funcSuccessful: function(data) {
					$.ui.popup("验证码已发送至手机" + telephone);
					$(obj).removeAttr("onclick");
				}
			},
			contentType: G_CONTENTTYPE
		});