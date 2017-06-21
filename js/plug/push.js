var push = function() {
	var socket,
		lastSocketId,
		keepLiveTimer,
		timer,
		bind = function(logintype, callback) {
			if(socket != null) return;
			socket = io.connect(G_PUSHSVR);
			var rLoginType = logintype;
			socket.on('connect', function() {
				lastSocketId = socket.id;
				var store = window.localStorage;
				socket.emit("login", {
					logintype: rLoginType,
					usertype: G_USERTYPE,
					tenantid: common.getlocalStorageItemStr("userinfo", "tenantid"),
					userid: common.getlocalStorageItemStr("userinfo", "id"),
					deviceid: (G_ISBROWSE ? "browse uuid" : plus.device.uuid),
					devicetype: (G_ISBROWSE ? "browse devicetype" : plus.device.model),
					token: common.getlocalStorageItemStr("token")
				});
				rLoginType = 1;
			});

			socket.on("task", function(data) {
				handleTask(data);
			});

			/*接受消息处理*/
			socket.on("alarm", function(data) { //前端发出的系统预警消息，比如检测不合格
				handleAlarm(data, 1); //指定handletype为1，表示“不阻止用户操作”
			});

			socket.on("sysalarm", function(data) {
				//add code here. 20151210
				handleAlarm(data, data.data.handletype); //当handletype为0时，表示“阻止用户继续操作”，如系统维护时
			});

			socket.on("acceptlogin", function(data) {
				//              window.localStorage.setItem(G_COMKEY+".token",data.token);
				callback();
				console.log(JSON.stringify(data));
				if(data.servertime) {
					G_SERVERTIME = Math.round(data.servertime / 1000);
					clearInterval(timer);
					timer = setInterval(function() {
						G_SERVERTIME++;
					}, 1 * 1000);
				}
			});

			socket.on("keepalive", function(data) {
				//      console.log(socket.id+":"+JSON.stringify(data));
			});

			clearInterval(keepLiveTimer);
			keepLiveTimer = setInterval(function() {
				if(socket != null) socket.emit("keepalive", "1");
			}, 30 * 1000);

			socket.on("forcelogout", function(data) {
				common.executeLogout(1);
				$.ui.popup(data.message);
			});

			socket.on("forceupgrade", function(data) {
				common.autoUpgrate(data);
			});

			socket.on("topeer", function(data) {
				console.log("topeer event:" + JSON.stringify(data));
				var eventdata = {};
				eventdata["data"] = data;
				handleAlarm(eventdata, 1);
			});
		},
		logout = function() {
			clearInterval(keepLiveTimer);
			clearInterval(timer);
			socket.disconnect();
			socket = null;
		},
		push = function(data) {
			/*发送消息处理   一组 */
			socket.emit("alarm", data);
		},
		pushTo = function(data) {
			/*发送消息处理    确定的人，多个用“,”隔开*/

			console.log('pushTo--------' + JSON.stringify(data));

			socket.emit("topeer", data);
		};
	return {
		bind: bind,
		push: push,
		pushTo: pushTo,
		logout: logout
	}
}();