<template>
	<div class="classification">
		<div class="classification-header">
			<header-back :title="headTitle"></header-back>
		</div>
		<!--左右侧滑动商品-->
		<div class="warp-box" ref="boxCont">
			<swiper :list="banner"></swiper>
			<div class="classificationCont">
				<div class="left-menu absolute scroll-box-y" ref="left">
					<ul>
						<li class="item" v-for="(target,index) in dataItem" :class="{ 'active': index == active }" @click="jumpToTarget(index)" :key="index">{{target.className}}</li>
					</ul>
				</div>
				<div class="right-box absolute scroll-box-y" ref="rightView">
					<ul>
						<li class="item rightItemView" v-for="(target,index) in dataItem" :key="index">
							<p class="title">
								<span>{{target.className}}</span>
							</p>
							<div class="shop-item-wrap clear">
								<div class="shop-item" v-for="(goods,index) in target.goods"  :key="index">
									<x-img v-lazy="goods.goodsPictureRound" alt="" @click.native="showModel(goods)"></x-img>
									<x-img v-lazy="goodsSellOut" alt="" @click.native="showModel(goods)" class="sellOut" v-if="goods.goodsStock < 1"></x-img>
									
									<div class="shop-detail">
										<div class="shopd-title">{{goods.goodsName}}</div>
										<div class="shopd-detail">
											<div>{{goods.goodsIntroduction}}</div>
											<div>{{$t('classification.inventory')}} {{goods.goodsStock}}</div>
										</div>
										<div class="shopd-pAdd">
											<div class="shopdpa-price">${{goods.goodsPrice}}</div>
											<div class="shopdpa-add">
												<!--<x-icon type="ios-plus" class="cell-x-icon" @click="showGuiGe"></x-icon>-->
												<x-button class="shopdpa-select" @click.native="showGuiGe(goods)" mini v-if="goods.goodsStock > 0">{{seleStyle}}
													<badge class="guigeBadge" :text="goods.selGoodsNum" v-if="goods.selGoodsNum"></badge>
												</x-button>
												<x-button class="shopdpa-select disabled" mini v-else>{{seleStyle}}</x-button>												
												
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>

				</div>
			</div>
		</div>

		<!--底部结算按钮s-->
		<div class="classification-footer absolute">
			<div class="cf-left">
				<div class="cfl-cont" :class="{'hasGwcData' : !hasGwcData.hasGoodsData}" @click="gwcMask">
					<div class="iconfont icon-gouwuche ftl-gwc">
					</div>
					<div class="ftl-redPoint" v-if="gwcRedPoint">
						{{gwcRedPoint}}
					</div>
				</div>
			</div>
			<div class="cf-center" @click="gwcMask">
				{{hasGwcData.allGoodsPrice}}
			</div>
			<div class="cf-right" :class="{'hasGwcData' : !hasGwcData.hasGoodsData}" @click="toAccount('/closeAccount')">
				{{hasGwcData.allGoodsBtn}}
			</div>
		</div>
		<!--底部结算按钮e-->

		<!--购物车弹出层-->
		<div class="gouwuche absolute" :class="{'maskLeave':isMaskLeave}">
			<div class="gwc-mask" @click.self="gwcMask">
				<div class="gwc-cont absolute">
					<div class="gwc-clear">
						<span class="gwcc-yixuan">{{yixuanGoods}}</span>
						<span class="gwcc-qk" @click="clearGwc"><span class="delete iconfont icon-del"></span>{{emptyGwc}}</span>
					</div>
					<div class="gwc-detail">
						<div class="gwcd-item" v-for="(gwcItem,index) in gwcInitData" :key="index">
							<div class="gwcdi-left">
								<div class="gwcdil-top">{{gwcItem.goodsName}}</div>
								<div class="gwcdil-bottom"><span>{{gwcItem.iGAGAllGuige}}</span></div>
							</div>
							<div class="gwcdi-right">
								<div class="gwcdir-left">${{gwcItem.iGAGPrice}}</div>
								<div class="gwcdir-right">
									<x-icon type="ios-minus" class="cell-x-icon" @click.native="minusItemGoods(gwcItem.goodsItem)"></x-icon>
									<span>{{gwcItem.itemGuige.itemOneGuigeLen}}</span>
									<x-icon type="ios-plus" class="cell-x-icon" @click.native="addItemGoods(gwcItem.goodsItem)"></x-icon>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--购物车弹出层-->

		<!--选择规格弹出层-->
		<div class="goodsGuiGe">
			<x-dialog v-model="isShowGuiGe" hide-on-blur :dialog-style="{'width':'90%','max-width':'90%'}">
				<div class="guiGe-header">
					<div class="guiGeh-title">
						{{initGuiGeBottomSC.goodsItem.goodsName}}
						<div @click="isShowGuiGe=false" class="guiGeh-closeGuiGe">
							<x-icon type="ios-close-empty" size="38"></x-icon>
						</div>
					</div>

				</div>
				<div class="guiGe-cont">
					<div class="checkItemBox" v-for="(item,index) in initGuiGeBottomSC.goodsItem.allSelGuiGe" :key="index">
						<divider>{{item.guiGeBigName}}</divider>
						<checker v-model="initGuiGeBottomSC.initGuiGeSC[index]" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected" class="guiGe-checker" @on-change="changeChecker">
							<checker-item :value="theItem" v-for="(theItem,theIndex) in item.theGuiGeArr" :key="theIndex" class="guiGe-checkerItem">
								{{theItem.attrName}}
							</checker-item>
						</checker>
					</div>
				</div>

				<div class="guiGe-footer">
					<div class="guiGef-left">
						<span class="red guiGef-price">${{initGuiGeBottomSC.iGAGPrice}}</span>
						<span class="guiGef-guiGe">({{initGuiGeBottomSC.iGAGAllGuige}})</span>
					</div>
					<div class="guiGef-right">
						<x-button class="gr-btn" mini style="border-radius:44px;" action-type="button" @click.native="addItemGoods(initGuiGeBottomSC,initGuiGeBottomSC.iGAGAllGuige)" v-if="!hasTheGgInGwcLen">
							<div class="iconfont icon-gouwuche ftl-gwc">{{joinGwc}}</div>
						</x-button>
						<div class="gwcdir-right" v-if="hasTheGgInGwcLen">
							<x-icon type="ios-minus" class="cell-x-icon" @click.native="minusItemGoods(initGuiGeBottomSC,initGuiGeBottomSC.iGAGAllGuige)"></x-icon>
							<span>{{hasTheGgInGwcLen}}</span>
							<x-icon type="ios-plus" class="cell-x-icon" @click.native="addItemGoods(initGuiGeBottomSC,initGuiGeBottomSC.iGAGAllGuige)"></x-icon>
						</div>
					</div>
				</div>
			</x-dialog>
		</div>

		<!--选择规格弹出层-->
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import swiper from "../../components/swiper";
	import VueDB from "../../util/vue-db/vue-db-long.js";
	import shopCarTool from "../../util/shop-car-tool/index.js";
	import headerBack from "../../components/header-back";
	import { XImg, Divider } from "vux";
	import _ from 'lodash';
	import { setTimeout } from 'timers';

	var DB = new VueDB();

	export default {
		name: "classification",
		data() {
			return {
				msg: "",
				active: 0,
				headTitle: this.$t('classification.headTitle'), //所有商品
				seleStyle:this.$t('classification.seleStyle'), //选择规格
				yixuanGoods:this.$t('classification.yixuanGoods'), //已选规格
				emptyGwc:this.$t('classification.empltyGwc'), //清空
				joinGwc:this.$t('classification.addCart'), //加入购物车
				isMaskLeave: true,
				isShowGuiGe: false,
				offset: [],
				banner: [],
				dataItem: [],
				dataInitItem: [],
				dataItem22: [],
				gwcInitData: [],
				//初始化底部所选价格规格 //initGuiGeSC初始化每大类规格选中的，所选规格总规格、价格，这个商品
				initGuiGeBottomSC: {
					initGuiGeSC: [],
					iGAGAllGuige: "",
					iGAGPrice: 0,
					goodsItem: ""
				},
				pushGuige: "", //选中的规格
				hasGwcData: {
					hasGoodsData: true,
					allGoodsPrice: this.$t('classification.TheSecondItemHalfOff'),
					allGoodsBtn: this.$t('classification.PleaseSelectGoods')
				}, //购物车中是否有商品
				hasTheGgInGwc: false,
				hasTheGgInGwcLen: 0,
				goodsSellOut:"../../../static/images/home/sellOut.jpg"
			};
		},
		computed: {
			...mapGetters({
				gwcRedPoint: "getShopCarLength"
			})
		},
		mounted: function() {
			this.shopCar = new shopCarTool(this.$store);
			//初始化轮播图
			this.initGetCarousel();
			//初始化店铺数据
			this.initStoreData();

		},
		methods: {
			showModel() {
				console.log(123)
				console.log(this.shopCar.getAll())
			},
			//初始化轮播
			initGetCarousel() {
				this.$http.get("/userLogin/getCarouselFigure", {
					params: {
						storeNo: DB.getItem("storeNo").toString(),
						lang: "zh"
					}
				}).then((res) => {
					console.log("getCarouselFigure")
					console.log(res)
					if(res.status == 200 && res.data.rspCode == "00000") {
						this.banner = res.data.data.data;
					}
				}).catch((err) => {
					console.log(err)
				})

				
			},

			//初试化店铺数据
			initStoreData() {
				var _this = this;
				console.log(this.gwcRedPoint)
				this.$http.get("/userLogin/getClassGoods", {
					params: {
						storeNo: DB.getItem("storeNo").toString(),
						classType: 1,
						lang: DB.getItem("localLang").toString()
					}
				}).then((res) => {
					console.log("getClassGoods")
					console.log(res.data.data.data)
					if(res.status == 200 && res.data.rspCode == "00000") {
						//存储所有的规格数据
						console.log("allGoodsAttrs")
						console.log(res)
						console.log(JSON.stringify(res.data.data.data[0].goods[0].goodsAttrs))
						DB.setItem("allGoodsAttrs",JSON.stringify(res.data.data.data[0].goods[0].goodsAttrs));
						
						//合并购物车和初始化的数据
						console.log("//合并购物车和初始化的数据")
						this.dataInitItem = res.data.data.data;
						//初始化右侧菜单滚动 
						this.initScroll();
						// 初始化购物车
						this.initGwc();
						//是否是从首页过来的规格
						this.selectThisGoods();
					}
				}).catch((err) => {
					console.log(err)
				})
			},

			//根据缓存初始化购物车
			initGwc() {
				console.log("初始化购物车")
				this.gwcInitData = [];
				console.log(this.shopCar.getAll())
				var allShopCarData = this.shopCar.getAll();
				for(var itemKey in allShopCarData) {
					console.log("allShopCarData[itemKey]")
					console.log(allShopCarData[itemKey])
					for(var i = 0; i < allShopCarData[itemKey].itemGuige.length; i++) {
						var item = {};
						item.itemGuige = allShopCarData[itemKey].itemGuige[i];
						item.iGAGAllGuige = allShopCarData[itemKey].itemGuige[i].iGAGAllGuige;
						item.iGAGPrice = allShopCarData[itemKey].itemGuige[i].hasGuigePrice;
						item.goodsName = allShopCarData[itemKey].goodsName;
						item.goodsItem = {
							goodsItem: allShopCarData[itemKey].goodsItem,
							iGAGAllGuige: allShopCarData[itemKey].itemGuige[i].iGAGAllGuige,
							iGAGPrice: 0,
							initGuiGeSC: allShopCarData[itemKey].itemGuige[i].initGuiGeSC
						};
						item.goodsId = itemKey;
						this.gwcInitData.push(item)
					}
				}

				console.log("this.gwcInitData")
				console.log(this.gwcInitData)
				if(this.gwcInitData.length) {
					this.hasGwcData.hasGoodsData = true;
					var allGoodsPrice = 0;
					this.gwcInitData.forEach((item, index) => {
						console.log(item)
						allGoodsPrice += item.iGAGPrice * item.itemGuige.itemOneGuigeLen;
					})
					this.hasGwcData.allGoodsPrice = this.$t('classification.totalPrice') + "：" + "$" + allGoodsPrice;
					this.hasGwcData.allGoodsBtn = this.$t('classification.toSettleAccounts');
				} else {
					this.hasGwcData.hasGoodsData = false;
					this.hasGwcData.allGoodsBtn = this.$t('classification.PleaseSelectGoods');
					this.hasGwcData.allGoodsPrice = this.$t('classification.TheSecondItemHalfOff');
				}
				this.concatGwcInit();
			},

			// 左侧菜单跳转
			jumpToTarget(index) {
				this.$refs.rightView.scrollTop = this.offset[index];
				setTimeout(() => {
					this.active = index;
				}, 10)
			},
			// 初始化右侧菜单滚动 
			initScroll() {
				var initLeftRightScroll = {
					left: DB.getItemOnce("classification-left-scrollTop").toNumber(),
					right: DB.getItemOnce("classification-right-scrollTop").toNumber()
				};

				setTimeout(() => {
					this.offset.push(0);
					_.forEach(
						this.$refs.rightView.querySelectorAll(".rightItemView"),
						(value, key) => {
//							console.dir(value)
//							console.log(key)
							this.offset.push(this.offset[key] + value.offsetHeight);
//							this.offset.push(value.offsetHeight * key + (11 * key));
						}
					);
					var mySort = this.offset;

					//首页从哪个入口过来的
					var jfHomeNo = "jfHomeNo";
					if(DB.getItem("judeFromHome").toJson()) {
						jfHomeNo = DB.getItem("judeFromHome").toJson().indexNo;
						console.log(jfHomeNo)
						if(jfHomeNo) {
							this.$refs.rightView.scrollTop = this.offset[jfHomeNo - 1];
							this.active = jfHomeNo - 1;
							DB.removeItem("judeFromHome");
						}
					}

					//监听右侧滚动来设置左侧焦点状态
					this.$refs.rightView.addEventListener("scroll", e => {
						var rightScrollHeight = this.$refs.rightView.scrollTop;
						//        console.log(rightScrollHeight)
						if(10 < rightScrollHeight) {
							this.$refs.boxCont.scrollTop = 200;
						}
						for(let index = 0; index < mySort.length; index++) {
							let myRightItemHeight = mySort[index];
							if(rightScrollHeight > myRightItemHeight && jfHomeNo == "jfHomeNo") {
								this.active = index;
							}
						}
						jfHomeNo = "jfHomeNo";

					});

				}, 300);
			},

			//购物撤弹出框
			gwcMask() {
				console.log(this.hasGwcData.hasGoodsData)
				if(this.hasGwcData.hasGoodsData) {
					this.isMaskLeave = !this.isMaskLeave;
				} else {
					this.$vux.toast.show({
						text: this.$t("classification.PleaseSelectGoods"),
						type: "text",
					})
				}
			},
			
			//从首页带过来的规格
			selectThisGoods(){
				console.log("DB.getItem(selectThisGoods).toJson()")
				var selectThisGoods = DB.getItem("selectThisGoods").toJson();
				console.log(selectThisGoods);
				if(selectThisGoods.storeNo && selectThisGoods.goodsStock){
					this.showGuiGe(selectThisGoods);
				}
			},
			//显示规格
			showGuiGe(goodsItem) {
				console.log("showGuiGe")
				console.log(goodsItem);
				if(goodsItem.goodsAttrs.length) {
					//第一遍获取商品的所有规格种类
					var allSelGuiGeClass = [],
						allSelGuiGe = [],
						allSelGuiGeObj = {
							theGuiGeArr: []
						};
					goodsItem.goodsAttrs.forEach((item) => {
						if(allSelGuiGeClass.indexOf(item.attrType) == -1) {
							allSelGuiGeClass.push(item.attrType);
						}
					})
					//  		console.log(allSelGuiGeClass)
					//第二遍获取商品规格类整理的数组
					allSelGuiGeClass.forEach((item3) => {
						allSelGuiGeObj = {
							theGuiGeArr: []
						}
						goodsItem.goodsAttrs.forEach((item2) => {
							if(item2.attrType == item3) {
								if(item3 == 0) {
									var cupType = DB.getItem("localLang").toString() == "zh" ? "杯型" : "Cup Type";
									allSelGuiGeObj.guiGeBigName = cupType;
								} else if(item3 == 1) {
									var addaccessories = DB.getItem("localLang").toString() == "zh" ? "添加辅料" : "Add accessories";
									allSelGuiGeObj.guiGeBigName = addaccessories;
								} else if(item3 == 2) {
									var temperature = DB.getItem("localLang").toString() == "zh" ? "温度" : "temperature";
									allSelGuiGeObj.guiGeBigName = temperature;
								} else if(item3 == 3) {
									var sweetness = DB.getItem("localLang").toString() == "zh" ? "甜度" : "sweetness";
									allSelGuiGeObj.guiGeBigName = sweetness;
								}
								allSelGuiGeObj.theGuiGeArr.push(item2);
							}
						})
						allSelGuiGe.push(allSelGuiGeObj);
					})

					//初始化默认的规格
					this.initGuiGeBottomSC.initGuiGeSC = [];
					this.initGuiGeBottomSC.iGAGPrice = goodsItem.goodsPrice;
					this.initGuiGeBottomSC.iGAGAllGuige = "";
					allSelGuiGe.forEach((item4, index) => {
						this.initGuiGeBottomSC.initGuiGeSC.push(item4.theGuiGeArr[0]);
						this.initGuiGeBottomSC.iGAGPrice += item4.theGuiGeArr[0].attrPrice;
						this.initGuiGeBottomSC.iGAGAllGuige += item4.theGuiGeArr[0].attrName + "、";

					})
					this.initGuiGeBottomSC.iGAGAllGuige = this.initGuiGeBottomSC.iGAGAllGuige.slice(0, this.initGuiGeBottomSC.iGAGAllGuige.length - 1);
					this.initGuiGeBottomSC.goodsItem = goodsItem;

					goodsItem.allSelGuiGe = allSelGuiGe;
					this.isShowGuiGe = !this.isShowGuiGe;
					//  	this.pushGuige = this.initGuige;
					console.log("this.initGuiGeBottomSC")
					console.log(this.initGuiGeBottomSC)

					this.thisGuiGeIsInGwc(this.initGuiGeBottomSC.iGAGAllGuige, this.initGuiGeBottomSC.goodsItem.goodsId);
				}

			},
			//选择切换规格
			changeChecker(value) {
				//根据切换的规格设置底部的价格和总规格
				this.initGuiGeBottomSC.iGAGPrice = this.initGuiGeBottomSC.goodsItem.goodsPrice;

				var iGAGAllGuige = "";
				this.initGuiGeBottomSC.initGuiGeSC.forEach((item4) => {
					this.initGuiGeBottomSC.iGAGPrice += item4.attrPrice;
					iGAGAllGuige += item4.attrName + "、";
				})
				iGAGAllGuige = iGAGAllGuige.slice(0, iGAGAllGuige.length - 1);
				this.initGuiGeBottomSC.iGAGAllGuige = iGAGAllGuige;

				this.thisGuiGeIsInGwc(this.initGuiGeBottomSC.iGAGAllGuige, this.initGuiGeBottomSC.goodsItem.goodsId);

			},
			//这种规格是否再购物车中
			thisGuiGeIsInGwc(value, goodsId) {
				console.log("thisGuiGeIsInGwc")
				console.log(value)
				console.log(this.gwcInitData);
				this.hasTheGgInGwc = false;
				this.hasTheGgInGwcLen = 0;
				this.gwcInitData.forEach((item, index) => {
					console.log(item)
					console.log(item.goodsId)
					console.log(item.iGAGAllGuige)
					if(item.iGAGAllGuige == value && item.goodsId == goodsId) {
						this.hasTheGgInGwc = true;
						this.hasTheGgInGwcLen = item.itemGuige.itemOneGuigeLen;
					}

				})
				console.log(this.hasTheGgInGwcLen)

			},

			//清空购物车
			clearGwc() {
				console.log("清空购物车")
				this.isMaskLeave = !this.isMaskLeave;
				this.shopCar.removeAll();
				// 初始化购物车
				this.initGwc();
				this.concatGwcInit();
			},
			//购物车新增商品
			addItemGoods(item, fromGuige) {
				console.log("add")
				console.log(item)
				console.log(fromGuige)
				console.log(this.shopCar.getAll())
				this.shopCar.add(item);
				
				// 初始化购物车
				this.initGwc();
				if(fromGuige) {
					this.thisGuiGeIsInGwc(fromGuige, item.goodsItem.goodsId);
				}

			},
			//购物车删除商品
			minusItemGoods(item, fromGuige) {
				this.shopCar.minus(item);
				// 初始化购物车
				this.initGwc();

				if(fromGuige) {
					this.thisGuiGeIsInGwc(fromGuige, item.goodsItem.goodsId);
				} else {
					if(!this.gwcInitData.length) {
						this.isMaskLeave = !this.isMaskLeave;
					}
				}
			},
			//展示规格end
			open(link) {
				this.$router.openPage(link);
			},
			//去结算判断是否用户是注册
			toAccount() {
//				console.log("gwcRedPoint" + this.gwcRedPoint)
				if (this.gwcRedPoint) {
//				console.log(DB.getItem("telUserNo").toJson())
				//电话，用户编号都有去结算
				if(DB.getItem("telUserNo").toJson()) {
					this.$router.openPage("/closeAccount");
				} else {
					//电话，用户编号没有去注册
					this.$router.openPage("/register");
				}
				DB.setItem("selectThisGoods",JSON.stringify({}));
				}else{
					this.$vux.toast.show({
						text: this.$t("classification.PleaseSelectGoods"),
						type: "text",
					})					
				}
			},
			//绑定

			//重置数据
			concatGwcInit() {
				
				console.log(this.gwcInitData);
				console.log(this.dataInitItem);
				// 		this.dataItem = this.dataInitItem;
				//合并
				this.dataInitItem.forEach((item2, index2) => {
					item2.goods.map((item3, index3) => {
						item3.selGoodsNum = 0;
						this.gwcInitData.forEach((item, index) => {
							if(item.goodsId == item3.goodsId) {
								item3.selGoodsNum += item.itemGuige.itemOneGuigeLen;
							}
						})
					})
				})
				console.log("concatGwcInit")
				console.log(this.dataInitItem)
				this.dataItem = this.dataInitItem;

			}

		},
		components: {
			swiper,
			headerBack,
			XImg,
			Divider
		},
		beforeRouteLeave(to, from, next) {
			DB.setItem("classification-left-scrollTop", this.$refs.left.scrollTop);
			DB.setItem(
				"classification-right-scrollTop",
				this.$refs.rightView.scrollTop
			);
			next();
		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" type="text/scss">
@import "../../assets/scss/util";
.classification {
  background-color: #fff;
}
.headerImg {
  width: 100%;
  height: 3rem;
}
.warp-box {
  position: absolute;
  width: 100%;
  top: 1.2rem;
  left: 0px;
  bottom: $footerHeight;
  overflow-y: auto;
  .classificationCont {
    height: calc(100vh - 2.6rem);
    position: absolute;
    width: 100%;
    top: 4rem;
    left: 0px;
    bottom: 0rem;
    .left-menu {
      width: getIphoneWidth(170px);
      left: 0px;
      top: 0px;
      bottom: 0px;
      overflow-x: hidden;
      @include box-sizing;
      background-color: #efefef;
      ul {
        padding-bottom: 0.44rem;
      }
      li.item {
        text-align: center;
        -webkit-transition: all 0.1s ease;
        transition: all 0.1s ease;
        padding: 0 0.1rem 0 0.1rem;
        @include box-sizing;
        font-size: 0.34rem;
        height: 1.2rem;
        line-height: 1.6rem;
      }
      li.item.active {
        color: #fda544;
        transform: scale(1.05);
      }
    }
    .right-box {
      background-color: #fcfcfc;
      left: getIphoneWidth(170px);
      padding-left: getIphoneWidth(10px);
      top: 0;
      right: 0px;
      bottom: 0px;
      overflow-x: hidden;
      .item {
        padding-top: 0.4rem;
        .title {
          text-align: center;
          padding-bottom: 0.2rem;
        }
        span {
          position: relative;
          display: inline-block;
        }
        &:after,
        &:before {
          display: inline-block;
          width: getIphoneWidth(34px);
          height: 1px;
          top: 50%;
          background-color: #e0e0e0;
          position: absolute;
          content: "";
        }
        &:after {
          left: getIphoneWidth(-50px);
        }
        &:before {
          right: getIphoneWidth(-50px);
        }
      }
      .shop-item-wrap .shop-item {
        text-align: left;
        /*float: left;*/
        color: #757575;
        margin-bottom: 0.3rem;
        @include f12px;
        position: relative;
        img {
          width: getIphoneWidth(140px);
          height: getIphoneWidth(140px);
          padding-bottom: 0.1rem;
        }
        .sellOut{
        	position: absolute;
        	top: 0;
        	left: 0;
          width: getIphoneWidth(140px);
          height: getIphoneWidth(140px);
          opacity: 0.5;
        }
        .shop-detail {
          display: inline-block;
          width: calc(100% - 2.4rem);
          .shopd-title {
            @include f14px;
            font-weight: 600;
            vertical-align: top;
          }
          .shopd-detail {
            div {
              font-size: 0.26rem;
            }
          }
        }
        .shopd-pAdd {
          display: flex;
          .shopdpa-price {
            flex: 1;
          }
          .shopdpa-add {
            flex: 1;
            text-align: right;
            padding-right: 0.4rem;
            .shopdpa-select{
            	font-size: 0.26rem;
            	overflow: visible;
            	position: relative;
            	padding: 0 1em;
            	background-color:#FDA544;
            	.guigeBadge{
            		position: absolute;
            		top: -0.1rem;
            		right: -0.1rem;
            		font-size: 0.22rem;
            	}
            }
            .disabled{
            	background-color:#767676;
            	color: #FFF;
            }
          }
          .cell-x-icon {
            fill: #FDA544;
          }
        }
      }
    }
  }
}
.classification-footer {
  left: 0;
  right: 0px;
  bottom: 0px;
  top: calc(100vh - 1.4rem);
  height: $footerHeight;
  display: flex;
  z-index: 999;
  .cf-left {
    flex: 1;
    background-color: rgb(80, 80, 83);
    display: flex;
    justify-content: center;
    align-items: center;
    .cfl-cont {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 50%;
      background-color: #FDA544;
      text-align: center;
      position: relative;
      top: -0.4rem;
      .ftl-gwc {
        line-height: 1.2rem;
        font-size: 0.6rem;
        color: #fff;
      }
      .ftl-redPoint {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 0.4rem;
        font-size: 0.3rem;
        color: #fff;
        background-color: #ff0000;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .hasGwcData{
      		background-color: #767676;
      }
  }
  .cf-center {
    flex: 3;
    background-color:  #4F4F4F;
    color: #fff;
    line-height: $footerHeight;
  }
  .cf-right {
    flex: 1.5;
    background-color: #FDA544;
    color: #fff;
    text-align: center;
    line-height: $footerHeight;
  }
  .hasGwcData{
  	background-color: #4F4F4F;
  }
}
.gouwuche {
  display: inline-block;
  top: 0;
  left: 0;
  bottom: calc(100vh - 1.4rem);
  width: 100%;
  height: calc(100vh - 1.4rem);
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  transform: translateY(0);
  z-index: 888;
  .gwc-mask {
    width: 100%;
    height: 100%;
    /*background-color: rgba(33,33,33,0.6);*/
    background-color: transparent;
    .gwc-cont {
      width: 100%;
      min-height: 2rem;
      max-height: 10rem;
      overflow-y: scroll;
      background-color: #efefef;
      bottom: 0;
      z-index: 333;
      .gwc-clear {
        height: 0.8rem;
        background-color: #e8e8e8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.4rem;
      }
      .gwc-detail {
        .gwcd-item {
          height: 1.2rem;
          display: flex;
          align-items: center;
          padding: 0 0.4rem;
          border-bottom: 1px solid #bbb;
          .gwcdi-left {
            flex: 1;
            .gwcdil-top {
              font-size: 0.34rem;
              font-weight: 600;
            }
            .gwcdil-bottom {
              font-size: 0.26rem;
              span:after{
              	content: "/";
              }
              span:nth-last-of-type(1):after{
              	content: "";
              }
            }
          }
          .gwcdi-right {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .gwcdir-left {
              color: #fda544;
            }
            .gwcdir-right {
              display: flex;
              align-items: center;
              fill: #FDA544;
              span {
                padding: 0 0.2rem;
              }
            }
          }
        }
      }
    }
  }
}
.maskLeave {
  transform: translateY(100vh);
}
// 选择规格start
.goodsGuiGe{
  .guiGe-header{
      text-align: center;
      line-height: 1rem;
      position: relative;
      .guiGeh-closeGuiGe{
        float:right;
        position: absolute;
        top: 0;
        right: 0;
      }
  }
  .guiGe-cont{
    max-height: 8rem;
    height: 8rem;
    overflow-y:scroll; 
    border: 1px solid #BBB;
    display: flex;
    flex-direction: column;
    .checkItemBox{
    .demo1-item {
		  border: 1px solid #ececec;
		  padding: 5px 15px;
		}
	.guiGe-checker{
		.guiGe-checkerItem{
			margin: 0 0.3rem 0.1rem;
			float: left;
		}
		}
	.demo1-item-selected {
	  border: 1px solid #FDA544;
	  color: #FDA544;
	}
	}
  }
  .guiGe-footer{
    height: 1.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem;
    .guiGef-left{
      .guiGef-price{
        font-size: 0.54rem;
      }
      .guiGef-guiGe{
      	display: inline-block;
        font-size: 0.3rem;
        max-width: 4rem;
        overflow: hidden;
        text-align: left;
        vertical-align: middle;
      }
    }
    .guiGef-right{
    	  .gr-btn{
    	  	background-color: #FDA544;
    	  }
          .gwcdir-right {
		      display: flex;
		      align-items: center;
		      fill: #FDA544;
		      span {
		        padding: 0 0.2rem;
		      }
		    }    	
    }
  }
}
</style>