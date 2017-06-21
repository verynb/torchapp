"use strict";;
(function() {
	var vol = {
		volGetList: function(jsondata) {
			//api/user/volunteers?pageSize=15&currentPage=0
			ajaxFuncs.get({
				urlname: "api/user/volunteers?pageSize=15&currentPage=" + currentPage,
				funcs: {
					funcSuccessful: function(data) {

					}
				}
			});
		}
	};
	window.vol = vol;
})();