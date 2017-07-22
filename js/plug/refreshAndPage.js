;
(function() {
	var refreshAndPage = {
		add: function(jsondata) {
			var pullDownHtml = "";
			pullDownHtml += '<div class="pullDown">';
			pullDownHtml += '<div class="pullDownLabel"></div>';
			pullDownHtml += '</div>';
			pullDownHtml += '<div class="pulldown-tips">下拉刷新</div>';
			$("#" + jsondata.content + " .scrollerBody").prepend(pullDownHtml);

			var pullUpHtml = "";
			pullUpHtml += '<div class="pullUp">';
			pullUpHtml += '<div class="pullUpLabel">加载更多</div>';
			pullUpHtml += '</div>';
			$("#" + jsondata.content + " .scrollerBody").append(pullUpHtml);

			var myScrollNi,
				pullDown = $("#" + jsondata.content + " .pullDown"),
				pullUp = $("#" + jsondata.content + " .pullUp"),
				pullDownLabel = $("#" + jsondata.content + " .pullDownLabel"),
				pullUpLabel = $("#" + jsondata.content + " .pullUpLabel"),
				container = $("#" + jsondata.content + " ." + jsondata.container),
				pulldownTips = $("#" + jsondata.content + " .pulldown-tips"),
				loadingStep = 0; //加载状态0默认，1显示加载状态，2执行加载数据，只有当为0时才能再次加载，这是防止过快拉动刷新  

			pullDown.hide();
			pullUp.hide();

			myScrollNi = new IScroll("#" + jsondata.content + " ." + jsondata.containerScroll, {
				scrollbars: true,
				mouseWheel: false,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true,
				scrollY: true,
				probeType: 2,
				bindToWrapper: true
			});

			if(jsondata.funcObjScroll != undefined) {
				jsondata.funcObjScroll(myScrollNi);
			}
			myScrollNi.on("scroll", function() {
				if(loadingStep == 0 && !pullDown.attr("class").match('refresh|loading') && !pullUp.attr("class").match('refresh')) {
					if(this.y > 40) { //下拉刷新操作  
						pulldownTips.hide();
						pullDown.addClass("refresh").show();
						pullDownLabel.text("松手刷新数据");
						loadingStep = 1;
						myScrollNi.refresh();
					} else if(this.y < (this.maxScrollY - 14)) { //上拉加载更多  
						pullUp.addClass("refresh").show();
						pullUpLabel.text("正在载入");
						loadingStep = 1;
						jsondata.funcpullUp(myScrollNi, function(status) {
							loadingStep = status;
							pullUp.attr('class', 'pullUp').hide();
							myScrollNi.refresh();
						});
					}
				}
			});
			myScrollNi.on("scrollEnd", function() {
				if(loadingStep == 1) {
					if(pullDown.attr("class").match("refresh")) { //下拉刷新操作  
						pullDown.removeClass("refresh").addClass("loading");
						pullDownLabel.text("正在刷新");
						loadingStep = 2;
						jsondata.funcPullDown(myScrollNi, function(status) {
							loadingStep = status;
							pullDown.attr('class', 'pullDown').hide();
							myScrollNi.refresh();
							pulldownTips.show();
						});
					}
				}
			});
		}
	};
	window.refreshAndPage = refreshAndPage;
})();