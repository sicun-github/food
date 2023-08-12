<template>
	<view>
		<u-subsection
			:list="list"
			:current="current"
			@change="change"
			active-color="#FCC32B"
		></u-subsection>
		<view class="today-order">
			<van-empty v-if="OrderList.length < 1" description="暂时无订单" />
			<view
				v-else
				class="order-container"
				v-for="(order, index) in OrderList"
				:key="order._id"
			>
				<view style="font-size: 28rpx; color: #999">{{
					order.create_time.substring(0, 19).replaceAll('T', ' ')
				}}</view>
				<u-read-more
					ref="uReadMore"
					:show-height="
						order.shop_list.length <= 2 ? order.shop_list.length * 120 : 340
					"
					:toggle="order.shop_list.length > 2"
					text-indent="0em"
					color="#fcc32b"
				>
					<view class="card" v-for="item in order.shop_list" :key="item._id">
						<u-image
							:src="item.shop_img"
							width="200rpx"
							height="200rpx"
							radius="10rpx"
						></u-image>
						<view class="right">
							<view class="title">
								<u-text
									:lines="1"
									bold
									:text="item.shop_name"
									size="30rpx"
								></u-text>
							</view>

							<view class="text_info">
								<text class="u-info">{{ item.shop_desc }}</text>
							</view>
						</view>
					</view>
				</u-read-more>
				<view style="margin-top: 20rpx">
					<u-row gutter="6" justify="end">
						<u-col span="3">
							<u-button
								type="error"
								plain
								shape="square"
								size="mini"
								@click="changeCode(order.code)"
								>删除订单</u-button
							>
						</u-col>
						<u-col span="3">
							<u-button
								type="primary"
								shape="square"
								size="mini"
								@click="anotherOrder(order)"
								>再来一单</u-button
							>
						</u-col>
					</u-row>
				</view>
			</view>
		</view>
		<u-modal
			:show="show"
			showCancelButton
			title="提示"
			content="确定要删除该订单吗?"
			@cancel="show = false"
			@confirm="deleteOrder"
		></u-modal>
	</view>
</template>

<script>
const orderCloud = uniCloud.importObject('order');
import { mapState } from 'vuex';
export default {
	data() {
		return {
			OrderList: [],
			list: [
				{
					name: '今日订单',
				},
				{
					name: '历史订单',
				},
			],
			current: 0,
			isLogin: true,
			show: false,
			currentCode: '',
			status: 'loadmore',
		};
	},
	computed: {
		...mapState({
			user_name: (state) => state.user.userinfo.user_name,
			user_id: (state) => state.user.openid,
		}),
	},
	methods: {
		async getOrderList() {
			let user_id = uni.getStorageSync('openid');
			let result = await orderCloud.getUserOrder({
				user_id,
				type: this.current,
			});
			if (result.code == 200) {
				this.OrderList = result.data;
				this.$nextTick(() => {
					if (this.$refs.uReadMore && this.$refs.uReadMore.length > 0) {
						this.$refs.uReadMore.forEach((element) => {
							element.init();
						});
					}
				});
			}
		},
		//分段器改变
		async change(current) {
			this.current = current;
			this.getOrderList();
		},

		changeCode(code) {
			this.currentCode = code;
			this.show = true;
		},
		async deleteOrder() {
			let user_id = uni.getStorageSync('openid');
			let res = await orderCloud.delUserOrder({
				code: this.currentCode,
				user_id: user_id,
			});
			if (res.code == 200) {
				uni.showToast({
					title: '删除成功！',
					icon: 'success',
				});
				this.show = false;
				this.getOrderList();
			}
		},
		//再来一单
		async anotherOrder(item) {
			// const create_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
			const create_time = new Date();

			const shop_list = item.shop_list;
			let user_id = uni.getStorageSync('openid');
			const order = {
				user_id,
				name: this.user_name,
				shop_list,
				create_time,
			};
			const result = await orderCloud.createOrder(order);
			if (result.code === 200) {
				uni.showToast({
					title: '下单成功！',
					duration: 2000,
				});
				this.getOrderList();
			}
		},
	},
	onLoad() {
		this.getOrderList();
	},
};
</script>

<style scoped lang="scss">
$text-normal: #3c3c3c;
$text-less: #636363;
$text-gold: #dba871;

$normal-size: 29rpx;
$less-size: 28rpx;

.icon {
	width: 35rpx;
	height: 35rpx;
}

.order-container {
	margin-top: 20rpx;
	background-color: #fff;
	padding: 40rpx 30rpx;
	display: flex;
	flex-direction: column;
	.shop {
		display: flex;
		.left {
			flex: 1;
			display: flex;
			align-items: center;
			image {
				width: 36rpx;
				height: 36rpx;
				margin-right: 10rpx;
			}
			font-size: $normal-size;
			color: $text-normal;
			font-weight: bold;
		}
		.right {
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: $text-normal;
		}
	}
	.good-image {
		margin-top: 30rpx;
		width: 600rpx;
		height: 100rpx;
		white-space: nowrap;
		overflow: scroll;
		img {
			height: 100rpx;
			margin-right: 10rpx;
			width: 100rpx;
			object-fit: contain;
			border-radius: 10rpx;
		}
	}
	.order-info {
		display: flex;
		align-items: center;
		margin-top: 30rpx;
		.left {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 26rpx;
			color: $text-less;
		}
		.right {
			font-size: 34rpx;
			// font-weight: bold;
			color: $text-normal;
		}
	}
	.button_List {
		margin-top: 20rpx;
		display: flex;
		justify-content: flex-end;
		.getOther {
			width: 150rpx;
			height: 60rpx;
			border: 2rpx solid $text-gold;
			font-size: 26rpx;
			border-radius: 4rpx;
			color: $text-gold;
			margin-right: 15rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}

// .today-order{
// 		height: 80vh;
// 		width: 100%;
// 		display: flex;
// 		align-items: center;
// 		justify-content: center;

// }

.card {
	padding: 15rpx 0;
	border-radius: 10rpx;
	background-color: #fff;
	margin-bottom: 10rpx;
	display: flex;
	align-items: center;
	.right {
		flex: 1;
		margin-left: 10rpx;
		.title {
			display: flex;
			.on {
				background-color: $u-primary-light;
				font-size: 22rpx;
				border-radius: 10rpx;
				padding: 5rpx;
			}
		}
		.text_info {
			display: flex;
			margin-top: 5rpx;
			font-size: 22rpx;

			.u-info {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 4;
			}
		}
		.stand_container {
			.stand {
				background-color: $u-warning-light;
				// margin-top: 15rpx;
				// display: block;
				font-size: 22rpx;
				// max-width: 350rpx;
				border-radius: 10rpx;
				padding: 5rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>
