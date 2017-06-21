"use strict";;
(function() {
	var login = {
		postLogin: function(obj) {
			if(!common.validate("#login form", obj)) {
				return false;
			} else {
				var username = $("#login input[name='username']").val();
				common.executeLogin(common.serializeToJson("#login form"), 1);
				window.localStorage.setItem(G_COMKEY + ".loginSet", username);
				window.localStorage.setItem(G_COMKEY + ".phone", username);
			}
		}
	};
	window.login = login;
})();