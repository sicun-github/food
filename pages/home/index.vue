<template>
	<view class="container">
		<view>
			<swiper
				class="banner-swiper"
				circular
				autoplay
				:interval="5000"
				:duration="1000"
			>
				<swiper-item
					class="banner-swiper-item"
					v-for="(item, index) in swipers"
					:key="index"
				>
					<image :src="item" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="context">
			<view class="get_container">
				<view class="left" @tap="gotoPulishTreeHole"
					><img src="/static/媒体发布.png" alt="" srcset="" />
					<text class="font-20">发布评论</text>
				</view>
				<view class="right" @tap="gotoShop_select"
					><img src="/static/shiwu.png" alt="" srcset="" /><text class="font-20"
						>今日点餐</text
					>
				</view>
			</view>

			<!-- <view class="credit">
				<view class="left" @tap="gotoVoucher">
					<text class="base"
						>我的积分<text class="num">{{ credit ? credit : 0 }}</text></text
					>
					<text class="assist">可兑换优惠券和丰富灵感周边</text>
				</view>
				<view class="right" @tap="gotoCode">
					<image src="../../static/home_icon_erweima.png" mode=""></image>
					<text class="assist">会员码</text>
				</view>
			</view> -->

			<view class="image" @click="gotoTreeHole">
				<image src="../../static/shudon.jpg" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			swipers: [
				'https://i3.meishichina.com/atta/recipe/201102/201102200859330.jpg?x-oss-process=style/p800',
				'https://i3.meishichina.com/atta/recipe/2018/12/29/2018122915460588584437828.jpg?x-oss-process=style/p800',
				'https://i3.meishichina.com/atta/recipe/2018/02/06/2018020615179140581361846401.jpg?x-oss-process=style/p800',
			],
		};
	},
	computed: {
		...mapState({ credit: (state) => state.user.userinfo.user_credit }),
	},
	methods: {
		async getMessage() {
			let data = await uniCloud.callFunction({
				name: 'add',
				data: { message: 'hello' },
			});
			console.log(data.result);
			this.context = data.result.message;
		},
		gotoCode() {
			uni.navigateTo(
				{
					url: '/pages/user/code/code',
				},
				true
			);
		},
		gotoPulishTreeHole() {
			// uni.switchTab({
			// 	url: '/pages/purchase/purchase'
			// });
			uni.navigateTo(
				{
					url: '/pages/treeHole/publish',
				},
				true
			);
			console.log(123);
		},
		gotoTreeHole() {
			uni.navigateTo(
				{
					url: '/pages/treeHole/treeHole',
				},
				true
			);
		},
		gotoShop_select() {
			uni.switchTab({
				url: '/pages/purchase/shop_select',
			});
		},
		gotoVoucher() {
			uni.navigateTo(
				{
					url: '/pages/user/voucher/voucher',
				},
				true
			);
		},
	},
	async onLoad() {
		//判断是否登录，如果用户名不存在则登录
		// if(!uni.getStorageInfoSync('user_name')){
		// 	this.$store.dispatch('login')
		// }

		let openid = uni.getStorageSync('openid');
		console.log('openid:', openid);
		if (openid) {
			await this.$store.dispatch('login', true);
			// this.credit = this.$store.state.user.userinfo.user_credit

			console.log(this.$store.state.user.userinfo.user_credit);
		}
	},
	onShareAppMessage(res) {
		return {
			title: '美食日历',
			path: '/pages/home/index',
		};
	},
};
</script>

<style scoped lang="scss">
.container {
	// width: 100%;

	display: flex;
	flex-direction: column;
}

.banner-swiper {
	width: 100%;
	height: 600rpx;
	.banner-swiper-item {
		image {
			width: 100%;
			height: 100%;
		}
	}
}

.context {
	box-sizing: border-box;
	width: 100%;
	padding-left: 40rpx;
	padding-right: 40rpx;
	margin-top: -20rpx;
	z-index: 2;

	.get_container {
		width: 100%;
		background-color: #fff;
		height: 350rpx;
		display: block;
		border-radius: 10rpx;
		margin-top: -60rpx;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		box-shadow: $box-shadow;
		.font-20 {
			font-size: 45rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}
		.right {
			// &:nth-child(1):after {
			// 	content: '';
			// 	position: absolute;
			// 	right: -60rpx;
			// 	top: 0;
			// 	bottom: 0;
			// 	width: 2rpx;
			// 	background-color: #cccccc;
			// }
			width: 50%;
			// margin-right: 10rpx;
			display: flex;
			flex-direction: column;
			position: relative;
			justify-content: space-between;
			align-items: center;
			img {
				height: 115rpx;
				width: 115rpx;
				margin-bottom: 20rpx;
			}
		}
		.left {
			@extend .right;
			margin-top: 5rpx;
			img {
				height: 110rpx;
				width: 110rpx;
				// margin-bottom: 30rpx;
			}
			border-right: 2rpx solid #cccccc;
		}
	}

	.image {
		margin-top: 60rpx;
		width: 100%;
		image {
			border-radius: 5rpx;
			width: 100%;
		}
	}

	.credit {
		margin-top: 40rpx;
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			flex-direction: column;
			flex: 1;
			.assist {
				font-size: 26rpx;
				color: $text-color-assist;
				margin-top: 10rpx;
			}
			.base {
				color: $text-color-base;
				font-size: 32rpx;
				.num {
					margin-left: 10rpx;
					font-size: 40rpx;
					font-weight: bold;
				}
			}
		}
		.right {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 130rpx;
			.assist {
				font-size: 26rpx;
				color: $text-color-assist;
				margin-top: 10rpx;
			}
			border-left: 2rpx solid #cbcbcb;
			// padding-right: 20rpx;
		}
		image {
			width: 60rpx;
			height: 60rpx;
		}
	}
}
</style>
