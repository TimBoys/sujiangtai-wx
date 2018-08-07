/*
 *	Created By Tim on 2018/8/6
 */

import DBLong from "../vue-db/vue-db-long.js";
import _ from 'lodash';
var DB = new DBLong();

class shopCarTool{
	constructor(store){
		var shopCar = DB.getItem("shop-car").toJson();
		console.log(shopCar)
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
	    var key = value.id
	
	    if(!key){
	      return
	    }
	    //新加入的商品是否在缓存的购物车中
	    if (this.shopCarDB[key]) {
	    	this.shopCarDB[key].length += 1;
	    	var itemGuigeLength = this.shopCarDB[key].itemGuige.length;
	    	var initLeng = 0;
			for (var i =0 ; i < itemGuigeLength ; i++) {
				//新加入商品的规格是否在缓存的购物车中
				if (this.shopCarDB[key].itemGuige[i].itemOneGuige[0].key == value.oneGuige[0].key && this.shopCarDB[key].itemGuige[i].itemOneGuige[1].key == value.oneGuige[1].key && this.shopCarDB[key].itemGuige[i].itemOneGuige[2].key == value.oneGuige[2].key) {
					this.shopCarDB[key].itemGuige[i].itemOneGuigeLen += 1;
				} else{
					initLeng++;
					if (itemGuigeLength == initLeng) {
						var itemOneGuige = value.oneGuige;
						this.shopCarDB[key].itemGuige.push({itemOneGuigeLen:1,itemOneGuige})
					}
					
				}
			}
	    }else{
	     	// 过滤需要的信息
	      	var filter = {};
			filter.length =1;
			var itemOneGuige = value.oneGuige;
			filter.itemGuige = [{itemOneGuigeLen:1,itemOneGuige}]
			filter.id = value.id;
			filter.name = value.name;
//			console.log(filter);
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
	
	
}

export default shopCarTool;
