"use strict";;
(function() {
	var pageRoute = {
		initLogin: function() {
			var jsondata = {
				"className": "loginJs",
				"pageName": "login"
			}
			this.initPagejs(jsondata);
		},
		initHome: function(funcLoad) {
			var jsondata = {
				"className": "homeJs",
				"pageName": "home"
			}
			this.initPagejs(jsondata, funcLoad);
		},
		initVolList: function(funcLoad) {
			var jsondata = {
				"className": "volListJs",
				"pageName": "volList"
			}
			this.initPagejs(jsondata, funcLoad);
		},
		initPagejs: function(jsondata, funcLoad) {
			if($("." + jsondata.className + "").length == 0) {
				var script = document.createElement("script");
				script.src = './js/page/' + jsondata.pageName + '.js?r=' + Math.random();
				document.head.appendChild(script);
				if(funcLoad != null && funcLoad != undefined) {
					setTimeout(function() {
						funcLoad();
					}, 100);
				}
			}
		}
	};
	window.pageRoute = pageRoute;
})();