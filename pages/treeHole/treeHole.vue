<template>
	<view class="u-page">
		<view
			class="u-demo-block"
			v-for="(item, index) in HoleList"
			:key="item.hole_id"
		>
			<!-- <text class="u-demo-block__title">多图模式</text> -->
			<view class="u-demo-block__content">
				<view class="album">
					<view class="album__avatar">
						<img
							:src="item.user_avatar"
							mode=""
							style="
								height: 80rpx;
								width: 80rpx;
								object-fit: cover;
								border-radius: 10rpx;
							"
						/>
					</view>
					<view class="album__content">
						<view class="title">
							<u--text
								:text="item.user_name"
								type="primary"
								bold
								size="34rpx"
							></u--text>
						</view>
						<u--text
							margin="0 0 16rpx 0"
							size="30rpx"
							:text="item.hole_content"
						></u--text>
						<u-album
							:urls="item.hole_img.length ? item.hole_img : []"
						></u-album>
						<view class="wechat-container" style="">
							<u--text
								:text="getTime(item.hole_addtime)"
								type="info"
								size="24rpx"
							></u--text>
							<!-- <view class="right">
								<uni-transition
									mode-class="fade"
									:show="commentIndex == index"
									@change="change"
								>
									<view class="dz-button">
									
										<u--text
											prefixIcon="edit-pen"
											iconStyle="font-size: 36rpx;color:#3c9cff"
											text="评论"
											size="24rpx"
											type="primary"
											@click="openPublishComment(item.hole_id)"
										></u--text>
									</view>
								</uni-transition>
								<u-icon
									name="chat"
									size="38rpx"
									@tap="openComment(index)"
								></u-icon>
							</view> -->
						</view>
						<view class="dz-container">
							<!-- <view class="comment" v-if="item._comment.length > 0">
								<view
									class="person"
									v-for="comment in item._comment"
									:key="comment._id"
									@click="
										changeCommentID(comment._id, comment.user_id[0].user_id)
									"
								>
									<text class="u-primary name"
										>{{ comment.user_id[0].user_name }}:</text
									>
									<text class="content">{{ comment.holeComment_content }}</text>
								
								</view>
							</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog
				ref="inputClose"
				mode="input"
				confirmText="发布"
				title="输入评论内容"
				placeholder="请输入内容"
				@confirm="publishComment"
			></uni-popup-dialog>
		</uni-popup> -->
		<!-- <u-notify ref="uNotify" message="Hi uView"></u-notify> -->
		<!-- <u-action-sheet
			:actions="list"
			@select="deleteComment"
			cancelText="取消"
			@close="showAction = false"
			:show="showAction"
		></u-action-sheet> -->
	</view>
</template>

<script>
import dayjs from 'dayjs';
const treeHole = uniCloud.importObject('treeHole');
import { mapState } from 'vuex';
export default {
	data() {
		return {
			albumWidth: 0,
			show: true,
			list: [
				{
					name: '删除',
				},
			],
			commentIndex: -1,
			currentCommentId: '',
			status: 'loadmore',
			showAction: false,
			HoleList: [],
			current_hole_id: '',
		};
	},
	computed: {
		...mapState({
			user_id: (state) => state.user.openid,
			user_name: (state) => state.user.userinfo.user_name,
		}),
	},
	methods: {
		openComment(index) {
			if (this.commentIndex != index) {
				this.commentIndex = index;
			} else {
				this.commentIndex = -1;
			}
		},
		getReverse(item) {
			return item.reverse;
		},
		openPublishComment(hole_id) {
			this.$refs.inputDialog.open();
			this.current_hole_id = hole_id;
		},
		//发布评论，val为评论内容
		async publishComment(val) {
			// uni.showLoading({
			// 	title: '3秒后会关闭'
			// })
			console.log(this.user_id);
			let res = await treeHole.addHoleComment({
				hole_id: this.current_hole_id,
				user_id: this.user_id,
				comment_content: val,
			});
			if (res.code == 200) {
				this.$refs.uNotify.primary('评论成功！');
				this.status = 'loadmore';
				this.getTreeHole();
			} else {
				this.$refs.uNotify.warning('评论好像有点问题！');
			}
		},
		async deleteComment(item) {
			if (item.name == '删除') {
				let res = await treeHole.delHoleComment({
					user_id: this.user_id,
					comment_id: this.currentCommentId,
				});
				if (res.code == 200) {
					this.$refs.uNotify.success('删除成功！');
					this.status = 'loadmore';
					this.getTreeHole();
				}
			}
			console.log(item);
		},
		changeCommentID(id, user_id) {
			this.currentCommentId = id;
			console.log(this.currentCommentId);
			if (user_id == this.user_id) {
				this.showAction = true;
			}
			// let res = await treeHole.delHoleComment({
			// 	user_id:this.user_id,
			// 	comment_id:id
			// })
		},
		change() {
			console.log(123);
		},
		closeComment() {
			this.showComment = false;
		},
		getTime(time) {
			return dayjs(time).format('YYYY-MM-DD HH:mm');
		},
		async getTreeHole(start = 0) {
			let result = await treeHole.getAllHole({ start });
			if (result.code == 200) {
				this.HoleList = result.data;
			}
		},
	},
	// onReachBottom() {
	// 	console.log(this.HoleList[this.HoleList.length - 1]._id);
	// 	this.getTreeHole(this.HoleList[this.HoleList.length - 1]._id);
	// },
	onLoad() {
		this.getTreeHole();
	},
};
</script>

<style lang="scss">
.u-page {
	padding: 0 30rpx;
	background-color: white;
	.u-demo-block {
		padding-top: 20rpx;
		border-bottom: 2rpx solid #eee;
	}

	.album__avatar {
		background-color: white !important;
	}
	.u-demo-block__content {
		margin-bottom: 10rpx;

		.wechat-container {
			width: 100%;
			margin: 20rpx 0 10rpx 0;
			display: flex;
			height: 60rpx;
			justify-content: space-between;
			.right {
				display: flex;
				align-items: center;

				.dz-button {
					padding: 5rpx 5rpx;
					box-sizing: border-box;
					height: 50rpx;
					display: flex;
					background-color: rgba(193, 193, 193, 0.5);
					border-radius: 8rpx;
				}
			}
		}
		.dz-container {
			background-color: rgba(193, 193, 193, 0.5);
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			width: 550rpx;
			// .dz{
			// 	display: flex;
			// 	flex-wrap: wrap;
			// 	padding: 10rpx 10rpx;
			// 	border-bottom: 2rpx solid #eee;
			// 	.person{
			// 		display: flex;
			// 		align-items: center
			// 	}
			// }
			.comment {
				width: 100%;
				.person {
					display: flex;
					align-items: flex-start;
					margin-bottom: 10rpx;
					.name {
						font-size: 26rpx;
						font-weight: bold;
						margin-right: 10rpx;
					}
					.content {
						flex: 1;
						font-size: 24rpx;
						color: #000;
					}
				}
				padding: 10rpx 10rpx;
			}
		}
	}
}
.album {
	@include flex;
	align-items: flex-start;

	&__avatar {
		background-color: $u-bg-color;
		padding: 5px;
		border-radius: 3px;
	}

	&__content {
		margin-left: 10px;
		flex: 1;
		.title {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10rpx;
			.info {
				font-size: 22rpx;
				color: $u-warning-dark;
				background-color: $u-warning-light;
				padding: 5rpx;
				// padding: 0 5rpx;
				// padding-bottom: 3rpx;
				box-sizing: border-box;
				border: 1rpx solid $u-warning;
				border-radius: 5rpx;
			}
		}
	}
}
</style>
