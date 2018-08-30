<template>
	<div class="app-init">
			<div class="mineContHead">
				<x-img v-lazy="maskImg" class="maskCont"></x-img>				
				<div class="mineCont">
					<div class="mineContTop">
						<img :src="maskImg2" class="headIcon" @click="showImgText" />
						<div class="isImgText" v-if="isImgText"><span >#</span>现有客户交易积分有效，累计核算在之后的积分系统里。</div>
						<div class="headJieShao">
							<div>{{headName}}</div>
							<div>积分：{{points}}</div>
						</div>
					</div>
					<div class="mineContBottom" @click="nextWait">
						<div>{{$t('mine.VIPEnjoyMoreDiscounts')}}</div>
						<div @click="showFavorText">{{$t('mine.favorable')}}</div>
						<div class="isFavorText" v-if="isFavorText"><span >#</span>充值系统即将开放，敬请期待。</div>
					</div>
				</div>
			</div>

			<div class="groupCont">
				<group label-width="9em" label-margin-right="2em" label-align="left" class="groupItem">
						<cell :title="mineOrder"  is-link @click.native="open('/mineOrder')">
							<x-img slot="icon" class="mineItem" v-lazy="groupCont.mineDingdan">
							</x-img>
						</cell>
						<cell @click.native="showPosition('middle')" :title="membershipCard"  is-link >
							<x-img slot="icon" class="mineItem" v-lazy="groupCont.mineHuiYuan">
							</x-img>
						</cell>
				</group>
				<group label-width="9em" label-margin-right="2em" label-align="left" class="groupItem">
						<cell @click.native="showPosition2('middle')" :title="systematicNotification"  is-link>
							<x-img slot="icon" class="mineItem" v-lazy="groupCont.mineHelp">
							</x-img>
						</cell>
						<cell @click.native="showPosition('middle')" :title="aboutUs" is-link>
							<x-img slot="icon" class="mineItem" v-lazy="groupCont.mineMsg">
							</x-img>
						</cell>
						<!--<cell @click.native="showPosition('middle')" :title="aboutUs" is-link @click.native="open('/aboutUs')">
							<x-img slot="icon" class="mineItem" v-lazy="groupCont.mineMsg">
							</x-img>
						</cell>-->						
				</group>
			</div>
			
			 <toast  v-model="showPositionValue" width="5rem"  type="text" :time="2000" is-show-mask :text="$t('reminder.comingSoon')" :position="position"></toast>
			 <toast  v-model="showPositionValue2" width="5rem"  type="text" :time="2000" is-show-mask :text="$t('reminder.comingSoon2')" :position="position"></toast>
			
	</div>
</template>

<script>
	import VueDB from "../../util/vue-db/vue-db-long.js";
	import {XImg, GroupTitle,Toast} from "vux"

	var DB = new VueDB();

	export default{
		name:"mine",
		data(){
			return {
				mineOrder:this.$t('mine.mineOrder'), //我的订单
				membershipCard:this.$t('mine.membershipCard'), //会员卡
				systematicNotification:this.$t('mine.systematicNotification'), //系统通知
				aboutUs:this.$t('mine.aboutUs'), //帮助中心
				maskImg:"../../../static/images/home/testImg1.jpg",
				maskImg2:null,
				headName:"素匠泰 PRIME'S HAI TEA",
				groupCont:{
					mineDingdan:"../../../static/images/mine/groupDingDan.png",
					mineHuiYuan:"../../../static/images/mine/groupHuiYuan.png",
					mineHelp:"../../../static/images/mine/groupHelp.png",
					mineMsg:"../../../static/images/mine/groupMsg.png",
				},
				value:"",
				position: 'default',
      			showPositionValue: false,
      			showPositionValue2: false,
      			isImgText:false, //图片显示字段
      			isFavorText:false,//优惠显示字段
      			points:0, //积分
			}
		},
		mounted:function(){
			this.initData();
			
			
			
		},
		methods:{
			initData(){
				
				console.log("DB.getItem(wxUserInfo).toJson()")
				console.log(DB.getItem("wxUserInfo").toJson())
				var wxUserInfo = DB.getItem("wxUserInfo").toJson();
				if (wxUserInfo) {
					this.maskImg2 = wxUserInfo.headimgurl;
					this.headName = wxUserInfo.weixinNickname;
				}else{
					this.maskImg2 = this.maskImg;
				}
				
				//获取积分
//				console.log(DB.getItem("telUserNo").toJson())
				if(DB.getItem("telUserNo").toJson()) {
					this.findUserByTelephone();
				}
				
				
			},
			showPosition (position) {
		      this.position = position;
		      this.showPositionValue = true;
		    },
			showPosition2 (position) {
		      this.position2 = position;
		      this.showPositionValue2 = true;
		    },		    
		    nextWait(){
//		      this.showPositionValue = true;
		    },
		    open(link){
		    	this.$router.openPage(link);
		    },
		    showImgText(){
		    	this.isImgText = !this.isImgText;
		    },
		    showFavorText(){
		    	this.isFavorText = !this.isFavorText;
		    },	
			//根据手机号码查找用户，移动端
			findUserByTelephone() {
				this.$http.get("/userRegister/findUserByTelephone", {
					params: {
						telephone: DB.getItem("telUserNo").toJson().telephone,
					}
				}).then((res) => {
					if(res.status == 200 && res.data.rspCode == "00000") {
						console.log(res.data.data)
						if(res.data.data) {
							//手机号码查询有参数的
							this.points = res.data.data.points;
							if (!DB.getItem("wxUserInfo").toJson()) {
								this.headName = res.data.data.telephone;
								if(res.data.data.headimgurl){
									this.maskImg2 = res.data.data.headimgurl;
								}else{
									this.maskImg2 = this.maskImg;
								}
							}
						}
					}
				}).catch((err) => {
					console.log(err)
				})
			},		    
		},
		components:{
			XImg,
			GroupTitle,
			Toast
		}
		
		
	}
	
	
</script>

<style scoped="scoped" type="text/scss" lang="scss">
.mineContHead{
		height: 4rem;
		position: relative;
	.maskCont{
		height:  100%;
		width: 100%;
		position: absolute;
		top: 0;
		z-index: 111;

	}
	.mineCont{
			height: 3.4rem;
			width: 9.4rem;
			background-color:rgba(00, 00, 00, 0.4);
			position: absolute;
			top: 0.3rem;
			left: 0.3rem;
			z-index: 222;
			display: flex;
			flex-direction: column;
			
			.mineContTop{
				color: #EFEFEF;
				padding:0.2rem;
				display:flex;
				justify-content: space-between;
				align-items: center;
				position: relative;
				.isImgText{
					position: absolute;
					top:1.6rem ;
					left: 1.2rem;
					background-color: #fff;
					border: 1px solid #333;
					color: #333;
					font-size: 0.24rem;
					padding:0 0.04rem;
					span{
						color: red;
					}
				}
				.headIcon{
					width: 1.8rem;
					height: 1.8rem;
					border-radius: 50%;
				}
				.headJieShao{
					text-align: right;
				}
			}
			.mineContBottom{
				color: #fda544;
				font-weight: 600;
				display: flex;
				align-items: center;
				padding:0.2rem;
				justify-content: space-between;
				position: relative;
				.isFavorText{
					position: absolute;
					top:0.6rem ;
					right: 0.9rem;
					background-color: #fff;
					border: 1px solid #333;
					color: #333;
					font-size: 0.24rem;
					padding:0 0.04rem;
					span{
						color: red;
					}					
				}
			}
		}
	}
	
	.groupCont{
		.groupItem{
		.mineItem{
			width: 0.5rem;
			height: 0.5rem;
			line-height: 0.5rem;
			vertical-align: middle;
			padding-right: 0.4rem;
		}
		}
	}
	
</style>