<template>
		<div class="app-init">
		<header-back :title="headTitle"></header-back>
		<div class="tabCont">
		    <tab bar-active-color="#FDA544" active-color="#FDA544" height="1rem">
		      <tab-item selected @on-item-click="onItemClick(1)"  v-if="mineOrderType == 1" selected>{{$t('closeAccount.eatIn')}}</tab-item>
		      <tab-item selected @on-item-click="onItemClick(1)" v-else>{{$t('closeAccount.eatIn')}}</tab-item>
		      <tab-item @on-item-click="onItemClick(0)" v-if="mineOrderType == 0" selected>{{$t('closeAccount.reserve')}}</tab-item>
		      <tab-item @on-item-click="onItemClick(0)" v-else>{{$t('closeAccount.reserve')}}</tab-item>
		    </tab>
		    
 <!--堂吃-->	
		   <div class="yyTcCont" v-show="mineOrderType == 1">
		   	<!--tc-->
		   	   <scroller lock-x height="100%" @on-scroll-bottom="onScrollBottom" :scroll-bottom-offst="2000">
		   	  	<div class="box2">
		   	  <div class="yyTcItem" v-for="(item,index) in tcData" >
		   	  	
		   	  	
		   	  	<div class="topItem" @click="watchDetail(item)">
			   	  	<div class="ti_titile">
			   	  		<div class="tit_orderNo">{{item.orderNo}}</div>
			   	  		<div class="tit_orderTime">{{item.orderTime}}</div>
			   	  	</div>
			   	  	<div class="ti_detail"><span>{{$t('mine.viewDetails')}}</span></div>
		   	  	</div>
		   	  	<div class="bottomItem">
			   	  	<div class="bi_cont">
			   	  		<div v-if="item.payStatus == 0">{{$t('mine.unpaid')}}</div>
			   	  		<div v-else-if="item.payStatus == 1">{{$t('mine.paymentSuccess')}}</div>
			   	  		<div v-else-if="item.payStatus == 2">{{$t('mine.paymentSuccess')}}</div>
			   	  		
			   	  		<div v-if="item.orderStatus == 0">{{$t('mine.placedAnOrder')}}</div>
			   	  		<div v-else-if="item.orderStatus == 1">{{$t('mine.finishedOrder')}}</div>
			   	  		<div v-else-if="item.orderStatus == 2">{{$t('mine.PickupToComplete')}}</div>
			   	  		<div v-else-if="item.orderStatus == 3">{{$t('mine.delivery')}}</div>
			   	  		<div v-else-if="item.orderStatus == 4">{{$t('mine.revocation')}}</div>
			   	  		
			   	  	</div>
		   	  	</div>	
		   	  	
		   	  	<div class="bottomItem">
			   	  	<div class="bi_cont">
			   	  		<div v-for="(itemName,indexName) in item.orderDetails" v-if="!indexName">{{itemName.goodsName}}{{$t('mine.andSoOn')}} {{item.orderDetails.length}} {{$t('mine.items')}}</div>
						<div class="bi-origPrice">${{item.origPrice}}</div>
			   	  	</div>
		   	  	</div>	
		   	  	
		   	  	
		   	  </div>
 				  <!--<load-more v-if="tcNoData" tip="loading"></load-more>-->
 				   <load-more v-if="!tcNoData" :show-loading="false" :tip="noMore" background-color="#fbf9fe"></load-more>
			      </div>
			    </scroller>		   	  	
		   </div>
 <!--堂吃-->		   
		   
 <!--预定-->
		   <div class="yyTcCont" v-show="mineOrderType == 0">
		   <!--yy-->
		   	   <scroller lock-x height="100%" @on-scroll-bottom="onScrollBottom"  :scroll-bottom-offst="2000">
		   	  	<div class="box2">
		   	  <div class="yyTcItem" v-for="(item,index) in yyData" >
		   	  	
		   	  	
		   	  	<div class="topItem" @click="watchDetail(item)">
			   	  	<div class="ti_titile">
			   	  		<div class="tit_orderNo">{{item.orderNo}}</div>
			   	  		<div class="tit_orderTime">{{item.orderTime}}</div>
			   	  	</div>
			   	  	<div class="ti_detail"><span>{{$t('mine.viewDetails')}}</span></div>
		   	  	</div>
		   	  	<div class="bottomItem">
			   	  	<div class="bi_cont">
			   	  		<div v-if="item.payStatus == 0">{{$t('mine.unpaid')}}</div>
			   	  		<div v-else-if="item.payStatus == 1">{{$t('mine.paymentSuccess')}}</div>
			   	  		<div v-else-if="item.payStatus == 2">{{$t('mine.paymentSuccess')}}</div>
			   	  		
			   	  		<div v-if="item.orderStatus == 0">{{$t('mine.placedAnOrder')}}</div>
			   	  		<div v-else-if="item.orderStatus == 1">{{$t('mine.finishedOrder')}}</div>
			   	  		<div v-else-if="item.orderStatus == 2">{{$t('mine.PickupToComplete')}}</div>
			   	  		<div v-else-if="item.orderStatus == 3">{{$t('mine.delivery')}}</div>
			   	  		<div v-else-if="item.orderStatus == 4">{{$t('mine.revocation')}}</div>
			   	  		
			   	  	</div>
		   	  	</div>	
		   	  	
		   	  	<div class="bottomItem">
			   	  	<div class="bi_cont">
			   	  		<div v-for="(itemName,indexName) in item.orderDetails" v-if="!indexName">{{itemName.goodsName}}{{$t('mine.andSoOn')}} {{item.orderDetails.length}} {{$t('mine.items')}}</div>
						<div class="bi-origPrice">${{item.origPrice}}</div>
			   	  	</div>
		   	  	</div>	
		   	  	
		   	  	
		   	  </div>
 				  <!--<load-more v-if="yyNoData" tip="loading"></load-more>-->
 				  <load-more v-if="!yyNoData" :show-loading="false" :tip="noMore" background-color="#fbf9fe"></load-more>
			      </div>
			    </scroller>		   	  	
		   </div>
		   <!--预定-->
		   
    	</div>
			<loading :show="showLoading" width="5rem" is-show-mask :text="showText"></loading>	
		</div>
</template>

<script>
import VueDB from "../../util/vue-db/vue-db-long.js";
import headerBack from "../../components/header-back";
import { Scroller, Divider, Spinner, XButton, Group, Cell, LoadMore } from 'vux'

	var DB = new VueDB();

	export default{
		name:"mineOrder",
		data(){
			return{
				headTitle:this.$t('mine.mineOrder'), //我的订单
				mineOrderType:null,  //1堂吃0预约
				yyData:[],  //堂吃
				tcData:[],  //预定
				showLoading:false, //loading
				showText:this.$t("reminder.dataLoading"),
      			onFetching: false,
      			yyPageNumber:1,
      			tcPageNumber:1,
     			yyNoData:true,
      			tcNoData:true,      
      			flgtcyy:null,
      			noMore:this.$t("reminder.noMore"),
			}
		},
		mounted:function(){
			this.initData(1);
			
		},
		methods:{
			initData(val){
				this.showLoading = true;
				setTimeout(()=>{
					this.showLoading = false;
				},30000)
				//是否有堂吃预定缓存
				var isYyTc = DB.getItem("isYyTc").toNumber();
				console.log("isYyTc")
				console.log(isYyTc)
				if (!isNaN(parseInt(isYyTc))) {
					this.mineOrderType = isYyTc;
				}else{
					DB.setItem("isYyTc","1");
					this.mineOrderType = 1;
				}
//				console.log(this.mineOrderType)
				
				if(val){
					this.queryOrdersByUserNoPage(0,1); //预约
					this.queryOrdersByUserNoPage(1,1); //堂吃
				}else{
					this.queryOrdersByUserNoPage();
				}
			},
			
			//分页查询数据接口
			queryOrdersByUserNoPage(val,flg){
				var pageNumber = 1;
				var mineOrderType = null;
				if (flg) {
					//第一次默认都加载预定堂吃
					mineOrderType = val;
				} else{
					mineOrderType = this.mineOrderType;
					pageNumber = Number(mineOrderType) ? this.tcPageNumber : this.yyPageNumber;
					console.log("pageNumber")
					console.log(pageNumber)
				}
				var telUserNo = DB.getItem("telUserNo").toJson(); 
				console.log(telUserNo)
				//判断是否登录
				if(telUserNo){
				//封装请求数据
				var data = {
						pageNumber:pageNumber,
						pageSize:10,
						params:{
							userNo:telUserNo.userNo,
							lang:DB.getItem("localLang").toString(),
							storeNo: DB.getItem("storeNo").toString(),
							orderType:mineOrderType,
							payStatus:1
						}
				}
				data = JSON.stringify(data);
				console.log("/userOrderInfo/queryOrdersByUserNoPage")
				
				this.$http.get("/userOrderInfo/queryOrdersByUserNoPage",{
					params:{
						jsonStr:data
					}					
				}).then((res) => {
					console.log(res)
					if(res.status == 200){
							if(DB.getItem("localLang").toString() == "en"){
								var ErrorMsg = res.data.data.usErrorMsg;
							}else{
								var ErrorMsg = res.data.data.cnErrorMsg;
							}
							
						if(res.data.data.rspCode == "00000" ){
							if(res.data.data.rows){
								if(!Number(mineOrderType)){
									res.data.data.rows.forEach((item,index)=>{
										this.yyData.push(item);
									})
									console.log("yyData")
									console.log(this.yyData)
								}else{
									res.data.data.rows.forEach((item,index)=>{
										this.tcData.push(item);
									})
									console.log("tcData")
									console.log(this.tcData)
								}
							}else{
								console.log("已经没有更多了")
								console.log(this.mineOrderType)
								this.flgtcyy == "istc" ? this.tcNoData = false : "";
								this.flgtcyy == "isyy" ? this.yyNoData = false : "";
							}
						}else{
							this.$vux.toast.show({
								text: ErrorMsg,
								type: "text",
							})								
						}
						this.showLoading = false;
					}
				}).catch((err) => {
					console.log(err)
					this.showLoading = false;
				})				
			}else{
           		this.$vux.toast.show({
					text: "该用户还未登录！",
					type: "text",
				})	
				this.$router.openPage("/mine");
			}
			},			
			
			//切换预约堂吃
			onItemClick(value){
				console.log("value")
				console.log(value)
				this.mineOrderType = value;
				DB.setItem("isYyTc",value); //存默认是预定还是堂吃

			},
			
			//查看明细
			watchDetail(item){
				console.log(item)
				DB.setItem("orderDetail",JSON.stringify(item));
				this.$router.openPage("/mineOrderDetail");
			},
			
		    onScrollBottom () {
		      if (!this.tcNoData && Number(this.mineOrderType)) {
		      	return false;
		      }else if(!this.yyNoData && !Number(this.mineOrderType)){
		      	return false;
		      }
		    	
		      this.showLoading = true;
		      if (this.onFetching) {
		        // do nothing
		      } else {
		        this.onFetching = true
		        setTimeout(() => {
		          this.$nextTick(() => {
		          	if(Number(this.mineOrderType)){
		          		this.tcPageNumber++;
		          		this.flgtcyy = "istc";
		          	}else{
		          		console.log("我是预定")
		          		this.yyPageNumber++;
		          		this.flgtcyy = "isyy";
		          	}
		          	this.initData();
		          })
		          this.onFetching = false
		        }, 2000)
		      }
		    },			
			
		},
		components:{
			headerBack,
			Scroller,
		    Divider,
		    Spinner,
		    XButton,
		    Group,
		    Cell,
		    LoadMore
		}
		
	}
	
	
</script>

<style lang="scss" type="text/scss" scoped="scoped">
@import "../../assets/scss/util";

.tabCont{
	.yyTcCont{
		overflow-y:auto ;
		position: absolute;
		top: 2.3rem;
		bottom: 0;
		width:10rem;
		font-size: 0.32rem;
		.yyTcItem{
			&>div{
				padding: 0.02rem;
			}
			padding: 0.3rem;
			border-bottom:1px solid #CCC;
			.topItem{
				.ti_titile{
					display: flex;
					flex-direction: column;
					justify-content:center;	
					.tit_orderNo{
						font-size: 0.38rem;
					}
					.tit_orderTime{
						font-size: 0.28rem;
					}					
				}
				.ti_detail{
					display: flex;
					justify-content:center;	
					font-weight: 600;
					color: #FDA544;	
					span{
						vertical-align: top;
					}		
				}
				display: flex;
				justify-content: space-between;				
			}
			.bottomItem{
				.bi_cont{
					display: flex;
					justify-content: space-between;		
					.bi-origPrice{
						color: red;
						font-size: 0.34rem;
					}				
				}
			}
		}
		
	}
	
	
}

</style>