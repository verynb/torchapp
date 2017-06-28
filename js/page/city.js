"use strict";;
(function() {
	var cityfunc = {
		add: function(idName) {
			var nameEl = document.getElementById(idName);

			var first = []; /* 省，直辖市 */
			var second = []; /* 市 */
			var third = []; /* 镇 */

			var selectedIndex = [0, 0, 0]; /* 默认选中的地区 */

			var checked = [0, 0, 0]; /* 已选选项 */

			function creatList(obj, list) {
				obj.forEach(function(item, index, arr) {
					var temp = new Object();
					temp.text = item.text;
					temp.value = item.value;
					list.push(temp);
				})
			}

			creatList(city, first);

			if(city[selectedIndex[0]].hasOwnProperty('children')) {
				creatList(city[selectedIndex[0]].children, second);
			} else {
				second = [{
					text: '',
					value: 0
				}];
			}

			if(city[selectedIndex[0]].children[selectedIndex[1]].hasOwnProperty('children')) {
				creatList(city[selectedIndex[0]].children[selectedIndex[1]].children, third);
			} else {
				third = [{
					text: '',
					value: 0
				}];
			}

			var picker = new Picker({
				data: [first, second, third],
				selectedIndex: selectedIndex,
				title: '地址选择'
			});

			picker.on('picker.select', function(selectedVal, selectedIndex) {
				var text1 = first[selectedIndex[0]].text;
				var text2 = second[selectedIndex[1]].text;
				var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';

				$("#" + idName).find('.set_city').text(text1 + ' ' + text2 + ' ' + text3);
				$("#" + idName).find("input[name='province']").val(text1);
				$("#" + idName).find("input[name='city']").val(text2);
				$("#" + idName).find("input[name='area']").val(text3);
			});

			picker.on('picker.change', function(index, selectedIndex) {
				if(index === 0) {
					firstChange();
				} else if(index === 1) {
					secondChange();
				}

				function firstChange() {
					second = [];
					third = [];
					checked[0] = selectedIndex;
					var firstCity = city[selectedIndex];
					if(firstCity.hasOwnProperty('children')) {
						creatList(firstCity.children, second);

						var secondCity = city[selectedIndex].children[0]
						if(secondCity.hasOwnProperty('children')) {
							creatList(secondCity.children, third);
						} else {
							third = [{
								text: '',
								value: 0
							}];
							checked[2] = 0;
						}
					} else {
						second = [{
							text: '',
							value: 0
						}];
						third = [{
							text: '',
							value: 0
						}];
						checked[1] = 0;
						checked[2] = 0;
					}

					picker.refillColumn(1, second);
					picker.refillColumn(2, third);
					picker.scrollColumn(1, 0)
					picker.scrollColumn(2, 0)
				}

				function secondChange() {
					third = [];
					checked[1] = selectedIndex;
					var first_index = checked[0];
					if(city[first_index].children[selectedIndex].hasOwnProperty('children')) {
						var secondCity = city[first_index].children[selectedIndex];
						creatList(secondCity.children, third);
						picker.refillColumn(2, third);
						picker.scrollColumn(2, 0)
					} else {
						third = [{
							text: '',
							value: 0
						}];
						checked[2] = 0;
						picker.refillColumn(2, third);
						picker.scrollColumn(2, 0)
					}
				}

			});

			picker.on('picker.valuechange', function(selectedVal, selectedIndex) {
				console.log(selectedVal);
				console.log(selectedIndex);

			});

			$("#" + idName).on('click', function() {
				picker.show();
			});
		},
		addTwo: function(idName) {
			var nameEl = document.getElementById(idName);

			var first = []; /* 省，直辖市 */
			var second = []; /* 市 */
			var selectedIndex = [0, 0]; /* 默认选中的地区 */
			var checked = [0, 0]; /* 已选选项 */

			function creatList(obj, list) {
				obj.forEach(function(item, index, arr) {
					var temp = new Object();
					temp.text = item.text;
					temp.value = item.value;
					list.push(temp);
				})
			}
			creatList(city, first);
			if(city[selectedIndex[0]].hasOwnProperty('children')) {
				creatList(city[selectedIndex[0]].children, second);
			} else {
				second = [{
					text: '',
					value: 0
				}];
			}
			var picker = new Picker({
				data: [first, second],
				selectedIndex: selectedIndex,
				title: '地址选择'
			});

			picker.on('picker.select', function(selectedVal, selectedIndex) {
				var text1 = first[selectedIndex[0]].text;
				var text2 = second[selectedIndex[1]].text;

				$("#" + idName).find('.sel_city').text(text1 + ' ' + text2);
				$("#" + idName).find("input[name='province']").val(text1);
				$("#" + idName).find("input[name='city']").val(text2);
			});

			picker.on('picker.change', function(index, selectedIndex) {
				if(index === 0) {
					firstChange();
				}

				function firstChange() {
					second = [];
					checked[0] = selectedIndex;
					var firstCity = city[selectedIndex];
					if(firstCity.hasOwnProperty('children')) {
						creatList(firstCity.children, second);
					} else {
						second = [{
							text: '',
							value: 0
						}];
						checked[1] = 0;
					}

					picker.refillColumn(1, second);
					picker.scrollColumn(1, 0)
				}
			});
			picker.on('picker.valuechange', function(selectedVal, selectedIndex) {
				console.log(selectedVal);
				console.log(selectedIndex);
			});
			$("#" + idName).on('click', function() {
				picker.show();
			});
		}
	};
	window.cityfunc = cityfunc;
})();