<template>
		<div class="app-init">
		<header-back :title="headTitle"></header-back>
			
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
					lang:DB.getItem("localLang").toString()
				}).then((res) => {
					console.log(res)
					if(res.status == 200 && res.data.rspCode == "00000"){
					}
				}).catch((err) => {
					console.log(err)
				})				
			}
			}
		},
		components:{
			headerBack
		}
		
				
		
	}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">


</style>