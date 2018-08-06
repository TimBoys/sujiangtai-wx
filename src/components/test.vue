<template>
	<div class="hello">
		<!--<div class="about-words">
			{{ $t("message.hello") }} {{nowStatus}}
		</div>

		<group>
			<cell title="title" value="value"></cell>
		</group>
		<router-link to="/home">Go to HelloWorld</router-link>
		<img v-lazy="imgSrc">
		<swiper :list="banner"></swiper>-->
		{{$route.query}}
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import VueDB from '../util/vue-db/vue-db-long.js'
	import swiper from './swiper'

	var DB = new VueDB();

	export default {
		name: 'test',
		data() {
			return {
				msg: '',
				imgSrc: "https://gw.alicdn.com/tfs/TB1gBPhgZLJ8KJjy0FnXXcFDpXa-468-60.jpg",
				banner: [{
						src: 'http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/1888a9f0a6ae807113cb428b9e01f5fe.jpg',
						href: '/detail/1007'
					},
					{
						src: 'http://oz3tayfme.bkt.clouddn.com/show.liluo.cc/2018011213275295675.png',
						href: '/detail/1009'
					}
				]
			}
		},
		computed: {
			...mapGetters({
				nowStatus: "nowStatus"
			})
		},
		mounted: function() {
			DB.setItem("name", "wjy");
			DB.setItem("obj", {
				aa: 11,
				bb: 22
			});
			console.log(DB.getItem("name").toString())
			console.log(DB.getItem("obj").toJson())

			//			console.log(this.$router)

			//			测试axios---start
			this.$http
				.get("/getAllGoodsClass")
				.then(res => {
					//					console.log(res)
				})
				.catch(err => {
					console.log(err);
				});

			this.$http.post("/jielong/selectAll", {
				'pageNum': 2,
				'pageSize': 2
			}).then((res) => {
				//				console.log(res)
			}).catch((err) => {
				//				console.log(err)
			})
			//			测试axios---end

		},
		components:{
			swiper
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
	@import "../assets/scss/util"; .about-words{ width: getIphoneWidth(20px); border: getIphoneWidth(20px) solid red; }
</style>