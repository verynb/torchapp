"use strict";;
(function() {
	var pageCom = {
		getProvinces: function() {
			/*获取查询全国所有的省份*/
			ajaxFuncs.get({
				urlname: "/api/regions/provinces",
				funcs: {
					funcSuccessful: function(data) {

					}
				}
			});
		},
		getCities: function(id) {
			/*查询某个省下面的所有的市*/
			if(id != undefined && id != '') {
				ajaxFuncs.get({
					urlname: "/api/regions/cities/" + id,
					funcs: {
						funcSuccessful: function(data) {

						}
					}
				});
			} else {
				common.toast("请先选择省");
			}
		},
		getAreas: function(id) {
			/*查询某个市下面的所有的区/县*/
			if(id != undefined && id != '') {
				ajaxFuncs.get({
					urlname: "/api/regions/areas/" + id,
					funcs: {
						funcSuccessful: function(data) {

						}
					}
				});
			} else {
				common.toast("请先选择市");
			}
		}
	};
	window.pageCom = pageCom;
})();