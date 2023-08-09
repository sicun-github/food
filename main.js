// #ifndef VUE3
import Vue from 'vue';
import App from './App';

import store from '@/store/index.js';

import Button from '@/components/tan-button.vue';

import Input from '@/components/tanInput.vue';

Vue.component('tan-button', Button);
Vue.component('tanInput', Input);

import uView from '@/uni_modules/uview-ui';

console.log('%c 🎂 uView: ', 'background-color: #6EC1C2;color:#fff;', uView);
Vue.use(uView);

Vue.config.productionTip = false;

import API from '@/api/index.js';

Vue.prototype.$API = API;

App.mpType = 'app';

//路由拦截钩子，判断是否需要登录权限
const methodToPatch = ['navigateTo', 'redirectTo', 'switchTab', 'navigateBack'];
methodToPatch.map((item) => {
	const original = uni[item]; //
	uni[item] = function (opt = {}, needAuth) {
		if (needAuth && !uni.getStorageSync('openid')) {
			// 需要登录且未登录
			//            uni.navigateTo({
			//                url: '/pages/user/address/address'
			//            })
			uni.showToast({
				icon: 'error',
				title: '请先登录！',
			});
		} else {
			return original.call(this, opt);
		}
	};
});

const app = new Vue({
	...App,
	store,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
import App from './App.vue';
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}
// #endif
