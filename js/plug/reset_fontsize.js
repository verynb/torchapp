"use strict";
/*使用方法说明
 
 * 1.当设计稿宽度时为750px，用iPhone7调试，因为iPhone7宽度正好为750的一半；初始font-size大小为10px则 需要 屏幕宽度除以设计稿后乘以20
 * 2.当设计稿宽度时为720px，用iPhone5调试，因为iPhone5宽度正好为720的一半；初始font-size大小为10px则 需要 屏幕宽度除以设计稿后乘以22.5
 * 
 * */
$(function() {
	var jz_num;
	var ui_width = 750;
	var offWidth = $(window).width();
	jz_num = offWidth / ui_width;
	if(offWidth >= 768) {
		$("html").css("font-size", 14 + "px");
	} else {
		$("html").css("font-size", jz_num * 20 + "px");
	}

});