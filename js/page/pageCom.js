"use strict";;
(function() {
	var pageCom = {
		volunteerRoles: function() {
			var title = "角色选择";
			ajaxFuncs.get({
				urlname: "/api/volunteerRoles",
				funcs: {
					funcSuccessful: function(data) {
						var buttons = [];
						for(var i = 0; i < data.roleDtos.length; i++) {
							var titVal = {};
							titVal.title = data.roleDtos[i].name;
							buttons.push(titVal);
						}
						plus.nativeUI.actionSheet({
							title: title,
							cancel: "取消",
							buttons: buttons
						}, function(selected) { /*actionSheet 按钮点击事件*/
							var typeval = buttons[selected.index - 1].title;
							var typeid = selected.index;
							var container = "#" + $.ui.activeDiv.id;
							$(container + " span.roleName").text(typeval);
							$(container + " input[name='roleName']").val(typeval);
							$(container + " input[name='roleId']").val(typeid);
							$(container + " input[name='roleName']").attr("readonly", "readonly");
							var el_shool = $(container + " .isshool");
							if(typeval == "老师") {
								if($(el_shool).hasClass("hidden")) {
									$(container + " .isshool").removeClass('hidden');
									$(container + " .isshool").find("input[name='school']").attr('required', 'required');
								}
							} else {
								if(!$(el_shool).hasClass("hidden")) {
									$(container + " .isshool").addClass('hidden');
									$(container + " .isshool").find("input[name='school']").removeAttribute('required');
								}
							}
						});
					}
				}
			});
		},
		chooseSex: function() {
			var title = "性别选择";
			var buttons = [{
				title: "男"
			}, {
				title: "女"
			}];
			plus.nativeUI.actionSheet({
				title: title,
				cancel: "取消",
				buttons: buttons
			}, function(selected) { /*actionSheet 按钮点击事件*/
				var typeval = buttons[selected.index - 1].title;
				var typeid = selected.index;
				var container = "#" + $.ui.activeDiv.id;
				$(container + " input[name='gender']").val(typeval);
				$(container + " input[name='gender']").attr("readonly", "readonly");
			});
		}
	};
	window.pageCom = pageCom;
})();