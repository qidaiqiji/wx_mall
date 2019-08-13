import fly from 'request.js'
import qs from 'qs.js';
// console.log(fly)
// console.log(qs)

//购物车数据
const getCartData = params => fly.get('v2/cart/list', qs.stringify(params), {
  params: 'haveModel'
})
const changeCartNum = params => fly.post('v2/cart/update', params, {
  params: 'haveModel'
})
const deleteCartGoods = params => fly.post('v2/cart/delete', params, {
  params: 'haveModel'
})
const selectGoods = params => fly.post('v2/cart/select', params, {
  params: 'haveModel'
})
const cancelSelectGoods = params => fly.post('v2/cart/unselect', params, {
  params: 'haveModel'
})
const goodsAdviceList = params => fly.get('v2/goods/advice-list', qs.stringify(params), {
  params: 'haveModel'
})
const setadd = params => fly.post('v2/cart/add', params, {
  params: 'haveModel'
});
const getAddCoudan = params => fly.post('v2/cart/add-coudan', params, {
  params: 'haveModel'
});

//订单页数据
const orderGroupGoods = params => fly.post('v2/order-group/checkout', params, {
  params: 'haveLoading'
})
const allOrderList = params => fly.get('v2/order-group/list', qs.stringify(params), {
  params: 'haveLoading'
})
const orderDetail = params => fly.post('v2/order-group/view', params)
const orderGroupConfirmReceive = params => fly.post('v2/order-group/confirm-receive', params)
const orderGroupStatusNumList = params => fly.get('v2/order-group/status-num-list', qs.stringify(params))
//物流信息
const queryShipping = params => fly.get('v2/order-group/query-shipping', qs.stringify(params))
const shippingList = params => fly.get('v2/order-group/shipping-list', qs.stringify(params))

//提交订单
const orderGroupCreate = params => fly.post('v2/order-group/create', params)
const orderGroupCancel = params => fly.post('v2/order-group/cancel', params)
// 支付
const paymentHuifuApp = params => fly.post('v2/payment/huifu-app', params, {
  params: 'haveModel'
})
const orderGroupCheckStock = params => fly.get('/v2/order-group/check-stock', qs.stringify(params))
//支付成功
const orderGroupPayDone = params => fly.get('v2/order-group/pay-done', qs.stringify(params))

//商品
const goodsList = params => fly.get('v2/goods/list', qs.stringify(params))


//商品筛选
const goodsFilter = params => fly.get('v2/goods/goods-filter', qs.stringify(params))


//地址
const addressList = params => fly.get('v2/address/list', qs.stringify(params))
const addressUpdate = params => fly.post('v2/address/update', params)
const addressDelete = params => fly.post('v2/address/delete', params)
const addressCreate = params => fly.post('v2/address/create', params)
const addressDefault = params => fly.get('v2/address/default', qs.stringify(params))



//搜索页
const goodsHotKeywords = params => fly.get('v2/goods/hot-keywords', qs.stringify(params))
const goodsHistoryKeywords = params => fly.get('v2/goods/history-keywords', qs.stringify(params))
const goodsHistoryKeywordsDelete = params => fly.get('v2/goods/history-keywords-delete', qs.stringify(params))



//登录
const getreg = params => fly.post('v2/user/register', params);
const getshort = params => fly.post('v2/user/get-sms-check-no', params);
const getuser = params => fly.get('v2/user/info', params);
const autoLogin = params => fly.post('v2/user/login-with-code', params);
// 省份修改
const setprovince = params => fly.get('v2/user/change-province', params);

// 商品详情
const getshops = params => fly.get('v2/goods/view', qs.stringify(params));
const getprovinceID = params => fly.post('v2/goods/shipping-info', params);
const getremind = params => fly.post('v2/goods/set-arrival-reminder', params);
const getremovdremind = params => fly.get('v2/goods/set-arrival-reminder', qs.stringify(params));
const noremovdremind = params => fly.get('v2/goods/unset-arrival-reminder', qs.stringify(params));
const getremindlist = params => fly.get('v2/goods/remind-list', qs.stringify(params));

// 活动中心
const getactivityCenter = params => fly.get('v2/activity/index', qs.stringify(params));
const getactivityindex = params => fly.get('v2/activity/flash-sale', qs.stringify(params));
const getactivitygiftpkg = params => fly.get('v2/activity/gift-pkg ', qs.stringify(params));
const getactivityfullgift = params => fly.get('v2/activity/full-gift ', qs.stringify(params));
const getactivityfullcut = params => fly.get('v2/activity/full-cut', qs.stringify(params));
// 新活动页
const activityTravel = params => fly.get('v2/activity/travel', qs.stringify(params), {
  params: 'haveLoading'
})

// 选聘专辑
const getcolllist = params => fly.get('v2/coll/list', qs.stringify(params), {
  params: 'haveLoading'
});
const getcolldetail = params => fly.post('v2/coll/detail', params);
//优惠券
const couponCanTakeList = params => fly.get('v2/coupon/can-take-list', qs.stringify(params), {
  params: 'haveLoading'
})
const couponReceivedList = params => fly.get('v2/coupon/received-list', qs.stringify(params), {
  params: 'haveLoading'
})
const couponTake = params => fly.get('v2/coupon/take', qs.stringify(params))
const couponMatchCouponList = params => fly.post('v2/coupon/match-coupon-list', params)
//品牌
const brandView = params => fly.get('v2/brand/view', qs.stringify(params))
const brandLicense = params => fly.get('v2/brand/license', qs.stringify(params))
const brandIndex = params => fly.get('v2/brand/index', qs.stringify(params), {
  params: 'haveLoading'
})

// 聚划算
const getjuhuasuan = params => fly.get('v2/activity/juhuasuan', qs.stringify(params), {
  params: 'haveLoading'
});

//个人中心块
const userInfo = params => fly.get('v2/user/user-info', qs.stringify(params))
const changeUserInfo = params => fly.post('v2/user/change-user-info', params)
const userCheckIn = params => fly.get('v2/user/check-in', qs.stringify(params))
const userIsCheckIn = params => fly.get('v2/user/is-check-in', qs.stringify(params))
const goodsBoughtList = params => fly.get('v2/goods/bought-list', qs.stringify(params))
const userService = params => fly.get('v2/user/service', qs.stringify(params))
const blackCardAd = params => fly.get('/v2/user/ad-list', qs.stringify(params))
// 商品分类
const getclassifylist = params => fly.get('v2/category/list', qs.stringify(params), {
  params: 'haveLoading'
})
const getclassifydetails = params => fly.get('v2/category/view', qs.stringify(params))
const getbrand = params => fly.get('v2/brand/list', qs.stringify(params));
const categoryAllview = params => fly.get('v2/category/all-view', qs.stringify(params))



//vip
const vipIndex = params => fly.get('v2/vip/index', qs.stringify(params), {
  params: 'haveLoading'
})

const paramsUrl = params => fly.get(params)

//品类馆
const categoryGallery = params => fly.get('v2/category/gallery', qs.stringify(params), {
  params: 'haveLoading'
});
// 直发首页
const getZhiFaIndex = params => fly.get('v2/index/zhifa', qs.stringify(params), {
  params: 'haveLoading'
});
//榜单
const paihangIndex = params => fly.get('v2/paihang/index', qs.stringify(params), {
  params: 'haveLoading'
})
const paihangView = params => fly.get('v2/paihang/view', qs.stringify(params))

//首页
const index = params => fly.get('v2/index/index', qs.stringify(params), {
  params: 'haveLoading'
});
const indexAds = params => fly.get('v2/index/ads', qs.stringify(params))
// 认证审核
const getApplyInfo = params => fly.get('v2/user/get-apply-info', qs.stringify(params));
const setApplyInfo = params => fly.post('v2/user/set-apply-info', params);
const applyStatus = params => fly.get('v2/user/apply-status', qs.stringify(params));
// 凑单数据
const zhifaCoudan = params => fly.get('v2/cart/zhifa-coudan', qs.stringify(params), {
  params: 'haveLoading'
});
const fullcutCoudan = params => fly.get('v2/cart/fullcut-coudan', qs.stringify(params), {
  params: 'haveLoading'
});
const brandCoudan = params => fly.get('v2/cart/brand-coudan', qs.stringify(params), {
  params: 'haveLoading'
});
// 积分商城
const getExchangeIndex = params => fly.get('v2/exchange/index', qs.stringify(params), {
  params: 'haveLoading'
});
// 积分明细
const getExchangeDetail = params => fly.get('v2/exchange/detail', qs.stringify(params));
// 积分订单
const getExchangeOrderList = params => fly.get('v2/exchange/order-list', qs.stringify(params));
// 积分抽奖
const getExchangeDraw = params => fly.get('v2/exchange/draw', qs.stringify(params));
const getExchangeDrawRecord = params => fly.get('v2/exchange/draw-record', qs.stringify(params));
const exchangePrizeList = params => fly.get('v2/exchange/prize-list', qs.stringify(params));
// 最新中奖信息
const exchangeLastRecordList = params => fly.get('/v2/exchange/last-record-list', qs.stringify(params));
// 积分兑换规则
const articleContent = params => fly.get('v2/article/content', qs.stringify(params));

// 兑换商品
const exchangeBuy = params => fly.post('v2/exchange/buy', params);
// 邀请好友
const userInvite = params => fly.get('v2/user/invite', qs.stringify(params));
const userInviteAd = params => fly.get('/v2/user/invite-ad', qs.stringify(params));
//发现
const foundCategory = params => fly.get('v2/found/category', qs.stringify(params));
const foundIndex = params => fly.get('v2/found/index', qs.stringify(params), {
  params: 'haveLoading'
});
const foundUnread = params => fly.get('v2/found/unread', qs.stringify(params));
const foundRecord = params => fly.get('v2/found/record', qs.stringify(params));
const foundAll = params => fly.get('v2/found/all', qs.stringify(params), {
  params: 'haveLoading'
})
const foundContent = params => fly.get('v2/found/content', qs.stringify(params), {
  params: 'haveLoading'
})
const foundCollectList = params => fly.get('/v2/found/collect-list', qs.stringify(params), {
  params: 'haveLoading'
})

const foundAdviceList = params => fly.get('/v2/found/advice-list', qs.stringify(params), {
  params: 'haveLoading'
})

// 收藏动态
const foundCollect = params => fly.get('/v2/found/collect', qs.stringify(params), {
  params: 'haveLoading'
});
const foundCancleCollect = params => fly.get('/v2/found/cancle-collect', qs.stringify(params), {
  params: 'haveLoading'
})

// 秒杀页面
const activityFlashSaleNew = params => fly.get('v2/activity/flash-sale-new', qs.stringify(params), {
  params: 'haveLoading'
})

// 新品页面
const newBrandGoodsList = params => fly.get('v2/new-brand/goods-list', qs.stringify(params))
const newBrandIndex = params => fly.get('v2/new-brand/index', qs.stringify(params), {
  params: 'haveLoading'
})
const newBrandBrandList = params => fly.get('v2/new-brand/brand-list', qs.stringify(params))
const newBrandAliveList = params => fly.get('v2/new-brand/alive-list', qs.stringify(params))
const goodsSetNewReminder = params => fly.get('v2/goods/set-new-reminder', qs.stringify(params))
const goodsUnsetNewReminder = params => fly.get('v2/goods/unset-new-reminder', qs.stringify(params))
// 特惠专场
const actPage = params => fly.get('v2/act-page/view', qs.stringify(params), {
  params: 'haveLoading'
})

// 樱花季
const activitySakura = params => fly.get('v2/activity/sakura', qs.stringify(params), {
  params: 'haveLoading'
})
// 三周年满减/套餐聚合页
const activityThreeYearCut = params => fly.get('/v2/activity/three-year-gift', qs.stringify(params), {
  params: 'haveLoading'
})

//三周年活动
const activityThreeYear = params => fly.get('v2/activity/three-year', qs.stringify(params), {
  params: 'haveLoading'
})

//小美头条
const articleNotifyList = params => fly.get('v2/article/notify-list', qs.stringify(params), {
  params: 'haveLoading'
})
// 三周年满减/套餐聚合页
const activityTradeFair = params => fly.get('/v2/activity/trade-fair', qs.stringify(params), {
  params: 'haveLoading'
})
// 表白季
const activityExpress = params => fly.get('/v2/activity/express', qs.stringify(params), {
  params: 'haveLoading'
})
// 热销商品列表
const hotGoodsIndex = params => fly.get('/v2/hot-goods/index', qs.stringify(params), {
  params: 'haveLoading'
})
// 黑卡规则
const activityBlackCardRule = params => fly.get('/v2/activity/black-card-rule', qs.stringify(params), {
  params: 'haveLoading'
})
// 增加广告点击量
const xcxAdAddClick = params => fly.get('/v2/xcx-ad/add-click', qs.stringify(params), {
  params: 'haveLoading'
})
// 名品
const famousBrandCategoryList = params => fly.get('/v2/famous-brand/category-list', qs.stringify(params), {
  params: 'haveLoading'
})
const famousBrandIndex = params => fly.get('/v2/famous-brand/index', qs.stringify(params), {
  params: 'haveLoading'
})
const goodsCategoryList = params => fly.get('/v2/famous-brand-goods/index', qs.stringify(params), {
  params: 'haveLoading'
})
// 超级品牌
const superBrandIndex = params => fly.get('/v2/super-brand/index', qs.stringify(params), {
  params: 'haveLoading'
})
const superBrandHotList = params => fly.get('/v2/super-brand/hot-list', qs.stringify(params), {
  params: 'haveLoading'
})

//618年中活动
const midYearActivities = params => fly.get('v2/activity/brand-mobilize', qs.stringify(params), {
  params: 'haveLoading'
})
//团拼
const groupShoppingIndex = params => fly.get('v2/group-shopping/index', qs.stringify(params), {
  params: 'haveLoading'
})
const groupShoppingAdviceList = params => fly.get('/v2/group-shopping/advice-list', qs.stringify(params))
const groupShoppingHotList = params => fly.get('/v2/group-shopping/hot-list', qs.stringify(params), {
  params: 'haveLoading'
})
// 拼团详情
const groupShoppingView = params => fly.get('/v2/group-shopping/view', qs.stringify(params), {
  params: 'haveLoading'
})


const orderGroupCheckPayable = params => fly.get('/v2/order-group/check-payable', qs.stringify(params), {
  params: 'haveLoading'
})
// 保湿季
const activityMask = params => fly.get('v2/activity/mask', qs.stringify(params), {
  params: 'haveLoading'
})
const goodsGuessList = params => fly.get('v2/goods/guess-list', qs.stringify(params), {
  params: 'haveLoading'
})
const orderGroupLastOrder = params => fly.get('v2/order-group/last-order', qs.stringify(params), {
  params: 'haveLoading'
})
// 口令
const passwordCouponTakePrize = params => fly.post('/v2/password-coupon/take-prize', params);
const getActivityInfo = params => fly.get('/v2/password-coupon/get-activity-info', qs.stringify(params), {
  params: 'haveLoading'
})

// 活动单页面

const getActivityLevelb = params => fly.get('/v2/activity/level-b', qs.stringify(params), {
  params: 'haveLoading'
})

export default {
  getCartData,
  changeCartNum,
  deleteCartGoods,
  selectGoods,
  cancelSelectGoods,
  orderGroupGoods,
  allOrderList,
  orderDetail,
  goodsAdviceList,
  goodsFilter,
  goodsList,
  addressList,
  addressUpdate,
  addressDelete,
  addressDefault,
  getreg,
  getshort,
  getshops,
  addressDelete,
  addressCreate,
  goodsHotKeywords,
  goodsHistoryKeywords,
  goodsHistoryKeywordsDelete,
  getprovinceID,
  getremind,
  getremovdremind,
  noremovdremind,
  getremindlist,
  setadd,
  getuser,
  autoLogin,
  setprovince,
  orderGroupCreate,
  paymentHuifuApp,
  orderGroupPayDone,
  getactivityCenter,
  couponCanTakeList,
  couponReceivedList,
  couponTake,
  brandView,
  brandLicense,
  brandIndex,
  userInfo,
  changeUserInfo,
  couponMatchCouponList,
  getactivityCenter,
  getactivityindex,
  getactivitygiftpkg,
  getactivityfullgift,
  getactivityfullcut,
  getcolllist,
  getcolldetail,
  getjuhuasuan,
  getbrand,
  getclassifydetails,
  getclassifylist,
  orderGroupConfirmReceive,
  queryShipping,
  shippingList,
  paramsUrl,
  vipIndex,
  getZhiFaIndex,
  categoryGallery,
  paihangIndex,
  paihangView,
  index,
  indexAds,
  getApplyInfo,
  setApplyInfo,
  applyStatus,
  getAddCoudan,
  zhifaCoudan,
  fullcutCoudan,
  brandCoudan,
  getExchangeIndex,
  getExchangeDetail,
  getExchangeOrderList,
  exchangeBuy,
  getExchangeDraw,
  getExchangeDrawRecord,
  exchangePrizeList,
  orderGroupCancel,
  userCheckIn,
  userIsCheckIn,
  userInvite,
  foundIndex,
  foundCategory,
  goodsBoughtList,
  orderGroupStatusNumList,
  userService,
  activityFlashSaleNew,
  foundUnread,
  foundRecord,
  activityTravel,
  newBrandGoodsList,
  newBrandIndex,
  newBrandBrandList,
  newBrandAliveList,
  goodsSetNewReminder,
  goodsUnsetNewReminder,
  activityTravel,
  actPage,
  activitySakura,
  activityThreeYear,
  activityThreeYearCut,
  categoryAllview,
  articleNotifyList,
  foundAll,
  foundContent,
  orderGroupCheckStock,
  activityTradeFair,
  activityExpress,
  hotGoodsIndex,
  activityBlackCardRule,
  foundCollect,
  foundCancleCollect,
  foundCollectList,
  foundAdviceList,
  xcxAdAddClick,
  famousBrandCategoryList,
  famousBrandIndex,
  goodsCategoryList,
  exchangeLastRecordList,
  articleContent,
  superBrandIndex,
  superBrandHotList,
  midYearActivities,
  blackCardAd,
  userInviteAd,
  groupShoppingView,
  groupShoppingIndex,
  groupShoppingAdviceList,
  groupShoppingHotList,
  orderGroupCheckPayable,
  activityMask,
  goodsGuessList,
  orderGroupLastOrder,
  passwordCouponTakePrize,
  getActivityInfo,
  getActivityLevelb,
}