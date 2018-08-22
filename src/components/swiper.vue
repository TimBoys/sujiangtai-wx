<template>
	<div class="swiper-container vue-swiper" ref="swiper">
		<div class="swiper-wrapper">
			<div class="swiper-slide" v-for="(x,index) in list">
				<a href="javascript:;" @click=""><img :src="x.figureAddress" :alt="x.alt || 'img'+index" /></a>
				
			</div>
		</div>
		<div class="swiper-pagination" ref="pagination"></div>
	</div>
</template>

<script>
	import Swiper from '../assets/swiper/swiper-3.4.2.min';
	import _ from 'lodash';
	
	var myswiper = null;
	
	export default{
		props:{
			list:Array,
			default:function(){
				return []
			},
			config:{
				type:Object,
				default:function(){
					return{
						autoplay:3000,
						observer:true,
						observeParents:true,
						autoplayDisableOnInteraction:false,
						loop:true
					}
				}
			}
		},
		data(){
			return{
				
			}
		},
		mounted(){
//			console.log(this.list)
			myswiper = new Swiper (this.$refs.swiper, _.assign({
		        pagination: this.$refs.pagination
		     }, this.config))
		},
		watch:{
			list(newVal,oldVal){
		        setTimeout(function () {
		          myswiper.update();
		        }, 10)				
			}
		}
		
		
		
		
	}
	
</script>

<style type="text/css">
  @import "../assets/swiper/swiper-3.4.2.min.css";
  .swiper-container img{
    width: 100%;
    height: 4rem;
  }

  .vue-swiper .swiper-pagination-bullet{
    background-color: #fff;
  }
  .vue-swiper .swiper-pagination-white .swiper-pagination-bullet-active{
    background-color: #fff;
  }
</style>