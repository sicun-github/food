(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/order/order"],{"2e22":function(e,t,r){"use strict";(function(e){var t=r("4ea4");r("6e79"),r("a9ff");t(r("66fd"));var n=t(r("4b71"));wx.__webpack_require_UNI_MP_PLUGIN__=r,e(n.default)}).call(this,r("543d")["createPage"])},3098:function(e,t,r){"use strict";var n=r("75c0"),o=r.n(n);o.a},"4b71":function(e,t,r){"use strict";r.r(t);var n=r("92e0"),o=r("af1f");for(var a in o)["default"].indexOf(a)<0&&function(e){r.d(t,e,(function(){return o[e]}))}(a);r("3098");var u=r("f0c5"),i=Object(u["a"])(o["default"],n["b"],n["c"],!1,null,"fd123f5c",null,!1,n["a"],void 0);t["default"]=i.exports},"75c0":function(e,t,r){},"92e0":function(e,t,r){"use strict";r.d(t,"b",(function(){return o})),r.d(t,"c",(function(){return a})),r.d(t,"a",(function(){return n}));var n={uModal:function(){return Promise.all([r.e("common/vendor"),r.e("uni_modules/uview-ui/components/u-modal/u-modal")]).then(r.bind(null,"3ebe"))},uLoadmore:function(){return Promise.all([r.e("common/vendor"),r.e("uni_modules/uview-ui/components/u-loadmore/u-loadmore")]).then(r.bind(null,"2738"))}},o=function(){var e=this,t=e.$createElement,r=(e._self._c,e.__map(e.OrderList,(function(t,r){var n=e.__get_orig(t),o=e.getTime(t.addtime);return{$orig:n,m0:o}})));e._isMounted||(e.e0=function(t){e.show=!1}),e.$mp.data=Object.assign({},{$root:{l0:r}})},a=[]},af1f:function(e,t,r){"use strict";r.r(t);var n=r("be1f"),o=r.n(n);for(var a in n)["default"].indexOf(a)<0&&function(e){r.d(t,e,(function(){return n[e]}))}(a);t["default"]=o.a},be1f:function(e,t,r){"use strict";(function(e,n){var o=r("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=o(r("a34a")),u=o(r("9523")),i=o(r("c973")),s=o(r("a8f2"));function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}var d=e.importObject("order"),f={data:function(){return{OrderList:[],isLogin:!0,show:!1,currentCode:"",status:"loadmore"}},methods:{getTime:function(e){return(0,s.default)(e).format("YYYY-MM-DD HH:mm")},getOrderList:function(){var e=arguments,t=this;return(0,i.default)(a.default.mark((function r(){var o,u,i,s;return a.default.wrap((function(r){while(1)switch(r.prev=r.next){case 0:if(o=e.length>0&&void 0!==e[0]?e[0]:0,u=n.getStorageSync("openid"),!u){r.next=25;break}if("nomore"!=t.status){r.next=5;break}return r.abrupt("return");case 5:if(r.prev=5,0!=o){r.next=13;break}return r.next=9,d.getUserOrder({start:o,user_id:u});case 9:i=r.sent,200==i.code?(t.OrderList=i.data,console.log(t.OrderList)):t.status=nomore,r.next=19;break;case 13:if("loadmore"!=t.status){r.next=19;break}return t.status="loading",r.next=17,d.getUserOrder({start:o,user_id:u});case 17:s=r.sent,null!=s&&200==s.code?(t.OrderList=t.OrderList.concat(s.data),s.data.length<6?t.status="nomore":t.status="loadmore"):t.status="nomore";case 19:r.next=25;break;case 21:r.prev=21,r.t0=r["catch"](5),console.log("error",r.t0),t.status="nomore";case 25:case"end":return r.stop()}}),r,null,[[5,21]])})))()},gotoPurchase:function(e){var t=this;return(0,i.default)(a.default.mark((function r(){return a.default.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return t.$store.commit("SET_SHOP_ID",e),r.next=3,t.$store.dispatch("getMealInfo",e);case 3:n.navigateTo({url:"/pages/purchase/purchase?show_goods=".concat(!1)},!0);case 4:case"end":return r.stop()}}),r)})))()},gotoOrderDetail:function(e){n.navigateTo({url:"/pages/order/order_detail/order_detail?code=".concat(e)})},getSame:function(e,t,r){this.$store.commit("SET_SHOP_ID",e),r?this.$store.commit("SET_SHOP_ID",!1):this.$store.commit("SET_SHOP_ID",!0);var o=t.map((function(e){var t=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){(0,u.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},e.meal_info);return t.num=e.num,t}));o=JSON.stringify(o),n.navigateTo({url:"/pages/order/addOrder/addOrder?cart=".concat(o)},!0)},changeCode:function(e){this.currentCode=e,this.show=!0},deleteOrder:function(){var e=this;return(0,i.default)(a.default.mark((function t(){var r,o;return a.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return r=n.getStorageSync("openid"),t.next=3,d.delUserOrder({code:e.currentCode,user_id:r});case 3:o=t.sent,200==o.code&&(n.showToast({title:"删除成功！",icon:"success"}),e.status="loadmore",e.show=!1,e.getOrderList());case 5:case"end":return t.stop()}}),t)})))()}},onLoad:function(){this.getOrderList()},onReachBottom:function(){this.getOrderList(this.OrderList[this.OrderList.length-1]._id)}};t.default=f}).call(this,r("a9ff")["default"],r("543d")["default"])}},[["2e22","common/runtime","common/vendor"]]]);