"use strict"; /*本地存储*/
var localSta = (function() {
	var sql_insertSta = 'INSERT INTO local_standard(staid,title,staJsonStrData,createtime) VALUES(?,?,?,?)';
	var sql_deleteSta = 'DELETE FROM local_standard';
	var sql_selectAll = 'SELECT * FROM local_standard';
	var createDB;
	var num = 0; //递归次数
	return {
		insertSta: function(data) { /*插入家居记录*/
			var sqls = [];
			sqls.push({
				"sql": sql_insertSta,
				"data": data
			})
			html5sql.process(sqls, function(tx, results) {
				console.log("插入设备数据成功");
			}, function(error) {
				console.log("插入设备数据失败");
			});
		},
		deleteStaAll: function() { /*清空local_device表*/
			var sqls = [];
			sqls.push({
				"sql": sql_deleteSta
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
					console.log("查询设备数据成功,但是没有数据");
				}
				callback(selectData);
			}, function(error) {
				console.log("查询标准失败");
			});
		}
	};

})();