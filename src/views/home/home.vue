<template>
	<div class="app-init">
		<swiper :list="banner"></swiper>

		<!--热门三种按钮-->
		<div class="topFire_cont" v-show="detailFireSrc.length">
			<div v-for="(tf_src) in topFire_src" class="tf_cell">
				<section @click="open(tf_src.linkTo,tf_src.indexNo,tf_src.isOrder)">
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
					<div class="triangle_border_down">
					    <span></span>
					</div>
				</div>
				<!--店铺选择-->
				<div class="storeDetail" v-if="isShowAs2">
					<div class="sd-item" v-for="(sdItem,index) in menusStore" @click="selectMenu2(sdItem)" ><span :class="{'colorYellow':localAddr.localName == sdItem.storeName}">{{sdItem.storeName}}</span></div>
				</div>
			</div>
		</div>
		
		<div class="bodyCont scroll-box-y" v-show="detailFireSrc.length">

			<!--三种分类-->
			<div class="detailFire_cont">
				<div v-for="(detailFS,index) in detailFireSrc" class="df_cell">
					<div class="df_header">
						<x-img  v-lazy="detailFS.classLogo"  class="dfh_img"></x-img>
						<p class="dfh_title">{{detailFS.className}} ——</p>
					</div>
					<div class="df_body">
						<div v-for="(dfb_body) in detailFS.goods" class="dfb_item" >
							<x-img v-lazy="dfb_body.goodsPictureRound" class="dfb_img" @click.native="selectThisGoods(dfb_body)"></x-img>
							<p class="dfb_name">{{dfb_body.goodsName}}</p>
							<p class="dfb_price">${{dfb_body.goodsPrice}}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!--<!--地址选择localAddr-->
		<actionsheet v-model="isShowAs" :menus="menusAddr" @on-click-menu="selectMenu" show-cancel></actionsheet>

	</div>
</template>

<script>
	import VueDB from '../../util/vue-db/vue-db-long'
	import swiper from '../../components/swiper';
	import shopCarTool from "../../util/shop-car-tool/index.js";
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
				localLang: "zh",
				localAddr: {
					localPos: "../../../static/images/home/local_position2.png",
					localName: ""
				},
				isShowAs: false,
				isShowAs2: false,
				testUrl:false,
				menusAddr: {},
				menusStore:[], //店铺数据
				detailFSsrc:"../../../static/images/home/fire_icon.png",
				banner: [],
				topFire_src: [{
					src: "../../../static/images/home/tf_zhaopai.png",
					title: this.$t('home.topFire_src.title_djjx'),
					linkTo: "/classification",
					indexNo:"1"
				}, {
					src: "../../../static/images/home/tf_dianzhang.png",
					title: this.$t('home.topFire_src.title_zpty'),
					linkTo: "/classification",
					indexNo:"2"
				}, {
					src: "../../../static/images/home/tf_yuding.png",
					title: this.$t('home.topFire_src.title_ydxd'),
					linkTo: "/classification",
					indexNo:0,
					isOrder:"isOrder"
				}],
				//首页最热的三类的图标
				detailFireSrc:[],
			}
		},
		mounted: function() {
			this.shopCar = new shopCarTool(this.$store);
			//初始化获取本地语言
			this.initLocalLang();
			//初始化轮播图
//			this.initGetCarousel();
			//根据code获取并存储openId
			this.initOpenId();			
			//初始化店铺
			this.initGetStoreId();
			//初始化店铺数据
//			this.initStoreData();

		},
		methods: {
			//初试化start
			//根据code获取并存储openId
			initOpenId(){
				var strUrl = location.href.split('#')[0];
	//			console.log("url:"+ location.href);
				var resultCode = getUrlParam(strUrl, "code");
				var telUserNo = DB.getItem("telUserNo").toJson();
				console.log("telUserNo")
				console.log(DB.getItem("telUserNo").toJson())
				if (!telUserNo) {
				//code存在是wx端，不存在是pc端
				if (resultCode) {
					this.$http.get("/userLogin/weixin", {params:{
						code: resultCode,
						accessToken:DB.getItem("accessToken").toString(),
						openId:DB.getItem("weixinOpenid").toString()
					}}).then((res) => {
					console.log("/userLogin/weixin")
					console.log(res)
					if(res.status == 200){
						if(res.data.data && res.data.rspCode == "00000") {
							var weixinOpenid = res.data.data.weixinOpenid;
							var accessToken = res.data.data.accessToken;
							console.log(res.data.data)
							console.log(weixinOpenid)
							console.log(accessToken)
							DB.setItem("weixinOpenid",weixinOpenid);
							DB.setItem("accessToken",accessToken);
							DB.setItem("wxUserInfo",JSON.stringify(res.data.data));
							//获取手机号码用户编号
							this.findUserByWeixinOpenid();
						}else{
							if(DB.getItem("localLang").toString() == "en"){
								var ErrorMsg = res.data.usErrorMsg;
							}else{
								var ErrorMsg = res.data.cnErrorMsg;
							}
							this.$vux.toast.show({
										text: ErrorMsg,
										type: "text",
							})	
					} 						
					}
					}).catch((err) => {
						console.log(err)
					})				
				}else{
					console.log("no-code")
				}
				}
			},
			//获取电话用户编号
			findUserByWeixinOpenid(){
				this.$http.get("/userRegister/findUserByWeixinOpenid", {
					params: {
						weixinOpenid:DB.getItem("weixinOpenid").toString()
					}
				}).then((res) => {
					console.log(res)
					if(res.status == 200 && res.data.rspCode == "00000") {
						console.log("根据手机号码查找用户,确定用户已经存在了，存储userNo,telephone")
						console.log(res.data.data)
						if(res.data.data && res.data.data.telephone && res.data.data.userNo) {
							var telUserNo = {telephone:res.data.data.telephone,userNo:res.data.data.userNo}
							console.log(telUserNo)
							DB.setItem("telUserNo",telUserNo);
						}
						if(res.data.data && res.data.data.userNo) {
							DB.setItem("userNo",res.data.data.userNo);
						}						
					}
				}).catch((err) => {
					console.log(err)
				})			
				
			},
			
			//初始化获取本地语言
			initLocalLang() {
				if(!DB.getItem("localLang").toString()) {
					this.localLang = "zh";
//					DB.setItem("localLang",this.localLang);
					DB.setItem("localLang","en");
				} else {
					this.localLang = DB.getItem("localLang").toString() == "en" ? "zh" : "en";
				}
			},
			//初始化轮播
			initGetCarousel(){
				this.$http.get("/userLogin/getCarouselFigure",{
						params:{
						storeNo:DB.getItem("storeNo").toString(),
//						storeNo:"D00005",
						lang:"zh"
				}}).then((res) => {
						if(res.status == 200 && res.data.rspCode == "00000"){
							this.banner = res.data.data.data;
						}
					}).catch((err) => {
						console.log(err)
					})	
			},	
			
			//初始化店铺获取店铺编号
			initGetStoreId(){
				var _this = this;
					this.$http.get("/userLogin/storelist",{
						params:{
							lang:DB.getItem("localLang").toString()
						}
					}).then((res) => {
						if(res.status == 200 && res.data.rspCode == "00000"){
							//初始化上拉店铺
							if(DB.getItem("storeNo").toString()) {
								//有缓存过店铺编号，根据店铺编号去取
								res.data.data.data.forEach(function(item,index){
										if(item.storeNo == DB.getItem("storeNo").toString()){
											_this.localAddr.localName = item.storeName;
										}
									})								
							}else{
								//第一次进来没有缓存数据，1缓存storeNo ,2初始化选择框
								res.data.data.data.forEach(function(item,index){
									if(item.isDefault){
										DB.setItem("storeNo",item.storeNo);
										_this.localAddr.localName = item.storeName;
									}
								})
							}
								//初始化上拉店铺 ，缓存三个店铺数据
								this.menusStore = res.data.data.data;
								res.data.data.data.forEach(function(item,index){
									_this.menusAddr["storeName_"+item.storeNo]= item.storeName;
								})
								DB.setItem("storeList",JSON.stringify(res.data.data.data));
								//初始化店铺数据
								this.initStoreData();
								
								this.initGetCarousel();
						}
					}).catch((err) => {
						console.log(err)
					})	

			},
			
			selectAddr(){
//				this.isShowAs = true;
				this.isShowAs2 = !this.isShowAs2;
			},
			//切换店铺 存储店铺编号 更新选择框vux插件的
			selectMenu(key,val){
				console.log(key)
				if(key != "cancel"){
				var selectVal = key.split("_");
//				console.log(selectVal[1]);
				if(selectVal[1] != DB.getItem("storeNo").toString()){
					DB.setItem("storeNo",selectVal[1]);
					this.localAddr.localName = val;		
					//青春店铺缓存
					this.shopCar.removeAll();
					window.location.reload();
				}
				}
			},		
			//切换店铺 存储店铺编号 更新选择框自定义
			selectMenu2(key,val){
				console.log(key)
				var selectVal = key.storeNo;
//				console.log(selectVal[1]);
				if(selectVal != DB.getItem("storeNo").toString()){
					DB.setItem("storeNo",selectVal);
					this.localAddr.localName = val;		
					//青春店铺缓存
					this.shopCar.removeAll();
					window.location.reload();
				}
			},				
			//初试化店铺数据
			initStoreData(){
				var _this = this;
				this.$http.get("/userLogin/getClassGoods",{
					params:{
						storeNo:DB.getItem("storeNo").toString(),
						classType:1,
						lang:DB.getItem("localLang").toString()
					}
				}).then((res) => {
						console.log("/userLogin/getClassGoods")
						console.log(res)
						console.log(res.data.data.data)
						if(res.status == 200 && res.data.rspCode == "00000"){
							this.detailFireSrc = res.data.data.data;
						}
				}).catch((err) => {
					console.log(err)
				})				
			},
			//切换语言
			changeLang(item) {
				console.log(item);
				if(item == "zh") {
					this.localLang = "en";
					DB.setItem("localLang", "zh");
				} else {
					this.localLang = "zh";
					DB.setItem("localLang", "en");
				}
				this.shopCar.removeAll();
				window.location.reload();
			},
			//点击商品跳转到所有商品并弹出规格
			selectThisGoods(item){
				console.log(item)
				DB.setItem("selectThisGoods",JSON.stringify(item))
				this.$router.openPage("/classification");
			},
			//通用方法
			
			//初试化店铺数据end
			open(link,indexNo,isOrder) {
				console.log(link)
				console.log(indexNo)
				if (indexNo) {
					DB.setItem("judeFromHome",{indexNo:indexNo})
				}
				if (isOrder == "isOrder") {
					DB.setItem("isOrder","isOrder")
				}else{
					DB.setItem("isOrder","noOrder")
				}
				DB.setItem("selectThisGoods",JSON.stringify({}));
				this.$router.openPage(link);
			},
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
		top: 6rem;
		bottom: 1.43rem;
	}
	
	.topFire_cont {
		/*position: relative;*/
		.localLang {
			width: 0.44rem;
			height: 0.44rem;
			text-align: center;
			line-height: 0.44rem;
			position: absolute;
			top: 0.2rem;
			right: 0.2rem;
			background-color: #FDA544;
			font-size: 0.34rem;
			padding: .1rem;
			color: #FFF;
			border-radius: 50%;
			z-index: 999;
		}
		/*店铺切换*/
		.localAddr {
			line-height: 0.44rem;
			position: absolute;
			top: 0.2rem;
			left: 0.2rem;
			z-index: 999;
			word-break:keep-all;
			/*overflow: hidden;*/
			/*店铺选择框*/
			.addrCont {
				padding: 0.05rem 0.1rem;
				max-width: 6rem;
				background-color: #FFF;
				border: 1px solid #c5c5c5;
				line-height: 0.4rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.triangle_border_down{
					display: inline-block;
				    width:0;
				    height:0;
				    border-width:0.14rem 0.14rem 0;
				    margin-left: 0.04rem;
				    border-style:solid;
				    border-color:#FDA544 transparent transparent;/*灰 透明 透明 */
				    position:relative;
				    top: 0;
				}
				.triangle_border_down span{
				    display:block;
				    width:0;
				    height:0;
				    border-width:0.14px 0.14px 0;
				    border-style:solid;
				    border-color:#fc0 transparent transparent;/*黄 透明 透明 */
				    position:absolute;
				    top:0px;
				    left:0px;
				}
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
					max-width: 4rem;
				}
			}
		/*店铺下拉*/
		.storeDetail{
			position: absolute;
			top: 0.54rem;
			/*left: 0.2rem;*/			
			z-index: 999;
			font-size: 0.32rem;
			background-color: #fff;
			border: 1px solid #FDA544;
			.sd-item{
				.colorYellow{
					color: #FDA544;
				}
				padding:0.1rem 0.2rem;
				border-bottom: 1px solid #FDA544;
			}
			
		}			
			
		}
		/*店铺下拉*/
		.storeDetail{
			position: absolute;
			top: 0.54rem;
			left: 0rem;			
			z-index: 999;
			font-size: 0.32rem;
			background-color: #fff;
			border: 1px solid #FDA544;
			.sd-item{
				.colorYellow{
					color: #FDA544;
				}
				padding:0.1rem 0.2rem;
				border-bottom: 1px solid #FDA544;
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
						width: 1.6rem;
						height: 1.6rem;
						border-radius: 50%;
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