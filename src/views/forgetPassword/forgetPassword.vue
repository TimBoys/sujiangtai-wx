<template>
	<div class="app-init">
		<x-img class="sjtLogin-bImg" v-lazy="sjtLogo"></x-img>
		<div class="sjtLogin-cont">
			<div class="sjtlc-logo">
				<x-img class="sjtlcl-img" v-lazy="sjtLogo2"></x-img>
				<div>素匠泰茶</div>
			</div>
			<div class="sjtlc-title">
				忘记密码
			</div>
			<div class="sjtlc-cont">
				<group class="sjtlc-group">
					<x-input placeholder="输入手机号码" placeholder-align="left" class="gInput" v-model="register.telephone">

					</x-input>
				</group>
				<group class="sjtlc-group">
					<x-input placeholder="输入验证码" placeholder-align="left" class="gInput" v-model="register.identifyCode">
						<x-button slot="right" type="primary" mini @click.native="getMsgCode" v-if="!isMsgShow">获取验证码</x-button>
						<x-button slot="right" class="countDown" type="default" mini v-else disabled>
							重新获取({{countDown}})
						</x-button>
					</x-input>
				</group>
				<group class="sjtlc-group">
					<x-input placeholder="输入密码" class="gInput" v-model="register.passwords"></x-input>
				</group>
				<div class="sjtlc-foot">
					<div @click="open('/login')">有密码？去登录</div>
				</div>
			</div>
			<div class="sjtlc-btn">
				<x-button class="login-btn" type="primary" @click.native="userRegister()">登录</x-button>
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
		name: "forgetPassword",
		data() {
			return {
				isMsgShow: false,
				countDown: 120,
				sjtLogo: "../../../static/images/mine/sjtLogin.jpg",
				sjtLogo2: "../../../static/images/mine/circleLogo.png",
				iconType: '',
				register: {
					telephone: "",
					identifyCode: "",
					passwords: ""
				},
				isUserInsert: true,
				comparePollCodeData:null,
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
					this.findUserByTelephone();
					//发送短信
					this.createPollCode();
					
				} else {
					this.$vux.toast.show({
						text: "请填写手机号！",
						type: "text",
					})
				}
			},
			//用户注册
			userRegister() {
				if(!this.register.telephone && !this.register.passwords && !this.register.identifyCode) {
					this.$vux.toast.show({
						text: "请填写正确的用户信息！",
						type: "cancel",
					})
					return;
				} else {
					this.comparePollCode();

				}

			},
			//根据手机号码查找用户
			findUserByTelephone() {
				console.log("findUserByTelephone")
				this.$http.get("/userRegister/findUserByTelephone", {
					params: {
						telephone: this.register.telephone
					}
				}).then((res) => {
					if(res.status == 200 && res.data.rspCode == "00000") {
//						console.log(res)
						console.log("根据手机号码查找用户")
						if(res.data.data) {
							//插入
							this.isUserInsert = false;
						} else {
							//注册
							this.isUserInsert = true;
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
//					console.log(res)
					console.log("发送短信成功");
					if(res.status == 200) {
						console.log(res.data)
						if(res.data) {
							this.$vux.toast.show({
								text: "信息已发送,请注意查收！",
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
					console.log(res)
					console.log(res.data)
					if(res.status == 200){
						switch(res.data){
							case 1:
								this.comparePollCodeData = 1;
							break;
							case 0:
								this.$vux.toast.show({
									text: "输入验证码错误！",
									type: "text",
								})
							break;
							case 98:
								this.$vux.toast.show({
									text: "输入验证码错误！",
									type: "text",
								})
							break;								
							case 99:
								this.$vux.toast.show({
									text: "输入验证码已经过期，请重新输入！",
									type: "text",
								})
							break;								
						}
					//验证码正确
					console.log(this.comparePollCodeData)
					if(this.comparePollCodeData){
						if (this.isUserInsert) {
							this.insertTel();
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
					userNo:this.register.userNo,
					telephone: this.register.telephone,
					userPassword: this.register.passwords,
					weixinOpenid: DB.getItem("weixinOpenid").toString()
				}).then((res) => {
					console.log(res)
				}).catch((err) => {
					console.log(err)
				})
			},
			//插入用户
			insertTel() {
				this.$http.post("/userRegister/insert", {
					telephone: this.register.telephone,
					userPassword: this.register.passwords,
					weixinOpenid: DB.getItem("weixinOpenid").toString()
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
	.sjtLogin-bImg{ height: 100vh; width: 100vw; z-index: 222; } .sjtLogin-cont{ width: 100%; z-index: 444; position: absolute; top: 0; .sjtlc-logo{ color: #FFF; width: 100%; margin-top: 0.6rem; display:flex; justify-content: center; align-items: center; .sjtlcl-img{ height: 1.4rem; width: 1.8rem; } div{ line-height: 1.4rem; font-size: .46rem; margin-left: 0.2rem; } } .sjtlc-title{ width: 100%; margin:0.6rem 0 0.8rem; font-size: 0.8rem; text-align: center; color:#FFF; } .sjtlc-cont{ .sjtlc-group{ width: 7.4rem; margin: 0 auto; .weui-cells{ border-radius: 10px; } .countDown{ color:#333 ; } } .sjtlc-foot{ width: 7.4rem; margin: 0 auto; display: flex; justify-content: space-between; padding: 0.2rem; div{ border-bottom: 1px solid; } } } .sjtlc-btn{ .login-btn{ width: 5rem; margin: 1rem auto; } } }

</style>