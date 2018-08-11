/**
 * Created by wjy on 2018/7/23.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import shopCarTool from '../util/shop-car-tool'
var shopCar = new shopCarTool();

Vue.use(Vuex)

const ShopCar = { // 路由状态
  state: {
    length: shopCar.length(),
//  classifyData: shopCar.concatGwcInit(),
  },
  mutations: {
    setShopCarLength (state, length) {
      state.length = length
    },
//  concatGwcInit(state, value){
//  	console.log(state)
//  	state.classifyData = value;
//  }
  },
  getters: {
    getShopCarLength: state => {
      return state.length
    },
//  getClassifyData:state =>{
//  	console.log("state.classifyData")
//  	console.log(state.classifyData)
//  	return state.classifyData
//  }
  }
}

export default new Vuex.Store({
	modules:{
		ShopCar
	}
	
	
})
