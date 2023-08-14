<template>
	<view class="container">
		<view class="search">
			<u-search
				:clearabled="true"
				margin="20rpx 20rpx"
				bgColor="#fff"
				placeholder="搜索菜品名称"
				borderColor="#eee"
				@search="search"
				@clear="clear"
				:showAction="false"
				v-model="keyword"
			></u-search>
		</view>
		<u-empty
			v-if="ShopList.length <= 0 && showWinner == false"
			mode="data"
			text="列表暂时为空~"
			icon="http://cdn.uviewui.com/uview/empty/data.png"
		>
		</u-empty>
		<view style="padding-top: 110rpx">
			<u-checkbox-group wrap shape="circle" @chenge="checkboxGroupChange">
				<view class="card_container" v-show="!showWinner">
					<view
						class="card"
						v-for="item in ShopList"
						:key="item._id"
						@click="handleSelect(item._id)"
					>
						<u-image
							:src="item.shop_img"
							showLoading
							lazyLoad
							width="200rpx"
							height="200rpx"
							radius="10rpx"
						></u-image>
						<view class="right">
							<view>
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
							<view class="stand_container" style="margin-top: 15rpx">
								<u-rate
									active-color="#FA3534"
									inactive-color="#b2b2b2"
									v-model="item.shop_star"
									disabled
								></u-rate>
							</view>
						</view>
						<view style="margin-left: 10rpx" v-if="ShopList.length > 0">
							<u-checkbox
								active-color="#FCC32B"
								@change="(e) => checkboxChange(e, item._id)"
								:checked="selects.includes(item._id)"
								:name="item._id"
							></u-checkbox>
						</view>
					</view>
				</view>
			</u-checkbox-group>
		</view>
		<view class="but">
			<u-button type="primary" @click="placeOrder">下单</u-button>
		</view>
		<!-- <winnerMeal v-show="showWinner"></winnerMeal> -->
	</view>
</template>

<script>
import dayjs from 'dayjs';
const shop = uniCloud.importObject('shop');
const special_tool = uniCloud.importObject('special_tool');
const orderCloud = uniCloud.importObject('order');
// import winnerMeal from './winnerMeal.vue';
import { mapState } from 'vuex';
export default {
	components: {
		// winnerMeal,
	},
	data() {
		return {
			keyword: '',
			showWinner: false,
			value: 4,
			lineBg:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=',
			list1: [
				{
					name: '南区饭堂',
				},
				{
					name: '北区饭堂',
				},
				{
					name: '饭菜推荐',
					badge: {
						isDot: true,
					},
				},
			],
			ShopList: [],
			selects: [],
		};
	},
	computed: {
		...mapState({
			user_name: (state) => state.user.userinfo.user_name,
			user_id: (state) => state.user.openid,
		}),
	},
	methods: {
		async search() {
			const shop = uniCloud.importObject('shop');
			let res = await shop.searchShop({ name: this.keyword });
			if (res.code == 200) {
				this.ShopList = res.data;
			}
		},

		//清除
		async clear() {
			this.keyword = '';
			this.getSouthShopInfo();
		},
		async gotoPurchase(shop_id) {
			this.$store.commit('SET_SHOP_ID', shop_id);
			await this.$store.dispatch('getMealInfo', shop_id);
			uni.navigateTo(
				{
					url: `/pages/purchase/purchase`,
				},
				true
			);
		},
		async getSouthShopInfo() {
			let result = await shop.getShopByLoc();
			this.ShopList = result.data;
			this.ShopList = this.ShopList.map((item) => {
				item.checked = false;
				return item;
			});
		},

		async getWinnerMeal() {
			let result = await special_tool.winnerMeal();
			this.$store.commit('SET_WINNERMEAL', result.data);
		},
		async getInfo() {
			this.getSouthShopInfo();
			// if (item.index == 2) {
			// 	await this.getWinnerMeal();
			// 	this.showWinner = true;
			// 	return;
			// }
			this.showWinner = false;
		},

		// 选中任一checkbox时，由checkbox-group触发
		checkboxGroupChange(e) {
			this.selects = e;
		},
		// 选中某个复选框时，由checkbox时触发
		checkboxChange(e, id) {
			if (e) {
				this.selects.push(id);
			} else {
				this.selects = this.selects.filter((item) => item !== id);
			}
		},

		//选择
		handleSelect(id) {
			if (this.selects.includes(id)) {
				this.selects = this.selects.filter((item) => item !== id);
			} else {
				this.selects.push(id);
			}
			this.$forceUpdate();
		},
		//下单
		async placeOrder() {
			if (this.selects.length == 0) {
				return uni.showToast({
					icon: 'none',
					title: '请选择菜品！',
					duration: 2000,
				});
			}
			const create_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
			const time = new Date();

			const shop_list = this.ShopList.filter((item) => {
				return this.selects.includes(item._id);
			});
			const order = {
				user_id: this.user_id,
				name: this.user_name,
				shop_list,
				create_time,
				time,
			};
			const result = await orderCloud.createOrder(order);
			if (result.code === 200) {
				uni.showToast({
					title: '下单成功！',
					duration: 2000,
				});
				this.selects = [];
			}
		},
	},
	onLoad() {
		this.getSouthShopInfo();
	},
	// onPullDownRefresh() {
	// 	this.getSouthShopInfo();
	// 	uni.stopPullDownRefresh();
	// },
	onShareAppMessage(res) {
		return {
			title: '美食日历',
			path: '/pages/home/index',
		};
	},
};
</script>

<style>
page {
	/* background-color: #fff; */
}
</style>
<style lang="scss" scoped>
.container {
	.card_container {
		height: calc(100vh - 190rpx);
		overflow-y: scroll;
		padding: 10rpx 10rpx;

		.card {
			padding: 15rpx;
			border-radius: 10rpx;
			background-color: #fff;
			margin-bottom: 10rpx;
			display: flex;
			align-items: center;
			.right {
				flex: 1;
				margin-left: 10rpx;
				height: 200rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
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
						-webkit-line-clamp: 3;
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
	}

	.search {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: white;
		z-index: 999;
	}

	.but {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
}

::v-deep .uicon-star-fill {
	color: rgb(230, 50, 50) !important;
}
</style>
