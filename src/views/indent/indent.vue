<template>
		<div class="app-init">
		<header-back :title="headTitle"></header-back>
		<div class="tabCont">
		    <tab bar-active-color="#FDA544" active-color="#FDA544" >
		      <tab-item selected @on-item-click="onItemClick(1)">堂吃</tab-item>
		      <tab-item @on-item-click="onItemClick(0)">预约</tab-item>
		      <!--<tab-item @on-item-click="onItemClick">全部订单</tab-item>-->
		    </tab>
    	</div>
    	
	    <group gutter="0">
	      <cell title="客服问题" is-link>
	        <div class="badge-value">
	          <span class="vertical-middle"> &nbsp;</span>
	          <!--<badge></badge>-->
	        </div>
	      </cell>
	      <cell title="客服问题2" is-link>
	        <div class="badge-value">
	          <span class="vertical-middle"> &nbsp;</span>
	          <!--<badge></badge>-->
	        </div>
	      </cell>
	
	    </group>	
	
	
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
				headTitle:"我的订单"
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
					orderType:1
				}).then((res) => {
					console.log(res)
					if(res.status == 200 && res.data.rspCode == "00000"){
					}
				}).catch((err) => {
					console.log(err)
				})				
			}
			},
			
			//切换预约堂吃
			onItemClick(value){
				console.log(value)
				
				
			}
		},
		components:{
			headerBack
		}
		
				
		
	}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">
.tabCont{
	color: #FDA544;
}

</style>