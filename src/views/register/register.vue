<template>
	<div class="app-init">
		<x-img class="sjtLogin-bImg" v-lazy="sjtLogo"></x-img>
		<div class="sjtLogin-cont">
			<div class="sjtlc-logo">
				<x-img class="sjtlcl-img" v-lazy="sjtLogo2"></x-img>
				<div>素匠泰茶</div>
			</div>
			<div class="sjtlc-title">
				{{$t('register.usersRegister')}}
			</div>
			<div class="sjtlc-cont">
				<group class="sjtlc-group">
					<x-input :placeholder="holdPhone" placeholder-align="left" class="gInput" v-model="register.telephone">

					</x-input>
				</group>
				<group class="sjtlc-group">
					<x-input :placeholder="inputVerificationCode" placeholder-align="left" class="gInput" v-model="register.identifyCode">
						<x-button slot="right" type="primary" mini @click.native="getMsgCode" v-if="!isMsgShow">{{$t('register.getCode')}}</x-button>
						<x-button slot="right" class="countDown" type="default" mini v-else disabled>
							{{$t('register.regain')}}({{countDown}})
						</x-button>
					</x-input>
				</group>
				<group class="sjtlc-group">
					<x-input :placeholder="holdPassword" class="gInput" v-model="register.passwords"></x-input>
				</group>
				<div class="sjtlc-foot">
					<div @click="open('/login')">{{$t('register.RegisteredTologin')}}</div>
				</div>
			</div>
			<div class="sjtlc-btn">
				<x-button class="login-btn" type="primary" @click.native="userRegister()">{{$t('login.login')}}</x-button>
			</div>

		</div>

	</div>
</template>

<script>
	import headerBack from "../../components/header-back";
	import { Confirm, XImg, Divider, PopupPicker, Tab, TabItem, XTextarea } from "vux";
	import VueDB from "../../util/vue-db/vue-db-long.js";
	var intervalTime = null;
	var DB = new VueDB();

	export default {
		name: "register",
		data() {
			return {
				holdPhone:this.$t('register.holdPhone'),
				holdPassword:this.$t('register.holdPassword'),				
				inputVerificationCode:this.$t('register.inputVerificationCode'),
				
				isMsgShow: false,
				countDown: 120,
				sjtLogo: "../../../static/images/mine/sjtLogin.jpg",
				sjtLogo2: "../../../static/images/mine/circleLogo.png",
				iconType: '',
				//请求参数
				register: {
					telephone: null,
					identifyCode:null,
					passwords: null
				},
				isUserInsert: true,
				comparePollCodeData:null,
				userNo:null, //用户编码
			}
		},
		components: {
			XImg,
		},
		mounted: function() {
			this.initData();
		},
		methods: {
			initData() {

			},
			open(link) {
				this.$router.openPage(link);
			},
			getMsgCode() {
				if(this.register.telephone) {
					//开始倒计时
					this.isMsgShow = true;
					intervalTime = setInterval(() => {
						this.countDown--;
						if(this.countDown <= 0) {
							clearInterval(intervalTime);
							this.isMsgShow = false;
							this.countDown = 120;
						}
					}, 1000)

					//判断是绑定还是插入
					
					console.log(DB.getItem("weixinOpenid").toString())
					console.log("DB.getItem(weixinOpenid).toString()")
					if (DB.getItem("weixinOpenid").toString()) {
						//根据微信号查询用户能绑定
						this.findUserByTelephoneInWx();
					}else{
						//根据手机号查询用户不能绑定
						this.findUserByTelephoneInWeb();
					}
				} else {
					this.$vux.toast.show({
						text: this.$t("reminder.writePhoneNumber"),
						type: "text",
					})
				}
			},
			//用户注册
			userRegister() {
				console.log(this.register.telephone)
				console.log(this.register.passwords)
				console.log(this.register.identifyCode)
				if(!this.register.telephone || !this.register.passwords || !this.register.identifyCode) {
					this.$vux.toast.show({
						text: this.$t("reminder.correctInformation"),
						type: "text",
					})	
					return;
				} else {
					this.comparePollCode();

				}
			},
		
			//根据手机号码查找用户，移动端
			findUserByTelephoneInWeb() {
				this.$http.get("/userRegister/findUserByTelephone", {
					params: {
						telephone: this.register.telephone,
					}
				}).then((res) => {
					if(res.status == 200 && res.data.rspCode == "00000") {
						console.log(res.data.data)
						console.log("根据手机号码查找用户移动端")
						if(res.data.data) {
							//手机号码查询有参数的，表示这个用户已经存在，提示去登录，并
							this.$vux.toast.show({
								text: this.$t("reminder.pleaseLogout"),
								type: "text",
							})
							clearInterval(intervalTime);
							this.isMsgShow = false;
							this.countDown = 120;
							return false;
						} else {
							//注册
							this.isUserInsert = true;
							//发送短信
							this.createPollCode();
						}
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			//根据手机号码查找用户，微商城端
			findUserByTelephoneInWx() {
				this.$http.get("/userRegister/findUserByTelephone", {
					params: {
						telephone: this.register.telephone
					}
				}).then((res) => {
					if(res.status == 200 && res.data.rspCode == "00000") {
						console.log(res.data.data)
						console.log("根据手机号码查找用户微商城端")
						if(res.data.data) {
						if(res.data.data.weixinOpenid) {
							//手机号码查询有参数的，表示这个用户已经存在，提示去登录，并
							this.$vux.toast.show({
								text: "该手机号已经绑定过微信，请使用是其他手机号绑定!",
								type: "text",
							})
							clearInterval(intervalTime);
							this.isMsgShow = false;
							this.countDown = 120;
							return false;
						} else {
							//绑定
							this.isUserInsert = false;
							//发送短信
							this.createPollCode();
						}
						}else{
							//注册
							this.isUserInsert = true;
							//发送短信
							this.createPollCode();							
						}
					}
				}).catch((err) => {
					console.log(err)
				})
			},			
			
			//发送短信息msg
			createPollCode() {
				this.$http.get("/userRegister/createPollCode", {
					params: {
						telephone: this.register.telephone
					}
				}).then((res) => {
					console.log("发送短信成功");
					if(res.status == 200) {
						console.log(res.data)
						if(res.data) {
							this.$vux.toast.show({
								text:  this.$t("reminder.pleaseCheckInfo"),
								type: "text",
							})
						}
					}
				}).catch((err) => {
					console.log(err)
				})

			},
			//比较短信息msg
			comparePollCode() {
				this.comparePollCodeData = null;
				this.$http.post("/userRegister/comparePollCode", {
					telephone: this.register.telephone,
					identifyCode: this.register.identifyCode
				}).then((res) => {
					console.log("比较验证码成功");
					console.log(res.data)
					if(res.status == 200){
						if(DB.getItem("localLang").toString() == "en"){
							var ErrorMsg = res.data.usErrorMsg;
						}else{
							var ErrorMsg = res.data.cnErrorMsg;
						}
						switch(res.data.rspCode){
							case "00000":
								this.comparePollCodeData = 1;
							break;
							case "00008":
								this.$vux.toast.show({
									text: ErrorMsg,
									type: "text",
								})
							break;
							default:
								this.$vux.toast.show({
									text: "server error！",
									type: "text",
								})
							break;
						}
					//验证码正确
					console.log(this.comparePollCodeData)
					if(this.comparePollCodeData){
						//是插入用户
						if (this.isUserInsert) {
							this.insertTel();
						//是绑定用户
						}else{
							this.bindOpenidTel();
						}
					}
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			//注册用户
			bindOpenidTel() {
				this.$http.post("/userRegister/bindOpenidTel", {
					userNo:DB.getItem("userNo").toString(),
					telephone: this.register.telephone,
					userPassword: this.register.passwords,
					weixinOpenid: DB.getItem("weixinOpenid").toString()
				}).then((res) => {
					console.log(res)
					if(res.status == 200 && res.data.rspCode == "00000"){
								this.$vux.toast.show({
									text: this.$t("reminder.loginSucc"),
									type: "text",
								})
								this.findUserByTelephoneEnd();
								setTimeout(()=>{
									this.$router.openPage("/closeAccount");
								},1000)
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			//插入用户
			insertTel() {
				this.$http.post("/userRegister/insert", {
					telephone: this.register.telephone,
					userPassword: this.register.passwords,
					weixinOpenid: DB.getItem("weixinOpenid").toString(),
					userName:this.register.telephone,
				}).then((res) => {
					console.log(res)
					if(res.status == 200 && res.data.rspCode == "00000"){
								this.$vux.toast.show({
									text: this.$t("reminder.loginSucc"),
									type: "text",
								})
								this.findUserByTelephoneEnd();
								setTimeout(()=>{
									this.$router.openPage("/closeAccount");
								},1000)
					}
				}).catch((err) => {
					console.log(err)
				})
			},
			//根据手机号码查找用户,确定用户已经存在了，存储userNo,telephone
			findUserByTelephoneEnd() {
				this.$http.get("/userRegister/findUserByTelephone", {
					params: {
						telephone: this.register.telephone
					}
				}).then((res) => {
					if(res.status == 200 && res.data.rspCode == "00000") {
						console.log("根据手机号码查找用户,确定用户已经存在了，存储userNo,telephone")
						console.log(res.data.data)
						if(res.data.data) {
							var telUserNo = {telephone:res.data.data.telephone,userNo:res.data.data.userNo}
							console.log("telUserNo")
							console.log(telUserNo)
							DB.setItem("telUserNo",telUserNo);
						}
					}
				}).catch((err) => {
					console.log(err)
				})
			},

		}

	}
</script>

<style lang="scss" type="text/scss">
	.sjtLogin-bImg{ height: 100vh; width: 100vw; z-index: 222; } .sjtLogin-cont{ width: 100%; z-index: 444; position: absolute; top: 0; .sjtlc-logo{ color: #FFF; width: 100%; margin-top: 0.6rem; display:flex; justify-content: center; align-items: center; .sjtlcl-img{ height: 1.4rem; width: 1.8rem; } div{ line-height: 1.4rem; font-size: .46rem; margin-left: 0.2rem; } } .sjtlc-title{ width: 100%; margin:0.6rem 0 0.8rem; font-size: 0.8rem; text-align: center; color:#FFF; } .sjtlc-cont{ .sjtlc-group{ width: 7.4rem; margin: 0 auto; .weui-cells{ border-radius: 10px; } .countDown{ color:#333 ; } } .sjtlc-foot{ width: 7.4rem; margin: 0 auto; display: flex; justify-content: space-between; padding: 0.2rem; div{ border-bottom: 1px solid; } } } .sjtlc-btn{ .login-btn{ width: 5rem; margin: 1rem auto; } } }

</style>