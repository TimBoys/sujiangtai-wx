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
				<li class="item" v-for="(target,index) in dataItem" :key="index">
				<p class="title">
					<span>{{target.className}}</span>
				</p>
				<div class="shop-item-wrap clear">
					<div class="shop-item" v-for="(goods,index) in target.goods" @click="showModel(goods)" :key="index">
                			<x-img v-lazy="goods.goodsPictureRound" alt=""></x-img>
                			<div class="shop-detail">
                				<div class="shopd-title">{{goods.goodsName}}</div>
                				<div class="shopd-detail">
                					<div>{{goods.goodsIntroduction}}</div>
                					<div>库存{{goods.goodsStock}}</div>
                				</div>
                				<div class="shopd-pAdd">
                					<div class="shopdpa-price">${{goods.goodsPrice}}</div>
                					<div class="shopdpa-add">
                						 <!--<x-icon type="ios-plus" class="cell-x-icon" @click="showGuiGe"></x-icon>-->
                						 <x-button class="shopdpa-select" @click.native="showGuiGe(goods)" type="primary" mini>选择规格<span>1</span></x-button>
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
			<div class="cfl-cont" @click="gwcMask">
				<div class="iconfont icon-gouwuche ftl-gwc">
			</div>
				<div class="ftl-redPoint" v-if="gwcRedPoint">
					{{gwcRedPoint}}
				</div>
			</div>
		</div>
				<div class="cf-center" @click="gwcMask">
			总价:$33.00
		</div>
				<div class="cf-right" @click="toAccount('/closeAccount')">
			去结算
		</div>
	</div>
	<!--底部结算按钮e-->
	
	<!--购物车弹出层-->
	<div class="gouwuche absolute" :class="{'maskLeave':isMaskLeave}">
		<div class="gwc-mask"  @click.self="gwcMask">
			<div class="gwc-cont absolute">
				<div class="gwc-clear">
					<span class="gwcc-yixuan">已选商品</span>
					<span class="gwcc-qk" @click="clearGwc"><span class="delete iconfont icon-del"></span>清空</span>
				</div>
				<div class="gwc-detail">
					<div class="gwcd-item" v-for="(gwcItem,index) in gwcData2" :key="index">
						<div class="gwcdi-left">
							<div class="gwcdil-top">{{gwcItem.name}}</div>
							<div class="gwcdil-bottom"><span v-for="(ggItem,index) in gwcItem.itemGuige.itemOneGuige">{{ggItem.value}}</span></div>
						</div>
						<div class="gwcdi-right">
							<div class="gwcdir-left">{{gwcItem.id}}</div>
							<div class="gwcdir-right">
								 <x-icon type="ios-minus" class="cell-x-icon" @click.native="minusItemGoods(gwcItem)"></x-icon>
								 <span>{{gwcItem.itemGuige.itemOneGuigeLen}}</span>
								 <x-icon type="ios-plus" class="cell-x-icon" @click.native="addItemGoods(gwcItem)"></x-icon>
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
					素匠泰茶
	     		<div @click="isShowGuiGe=false" class="guiGeh-closeGuiGe">
	          		<x-icon type="ios-close-empty" size="38"></x-icon>
	        	</div>
				</div>
				
			</div>
			<div class="guiGe-cont">
			  <div class="checkItemBox" v-for="(item,index) in initGuiGeBottomSC.goodsItem .allSelGuiGe" :key="index">
              	<divider>{{item.guiGeBigName}}</divider>
                 <checker v-model="initGuiGeBottomSC.initGuiGeSC[index]" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected" class="guiGe-checker" @on-change="changeChecker">
                      <checker-item :value="theItem"  v-for="(theItem,theIndex) in item.theGuiGeArr" :key="theIndex" class="guiGe-checkerItem">
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
					<x-button type="primary" mini style="border-radius:44px;" action-type="button" @click.native="pushShopCart">
						<div class="iconfont icon-gouwuche ftl-gwc">加入购物车</div>
					</x-button>
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
import { XImg,Divider } from "vux";
import _ from 'lodash';
import { setTimeout } from 'timers';

var DB = new VueDB();

export default {
  name: "classification",
  data() {
    return {
      msg: "",
      active: 0,
      headTitle: "所有商品",
      isMaskLeave: true,
      isShowGuiGe:false,
      offset: [],
      imgSrc: "../../../static/images/home/testImg1.jpg",
//    gwcRedPoint:null,
      banner: [],
      dataItem:[],
      dataItem22:[],
      gwcData2: [],
      guiGeDemo1: {key: '1-1', value: '标准'},
      guiGeDemo2: {key: '2-1', value: '常温'},
      guiGeDemo3: {key: '3-1', value: '半糖'},
      initGuige:[{key: '1-1', value: '标准'},{key: '2-1', value: '常温'},{key: '3-1', value: '半糖'}],
      items1: [{
        key: '1-1',
        value: '标准'
      }, {
        key: '1-2',
        value: '奶沫'
      }, {
        key: '1-3',
        value: '奶泡'
      }],
      items2: [{
        key: '2-1',
        value: '常温'
      }, {
        key: '2-2',
        value: '温热'
      }, {
        key: '2-3',
        value: '去冰'
      }, {
        key: '2-4',
        value: '少冰'
      }, {
        key: '2-5',
        value: '多冰'
      }],
      items3: [{
        key: '3-1',
        value: '半糖'
      }, {
        key: '3-2',
        value: '无糖'
      }, {
        key: '3-3',
        value: '多糖'
      }],
      //初始化底部所选价格规格 //initGuiGeSC初始化每大类规格选中的，所选规格总规格、价格，这个商品
      initGuiGeBottomSC:{initGuiGeSC:[],iGAGAllGuige:"",iGAGPrice:0,goodsItem:""}, 
      pushGuige:"", //选中的规格
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

    // 初始化购物车
    this.initGwc();
  },
  methods: {
    showModel() {

    },
	//初始化轮播
	initGetCarousel(){
		this.$http.get("/userLogin/getCarouselFigure",{
				params:{
				storeNo:DB.getItem("storeNo").toString(),
				lang:"zh"
		}}).then((res) => {
				if(res.status == 200 && res.data.rspCode == "00000"){
					this.banner = res.data.data.data;
				}
			}).catch((err) => {
				console.log(err)
			})	
	},	
	
	//初试化店铺数据
	initStoreData(){
		var _this = this;
		console.log(this.gwcRedPoint)
		this.$http.get("/userLogin/getClassGoods",{
			params:{
				storeNo:DB.getItem("storeNo").toString(),
				classType:1,
				lang:DB.getItem("localLang").toString()
			}
		}).then((res) => {
			console.log(res.data.data.data)
			if(res.status == 200 && res.data.rspCode == "00000"){
				//合并购物车和初始化的数据
				this.concatGwcInit(res.data.data.data);
//				//初始化右侧菜单滚动 
    			this.initScroll();
			}
		}).catch((err) => {
			console.log(err)
		})	
	},
	
    //根据缓存初始化购物车
    initGwc(){
//  	console.log("初始化购物车")
//  	this.gwcData2 = [];	
////  	console.log(this.shopCar.getAll())
//  	var allShopCarData = this.shopCar.getAll();
//		for (var itemKey in allShopCarData) {
////			console.log("allShopCarData[itemKey]")
////			console.log(allShopCarData[itemKey])
//				for (var i =0;i<allShopCarData[itemKey].itemGuige.length;i++) {
//					var item = {};
//					item.itemGuige = allShopCarData[itemKey].itemGuige[i];
//					item.id = allShopCarData[itemKey].id;
//					item.name = allShopCarData[itemKey].name;
//					
//					this.gwcData2.push(item)
//				}
//
//		}
//		console.log("this.gwcData2")
//		console.log(this.gwcData2)
//		console.log(this.initGuiGeBottomSC)
		
    },
   
   // 左侧菜单跳转
    jumpToTarget(index) {
		this.$refs.rightView.scrollTop = this.offset[index] ;
		console.log(this.$refs.rightView.scrollTop)
		setTimeout(()=>{
			this.active = index;
		},10)
  },
    // 初始化右侧菜单滚动 
    initScroll() {
      var initLeftRightScroll = {
        left: DB.getItemOnce("classification-left-scrollTop").toNumber(),
        right: DB.getItemOnce("classification-right-scrollTop").toNumber()
      };

      setTimeout(() => {
        _.forEach(
		  this.$refs.rightView.querySelectorAll(".right-box>ul>.item"),
          (value, key) => {
		    // console.dir(value.offsetHeight)
            this.offset.push(value.offsetHeight * key + (11*key));
          }
        );
        var mySort = this.offset;
        
        //首页从哪个入口过来的
		var jfHomeNo = "jfHomeNo";
		if(DB.getItem("judeFromHome").toJson()){
			jfHomeNo = DB.getItem("judeFromHome").toJson().indexNo;
			console.log(jfHomeNo)
	        if (jfHomeNo) {
	        	this.$refs.rightView.scrollTop = this.offset[jfHomeNo - 1];
	        	this.active = jfHomeNo - 1;
	        	DB.removeItem("judeFromHome");
	        } 
		}
		
		//监听右侧滚动来设置左侧焦点状态
        this.$refs.rightView.addEventListener("scroll", e => {
          var rightScrollHeight = this.$refs.rightView.scrollTop;
//        console.log(rightScrollHeight)
          if(10 < rightScrollHeight){
              this.$refs.boxCont.scrollTop = 200;
          }
          for (let index = 0; index < mySort.length; index++) {
            let myRightItemHeight = mySort[index];
            if (rightScrollHeight > myRightItemHeight && jfHomeNo == "jfHomeNo") {
              this.active = index;
            }
          }
          jfHomeNo = "jfHomeNo";
          
        });               

      }, 100);
    },
    
    //购物撤弹出框
    gwcMask() {
    	this.isMaskLeave = !this.isMaskLeave;
    },
    //显示规格
    showGuiGe(goodsItem){
    	this.initGuiGeBottomSC.initGuiGeSC = [];
    	console.log(goodsItem);
    	this.initGuiGeBottomSC.iGAGPrice = goodsItem.goodsPrice;
    	if (goodsItem.goodsAttrs.length) {
    		//第一遍获取商品的所有规格种类
    		var allSelGuiGeClass = [],allSelGuiGe = [],allSelGuiGeObj = {theGuiGeArr:[]};
			goodsItem.goodsAttrs.forEach((item)=>{
				if (allSelGuiGeClass.indexOf(item.attrType) == -1) {
					allSelGuiGeClass.push(item.attrType);
				}
			})
//  		console.log(allSelGuiGeClass)
    		//第二遍获取商品规格类整理的数组
			allSelGuiGeClass.forEach((item3)=>{
			allSelGuiGeObj = {theGuiGeArr:[]}
			goodsItem.goodsAttrs.forEach((item2)=>{
					if(item2.attrType == item3){
						if(item3 == 0){
							allSelGuiGeObj.guiGeBigName = "杯型";
						}else if(item3 == 1){
							allSelGuiGeObj.guiGeBigName = "添加辅料";
						}else if(item3 == 2){
							allSelGuiGeObj.guiGeBigName = "温度 ";
						}else if(item3 == 3){
							allSelGuiGeObj.guiGeBigName = "甜度";
						}
						allSelGuiGeObj.theGuiGeArr.push(item2);
					}
				})				
				allSelGuiGe.push(allSelGuiGeObj);
			})
    		
    		//初始化默认的规格
    		allSelGuiGe.forEach((item4,index)=>{
    			this.initGuiGeBottomSC.initGuiGeSC.push(item4.theGuiGeArr[0]);
    			this.initGuiGeBottomSC.iGAGPrice += item4.theGuiGeArr[0].attrPrice;
    			this.initGuiGeBottomSC.iGAGAllGuige += item4.theGuiGeArr[0].attrName + "、";
    			
    		})
    		this.initGuiGeBottomSC.iGAGAllGuige =  this.initGuiGeBottomSC.iGAGAllGuige.slice(0,this.initGuiGeBottomSC.iGAGAllGuige.length -1);
    		this.initGuiGeBottomSC.goodsItem = goodsItem;
    		
    		goodsItem.allSelGuiGe = allSelGuiGe;
	    	this.isShowGuiGe = !this.isShowGuiGe;
	//  	this.pushGuige = this.initGuige;
    	}

    },
    //选择切换规格
    changeChecker(value){
		//根据切换的规格设置底部的价格和总规格
		this.initGuiGeBottomSC.iGAGPrice = this.initGuiGeBottomSC.goodsItem.goodsPrice;

		var iGAGAllGuige = "";
     	this.initGuiGeBottomSC.initGuiGeSC.forEach((item4)=>{
    		this.initGuiGeBottomSC.iGAGPrice += item4.attrPrice;
    		iGAGAllGuige += item4.attrName + "、";
    	})   	
    	iGAGAllGuige =  iGAGAllGuige.slice(0,iGAGAllGuige.length -1);
    	this.initGuiGeBottomSC.iGAGAllGuige = iGAGAllGuige;
    	
    },
    
    //加入购物车
    pushShopCart(){
    	console.log(this.initGuiGeBottomSC)
//  	DB.removeItem("shop-car")
    	this.shopCar.add(this.initGuiGeBottomSC);
//  	//获取规格
//  	this.pushGuige = {oneGuige:[this.guiGeDemo1,this.guiGeDemo2,this.guiGeDemo3]};
////  	console.log(this.pushGuige)
//  	var addShopCart =  _.assignIn({},this.initGuiGeBottomSC.goodsItem,this.pushGuige)
//  	
//  	console.dir(addShopCart)
////  	this.isShowGuiGe = !this.isShowGuiGe;


    	// 初始化购物车
//  	this.initGwc();
    },
    
    //清空购物车
    clearGwc(){
    	DB.removeItem("shop-car")
    	console.log("清空购物车")
    	this.shopCar.removeAll();
    },
    //购物车新增商品
    addItemGoods(item){
    	console.log(item)
    	var addItem = {};
    	addItem.name = item.name;
    	addItem.id = item.id;
    	addItem.oneGuige = item.itemGuige.itemOneGuige;
    	
    	this.shopCar.add(addItem);
    	// 初始化购物车
    	this.initGwc();    	
    	
    },
    //购物车删除商品
    minusItemGoods(item){
    	this.shopCar.minus(item);
    	// 初始化购物车
    	this.initGwc();    	
    },
    //展示规格end
    open(link){
    	this.$router.openPage(link);
    },
    //去结算判断是否用户是注册
    toAccount(){
    	    	this.$router.openPage("/closeAccount");
			this.$http.get("/findUserByWeixinOpenid", {params:{
				weixinOpenid: DB.getItem("weixinOpenid").toString()
			}}).then((res) => {
				console.log(res)
			}).catch((err) => {
				console.log(err)
			})	    	
   },
   //绑定
   
   //重置数据
   concatGwcInit(val){
   		console.log(val);
   		console.log(DB.getItem("shopCarDB2").toString())
// 		DB.removeItem("shopCarDB2")
   		
   		if(DB.getItem("shopCarDB2").toString()){
   			//合并
   			
   		}else{
   			//初始化的值
   			this.dataItem = val;
   		}
   	
   	
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
    top: 3rem;
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
        img {
          width: getIphoneWidth(140px);
          height: getIphoneWidth(140px);
          padding-bottom: 0.1rem;
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
            }
          }
          .cell-x-icon {
            fill: limegreen;
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
      background-color: rgb(49, 144, 231);
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
  }
  .cf-center {
    flex: 3;
    background-color: rgb(80, 80, 83);
    color: #fff;
    line-height: $footerHeight;
  }
  .cf-right {
    flex: 1.5;
    background-color: rgb(46, 163, 69);
    color: #fff;
    text-align: center;
    line-height: $footerHeight;
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
              fill: rgb(32, 150, 250);
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
        font-size: 0.3rem;
      }
    }
  }
}

</style>