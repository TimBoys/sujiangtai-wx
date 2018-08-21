<template>
		<div class="app-init">
		<header-back :title="headTitle"></header-back>
		<div class="tabCont">
		    <tab bar-active-color="#FDA544" active-color="#FDA544" height="1rem">
		      <tab-item selected @on-item-click="onItemClick(1)">堂吃</tab-item>
		      <tab-item @on-item-click="onItemClick(0)">预约</tab-item>
		      <!--<tab-item @on-item-click="onItemClick">全部订单</tab-item>-->
		    </tab>
		    
		   <div class="yyTcCont">
		   	  <div class="yyTcItem" v-for="(item,index) in yyTcData" >
		   	  	<div class="topItem">
			   	  	<div class="ti_titile">
			   	  		<div class="tit_orderNo">{{item.orderNo}}</div>
			   	  		<div class="tit_orderTime">{{item.orderTime}}</div>
			   	  	</div>
			   	  	<div class="ti_detail">查看详情</div>
		   	  	</div>
		   	  	<div class="bottomItem">
			   	  	<div class="bi_cont">
			   	  		<div v-if="item.payStatus == 0">待支付</div>
			   	  		<div v-else-if="item.payStatus == 1">支付成功</div>
			   	  		<div v-else="item.payStatus == 2">支付失败</div>

						<div>${{item.origPrice}}</div>
			   	  		
			   	  		<div v-if="item.orderStatus == 0">已下单</div>
			   	  		<div v-else-if="item.orderStatus == 1">制作完成</div>
			   	  		<div v-else="item.orderStatus == 2">取货完成</div>
			   	  		<div v-else="item.orderStatus == 3">外送</div>
			   	  		<div v-else="item.orderStatus == 4">撤销</div>
			   	  		
			   	  		
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

	var DB = new VueDB();

	export default{
		name:"indent",
		data(){
			return{
				headTitle:"我的订单",
				mineOrderType:1,
				yyTcData:null,
			}
		},
		mounted:function(){
			this.initData();
			
			
		},
		methods:{
			initData(){
				console.log(DB.getItem("telUserNo").toJson())
				var telUserNo = DB.getItem("telUserNo").toJson();
				if(telUserNo){
				this.$http.post("/userOrderInfo/queryOrdersByUserNo", {
					userNo:telUserNo.userNo,
					lang:DB.getItem("localLang").toString(),
					storeNo: DB.getItem("storeNo").toString(),
					orderType:this.mineOrderType
				}).then((res) => {
					console.log(res)
					if(res.status == 200 && res.data.data.rspCode == "00000"){
						this.yyTcData = res.data.data.data;
					}
				}).catch((err) => {
					console.log(err)
				})				
			}
			},
			
			//切换预约堂吃
			onItemClick(value){
				console.log(value)
				this.mineOrderType = value;
				
				
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
		top: 2.2rem;
		bottom: 0;
		width:10rem;
		font-size: 0.28rem;
		.yyTcItem{
			padding: 0.2rem;
			.topItem{
				.ti_titile{
					display: flex;
					flex-direction: column;
					justify-content:center;	
					.tit_orderNo{
						font-size: 0.3rem;
					}
					.tit_orderTime{
						font-size: 0.26rem;
					}					
				}
				.ti_detail{
					display: flex;
					flex-direction: column;
					justify-content:center;						
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