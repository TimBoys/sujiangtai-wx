<template>
  <div id="app">
    <div >
      <transition :name="transitionName">
      	<!--<keep-alive>-->
        <router-view></router-view>
        <!--</keep-alive>-->
      </transition>
    </div>

    <footer class="footer clear" :class="{'leave':leaveComp}">
      <div class="footer-item" :class="{ 'active': isActive('home') }" @click="open('/home')">
        <p class="icon">
          <span class="iconfont icon-shouye"></span>
        </p>
        <p class="name">{{$t('BottomNav.nav_djjx')}}</p>
      </div>    	
      <div class="footer-item" :class="{ 'active': isActive('classification') }" @click="open('/classification')">
        <p class="icon">
          <span class="iconfont icon-classifition"></span>
        </p>
        <p class="name">{{$t('BottomNav.nav_sysp')}}</p>
      </div>     	
      <div class="footer-item" :class="{ 'active': isActive('mine') }" @click="open('/mine')">
        <p class="icon">
          <span class="iconfont icon-mine"></span>
        </p>
        <p class="name">{{$t('BottomNav.nav_grzx')}}</p>
      </div> 	
    	
    </footer>
  </div>
</template>

<script>
import Rem from '@/assets/js/rem';
import VueDB from './util/vue-db/vue-db-long';
new Rem();
var DB = new VueDB();

export default {
  name: 'App',
  data(){
  	return {
  		transitionName:"slide-go",
  		nowUrl:"/",
  		djjx:this.$t('home.topFire_src.title_djjx')
  	}
  },
  watch:{
			'$route'(to,from){
//				console.log(from)
//				console.log(to)
				if(from.query.time){
					if(to.query.time > from.query.time){
						this.transitionName = "slide-go";
					}else{
						this.transitionName = "slide-back";
					}
				}else{
					this.transitionName = "slide-go"
				}
				this.nowUrl = to.fullPath
			}
		},
	computed:{
		leaveComp(){
			var resout = false;
			var base = ['home','classification','mine',"login","register","aboutUs","hcDetail","forgetPassword","indent","mineOrder","mineOrderDetail"];
			
        for(var i=0; i<base.length; i++){
          if(this.isActive(base[i])){
            resout = false;
          }
        }
			if (this.isActive("classification") || this.isActive("closeAccount") ||  this.isActive("login") ||  this.isActive("register") || this.isActive("aboutUs") || this.isActive("hcDetail") || this.isActive("forgetPassword") || this.isActive("indent") || this.isActive("mineOrder") || this.isActive("mineOrderDetail")) {
				resout = true;
			}			
			
			return resout;
		}
	},
	methods:{
		isActive(name){
			return this.nowUrl.indexOf(name) != -1;
		},
		open(link){
			DB.setItem("isOrder","noOrder");
			DB.setItem("selectThisGoods",JSON.stringify({}));
			this.$router.openPage(link);
			
		}
	}
}
</script>

<style lang="scss" type="text/scss">
	@import "./assets/scss/public";
 /*@import '~@/assets/font/iconfont.css'*/


</style>
