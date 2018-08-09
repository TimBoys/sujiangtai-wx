<template>
	<div class="app-init">
		<swiper :list="banner"></swiper>

		<!--热门三种按钮-->
		<div class="topFire_cont">
			<div v-for="(tf_src) in topFire_src" class="tf_cell">
				<section @click="open(tf_src.linkTo)">
					<x-img v-lazy="tf_src.src" :web-src="`${tf_src.src}?type=webp`" class="tf_img"></x-img>
					<div class="tf_title">{{tf_src.title}}</div>
				</section>
			</div>
			<!--切换中英-->
			<div class="localLang" @click="changeLang(localLang)">
				{{localLang}}
			</div>
			<!--切换地址-->
			<div class="localAddr">
				<div class="addrCont" @click="selectAddr">
					<x-img v-lazy="localAddr.localPos" class="localPos"></x-img>
					<div>{{localAddr.localName}}</div>
				</div>
			</div>
		</div>
		<div class="bodyCont scroll-box-y">

			<!--三种分类-->
			<div class="detailFire_cont" v-show="detailFireSrc.length">
				<div v-for="(detailFS,index) in detailFireSrc" class="df_cell">
					<div class="df_header">
						<x-img  v-lazy="detailFS.detailFireIcon"  class="dfh_img"></x-img>
						<p class="dfh_title">{{detailFS.className}}——</p>
					</div>
					<div class="df_body">
						<div v-for="(dfb_body) in detailFS.goods" class="dfb_item" >
							<x-img v-lazy="dfb_body.goodsPictureRound" class="dfb_img" @click="showModelCode"></x-img>
							<p class="dfb_name">{{dfb_body.goodsName}}</p>
							<p class="dfb_price">${{dfb_body.goodsPrice}}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!--<!--地址选择localAddr-->
		<actionsheet v-model="isShowAs" :menus="menusAddr" @on-click-menu="selectMenu" show-cancel></actionsheet>
		<actionsheet v-model="testUrl" :menus="testUrlData" show-cancel></actionsheet>

	</div>
</template>

<script>
	import VueDB from '../../util/vue-db/vue-db-long'
	import swiper from '../../components/swiper';
	import { XImg, Flexbox, FlexboxItem, Actionsheet  } from 'vux';

	var DB = new VueDB();

	//获取微信第一次登录参数 
	function getUrlParam(sHref, sArgName) {
		var args = sHref.split("?");
		var retval = "";
		if(args[0] == sHref) /*参数为空*/ {
			return retval; /*无需做任何处理*/
		}
		var str = args[1];
		args = str.split("&");
		for(var i = 0; i < args.length; i++) {
			str = args[i];
			var arg = str.split("=");
			if(arg.length <= 1) continue;
			if(arg[0] == sArgName) retval = arg[1];
		}
		//        console.log(retval)
		return retval;
	}

	export default {
		name: "home",
		data() {
			return {
				home: "home",
				localLang: "en",
				localAddr: {
					localPos: "../../../static/images/home/local_position.png",
					localName: "Whiterock BC"
				},
				isShowAs: false,
				testUrl:false,
				menusAddr: {
					menu1: "White rock",
					menu2: "Downtown"
				},
				testUrlData:{
					menu1:"123",
					menu2:"123",
				},
				detailFSsrc:"../../../static/images/home/fire_icon.png",
				
				banner: [],

				topFire_src: [{
					src: "../../../static/images/home/tf_zhaopai.png",
					title: this.$t('home.topFire_src.title_djjx'),
					linkTo: "/classification"
				}, {
					src: "../../../static/images/home/tf_dianzhang.png",
					title: this.$t('home.topFire_src.title_zpty'),
					linkTo: "/classification"
				}, {
					src: "../../../static/images/home/tf_yuding.png",
					title: this.$t('home.topFire_src.title_ydxd'),
					linkTo: "/classification"
				}],
				//首页最热的三类的图标
				detailFire_icon:["../../../static/images/home/fire_icon.png","../../../static/images/home/zan_icon.png","../../../static/images/home/crown_icon.png"],
				detailFireSrc:[],
			}
		},
		mounted: function() {
			//初始化获取本地语言
			this.initLocalLang();
			//初始化轮播图
			this.initGetCarousel();
			//根据code获取并存储openId
//			this.initOpenId();			
			//初始化店铺
//			this.initGetStoreId();
			//初始化店铺数据
			this.initStoreData();

		},
		methods: {
			//初试化start
			//根据code获取并存储openId
			initOpenId(){
			var strUrl = location.href.split('#')[0];
			console.log("url:"+ location.href);
			var resultCode = getUrlParam(strUrl, "code");
			console.log(resultCode);
			//code存在是wx端，不存在是pc端
			if (resultCode) {
				this.$http.get("/userInfoLogin", {params:{
					code: resultCode
				}}).then((res) => {
					console.log(res)
					var weixinOpenid = "";
					DB.setItem("weixinOpenid",weixinOpenid);
				}).catch((err) => {
					console.log(err)
				})				
			}else{
				console.log("no-code")
			}
			},
			//初始化获取本地语言
			initLocalLang() {
				if(!DB.getItem("localLang").toString()) {
					this.localLang = "en";
					DB.setItem("localLang",this.localLang);
				} else {
					this.localLang = DB.getItem("localLang").toString();
				}
			},
			//初始化轮播
			initGetCarousel(){
					console.log("/userLogin/queryCarouselFigure")
				this.$http.post("/queryCarouselFigureNation",{
//						storeNo:DB.getItem("storeId").toString(),
						storeNo:"D00005",
						lang:"zh"
				}).then((res) => {
					console.log(res)
						if(res.status == 200 && res.data.rspCode == "00000"){
							console.log(res.data.data)
							this.banner = res.data.data;
						}
					}).catch((err) => {
						console.log(err)
					})	
			},			
			//初始化店铺获取店铺id
			initGetStoreId(){
				if(!DB.getItem("storeId").toString()) {
					var storeId = null;
					console.log("/userLogin/storelist")
					this.$http.get("/userLogin/storelist").then((res) => {
						if(res.status == 200 && res.data.rspCode == "00000"){
							console.log(res.data.data.data)
						}
					}).catch((err) => {
						console.log(err)
					})	
					DB.setItem(storeId);
				} else {
					DB.getItem("storeId").toString();
				}
			},
			//初试化店铺数据
			initStoreData(){
				var _this = this;
				this.$http.get("/userLogin/getClassGoods",{
					params:{
//						storeNo:DB.getItem("storeId").toString(),
						storeNo:"D00005",
						classType:1,
						lang:DB.getItem("localLang").toString() == "zh" ? "zh" : "en"
					}
				}).then((res) => {
						if(res.status == 200 && res.data.rspCode == "00000"){
							console.log(res.data.data.data)
							this.detailFireSrc = res.data.data.data;
							this.detailFireSrc.map(function(item,index){
								item.detailFireIcon = _this.detailFire_icon[index]
							})
//							console.log(this.detailFireSrc)							
						}
				}).catch((err) => {
					console.log(err)
				})				
				
			},
			//初试化店铺数据end
			open(link) {
				console.log(link)
				this.$router.openPage(link);
			},
			changeLang(item) {
				console.log(item);
				if(item == "zh") {
					this.localLang = "en";
				} else {
					this.localLang = "zh";
				}
				DB.setItem("localLang", this.localLang);
				window.location.reload();
			},
			selectAddr(){
				this.isShowAs = true;
			},
			showModelCode(){
				var strUrl = location.href.split('#')[0];
				//			console.log(strUrl)
				var resultCode = getUrlParam(strUrl, "code");
				//			console.log(resultCode)

			
				this.testUrlData.menu1 = location.href;
				this.testUrlData.menu2 = resultCode;
				
				this.testUrl = true;
				
			},
			selectMenu(key){
				console.log(key)
				//接口api   getStorCustOrderInfoVoeList   获取所有店铺LIST  queryStores
			}
		},
		components: {
			swiper,
			XImg,
			Flexbox,
			FlexboxItem,
			Actionsheet
		}

	}
</script>

<style scoped="scoped" lang="scss">
	@import "../../assets/scss/util";
	.bodyCont {
		position: absolute;
		width: 100%;
		left: 0;
		background-color: #fff;
		top: 5rem;
		bottom: 1.43rem;
	}
	
	.topFire_cont {
		position: relative;
		.localLang {
			width: 0.44rem;
			height: 0.44rem;
			text-align: center;
			line-height: 0.44rem;
			position: absolute;
			top: -2.8rem;
			right: 0.2rem;
			background-color: rgb(19, 194, 67);
			font-size: 0.34rem;
			padding: .1rem;
			color: #FFF;
			border-radius: 50%;
			z-index: 999;
		}
		.localAddr {
			line-height: 0.44rem;
			position: absolute;
			top: -2.8rem;
			left: 0.2rem;
			z-index: 999;
			word-break: keep-all;
			overflow: hidden;
			.addrCont {
				padding: 0.05rem 0.1rem;
				max-width: 4rem;
				background-color: #FFF;
				border: 1px solid #c5c5c5;
				line-height: 0.4rem;
				.localPos {
					width: 0.4rem;
					height: 0.4rem;
					display: inline-block;
				}
				div {
					display: inline-block;
					font-size: 0.3rem;
					color: #FDA544;
					overflow: hidden;
					text-overflow: ellipsis;
					max-width: 3rem;
				}
			}
		}
		.tf_cell {
			width: calc(100% / 3);
			height: 100%;
			display: inline-block;
			font-size: 0.34rem;
			section {
				width: 100%;
				height: 2rem;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #000000;
				.tf_img {
					width: 1.2rem;
					height: 1rem;
					margin-bottom: .1rem;
				}
			}
		}
	}
	
	.detailFire_cont {
		.df_cell {
			background-color: $bodyBackgroundColor;
			.df_header {
				height: 1rem;
				padding-left: .4rem;
				display: flex;
				align-items: center;
				.dfh_img {
					width: .6rem;
					height: .6rem;
				}
				.dfh_title {
					display: inline-block;
					padding-left: .1rem;
					font-size: .4rem;
					color: rgb(254, 122, 16);
				}
			}
			.df_body {
				display: flex;
				flex-wrap: wrap;
				.dfb_item {
					width: calc(100% / 3);
					display: inline-block;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: #FDA544;
					padding: 0.2rem;
					@include box-sizing;
					.dfb_img {
						width: 2rem;
						height: 1.2rem;
						border-radius: 1.2rem;
						padding-bottom: 0.1rem;
					}
					.dfb_name,
					.dfb_price {
						font-size: 0.3rem;
					}
				}
			}
		}
	}
	/*.footer{
		position: absolute;
		z-index: 400;
		bottom: 0;
	}*/
</style>