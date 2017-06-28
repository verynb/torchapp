"use strict"; /*本地存储*/
var localSta = (function() {
	var sql_insertSta = 'INSERT INTO local_sta(staid, title,staJsonStrData,createtime) VALUES(?,?,?,?)';
	var sql_deleteSta = 'DELETE FROM local_stu';
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
		}

	};

})();