<template>
	<div class="app-init">
		<x-img  class="sjtLogin-bImg" v-lazy="sjtLogo"></x-img>
		<div class="sjtLogin-cont">
			<div class="sjtlc-logo">
				<x-img  class="sjtlcl-img" v-lazy="sjtLogo2"></x-img>
				<div>素匠泰茶</div>
			</div>
			<div class="sjtlc-title">
				用户登录
			</div>
			<div class="sjtlc-cont">
				   <group class="sjtlc-group">
     					 <x-input  placeholder="输入手机号码"  placeholder-align="left" class="gInput" >
     					 	
     					 	
     					 </x-input>
   				  </group>
				   <group class="sjtlc-group">
     					 <x-input  placeholder="输入密码"   class="gInput"></x-input>
   				  </group>
   				  <div class="sjtlc-foot">
   				  		<div @click="open('/register')">新用户？请注册</div>
   				  		<div>忘记密码</div>
   				  </div>
			</div>
			<div class="sjtlc-btn">
				<x-button  class="login-btn" type="primary" >登录</x-button>
			</div>

		</div>		
		
	</div>
</template>

<script>
	import headerBack from "../../components/header-back";
	import { Confirm,XImg,Divider,PopupPicker,Tab,TabItem,XTextarea } from "vux";
	
	export default{
		name:"login",
		data(){
			return {
				test:"123",
				sjtLogo:"../../../static/images/mine/sjtLogin.jpg",
				sjtLogo2:"../../../static/images/mine/circleLogo.png",
				iconType: '',
			}
		},
		components:{
			XImg
		},
		methods:{
	    open(link){
	    	this.$router.openPage(link);
	    },
		}
		
		
	}
</script>

<style lang="scss" type="text/scss">
	.sjtLogin-bImg{
		height: 100vh;
		width: 100vw;
		z-index: 222;
	}
	.sjtLogin-cont{
		width: 100%;
		z-index: 444;
		position: absolute;
		top: 0;
		.sjtlc-logo{
			width: 100%;
			color: #FFF;
			margin-top: 0.6rem;
			display:flex;
    		justify-content: center;
    		align-items: center;			
			.sjtlcl-img{
				height: 1.4rem;
				width: 1.8rem;
			}
			div{
				line-height: 1.4rem;
				font-size: .46rem;
				margin-left: 0.2rem;
			}
		}
		.sjtlc-title{
			width: 100%;
			margin:0.6rem 0 0.8rem;
			font-size: 0.8rem;
			text-align: center;	
			color:#FFF;		
		}
		.sjtlc-cont{
			.sjtlc-group{
				width: 7.4rem;
				margin: 0 auto;
				.weui-cells{
					border-radius: 10px;
					
				}
			}
			.sjtlc-foot{
				width: 7.4rem;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				padding: 0.2rem;
				div{
					border-bottom: 1px solid;
				}
			}
		}
		.sjtlc-btn{
			.login-btn{
				width: 5rem;
				margin: 1rem auto;				
			}
		}
	}
	
	
	
	
</style>