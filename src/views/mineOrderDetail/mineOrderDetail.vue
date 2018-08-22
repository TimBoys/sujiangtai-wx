<template>
		<div class="app-init">
		<header-back :title="headTitle"></header-back>
		
    	<div class="yyTcCont">
			  <div>
			  	订单编号：{{orderDetail.orderNo}}
			  </div>  		
			  <div>
			  	下单时间：{{orderDetail.orderTime}}
			  </div>      		
	   	  	<div>
	   	  		<div v-if="orderDetail.orderType == 0">订单类型：预定</div>
	   	  		<div v-else="orderDetail.orderType == 1">订单类型：堂吃</div>	
	   	  	</div>		  
			  
			  <div>
			  	<div v-if="orderDetail.orderStatus == 0">订单状态：已下单</div>
			  	<div v-else-if="orderDetail.orderStatus == 1">订单状态：制作完成</div>
			  	<div v-else="orderDetail.orderStatus == 2">订单状态：取货完成</div>
			  	<div v-else="orderDetail.orderStatus == 3">订单状态：外送</div>
			  	<div v-else="orderDetail.orderStatus == 4">订单状态：撤销</div>			  
			  </div>
			  
			  
			  <div>
			  	<div v-if="orderDetail.payStatus == 0">支付状态：待支付</div>
			  	<div v-else-if="orderDetail.payStatus == 1">支付状态：支付成功</div>
			  	<div v-else="orderDetail.payStatus == 2">支付状态：支付失败</div>			  
			  </div>

			  <div>
			  	商品原价：${{orderDetail.origPrice}}
			  </div>	
			  <div>
			  	优惠价格：${{orderDetail.discount}}
			  </div>				  
			  <div>
			  	商品结算价：${{orderDetail.orderPrice}}
			  </div>				  
			  <div v-if="orderDetail.remark">
			  	留言：{{orderDetail.remark}}
			  </div>			  
		<!--商品详情-->
		<div class="goodsDetail">
			<div class="gd-cont">
				<div class="gdc-detail" v-for="(item,index) in orderDetail.orderDetails">
					<x-img  class="gdcd-img" v-lazy="item.goodsPictureBig"></x-img>
					<div  class="gdcd-price">
						<div class="gdcdp-right">
							<div class="gdcdpr-title">{{item.goodsName}}</div>
							<div><span v-for="(attrItem) in item.attrs">{{attrItem.attrName}} </span></div>
							<div>x1</div>
						</div>
						<div class="gdcdp-plus">
							<span>${{item.origPrice}}</span>
							<span>${{item.attrPrice}}</span>
							
						</div>
					</div>
				</div>
				
			</div>
			
			
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
				headTitle:"订单明细",
				mineOrderType:1,  //1堂吃0预约
				orderDetail:{},  //总商品
			}
		},
		mounted:function(){
			this.initData();
			
			
		},
		methods:{
			initData(){
				console.log(DB.getItem("orderDetail").toJson())
				var orderDetail = DB.getItem("orderDetail").toJson();
				
				var allGoodsArr = [];
//				if(orderDetail){
//					//合并规格
//					orderDetail.orderDetails.map((item,index)=>{
//						item.attrItems = "";
//						item.attrs.forEach((item2,index2)=>{
//							console.log(item2)
//							item.attrItems += item2.attrName + " ";
//						})
//					})
//					
//					//获取该规格长度
//					var getData = [];
//					getData.push(orderDetail.orderDetails[0]);
//					orderDetail.orderDetails.forEach((item,index)=>{
//						var goodsLength = 0;
//						getData.map((item3,index3)=>{
//							if (item.attrItems == item3.attrItems && item.goodsId == item3.goodsId) {
//								item3.goodsLength = ++goodsLength;
//							}
//							
//						})
//					})
//				}
				console.log("orderDetail")
				console.log(orderDetail)
				if(orderDetail){
					this.orderDetail = orderDetail;
				}
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
			
			
			.goodsDetail{
					margin-top: 0.4rem;
					background-color: #FFF;
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
				}
		}

</style>