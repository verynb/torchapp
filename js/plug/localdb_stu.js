"use strict"; /*本地存储*/
var localStu = (function() {
	var newestVersion = G_LOCALDB; //定义需要发布的最新版本1.2
	var sql_stutable = 'CREATE TABLE IF NOT EXISTS local_stu(id INTEGER PRIMARY KEY,batchId VARCHAR,studentId VARCHAR,name VARCHAR,stuJsonStrData VARCHAR,applicationForm VARCHAR,studentPhoto VARCHAR,familyPhoto VARCHAR,homePhoto VARCHAR,homeFeaturePhotos VARCHAR,InteractivePhoto VARCHAR,visitInfo VARCHAR,auditItemIds VARCHAR,status VARCHAR,upstatus VARCHAR,createtime VARCHAR,updatetime VARCHAR)';
	var sql_standardtable = 'CREATE TABLE IF NOT EXISTS local_standard(id INTEGER PRIMARY KEY,staid VARCHAR,title VARCHAR,staJsonStrData VARCHAR,createtime VARCHAR)';
	var sql_insertStu = 'INSERT INTO local_stu(batchId,studentId,name,stuJsonStrData,applicationForm,studentPhoto,familyPhoto,homePhoto,homeFeaturePhotos,InteractivePhoto,visitInfo,auditItemIds,status,upstatus,createtime,updatetime) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	var sql_deleteStu = 'DELETE FROM local_stu';
	var sql_selectAll = 'SELECT * FROM local_stu';
	var sql_selectStuByIdAndBatId = 'SELECT * FROM local_stu WHERE studentId=? AND batchId=?';
	var sql_saveStuByIdAndBatId = 'UPDATE local_stu set applicationForm=?,studentPhoto=?,familyPhoto=?,homePhoto=?,InteractivePhoto=?,visitInfo=?, auditItemIds=? ,status=?where studentId= ? and batchId=?';
	var sql_selectAllTwo = 'SELECT * FROM local_stu';
	var createDB;
	var num = 0; //递归次数
	return {
		createDB: function() { /*创建数据库*/
			html5sql.openDatabase("torch", "torchDB", 5 * 1024 * 1024);
			if(html5sql.database.version != newestVersion) {
				var sql_creattablearr = [];
				sql_creattablearr.push(sql_stutable);
				sql_creattablearr.push(sql_standardtable);
				html5sql.changeVersion(html5sql.database.version, newestVersion, sql_creattablearr, function() {
					console.log("创建表成功");
				}, function(error) {
					console.log("创建表失败" + JSON.stringify(error));
				});
			}
		},
		insertStu: function(data) { /*插入家居记录*/
			var sqls = [];
			sqls.push({
				"sql": sql_insertStu,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("插入设备数据成功");
			}, function(error) {
				console.log("插入设备数据失败");
			});
		},
		deleteStuAll: function() { /*清空local_device表*/
			var sqls = [];
			sqls.push({
				"sql": sql_deleteStu
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("清空设备数据成功");
			}, function(error) {
				console.log("清空设备数据失败");
			});
		},
		selectAll: function(callback) {
			var sqls = [];
			sqls.push({
				"sql": sql_selectAll
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("查询标准成功");
				var selectData = {};
				if(results.rows.length != 0) {
					console.log('results.rows======' + results.rows);
					var list = [];
					for(var i = 0; i < results.rows.length; i++) {
						list.push(results.rows.item(i));
					}
					selectData = {
						'status': '1',
						'list': list
					}
				} else {
					selectData = {
						'status': '0'
					};
					console.log("查询设备数据type成功,但是没有数据");
				}
				callback(selectData);
			}, function(error) {
				console.log("查询标准失败");
			});
		},
		selectStuByIdAndBatId: function(data, callback) {
			var sqls = [];
			sqls.push({
				"sql": sql_selectStuByIdAndBatId,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
					console.log("查询标准成功");
					var selectData = {};
					if(results.rows.length != 0) {
						console.log('results.rows======' + results.rows);
						for(var i = 0; i < results.rows.length; i++) {
							selectData.info = results.rows.item(i);
						}
						selectData.status = 1;
					} else {
						selectData = {
							'status': '0'
						};
						console.log("查询设备数据type成功,但是没有数据");
					}
					callback(selectData);
				},
				function(error) {
					console.log("查询标准失败");
				});
		},
		saveStuByIdAndBatId: function(data) { /*更新家居内容*/
			var sqls = [];
			sqls.push({
				"sql": sql_saveStuByIdAndBatId,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("更新设备数据成功");
			}, function(error) {
				console.log("更新设备数据失败");
			});
		},
		selectAllTwo: function(callback) {
			var sqls = [];
			sqls.push({
				"sql": sql_selectAllTwo
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("查询标准成功");
				var selectData = {};
				if(results.rows.length != 0) {
					console.log('results.rows======' + results.rows);
					var list = [];
					for(var i = 0; i < results.rows.length; i++) {
						list.push(results.rows.item(i));
					}
					selectData = {
						'status': '1',
						'list': list
					}
				} else {
					selectData = {
						'status': '0'
					};
					console.log("查询设备数据type成功,但是没有数据");
				}
				callback(selectData);
			}, function(error) {
				console.log("查询标准失败");
			});
		}

	};

})();