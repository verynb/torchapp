"use strict"; /*本地存储*/
var localLife = (function() {
	var newestVersion = G_LOCALDB; //定义需要发布的最新版本1.2
	var sql_devicetable = 'CREATE TABLE IF NOT EXISTS local_device(id INTEGER PRIMARY KEY,userid VARCHAR, deviceid VARCHAR,devicetype VARCHAR, devicename VARCHAR, devicepyname VARCHAR, createtime VARCHAR,updatetime VARCHAR,pid VARCHAR,origtype VARCHAR,origsubtype VARCHAR,deviceJsonStrDataType VARCHAR,deviceJsonStrData VARCHAR)';
	var sql_msgtable = 'CREATE TABLE IF NOT EXISTS local_botMsg(id INTEGER PRIMARY KEY,userid VARCHAR, msgid VARCHAR,askid VARCHAR, askname VARCHAR, devid VARCHAR,devname VARCHAR,dsc VARCHAR,msgJsonStrData VARCHAR,createtime VARCHAR)';
	var sql_insertDevice = 'INSERT INTO local_device(userid, deviceid,devicetype,devicename, devicepyname,createtime,updatetime,pid,origtype,origsubtype,deviceJsonStrDataType,deviceJsonStrData) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)'; //向“家居名称”表插入数据 //wangsirc 2016-03-16 local_device  增加 dir tkey opts字段
	var sql_updateDevice = 'UPDATE local_device set devicename = ? ,devicepyname = ? ,updatetime = ? where deviceid= ? and userid=?';
	var sql_updateDeviceData = 'UPDATE local_device set deviceJsonStrData = ? where deviceid= ? and userid=?';
	var sql_deleteDevice = 'DELETE FROM local_device';
	var sql_deleteDeviceById = 'DELETE FROM local_device WHERE deviceid = ? or pid = ?';
	var sql_deleteDeviceByPid = 'DELETE FROM local_device WHERE pid = ?';
	var sql_selectDeviceById = 'SELECT * FROM local_device WHERE deviceid = ?';
	var sql_selectDeviceID = 'SELECT * FROM local_device WHERE userid=? AND devicepyname=?';
	var sql_selectDeviceType = 'SELECT devicetype FROM local_device WHERE deviceid=?';
	var sql_selectDeviceJsonStrData = 'SELECT deviceJsonStrData FROM local_device WHERE deviceid IN (?)';
	var sql_selectDeviceName = 'SELECT * FROM local_device WHERE devicepyname=?';
	var sql_selectDeviceData = 'SELECT deviceJsonStrDataType,deviceJsonStrData FROM local_device  where pid= ? and userid=?';
	var sql_selectToBindDevice = 'SELECT deviceJsonStrData FROM local_device  where deviceJsonStrDataType= ? and pid=? and userid=?';
	var createDB;
	var num = 0; //递归次数
	return {
		createDB: function() { /*创建数据库*/
			html5sql.openDatabase("sixty", "sixtyDB", 5 * 1024 * 1024);
			if(html5sql.database.version != newestVersion) {
				var sql_creattablearr = [];
				sql_creattablearr.push(sql_devicetable);
				sql_creattablearr.push(sql_msgtable);
				html5sql.changeVersion(html5sql.database.version, newestVersion, sql_creattablearr, function() {
					console.log("创建表成功");
				}, function(error) {
					console.log("创建表失败");
				});

			}
		},
		insertDevice: function(data) { /*插入家居记录*/
			var sqls = [];
			sqls.push({
				"sql": sql_insertDevice,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("插入设备数据成功");
			}, function(error) {
				console.log("插入设备数据失败");
			});
		},
		updateDevice: function(data) { /*更新家居内容*/
			var sqls = [];
			sqls.push({
				"sql": sql_updateDevice,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("更新设备数据成功");
			}, function(error) {
				console.log("更新设备数据失败");
			});
		},
		updateDeviceData: function(data) { /*更新家居内容数据*/
			var sqls = [];
			sqls.push({
				"sql": sql_updateDeviceData,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("更新设备数据成功11");
			}, function(error) {
				console.log("更新设备数据失败11");
			});
		},
		deleteDeviceAll: function() { /*清空local_device表*/
			var sqls = [];
			sqls.push({
				"sql": sql_deleteDevice
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("清空设备数据成功");
			}, function(error) {
				console.log("清空设备数据失败");
			});
		},
		deleteDevice: function(id) {
			var data = [];
			data.push(id);
			data.push(id);
			var sqls = [];
			sqls.push({
				"sql": sql_deleteDeviceById,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("删除设备成功");
			}, function(error) {
				console.log("删除设备失败");
			});
		},
		deleteDeviceByPid: function(data, successCB) {
			var sqls = [];
			sqls.push({
				"sql": sql_deleteDeviceByPid,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("deleteDeviceByPid成功");
			}, function(error) {
				console.log("deleteDeviceByPid失败");
			});
		},
		selectDeviceId: function(data, callback) {
			var sqls = [];
			var selectDeviceIdData;
			sqls.push({
				"sql": sql_selectDeviceID,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				if(results.rows.length != 0) {
					console.log("查询设备数据ID成功+results=" + results.rows.item(0).deviceid);
					selectDeviceIdData = results.rows.item(0);
				} else {
					selectDeviceIdData = '';
					console.log("查询设备数据ID成功,但是没有数据");
				}
				callback(selectDeviceIdData);
			}, function(error) {
				console.log("查询设备数据ID失败");
			});

		},
		selectDeviceById: function(data, callback) {
			var sqls = [];
			sqls.push({
				"sql": sql_selectDeviceById,
				"data": data
			})
			console.log("htmlsql selectDeviceById");
			html5sql.process(sqls, function(tx, results) {
				var result;
				if(results.rows.length > 0) {
					console.log("selectDeviceById成功+results=" + results.rows.item(0).deviceid);
					result = results.rows.item(0);
				} else {
					result = null;
					console.log("selectDeviceById成功,但是没有数据");
				}
				callback(result);
			}, function(error) {
				console.log("selectDeviceById失败");
			});

		},
		selectDeviceType: function(data, callback) {
			var sqls = [];
			var selectDeviceData;
			sqls.push({
				"sql": sql_selectDeviceType,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				if(results.rows.length != 0) {
					console.log("查询设备数据type成功+results=" + results.rows.item(0).devicetype);
					selectDeviceData = results.rows.item(0).devicetype;
				} else {
					selectDeviceData = '';
					console.log("查询设备数据type成功,但是没有数据");
				}
				callback(selectDeviceData);

			}, function(error) {
				console.log("查询设备数据type失败");
			});
		},
		selectDeviceName: function(data, callback, deviceId, deviceNameVal) {
			var sqls = [];
			sqls.push({
				"sql": sql_selectDeviceName,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				if(results.rows.length != 0) {
					console.log("查询设备数据name成功" + results.rows.item(0).length);
					common.promptMsg('设备名称不能重复');
				} else {
					callback(deviceId, deviceNameVal);
					console.log("查询设备数据name成功,但是没有数据");
				}
			}, function(error) {
				console.log("查询设备数据name失败");
			});
			return false;
		},
		selectAllDeviceData: function(data, callback) {
			var sqls = [];
			var selectData = {
				'status': '0'
			};
			sqls.push({
				"sql": sql_selectDeviceData,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				if(results.rows.length != 0) {
					console.log('results.rows======' + results.rows);
					var airControllerList = [],
						groupList = [],
						lightList = [],
						oneList = [];
					for(var i = 0; i < results.rows.length; i++) {
						switch(results.rows.item(i).deviceJsonStrDataType) {
							case 'airControllerList':
								airControllerList.push(JSON.parse(results.rows.item(i).deviceJsonStrData));
								break;
							case 'groupList':
								groupList.push(JSON.parse(results.rows.item(i).deviceJsonStrData));
								break;
							case 'oneList':
								oneList.push(JSON.parse(results.rows.item(i).deviceJsonStrData));
								break;
							case 'lightList':
								if(JSON.parse(results.rows.item(i).deviceJsonStrData).bindOnDev == '0') {
									lightList.push(JSON.parse(results.rows.item(i).deviceJsonStrData));
								}
								break;
							default:
								console.log('selectAllDeviceData====default======' + JSON.parse(results.rows.item(i).deviceJsonStrData));
								break;
						}
					}
					selectData = {
						'status': '1',
						'airControllerList': airControllerList,
						'groupList': groupList,
						'lightList': lightList,
						'oneList': oneList
					}
				} else {
					selectData = {
						'status': '0'
					};
					console.log("查询设备数据type成功,但是没有数据");
				}
				callback(selectData);
			}, function(error) {
				console.log("查询设备数据type失败");
			});
		},
		selectDeviceJsonStrData: function(idarr, data, callback) {
			var sqls = [];
			var arrdata = [];
			arrdata.push(idarr.join(','));
			var selectData = {}; 
			var sql_selectDeviceJsonStrDataone = 'SELECT deviceJsonStrData FROM local_device WHERE deviceid IN (' + idarr.toString() + ')';
			sqls.push({
				"sql": sql_selectDeviceJsonStrDataone
			});
			html5sql.process(sqls, function(tx, results) {
				//				console.log('results======' + results);
				var devList = [];
				if(results.rows.length != 0) {
					//					console.log('results.rows======' + results.rows);
					for(var i = 0; i < results.rows.length; i++) {
						devList.push(JSON.parse(results.rows.item(i).deviceJsonStrData));
					}
					data.devList = devList;
					selectData = {
						'status': '1',
						'data': data
					}
				} else {
					selectData = {
						'status': '0',
						'data': data
					};
					console.log("查询设备数据type成功,但是没有数据");
				}
				callback(selectData);
			}, function(error) {
				console.log("查询设备数据type失败");
			});
		},
		selecttoBindDevices: function(data, callback) {
			var sqls = [];
			sqls.push({
				"sql": sql_selectToBindDevice,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				var lightList = [];
				if(results.rows.length != 0) {
					for(var i = 0; i < results.rows.length; i++) {
						lightList.push(JSON.parse(results.rows.item(i).deviceJsonStrData))
					}
				} else {
					lightList = [];
				}
				callback(lightList);
			}, function(error) {
				console.log("查询用于绑定设备失败");
			});
		}
	};

})();