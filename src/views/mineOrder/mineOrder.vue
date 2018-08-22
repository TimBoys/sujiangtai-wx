<template>
		<div class="app-init">
		<header-back :title="headTitle"></header-back>
		<div class="tabCont">
		    <tab bar-active-color="#FDA544" active-color="#FDA544" height="1rem">
		      <tab-item selected @on-item-click="onItemClick(1)"  v-if="mineOrderType == 1" selected>堂吃</tab-item>
		      <tab-item selected @on-item-click="onItemClick(1)" v-else>堂吃</tab-item>
		      <tab-item @on-item-click="onItemClick(0)" v-if="mineOrderType == 0" selected>预定</tab-item>
		      <tab-item @on-item-click="onItemClick(0)" v-else>预定</tab-item>
		    </tab>
		    
		   <div class="yyTcCont">
		   	  <div class="yyTcItem" v-for="(item,index) in yyTcData" >
		   	  	<div class="topItem" @click="watchDetail(item)">
			   	  	<div class="ti_titile">
			   	  		<div class="tit_orderNo">{{item.orderNo}}</div>
			   	  		<div class="tit_orderTime">{{item.orderTime}}</div>
			   	  	</div>
			   	  	<div class="ti_detail"><span>查看详情</span></div>
		   	  	</div>
		   	  	<div class="bottomItem">
			   	  	<div class="bi_cont">
			   	  		<div v-if="item.payStatus == 0">待支付</div>
			   	  		<div v-else-if="item.payStatus == 1">支付成功</div>
			   	  		<div v-else="item.payStatus == 2">支付失败</div>

			   	  		
			   	  		<div v-if="item.orderStatus == 0">已下单</div>
			   	  		<div v-else-if="item.orderStatus == 1">制作完成</div>
			   	  		<div v-else="item.orderStatus == 2">取货完成</div>
			   	  		<div v-else="item.orderStatus == 3">外送</div>
			   	  		<div v-else="item.orderStatus == 4">撤销</div>
			   	  		
			   	  	</div>
		   	  	</div>	
		   	  	
		   	  	<div class="bottomItem">
			   	  	<div class="bi_cont">
			   	  		<div v-for="(itemName,indexName) in item.orderDetails" v-if="!indexName">{{itemName.goodsName}}等 {{item.orderDetails.length}}件商品</div>
						<div>${{item.origPrice}}</div>
			   	  		
			   	  	</div>
		   	  	</div>			   	  	
		   	  	
		   	  	
		   	  	
		   	  	
		   	  	
		   	  </div>
		   	
		   	
		   	
		   </div>
    	</div>
    	
			
		<loading :show="showLoading" is-show-mask :text="showText"></loading>	
	
		</div>
</template>

<script>
import VueDB from "../../util/vue-db/vue-db-long.js";
import headerBack from "../../components/header-back";

	var DB = new VueDB();

	export default{
		name:"mineOrder",
		data(){
			return{
				headTitle:"我的订单",
				mineOrderType:null,  //1堂吃0预约
				yyTcData:null,  //总商品
				showLoading:false, //loading
				showText:this.$t("reminder.dataLoading"),
			}
		},
		mounted:function(){
			this.initData();
			
			
		},
		methods:{
			initData(){
				this.showLoading = true;
				var isYyTc = DB.getItem("isYyTc").toString();
//				console.log(isYyTc)
				if (isYyTc) {
					this.mineOrderType = isYyTc;
				}else{
					DB.setItem("isYyTc","1");
					this.mineOrderType = DB.getItem("isYyTc").toString();
				}
				
//				console.log(DB.getItem("telUserNo").toJson())
				var telUserNo = DB.getItem("telUserNo").toJson();
				if(telUserNo){
				this.$http.post("/userOrderInfo/queryOrdersByUserNo", {
					userNo:telUserNo.userNo,
					lang:DB.getItem("localLang").toString(),
					storeNo: DB.getItem("storeNo").toString(),
					orderType:0
				}).then((res) => {
					console.log(res)
					if(res.status == 200 && res.data.data.rspCode == "00000"){
						this.showLoading = false;
						this.yyTcData = res.data.data.data;
					}
				}).catch((err) => {
					console.log(err)
					this.showLoading = false;
				})				
			}
			},
			
			//切换预约堂吃
			onItemClick(value){
				console.log(value)
				this.mineOrderType = value;
				DB.setItem("isYyTc",value); //存默认是预定还是堂吃
				this.initData();
				
			},
			
			//查看明细
			watchDetail(item){
				console.log(item)
				DB.setItem("orderDetail",JSON.stringify(item));
				this.$router.openPage("/mineOrderDetail");
				
			}
		},
		components:{
			headerBack
		}
		
				
		
	}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">
@import "../../assets/scss/util";

.tabCont{
	.yyTcCont{
		overflow-y:auto ;
		position: absolute;
		top: 2.3rem;
		bottom: 0;
		width:10rem;
		font-size: 0.32rem;
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
					color: #FDA544;	
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
		
	}
	
	
}

</style>