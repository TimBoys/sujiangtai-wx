/*
 *	Created By Tim on 2018/8/6
 */

import DBLong from "../vue-db/vue-db-long.js";
import _ from 'lodash';
var DB = new DBLong();

class shopCarTool{
	constructor(store){
		var shopCar = DB.getItem("shop-car").toJson();
//		console.log(shopCar)
		if (!shopCar) {
			DB.setItem("shop-car",JSON.stringify(shopCar = {}));
		}
		this.$store = store;
		this.shopCarDB = shopCar;
	}
	
	//更新购物车
  upData() {
  	console.log("upData")
  	console.log(this.shopCarDB)
    DB.setItem('shop-car', JSON.stringify(this.shopCarDB))
    this.$store.commit('setShopCarLength', this.length())
  }	
	
	add(value){
		console.log("value" )
		console.dir( value)
	    var key = value.goodsItem.goodsId;
	
	    if(!key){
	      return
	    }
	    //新加入的商品是否在缓存的购物车中
	    if (this.shopCarDB[key]) {
	    	console.log("商品已经在购物车中")
	    	this.shopCarDB[key].length += 1;
	    	var itemGuigeLength = this.shopCarDB[key].itemGuige.length;
	    	var initLeng = 0;
			for (var i =0 ; i < itemGuigeLength ; i++) {
				//新加入商品的规格是否在缓存的购物车中
				if (this.shopCarDB[key].itemGuige[i].iGAGAllGuige == value.iGAGAllGuige) {
					this.shopCarDB[key].itemGuige[i].itemOneGuigeLen += 1;
				} else{
					initLeng++;
					if (itemGuigeLength == initLeng) {
						this.shopCarDB[key].itemGuige.push({itemOneGuigeLen:1,iGAGAllGuige:value.iGAGAllGuige,initGuiGeSC:value.initGuiGeSC})
					}
				}
			}	    	
	    	
	    }else{
	    	console.log("商品不在购物车中")
	     	// 过滤需要的信息
	      	var filter = {};
			filter.length =1;
			filter.itemGuige = [{itemOneGuigeLen:1,iGAGAllGuige:value.iGAGAllGuige,initGuiGeSC:value.initGuiGeSC}]
//			filter.initGuiGeSC = value.initGuiGeSC //选择规格数组
//			filter.iGAGAllGuige = value.iGAGAllGuige //选择规格字符串
			filter.goodsId = value.goodsItem.goodsId //规格所属的商品
			filter.goodsName = value.goodsItem.goodsName //规格所属的商品
			filter.iGAGPrice = value.iGAGPrice //选择商品加上规格的价格
			filter.goodsItem = value.goodsItem
	    	this.shopCarDB[key] = filter;
	    }
	    this.upData();
	}
	
	
  minus(value){
//	console.log(value)
//	console.log(this.shopCarDB)
  	var theItem = this.shopCarDB[value.id].itemGuige;
  	for (var i=0;i < theItem.length;i++) {
  		if (theItem[i].itemOneGuige[0].key == value.itemGuige.itemOneGuige[0].key && theItem[i].itemOneGuige[1].key == value.itemGuige.itemOneGuige[1].key && theItem[i].itemOneGuige[2].key == value.itemGuige.itemOneGuige[2].key) {
  			theItem[i].itemOneGuigeLen -= 1;
  			if(theItem[i].itemOneGuigeLen < 1){
  				delete theItem[i]
  			}
  			this.shopCarDB[value.id].length -= 1;
  			if (this.shopCarDB[value.id].length < 1) {
  				delete this.shopCarDB[value.id]
  			}
  		}
  	}
  	this.upData();
  }
	
  // 删除所有商品
  removeAll() {
    this.shopCarDB = {}
    this.upData()
  }
  
  // 获取全部数据
  getAll(){
    return this.shopCarDB
  }
  
	//所有商品数量
	length(){
		var n = 0;
	    for(var i in this.shopCarDB){
	      n += this.shopCarDB[i].length
	    }
	    return n		
	}
	
	//把购物车中商品和初始化商品合并
//	concatGwcInit(initVal){
////		console.log(initVal)
//		var returnGwcInit = [];
//		if(initVal){
//			console.log(123)
//			DB.setItem('shopCarDB2', JSON.stringify(initVal))
//		}
//		returnGwcInit = DB.getItem("shopCarDB2").toString();
//		
//		return returnGwcInit;
//		
//	}
	
	//
	
}

export default shopCarTool;
