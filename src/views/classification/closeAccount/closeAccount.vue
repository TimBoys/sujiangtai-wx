<template>
	<div class="app-init">
    <div class="classification-header">
    	<header-back :title="headTitle"></header-back>

    </div>	
	<div class="absolute closeAccountCont">
		<!--头部三个选择s-->
			<div class="groupCont">
			    <tab bar-active-color="#FDA544" >
			      <tab-item selected active-class="tabItem">到店自取</tab-item>
			      <tab-item disabled active-class="tabItem">外卖配送</tab-item>
			    </tab>
				<group label-width="4.5em" label-margin-right="2em" gutter="0" label-align="left" class="groupItem" >
						<!--<popup-picker title="配送方式" :data="list" v-model="value5" value-text-align="left" ></popup-picker>-->
						<cell title="自取地址" value-align="left" primary="content"   :value="storeAddress">
							
						</cell>
						<cell title="自取电话" value-align="left" primary="content"  :value="storePhone">
							 <!--@click.native="showPhone = true"-->
						</cell>
						<popup-picker title="预约时间" v-show="isShowOrderTime" v-model="formatDemoValue" value-text-align="left" :data="ppAllYuyueTime" :display-format="format"></popup-picker>
						<popup-picker title="支付方式" :data="list2" v-model="value6" value-text-align="left" ></popup-picker>
						
				</group>	

			</div>
		<!--头部三个选择e-->
		
		<!--商品详情-->
		<div class="goodsDetail">
			<div class="gd-title">
				素匠泰茶(Whiterock)
			</div>
			<div class="gd-cont">
				<div class="gdc-detail" v-for="(item,index) in allGoods.allGDPage">
					<x-img  class="gdcd-img" v-lazy="item.goodsItem.goodsPictureRound"></x-img>
					<div  class="gdcd-price">
						<div class="gdcdp-right">
							<div class="gdcdpr-title">{{item.goodsItem.goodsName}}</div>
							<div>{{item.iGAGAllGuige}}</div>
							<div>x{{item.itemOneGuigeLen}}</div>
						</div>
						<div class="gdcdp-plus">
							<span>{{item.goodsItem.goodsPrice}}</span>
							<span>{{item.goodsItem.goodsGuigePrice}}</span>
							
						</div>
					</div>
				</div>
					<div class="gdc-footer">
						<div class="gdcf-allPrice">
							原价：${{allGoods.allGDOrigPrice}}
						</div>
						<div class="gdcf-allPrice">
							<span class="fl"></span>优惠({{promotionName}})：${{allGoods.allGDDiscount}}
						</div>
						
						<div class="gdcf-allPrice">
							小计：${{allGoods.allGDOrderPrice}}
						</div>
						<group title="卖家留言" class="gdc-textarea">
      						<x-textarea  name="detail" placeholder="写下想对卖家说的话" :show-counter="false" v-model="textAreaValue"></x-textarea>
    					</group>
					</div>
				
			</div>
			
			
		</div>
	</div>		
		<!--底部结算按钮s-->
	<div class="classification-footer absolute">
		<div class="cf-left">
			<div class="cfl-cont" >
				<x-img v-lazy="sjtLogo" class="iconfont icon-gouwuche ftl-gwc"></x-img>
				<div class="ftl-redPoint">
					{{allGoods.allGDLength}}
				</div>
			</div>
		</div>
				<div class="cf-center">
			总价:${{allGoods.allGDOrderPrice}}
		</div>
				<div class="cf-right" @click="updateAccount()">
			提交订单
		</div>
	</div>
	<!--底部结算按钮e-->
		
		
	<div >
      <confirm v-model="showPhone"
      show-input
      ref="confirm5"
      :title="showPhoneTitle"
       @on-cancel="onCancel"
      @on-confirm="onConfirm5"
      @on-hide="onHide">
      </confirm>
    </div>
    
    <!--loadding弹出框-->
	<loading :show="showLoading" is-show-mask :text="showText"></loading>
		
		
	</div>
	
</template>

<script>
import headerBack from "../../../components/header-back";
import { Confirm,XImg,Divider,PopupPicker,Tab,TabItem,XTextarea } from "vux";
import VueDB from "../../../util/vue-db/vue-db-long.js";
import shopCarTool from "../../../util/shop-car-tool/index.js";
import formatTime from "../../../util/formatTime/formatTime.js";
import _ from 'lodash'

var DB = new VueDB();
var handler = null;
export default{
	name:"closeAccount",
	data(){
		return{
			headTitle: "提交订单",
			sjtLogo:"../../../static/images/mine/sjtLogo.jpg",
			list2: [['微信支付', '支付宝', 'VISA/Master Card',"银行卡"]],
			value6: ['微信支付'],
			showPhone:false,
			showPhoneTitle:"更改自提电话",
			formatDemoValue: [],				//默认预约时间
			ppAllYuyueTime:[], //所有预约时间
			isShowOrderTime:false,
			format: function (value, name) {
				console.log(value)
				if (value[1] == "closeDoor") {
					return `${value[0]}`
				}else{
		        return `${value[0]}:${value[1]}`
		     }
			},
		    allGoods:[],
		    textAreaValue:"",
		    promotionId:null,
		    promotionName:null,
		    storeAddress:"shanghai",
		    storePhone:"110",
		    showLoading:false,
		    showText:"数据加载中...",
		    orderNo:null,
		}
	},
	components:{
		Confirm,
		headerBack,
		XImg,
		PopupPicker,
		Tab,
		TabItem,
		XTextarea
	},
	mounted:function(){
		this.shopCar = new shopCarTool(this.$store);
	    this.showLoading = true;	
	    setTimeout(()=>{
	    	this.showLoading = false;
	    },20000)
		//初始化预约时间
		this.initYuyueTime();
		
		this.queryPromotionByStoreNoNation(); //查询活动id
		
		this.initPayData(); //初始化支付
		
	},
	methods:{
		//展示规格end
	    open(link){
	    	this.$router.openPage(link);
	    },
	    initPayData(){
     			 var _this = this;
     		     handler = StripeCheckout.configure({
					 key:'pk_test_ujKHOw9xZM2QYfJwDZIt890W',  //测试key
     		         //key: 'pk_live_3aqw1J17VC1gcSxl29khgL3u',  //TODO:正式key,正式发布时替换
     		        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
     		        locale: 'auto',
     		        token: function(token) {
     		            // You can access the token ID with `token.id`.
     		            // Get the token ID to your server-side code for use.
     		            console.log(token)
     		            //TODO:发起http请求，将token、amount、description等参数发送给服务器
     		            // 接口地址/stripe/charge
						var data={
     		                token:token.id,
							amount:_this.allGoods.allGDOrderPrice * 100,
							description:'订单信息',
                            orderNum:_this.orderNo   //订单编号
						}
     		           _this.$http.post("/stripe/charge",data).then((res) => {
     		              console.log(res)
     		            if(DB.getItem("localLang").toString() == "en"){
							var ErrorMsg = res.data.usErrorMsg;
						}else{
							var ErrorMsg = res.data.cnErrorMsg;
						}
     		               if(res.status == 200 && res.data.rspCode == "00000") {
     		               		_this.finishPayModfiyOrder();
     		               		//青春店铺缓存
								_this.shopCar.removeAll();
								
								_this.$vux.toast.show({
									text: "支付成功！",
									type: "text",
								})     		               	
     		               }else{
     		               		_this.$vux.toast.show({
									text: ErrorMsg,
									type: "text",
								})
     		               }
     					}).catch((res) => {
     						console.log(res)
     					})   		        
     		        }
     		    });     			
	    	
	    	    window.addEventListener('popstate', function() {
			        handler.close();
			    });
	    	
	    },
	    //初始化预约时间
	    initYuyueTime(){
	    	//是否为预约单子
			console.log("DB.getItem(isOrder).toString()")
			console.log(DB.getItem("isOrder").toString())
			if (DB.getItem("isOrder").toString() == "isOrder") {
				this.isShowOrderTime = true;
			}else{
				this.isShowOrderTime = false;
			}
			
	    	var theTimeHour = [];
	    	var theTimeMin = [];
	    	for (var i = 9 ; i < 18 ; i++) {
	    		var iHour = i < 10 ? "0"+i : i;
	    		theTimeHour.push(iHour);
	    	}
	    	for (var j = 0 ; j <60 ; j++) {
	    		var iMin = j < 10 ? "0"+j : j;
	    		theTimeMin.push(iMin);
	    	}
	    	var nowHour = new Date().getHours() < 10 ? "0"+new Date().getHours() : new Date().getHours();
//	    	console.log(nowHour)
//	    	console.log(theTimeHour)
//	    	console.log(theTimeMin)
			if (theTimeHour.slice(0,theTimeHour.length -1).indexOf(nowHour) == -1) {
				this.formatDemoValue.push("本店暂未开业！","closeDoor")
			}else{
				var theNowHour = theTimeHour.slice(theTimeHour.indexOf(nowHour) + 1)
				console.log(theNowHour)
				this.ppAllYuyueTime.push(theNowHour,theTimeMin);
				this.formatDemoValue.push(theNowHour[0],theTimeMin[0])
			}
	   },
		
		//模态框s
	    onHide(){
	    	console.log("关闭模态框")
	    },
	    onCancel(){
	    	console.log("取消模态框")
	    },
	    onConfirm5 (value) {
	      console.log(value)
	      this.storePhone = value;
	    },
	    //获取店铺的活动
	    //8/15现在是默认第一个活动（第二件半价）
	    queryPromotionByStoreNoNation(){
	    	DB.getItem("storeList").toJson().forEach((item,index)=>{
	    		if (DB.getItem("storeNo").toString() == item.storeNo) {
	    			this.storeAddress = item.storeAddress;
	    			this.storePhone = item.storePhone;
	    		}
	    	})
	    	
			this.$http.get("/userLogin/queryPromotionByStoreNoNation",{
				params:{
					storeNo:DB.getItem("storeNo").toString(),
					lang:DB.getItem("localLang").toString()
				}
			}).then((res) => {
				console.log(res)
				if(res.status == 200 && res.data.rspCode == "00000") {
					this.promotionId = res.data.data.data[0].promotionId;
					this.promotionName = res.data.data.data[0].promotionName;
					this.initUserOrder();  //初始化订单
				}
			}).catch((err) => {
				console.log(err)
			})		    	
	    	
	    },
	    //初始化订单
	    initUserOrder(){
				var telUserNo = DB.getItem("telUserNo").toJson();
				var getAllShopCar = this.shopCar.getAll();
				var listTeaOrderDetails = [];
				for (var itemKey in getAllShopCar) {
					for (var i =0; i < getAllShopCar[itemKey].itemGuige.length; i++) {
						console.log(getAllShopCar[itemKey].itemGuige[i].initGuiGeSC)
						for (var k = 0; k < getAllShopCar[itemKey].itemGuige[i].itemOneGuigeLen; k++) {
							var pushGoods = {};
							var oneStyleItemArr = [];
							pushGoods.goodsId = getAllShopCar[itemKey].goodsId;
							getAllShopCar[itemKey].itemGuige[i].iGAGAllGuige.split("、").forEach((oneStyleItem,osIndex)=>{
								DB.getItem("allGoodsAttrs").toJson().forEach((agaItem,agiIndex)=>{
										if (oneStyleItem == agaItem.attrName) {
											oneStyleItemArr.push(agaItem);
										}									
								})
								
							})
							pushGoods.listTeaOrderDetailsAttr = oneStyleItemArr;
							listTeaOrderDetails.push(pushGoods)
						}
					}
				}
//				console.log(listTeaOrderDetails)
				
				var toPushData = {
					userNo:telUserNo.userNo,
					telephone:telUserNo.telephone,
					promotionId:this.promotionId,			//活动参数
					remark:this.textAreaValue, //备注
					orderType:1,				//1堂吃2预约
					storeNo:DB.getItem("storeNo").toString(),
					listTeaOrderDetails:listTeaOrderDetails  //商品和其规格
				};
				
				console.log("toPushData")
				console.log(toPushData)
				console.log(toPushData.listTeaOrderDetailsAttr)
				
				this.$http.post("/userOrderInfo/userOrderOper",toPushData).then((res) => {
					console.log("/userOrderInfo/userOrderOper")
					if(res.status == 200 && res.data.rspCode == "00000") {
						console.log(res.data.data)
						this.initOrderPage(res.data.data);
						this.orderNo = res.data.data.orderNo;
					}
				}).catch((err) => {
					console.log(err)
				})	    	
	    },
	    //初始化页面数据
	    initOrderPage(value){
				var getAllShopCar = this.shopCar.getAll();
				var allGoodsDataPage = {allGDPage:[],allGDLength:value.listTeaOrderDetails.length,allGDOrigPrice:value.origPrice,allGDDiscount:value.discount,allGDOrderPrice:value.orderPrice};
						    	
				for (var itemKey in getAllShopCar) {
						getAllShopCar[itemKey].itemGuige.forEach((item,i)=>{
						var allGDPageObj = {};
						allGDPageObj.goodsItem = {};
						allGDPageObj.goodsItem.goodsName = getAllShopCar[itemKey].goodsItem.goodsName;
						allGDPageObj.goodsItem.goodsPrice   = getAllShopCar[itemKey].goodsItem.goodsPrice;
						allGDPageObj.goodsItem.goodsGuigePrice  = getAllShopCar[itemKey].goodsItem.goodsGuigePrice;
						allGDPageObj.goodsItem.goodsPictureRound = getAllShopCar[itemKey].goodsItem.goodsPictureRound;
						allGDPageObj.goodsItem["goodsGuigePrice"] = item.guiGePrice;
						allGDPageObj.iGAGAllGuige = item.iGAGAllGuige;
						allGDPageObj.itemOneGuigeLen = item.itemOneGuigeLen;
						allGDPageObj.hasGuigePrice = item.hasGuigePrice;
						
						allGoodsDataPage.allGDPage.push(allGDPageObj)
				})
				}
				console.log(allGoodsDataPage)
				this.allGoods = allGoodsDataPage;
				this.showLoading = false;
	    	
	    },
	    //更改订单
	    finishPayModfiyOrder(){
		    	if (this.isShowOrderTime) {
		    		var theOrderTime = formatTime.ftNoHMS(new Date()) +" "+ this.formatDemoValue[0] + ":" + this.formatDemoValue[1] + ":00";
		    	} else{
					var theOrderTime = "";	    		
		    	}
		    	console.log("theOrderTime")
		    	console.log(theOrderTime)
		    	var data = {
		    		orderTime:theOrderTime,
					orderNo:this.orderNo,
					remark:this.textAreaValue,
				}
	    	
				this.$http.get("/userOrderInfo/finishPayModfiyOrder",{params:data}).then((res) => {
					console.log("/userOrderInfo/finishPayModfiyOrder")
					console.log(res.data)
					if(res.status == 200 && res.data.rspCode == "00000") {
						this.$router.openPage("/mineOrder");
					}
				}).catch((err) => {
					console.log(err)
				})		    	
	    	
	    	
	    },
	    //提交订单
	    updateAccount(){
	    	var _this = this;
			if(_this.allGoods.allGDOrderPrice){
 			 handler.open({
 	            name: '素匠泰茶',
 	            description: '商品信息',
 	            currency: 'usd',
 	            amount: _this.allGoods.allGDOrderPrice * 100   //TODO:金额，单位分，变量,需乘以100
 	        });	  
			}
	    	
	    }
	}
	
	
}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">
@import "../../../assets/scss/util";

.classification-footer {
  left: 0;
  right: 0px;
  bottom: 0px;
  top: calc(100vh - 1.4rem);
  height: $footerHeight;
  display: flex;
  z-index: 111;
  .cf-left {
    flex: 1;
    background-color: rgb(80, 80, 83);
    display: flex;
    justify-content: center;
    align-items: center;
    .cfl-cont {
      width: 1.2rem;
      height: 1.2rem;
      text-align: center;
      position: relative;
	  background-color:  rgb(80, 80, 83);
      top: 0.1rem;
      .ftl-gwc {
        height: 1rem;
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

/*中间*/
.closeAccountCont{
	width: 100%;
	top: 1.2rem;
	bottom:  $footerHeight;
	overflow-y: auto;
		.groupCont{
			.tabItem{
				color: #FDA544;
			}
	}
	.goodsDetail{
		margin-top: 0.4rem;
		background-color: #FFF;
		.gd-title{
			font-size: 0.44rem;
			border-bottom: 1px solid #DDD;
			height: 1.2rem;
			line-height: 1.2rem;
			padding-left: 0.4rem;

		}
		.gd-cont{
			.gdc-detail{
					height: 2rem;
					display: flex;
					font-size: 0.32rem;
				.gdcd-img{
					width: 1.6rem;
					height: 1.6rem;
					padding: 0.2rem;
					/*border-radius: 50%;*/
				}	
				.gdcd-price{
					width: calc(10rem - 2.4rem);
					height: 1rem;
					line-height: 1rem;
					display: flex;
					justify-content: space-between;		
					color: #666;
					.gdcdp-right{
						display: flex;
						flex-direction: column;
						div{
							height: 0.5rem;
						}
						.gdcdpr-title{
							height: 0.6rem;
							font-size: 0.42rem;
							color: #333;
						}

					}
					.gdcdp-plus{
						display: flex;
						flex-direction: column;
						justify-content: space-between;		
						padding-right: 0.6rem;		
						font-size: 0.42rem;		
						span{
							display: inline-block;
							height: 0.62rem;
						}
					}			
				}			
			}
		}
		.gdc-footer{
				color: #333;
				padding:0  0.2rem 0.2rem 0.2rem ;
			.gdcf-allPrice{
				padding-right: 0.6rem;				
				padding-bottom: 0.2rem;				
				text-align: right;
				.fl{
					float: left;
					padding-left: 0.1rem;	
				}
			}
			.gdc-textarea{
				border: 1px solid #D0D6D6;
			}
		}
	}
	}


</style>