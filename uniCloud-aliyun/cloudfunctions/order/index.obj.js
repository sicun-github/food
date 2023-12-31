const db = uniCloud.database();
const dbJql = uniCloud.databaseForJQL();
const voucher = uniCloud.importObject('voucher');
module.exports = {
	_before: function () {
		// 通用预处理器
	},
	async createOrder(order) {
		//生成订单
		const now = new Date().getTime();
		const orderCode = now + '1229';

		const data = {
			code: orderCode,
			...order,
		};
		//1.先添加到order订单表中的基本信息
		await db.collection('order').add(data);

		//3.返回订单信息
		let res = await db
			.collection('order')
			.where({
				code: orderCode,
			})
			.get()
			.catch((err) => {
				return {
					code: 500,
					msg: '订单生成失败',
					data: null,
				};
			});
		return {
			code: 200,
			msg: '订单生成成功，返回订单数据',
			data: res.data,
		};
	},
	async getUserOrder(event) {
		var today = new Date().toLocaleDateString();
		const _ = db.command;
		const query = {};
		if (event.user_admin === false) {
			query = {
				// 在这里添加其他查询条件，如果需要的话
				user_id: event.user_id,
			};
		}
		if (event.type == 0) {
			query.time = _.and(
				_.gte(new Date(today + ' 00:00:00')),
				_.lte(new Date(today + ' 23:59:59'))
			);
		}
		let res = await db
			.collection('order')
			.where(query)
			.orderBy('create_time', 'desc')
			.get()
			.catch((err) => {
				return {
					code: 500,
					msg: '失败',
					data: null,
				};
			});
		return {
			code: 200,
			msg: '成功',
			data: res.data,
		};
		// var option = {
		// 	user_id: event.user_id,
		// };
		// if (event.start) option._id = db.command.lt(event.start);
		// //输入用户编号userId即openid
		// //联合order和order_detail表查询用户订单信息
		// let order = await dbJql.collection('order').where(option).getTemp();
		// let user_order = await dbJql
		// 	.collection(order, 'order_detail')
		// 	.orderBy('_id desc,addtime desc')
		// 	.limit(6)
		// 	.get()
		// 	.catch((err) => {
		// 		return {
		// 			code: 500,
		// 			msg: '查询用户订单信息失败',
		// 			data: null,
		// 		};
		// 	});
		// user_order = user_order.data;
		// //遍历订单详情补充店铺和菜品信息
		// for (var i = 0; i < user_order.length; i++) {
		// 	//获取订单详情
		// 	let _detail = user_order[i].code.order_detail;
		// 	for (var j = 0; j < _detail.length; j++) {
		// 		//查询店铺信息
		// 		let shop = await db
		// 			.collection('shop')
		// 			.where({
		// 				_id: _detail[j].shop_id,
		// 			})
		// 			.get();
		// 		user_order[i].code.order_detail[j]['shop_info'] = shop.data[0];

		// 		//查询菜品信息
		// 		let meal = await db
		// 			.collection('shop_meal')
		// 			.where({
		// 				_id: _detail[j].meal_id,
		// 			})
		// 			.get();
		// 		user_order[i].code.order_detail[j]['meal_info'] = meal.data[0];
		// 	}
		// }

		// return {
		// 	code: 200,
		// 	msg: '查询用户订单成功',
		// 	data: user_order,
		// };
	},
	async getOrderInfo(code) {
		//通过订单号查询订单详情
		// var testCode = "20221215kkk";
		let order = await dbJql
			.collection('order')
			.where({
				code: code,
			})
			.getTemp();
		let order_list = await dbJql
			.collection(order, 'order_detail')
			.get()
			.catch((err) => {
				return {
					code: 500,
					msg: '查询订单详情失败',
					data: null,
				};
			});
		order_list = order_list.data;
		for (var i = 0; i < order_list.length; i++) {
			//获取订单详情
			let _detail = order_list[i].code.order_detail;
			for (var j = 0; j < _detail.length; j++) {
				//查询店铺信息
				let shop = await db
					.collection('shop')
					.where({
						_id: _detail[j].shop_id,
					})
					.get();
				order_list[i].code.order_detail[j]['shop_info'] = shop.data[0];

				//查询菜品信息
				let meal = await db
					.collection('shop_meal')
					.where({
						_id: _detail[j].meal_id,
					})
					.get();
				order_list[i].code.order_detail[j]['meal_info'] = meal.data[0];
			}
		}
		return {
			code: 200,
			msg: '查询订单详情成功',
			data: order_list,
		};
	},
	async delUserOrder(info) {
		//删除用户订单
		//传入用户user_id(即openid)和订单编号code
		let res = await db
			.collection('order')
			.where({
				code: info.code,
				user_id: info.user_id,
			})
			.remove();
		if (res.deleted) {
			await db
				.collection('order_detail')
				.where({
					code: info.code,
				})
				.remove();
			return {
				code: 200,
				msg: '删除成功',
			};
		} else {
			return {
				code: 500,
				msg: '删除失败,数据库出问题',
			};
		}
	},
};
