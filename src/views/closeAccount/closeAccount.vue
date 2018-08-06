<template>
	<div class="app-init">
    <div class="classification-header">
    	<header-back :title="headTitle"></header-back>

    </div>	
	<div class="absolute closeAccountCont">
		<!--头部三个选择s-->
			<div class="groupCont">
			    <tab bar-active-color="#FDA544" >
			      <tab-item selected active-class="tabItem">到店自取</tab-item>
			      <tab-item disabled active-class="tabItem">外卖配送</tab-item>
			    </tab>
				<group label-width="4.5em" label-margin-right="2em" gutter="0" label-align="left" class="groupItem" >
						<!--<popup-picker title="配送方式" :data="list" v-model="value5" value-text-align="left" ></popup-picker>-->
						<cell title="自取地址" value-align="left" primary="content"   value="上海市凤凰山凤凰峰">
							
						</cell>
						<cell title="自取电话" value-align="left" primary="content"  :value="myPhone" @click.native="showPhone = true">
							
						</cell>
						<popup-picker title="时间" v-model="formatDemoValue" value-text-align="left" :data="[['01','02','03'],['11','12','13']]" :display-format="format"></popup-picker>
						<popup-picker title="支付方式" :data="list2" v-model="value6" value-text-align="left" ></popup-picker>
						
				</group>	

			</div>
		<!--头部三个选择e-->
		
		<!--商品详情-->
		<div class="goodsDetail">
			<div class="gd-title">
				素匠泰茶(Whiterock)
			</div>
			<div class="gd-cont">
				<div class="gdc-detail" v-for="(goodsItem,index) in allGoods">
					<x-img  class="gdcd-img" v-lazy="goodsItem.sjtLogo"></x-img>
					<div  class="gdcd-price">
						<div class="gdcdp-right">
							<div class="gdcdpr-title">芒果奶昔</div>
							<div>+加冰+加热加冰+加热</div>
							<div>x2</div>
						</div>
						<div class="gdcdp-plus">
							$14.00
						</div>
					</div>
				</div>
					<div class="gdc-footer">
						<div class="gdcf-allPrice">
							小计：$14.50
						</div>
						<group title="卖家留言" class="gdc-textarea">
      						<x-textarea  name="detail" placeholder="写下想对卖家说的话" :show-counter="false" v-model="textAreaValue"></x-textarea>
    					</group>
					</div>
				
			</div>
			
			
		</div>
	</div>		
		<!--底部结算按钮s-->
	<div class="classification-footer absolute">
		<div class="cf-left">
			<div class="cfl-cont" >
				<x-img v-lazy="sjtLogo" class="iconfont icon-gouwuche ftl-gwc"></x-img>
				<div class="ftl-redPoint">
					12
				</div>
			</div>
		</div>
				<div class="cf-center">
			总价:$33.00
		</div>
				<div class="cf-right" @click="open('/login')">
			提交订单
		</div>
	</div>
	<!--底部结算按钮e-->
		
		
	<div >
      <confirm v-model="showPhone"
      show-input
      ref="confirm5"
      :title="showPhoneTitle"
       @on-cancel="onCancel"
      @on-confirm="onConfirm5"
      @on-hide="onHide">
      </confirm>
    </div>
		
	</div>
	
</template>

<script>
import headerBack from "../../components/header-back";
import { Confirm,XImg,Divider,PopupPicker,Tab,TabItem,XTextarea } from "vux";

export default{
	name:"closeAccount",
	data(){
		return{
			headTitle: "提交订单",
			sjtLogo:"../../../static/images/mine/sjtLogo.jpg",
			list2: [['微信支付', '支付宝', 'VISA/Master Card',"银行卡"]],
			value6: ['微信支付'],
			showPhone:false,
			showPhoneTitle:"更改自提电话",
			formatDemoValue: ['01', '12'],
			format: function (value, name) {
		        return `${value[0]}:${value[1]}`
		     },
		    myPhone:"18305626606",
		    allGoods:[{
		    	sjtLogo:"../../../static/images/mine/TimTest.jpeg",
		    },{
		    	sjtLogo:"../../../static/images/mine/TimTest.jpeg",
		    }],
		    textAreaValue:"sfsdfs"
		}
	},
	components:{
		Confirm,
		headerBack,
		XImg,
		PopupPicker,
		Tab,
		TabItem,
		XTextarea
	},
	methods:{
		//展示规格end
	    open(link){
	    	this.$router.openPage(link);
	    },
		
		//模态框s
	    onHide(){
	    	console.log("关闭模态框")
	    },
	    onCancel(){
	    	console.log("取消模态框")
	    },
	    onConfirm5 (value) {
	      console.log(value)
	      this.myPhone = value;
	    },
	    //模态框e
	}
	
	
}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">
@import "../../assets/scss/util";

.classification-footer {
  left: 0;
  right: 0px;
  bottom: 0px;
  top: calc(100vh - 1.4rem);
  height: $footerHeight;
  display: flex;
  z-index: 111;
  .cf-left {
    flex: 1;
    background-color: rgb(80, 80, 83);
    display: flex;
    justify-content: center;
    align-items: center;
    .cfl-cont {
      width: 1.2rem;
      height: 1.2rem;
      text-align: center;
      position: relative;
	  background-color:  rgb(80, 80, 83);
      top: 0.1rem;
      .ftl-gwc {
        height: 1rem;
        color: #fff;
      }
      .ftl-redPoint {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 0.4rem;
        font-size: 0.3rem;
        color: #fff;
        background-color: #ff0000;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
  .cf-center {
    flex: 3;
    background-color: rgb(80, 80, 83);
    color: #fff;
    line-height: $footerHeight;
  }
  .cf-right {
    flex: 1.5;
    background-color: rgb(46, 163, 69);
    color: #fff;
    text-align: center;
    line-height: $footerHeight;
  }
}

/*中间*/
.closeAccountCont{
	width: 100%;
	top: 1.2rem;
	bottom:  $footerHeight;
	overflow-y: auto;
		.groupCont{
			.tabItem{
				color: #FDA544;
			}
	}
	.goodsDetail{
		margin-top: 0.4rem;
		background-color: #FFF;
		.gd-title{
			font-size: 0.44rem;
			border-bottom: 1px solid #DDD;
			height: 1.2rem;
			line-height: 1.2rem;
			padding-left: 0.4rem;

		}
		.gd-cont{
			.gdc-detail{
					height: 2rem;
					display: flex;
					font-size: 0.32rem;
				.gdcd-img{
					width: 1.6rem;
					height: 1.6rem;
					padding: 0.2rem;
					/*border-radius: 50%;*/
				}	
				.gdcd-price{
					width: calc(10rem - 2.4rem);
					height: 1rem;
					line-height: 1rem;
					display: flex;
					justify-content: space-between;		
					color: #B2B2B2;
					.gdcdp-right{
						display: flex;
						flex-direction: column;
						div{
							height: 0.5rem;
						}
						.gdcdpr-title{
							height: 0.6rem;
							font-size: 0.42rem;
							color: #666;
						}

					}
					.gdcdp-plus{
						display: flex;
						justify-content: space-between;		
						padding-right: 0.6rem;		
						font-size: 0.42rem;		
					}			
				}			
			}
		}
		.gdc-footer{
				padding:0  0.2rem 0.2rem 0.2rem ;
			.gdcf-allPrice{
				padding-right: 0.6rem;				
				padding-bottom: 0.2rem;				
				text-align: right;
			}
			.gdc-textarea{
				border: 1px solid #D0D6D6;
			}
		}
	}
	}



.weui-cells,.vux-no-group-title{
	margin-top: 0!important;
}
</style>