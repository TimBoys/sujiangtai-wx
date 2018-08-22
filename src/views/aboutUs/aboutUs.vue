<template>
		<div class="app-init">
		<header-back :title="headTitle"></header-back>
			
    <group gutter="0">
      <cell title="客服问题" is-link @click.native="open('/hcDetail')">
        <div class="badge-value">
          <span class="vertical-middle"> &nbsp;</span>
          <badge text="22"></badge>
        </div>
      </cell>
      <cell title="客服问题2" is-link @click.native="open('/hcDetail')">
        <div class="badge-value">
          <span class="vertical-middle"> &nbsp;</span>
          <!--<badge></badge>-->
        </div>
      </cell>

    </group>	
	
	
		</div>
</template>

<script>
import headerBack from "../../components/header-back";

	export default{
		name:"helpCenter",
		data(){
			return{
				headTitle:"帮助中心"
			}
		},
		components:{
			headerBack
		},
		methods:{
			open(link){
				console.log(1)
				console.log(link)
				this.$router.openPage(link);
			}
		}
		
				
		
	}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">

.badge-value {
  display: inline-block!important;
}
.vertical-middle {
  vertical-align: middle;
}
</style>