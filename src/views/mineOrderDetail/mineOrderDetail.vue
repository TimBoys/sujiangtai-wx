<template>
		<div class="app-init">
		<header-back :title="headTitle"></header-back>
		
    	<div class="yyTcCont">
    		<div class="orderStatusCont">
			   	<div v-if="orderDetail.orderStatus == 0">{{$t('mine.placedAnOrder')}}</div>
	   	  		<div v-else-if="orderDetail.orderStatus == 1">{{$t('mine.finishedOrder')}}</div>
	   	  		<div v-else-if="orderDetail.orderStatus == 2">{{$t('mine.PickupToComplete')}}</div>
	   	  		<div v-else-if="orderDetail.orderStatus == 3">{{$t('mine.delivery')}}</div>
	   	  		<div v-else-if="orderDetail.orderStatus == 4">{{$t('mine.revocation')}}</div>	  	
			  	
			  	<x-icon type="ios-arrow-right" size="30"></x-icon>
    		</div>
    		
			<!--商品详情-->
			<div class="goodsDetail">
				<div class="gd-cont">
					<div class="gdc-title">
						{{storeAddress}}
					</div>
					
					<div class="gdc-detail" v-for="(item,index) in goodsDetail">
						<x-img  class="gdcd-img" v-lazy="item.goodsPictureBig"></x-img>
						<div  class="gdcd-price">
							<div class="gdcdp-right">
								<div class="gdcdpr-title">{{item.goodsName}}</div>
								<div><span v-for="(attrItem) in item.attrs">{{attrItem.attrName}} </span></div>
								<div>x{{item.tGoodsLeng}}</div>
							</div>
							<div class="gdcdp-plus">
								<span>${{item.origPrice}}</span>
								<span>${{item.attrPrice}}</span>
							</div>
						</div>
					</div>

					<div class="gdc-footer">
						<div class="gdcf-allPrice">
							<span class="gdcfa-One">{{$t('closeAccount.originalPrice')}}：</span>
							<span class="gdcfa-Two">${{orderDetail.origPrice}}</span>
						</div>
						<div class="gdcf-allPrice">
							<span class="gdcfa-One">{{$t('closeAccount.discounts')}}({{promotionName}})：</span>
							<span class="gdcfa-Two">${{orderDetail.discount}}</span>
						</div>
						
						<div class="gdcf-allPrice">
							<span class="gdcfa-One">{{$t('closeAccount.subtotal')}}：</span>
							<span class="gdcfa-Two">${{orderDetail.orderPrice}}</span>							
						</div>
					</div>
					
					
				</div>
			<!--商品详情-->	
    		
    		<!--订单信息-->
    		<div class="orderDetailCont">
				<div class="odc-title">
					{{orderDetailTitle}}
				</div>   			
			  <div class="odc-cont">
			  	<div class="odcc-title">
			  		{{$t('mine.orderNumber')}}
			  	</div>
			  	<div class="odcc-cont">
			  		{{orderDetail.orderNo}}
			  	</div>
			  </div>  
			  <div class="odc-cont">
			  	<div class="odcc-title">
			  		{{$t('mine.orderTime')}}
			  	</div>
			  	<div class="odcc-cont">
			  		{{orderDetail.orderTime}}
			  	</div>
			  </div>     
			  <div class="odc-cont">
			  	<div class="odcc-title">
			  		{{$t('mine.orderType')}}
			  	</div>
			  	<div class="odcc-cont">
		   	  		<div v-if="orderDetail.orderType == 0">{{$t('closeAccount.reserve')}}</div>
		   	  		<div v-else="orderDetail.orderType == 1">{{$t('closeAccount.eatIn')}}</div>	
			  	</div>
			  </div> 				  
			  <div class="odc-cont">
			  	<div class="odcc-title">
			  		{{$t('mine.modeOfPayment')}}
			  	</div>
			  	<div class="odcc-cont">
			  		{{$t('mine.onlinePayment')}}
			  	</div>
			  </div> 			  
			  <div class="odc-cont" v-if="orderDetail.remark">
			  	<div class="odcc-title">
			  		{{$t('mine.BuyerMessage')}}
			  	</div>
			  	<div class="odcc-cont">
			  		{{orderDetail.remark}}
			  	</div>
			  </div>			  	
    		</div>
    		<!--订单信息-->
    		
		</div>			  
    	</div>
		</div>
</template>

<script>
import VueDB from "../../util/vue-db/vue-db-long.js";
import headerBack from "../../components/header-back";
import { XImg } from 'vux'

	var DB = new VueDB();

	export default{
		name:"mineOrderDetail",
		data(){
			return{
				headTitle:this.$t("mine.orderDetails"),
				mineOrderType:1,  //1堂吃0预约
				orderDetail:[],  //总商品
				goodsDetail:[],  //总商品
				storeAddress:null,
				promotionName:null,
				orderDetailTitle:this.$t("mine.orderInformation"),
			}
		},
		mounted:function(){
			this.initData();
			
			this.queryPromotionByStoreNoNation()
			
		},
		methods:{
			initData(){
				console.log(DB.getItem("orderDetail").toJson())
				var orderDetail = DB.getItem("orderDetail").toJson();
				var orderDetail1 = orderDetail;
				
				var allGoodsArr = [];
				if(orderDetail){
					//合并规格
					orderDetail.orderDetails.map((item,index)=>{
						item.attrItems = "";
						item.attrs.forEach((item2,index2)=>{
//							console.log(item2)
							item.attrItems += item2.attrName + " ";
						})
					})
					console.log("orderDetail")
					console.log(orderDetail)
					
					//获取该规格长度
					var getDataLeng = [];
					orderDetail.orderDetails.forEach((item,index)=>{
						if (getDataLeng.length) {
							var tGoodsLeng = 0;
							getDataLeng.map((item2,index2)=>{
								if (item.attrItems == item2.attrItems && item.goodsId == item2.goodsId) {
									item2.tGoodsLeng += 1;
									return ;
								} else{
									tGoodsLeng++;
									if (tGoodsLeng == getDataLeng.length) {
										item.tGoodsLeng = 1;
										getDataLeng.push(item);
										return;
									}
								}					
								
							})
						} else{
							item.tGoodsLeng = 1;
							getDataLeng.push(item);
							return ;
						}						
					})
				}
				console.log("getDataLeng")
				console.log(getDataLeng)
				this.orderDetail = orderDetail;
				this.goodsDetail = getDataLeng;
			},
			
		//初试店铺名
	    //获取店铺的活动
	    //8/15现在是默认第一个活动（第二件半价）
	    queryPromotionByStoreNoNation(){
			DB.getItem("storeList").toJson().forEach((item,index)=>{
	    		if (DB.getItem("storeNo").toString() == item.storeNo) {
	    			this.storeAddress = "素匠泰茶("+item.storeAddress+")";
	    		}
	    	})
	    	
			this.$http.get("/userLogin/queryPromotionByStoreNoNation",{
				params:{
					storeNo:DB.getItem("storeNo").toString(),
					lang:DB.getItem("localLang").toString()
				}
			}).then((res) => {
//				console.log(res)
				if(res.status == 200 && res.data.rspCode == "00000") {
//					this.promotionId = res.data.data.data[0].promotionId;
					this.promotionName = res.data.data.data[0].promotionName;
				}
			}).catch((err) => {
				console.log(err)
			})		    	
	    	
	    },			
			
		},
		components:{
			headerBack,
			XImg
		}
		
				
		
	}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">
@import "../../assets/scss/util";

	.yyTcCont{
		overflow-y:auto ;
		position: absolute;
		top: 1.2rem;
		bottom: 0;
		width:10rem;
		font-size: 0.36rem;
		padding:0.3rem;
		/*订单状态头部*/
		.orderStatusCont{
			font-size:0.5rem;
			font-weight:700;
			display:flex;
			align-items:center;			
			div{
				display: inline-block;
			}
		}
		
		.yyTcItem{
			&>div{
				padding: 0.02rem;
			}
			padding: 0.3rem;
			border-bottom:1px solid #CCC;
			.topItem{
				.ti_titile{
					display: flex;
					flex-direction: column;
					justify-content:center;	
					.tit_orderNo{
						font-size: 0.34rem;
					}
					.tit_orderTime{
						font-size: 0.26rem;
					}					
				}
				.ti_detail{
					display: flex;
					justify-content:center;	
					font-weight: 600;
					color: #007AFF;	
					span{
						vertical-align: top;
					}		
				}
				display: flex;
				justify-content: space-between;				
			}
			.bottomItem{
				.bi_cont{
					display: flex;
					justify-content: space-between;						
				}
			}
			}
			
			/*商品信息*/
			.goodsDetail{
					margin-top: 0.1rem;
					background-color: #FFF;
					.gd-cont{
						.gdc-title{
							font-size:0.44rem;
							font-weight:700;
							padding: 0.2rem;
							padding-bottom: 0;						
						}
						
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
					
					/*价格优惠*/
					.gdc-footer{
							color: #333;
							padding:0  0.2rem 0.2rem 0.2rem ;
						.gdcf-allPrice{
							padding-right: 0.6rem;				
							padding-bottom: 0.2rem;				
							text-align: right;
							.gdcfa-One{
								
							}
							.gdcfa-Two{
								color: red;
							}
						}
						.gdc-textarea{
							border: 1px solid #D0D6D6;
						}
					}					
					
					
					/*订单明细*/
					.orderDetailCont{
						border-top: 0.3rem solid $bodyBackgroundColor;
						.odc-title{
							font-size:0.44rem;
							font-weight:700;
							padding: 0.2rem;
							padding-bottom: 0;						
						}
						.odc-cont{
							display: flex;
							justify-content:space-between;
							color: #000;
							padding:0.2rem;	
							padding-right: 0.6rem;
							.odcc-title{
								color: #666;
							}
							.odcc-cont{
								color:#000;
								max-width: 6rem;
							}
							
							
						}						
						
					}					
				}
		}

</style>