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
import headerBack from "../../../components/header-back";

	export default{
		name:"hcDetail",
		data(){
			return{
				headTitle:"11111111111"
			}
		},
		components:{
			headerBack
		}
		
				
		
	}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">


</style>