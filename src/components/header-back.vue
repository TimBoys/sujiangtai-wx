<template>
	<div class="header-back" :class="{'active':active}">
		<p>{{title}}</p>
    	<span class="iconfont icon-backer myicon back" @click="$router.go(-1)"></span>		
		
	</div>
</template>

<script>
	export default{
		name:"header-back",
		props:{
			title:{
				type:String,
				default:"标题"
			}
		},
		data(){
			return{
				active:false
			}
		},
		mounted(){
			setTimeout(()=>{
				this.active = true;
			},10)
		}
	}
</script>

<style type="text/scss" lang="scss">
	@import '../assets/scss/util';
	.header-back.active{
		transform: translateY(0%);
	}
	.header-back{
		    line-height: 0.3rem;
    		padding: getIphoneWidth(30px) 0;
    		background-color: #F2F2F2;
    		@include ani01-transform;
   	 		transform: translateY(-100%);
    		@include f14px;
    		color: #333;
    		text-align: center;
    		position: relative;
    		top: 0;
		    .myicon{
      			position: absolute;
      			width: getIphoneWidth(88px);
      			line-height: 0.3rem;
      			top: getIphoneWidth(30px);
      			color: #919191;
      			font-size: 0.6rem;
			}
    .back{
      left: 0;
    }
    p{
    	display: inline-block;
    	left: 5rem;
    }
    .search{
      right: 0;
		}
	}
	
	
</style>