<template>
	<div class="app-init">
		<x-img  class="sjtLogin-bImg" v-lazy="sjtLogo"></x-img>
		<div class="sjtLogin-cont">
			<div class="sjtlc-logo">
				<x-img  class="sjtlcl-img" v-lazy="sjtLogo2"></x-img>
				<div>素匠泰茶</div>
			</div>
			<div class="sjtlc-title">
				用户注册
			</div>
			<div class="sjtlc-cont">
				   <group class="sjtlc-group">
     					 <x-input  placeholder="输入手机号码"  placeholder-align="left" class="gInput" v-model="register.telephone">
     					 	
     					 </x-input>
   				  </group>
   				  				   <group class="sjtlc-group">
     					 <x-input  placeholder="输入验证码"  placeholder-align="left" class="gInput" v-model="register.code">
     					 	 <x-button slot="right" type="primary" mini @click.native="getMsgCode" v-if="!isMsgShow">获取验证码</x-button>
     					 	 <x-button slot="right" type="default" mini v-else disabled>
     					 	 	{{countDown}}
     					 	 </x-button>
     					 </x-input>
   				  </group>
				   <group class="sjtlc-group">
     					 <x-input  placeholder="输入密码"   class="gInput" v-model="register.password"></x-input>
   				  </group>
			</div>
			<div class="sjtlc-btn">
				<x-button  class="login-btn" type="primary" @click.native="open('/login')">登录</x-button>
			</div>

		</div>		
		
	</div>
</template>

<script>
	import headerBack from "../../components/header-back";
	import { Confirm,XImg,Divider,PopupPicker,Tab,TabItem,XTextarea } from "vux";
	var intervalTime = null;
	
	export default{
		name:"register",
		data(){
			return {
				isMsgShow:false,
				countDown:60,
				sjtLogo:"../../../static/images/mine/sjtLogin.jpg",
				sjtLogo2:"../../../static/images/mine/circleLogo.png",
				iconType: '',
				register:{
					telephone:"",
					code:"",
					password:""
				}
			}
		},
		components:{
			XImg,
		},
		mounted: function(){
			this.initData();
		},
		methods:{
			initData(){
			},
		    open(link){
		    	this.$router.openPage(link);
		    },
		    getMsgCode(){
		    	//开始倒计时
		    	this.isMsgShow = true;
		    	intervalTime = setInterval(()=>{
		    		this.countDown--;
		    		if (this.countDown <= 0) {
		    			clearInterval(intervalTime);
		    			this.isMsgShow = false;
		    			this.countDown = 60;
		    		}
		    	},1000)
		    	
		    	//判断是绑定还是插入
		    	console.log(this.register.telephone);
				this.$http.get("/userLogin/findUserByTelephone", {params:{
					telephone: this.register.telephone
				}}).then((res) => {
					console.log(res)
					if(res){
						//插入
						this.insertTel()
					}else{
						//注册
						this.bindOpenidTel();
					}
				}).catch((err) => {
					console.log(err)
				})	 		    	

				this.createPollCode();
				console.log(this.register)
		    },
		    //注册用户
		    bindOpenidTel(){
				this.$http.get("/userLogin/bindOpenidTel", {TeaUserInfo:{
					telephone: this.register.telephone
				}}).then((res) => {
					console.log(res)
				}).catch((err) => {
					console.log(err)
				})			    	
		    },
		    //插入用户
		    insertTel(){
				this.$http.get("/userLogin/insert", {TeaUserInfo:{
					telephone: this.register.telephone
				}}).then((res) => {
					console.log(res)
				}).catch((err) => {
					console.log(err)
				})			    	
		    },
		    //发送短信息msg
		    createPollCode(){
				this.$http.get("/userLogin/createPollCode").then((res) => {
					console.log(res)
				}).catch((err) => {
					console.log(err)
				})				    	
		    },
		    //发送短信息msg
		    createPollCode(){
				this.$http.get("/userLogin/comparePollCode",{
					params:this.register
				}).then((res) => {
					console.log(res)
				}).catch((err) => {
					console.log(err)
				})				    	
		    }
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
			color: #FFF;
			width: 100%;
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