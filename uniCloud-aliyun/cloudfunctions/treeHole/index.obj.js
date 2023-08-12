// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	_before: function () {
		// 通用预处理器
	},
	async addHole(hole) {
		//发布树洞/失物招领

		hole['hole_id'] = Date.now() + '';
		hole['hole_addtime'] = new Date();

		let res = await db
			.collection('treeHole')
			.add(hole)
			.catch((err) => {
				return {
					code: 500,
					msg: err.message || '新增失败',
				};
			});
		return {
			code: 200,
			msg: '发送成功',
			data: res,
		};
	},
	async getHole(event) {
		//通过树洞种类查询相关信息
		let res = await db
			.collection('treeHole')
			.orderBy('hole_addtime', 'desc')
			.get();
		if (res.data) {
			return {
				code: 200,
				msg: '查询成功',
				data: res.data,
			};
		} else {
			return {
				code: 500,
				msg: '查询失败',
				data: res,
			};
		}
	},
	async getAllHole(event) {
		//通过树洞种类查询相关信息
		let res = await db
			.collection('treeHole')
			.orderBy('hole_addtime', 'desc')
			.get()
			.catch((err) => {
				return {
					code: 500,
					msg: '失败',
					data: null,
				};
			});

		for (let i = 0; i < res.data.length; i++) {
			const user = await db
				.collection('user')
				.where({
					user_id: res.data[i].user_id,
				})
				.get();
			console.log(
				'%c 🎂 user: ',
				'background-color: #6EC1C2;color:#fff;',
				user
			);
			res.data[i].user_name = user.data[0].user_name;
			res.data[i].user_avatar = user.data[0].user_avatar;
		}

		return {
			code: 200,
			msg: '成功',
			data: res.data,
		};
	},
	async addHoleComment(hole_comment) {
		var date = new Date();
		// var hole_comment={
		// 	hole_id:"评论的树洞编号"
		// 	user_id:"用户编号openid"
		// 	comment_content:"在地上发现一个苹果18s，现放在南饭二楼小卖部",
		// }
		let res = await db
			.collection('treeHole_comment')
			.add({
				holeComment_id: hole_comment.hole_id,
				user_id: hole_comment.user_id,
				holeComment_content: hole_comment.comment_content,
				holeComment_addtime: date.getTime(),
			})
			.catch((err) => {
				return {
					code: 500,
					msg: '评论失败',
					data: hole_comment,
				};
			});
		return {
			code: 200,
			msg: '评论成功',
			data: res,
		};
	},
	async delHoleComment(event) {
		//传入event参数，里面有用户id和当前评论的id
		// var event = {
		// 	user_id:"用户id",
		// 	comment_id:"树洞评论编号"
		// }
		let flag = await db
			.collection('treeHole_comment')
			.doc(event.comment_id)
			.get();
		if (flag.data[0]['user_id'] == event.user_id) {
			let res = await db
				.collection('treeHole_comment')
				.doc(event.comment_id)
				.remove()
				.catch((err) => {
					return {
						code: 500,
						msg: '删除评论失败',
					};
				});
			return {
				code: 200,
				msg: '树洞评论删除成功',
				data: null,
			};
		} else {
			return {
				code: 501,
				msg: '你没有权限删除评论',
			};
		}
	},
	//删除照片
	async deleteImage(url) {
		let result = await uniCloud.deleteFile({
			fileList: [url],
		});
		return {
			status: 200,
			result,
		};
	},
};
