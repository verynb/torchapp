;
(function() {
	var pay = {
		pay: function(type, dealid, funcs) {
			var channel = null;
			plus.payment.getChannels(function(channels) {
				for(var i = 0; i < channels.length; i++) {
					if(channels[i].id = type) {
						channel = channels[i];
						break;
					}
				}
				if(channel == null) {
					plus.nativeUI.alert("不支持此支付方式:" + type);
				}
				$.getJSON(webContent.rootUrl + "pay/" + type, {
					dealid: dealid
				}, function(data) {
					if(data.failed) {
						$.ui.popup(data.failed.message);
						console.log("data.failed" + data.failed.message)
					} else {
						var paymentid = data.paymentid,
							paydata = data.data;
						plus.payment.request(channel, paydata, function(result) {
							if(paymentid) {
								funcs();
								$.getJSON(webContent.rootUrl + "pay/payresult", {
									dealid: dealid,
									success: "true",
									paymentid: paymentid
								}, function(sdata) {

								});
							} else {
								$.ui.popup("网络异常，暂时无法支付订单");
								console.log("paymentid undefined");
							}
						}, function(error) {
							if(paymentid) {
								$.getJSON(webContent.rootUrl + "pay/payresult", {
									dealid: dealid,
									success: "false",
									paymentid: paymentid
								}, function(fdata) {

								});
								$.ui.popup("支付失败：" + error.message);
								console.log("支付失败信息" + error.message);
							} else {
								$.ui.popup("网络异常，暂时无法支付订单");
								console.log("paymentid undefined");
							}
						});
					}
				});
			}, function(e) {
				plus.nativeUI.alert("获取支付通道失败:" + e.message);
			});
		}
	};
	window.pay = pay;
})();