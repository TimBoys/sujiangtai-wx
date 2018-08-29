<template>
	<div class="app-init">
		<x-img  class="sjtLogin-bImg" v-lazy="sjtLogo"></x-img>
		<div class="sjtLogin-cont">
			<div class="sjtlc-logo">
				<x-img  class="sjtlcl-img" v-lazy="sjtLogo2"></x-img>
				<div>素匠泰茶</div>
			</div>
			<div class="sjtlc-title">
				{{$t('login.usersLogin')}}
			</div>
			<div class="sjtlc-cont">
				   <group class="sjtlc-group">
     					 <x-input  :placeholder="holdPhone"  placeholder-align="left" class="gInput" v-model="loginParams.telephone">
     					 	
     					 	
     					 </x-input>
   				  </group>
				   <group class="sjtlc-group">
     					 <x-input  :placeholder="holdPassword" type="password"  class="gInput" v-model="loginParams.passwords"></x-input>
   				  </group>
   				  <div class="sjtlc-foot">
   				  		<div @click="open('/register')">{{$t('login.newUserReg')}}</div>
   				  		<div @click="open('/forgetPassword')">{{$t('login.forgetPassword')}}</div>
   				  </div>
			</div>
			<div class="sjtlc-btn">
				<x-button  class="login-btn" type="primary" @click.native="login()">{{$t('login.login')}}</x-button>
			</div>

		</div>		
		
	</div>
</template>

<script>
	import headerBack from "../../components/header-back";
	import { Confirm,XImg,Divider,PopupPicker,Tab,TabItem,XTextarea } from "vux";
	import VueDB from "../../util/vue-db/vue-db-long.js";
	var DB = new VueDB();	
	export default{
		name:"login",
		data(){
			return {
				holdPhone:this.$t('login.holdPhone'),
				holdPassword:this.$t('login.holdPassword'),
				
				sjtLogo:"../../../static/images/mine/sjtLogin.jpg",
				sjtLogo2:"../../../static/images/mine/circleLogo.png",
				iconType: '',
				loginParams:{
					telephone:null,
					passwords:null,
				}
			}
		},
		components:{
			XImg
		},
		methods:{
		    open(link){
		    	this.$router.openPage(link);
		    },
	    	login(){
	    		if (this.loginParams.telephone && this.loginParams.passwords) {
				this.$http.get("/userRegister/userLogin",{params:{
					telephone:this.loginParams.telephone,
					userPassword:this.loginParams.passwords,
				}}).then((res) => {
					console.log("userLogin")
					console.log(res)
					if(res.status == 200){
						if(DB.getItem("localLang").toString() == "en"){
							var ErrorMsg = res.data.usErrorMsg;
						}else{
							var ErrorMsg = res.data.cnErrorMsg;
						}
						if(res.data.data && res.data.rspCode == "00000") {
							this.$vux.toast.show({
									text: this.$t("reminder.loginSucc"),
									type: "text",
								})
							var telUserNo = {telephone:res.data.data.telephone,userNo:res.data.data.userNo}
//							console.log(telUserNo)
							DB.setItem("telUserNo",JSON.stringify(telUserNo));
							setTimeout(()=>{
									this.$router.openPage("/closeAccount");
							},1000)
						}else{
							this.$vux.toast.show({
									text: ErrorMsg,
									type: "text",
						})							
					} 						
					}
				}).catch((err) => {
					console.log(err)
				})	    		
	    		
	    	}else{
				this.$vux.toast.show({
						text: this.$t("reminder.correctInformation"),
						type: "text",
					})	    		
	    	}
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