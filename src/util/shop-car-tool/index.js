/*
 *	Created By Tim on 2018/8/6
 */

import DBLong from "../vue-db/vue-db-long.js";
import _ from 'lodash';
var DB = new DBLong();

class shopCarTool{
	constructor(store){
		var shopCar = DB.getItem("shop-car").toJson();
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
	    var valInitGuiGeSC = "";
	    valInitGuiGeSC = JSON.stringify(value.initGuiGeSC)
	    console.log("valInitGuiGeSC")
	    console.log(valInitGuiGeSC)
	    if(!key){
	      return
	    }
	    //新加入的商品是否在缓存的购物车中
	    if (this.shopCarDB[key]) {
	    	console.log("商品已经在购物车中")
	    	var itemGuigeLength = this.shopCarDB[key].itemGuige.length;
	    	var initLeng = 0;
			for (var i =0 ; i < itemGuigeLength ; i++) {
				//新加入商品的规格是否在缓存的购物车中
				console.log(this.shopCarDB[key].itemGuige[i].iGAGAllGuige == value.iGAGAllGuige)
				if (this.shopCarDB[key].itemGuige[i].iGAGAllGuige == value.iGAGAllGuige) {
					this.shopCarDB[key].itemGuige[i].itemOneGuigeLen += 1;
				} else{
					initLeng++;
					if (itemGuigeLength == initLeng) {
						var data = {};
						data = {
							itemOneGuigeLen:1,
							hasGuigePrice:value.iGAGPrice,
							guiGePrice:value.iGAGPrice - value.goodsItem.goodsPrice,
							iGAGAllGuige:value.iGAGAllGuige,
							initGuiGeSC:valInitGuiGeSC
						};
						this.shopCarDB[key].itemGuige.push(data);
						console.log(data)
					}
				}
			}	    	
	    	this.shopCarDB[key].length += 1;
	    	console.log("this.shopCarDB[key]")
	    	console.log(this.shopCarDB[key])
	    }else{
	    	console.log("商品不在购物车中")
	     	// 过滤需要的信息
	      	var filter = {};
			filter.length =1;
			//选择规格数组和规格所属的商品
			var data = {};
			data = {
				itemOneGuigeLen:1,
				hasGuigePrice:value.iGAGPrice,
				guiGePrice:value.iGAGPrice - value.goodsItem.goodsPrice,
				iGAGAllGuige:value.iGAGAllGuige,
				initGuiGeSC:valInitGuiGeSC
			};
			filter.itemGuige = [];
			filter.itemGuige.push(data);
			filter.goodsId = value.goodsItem.goodsId //规格所属的商品
			filter.goodsName = value.goodsItem.goodsName //规格所属的商品
			filter.iGAGPrice = value.iGAGPrice //选择商品加上规格的价格
			filter.goodsItem = value.goodsItem
	    	this.shopCarDB[key] = filter;
	    }
	    this.upData();
	}
	
	
  minus(value){
	console.log(value)
	console.log(this.shopCarDB)

	var theItem = this.shopCarDB[value.goodsItem.goodsId].itemGuige; //再购物车中找到减去的商品
	var theGoodsLen = this.shopCarDB[value.goodsItem.goodsId]; //这个商品的数量
//	debugger
	for (var i=0;i < theItem.length;i++) {
		if (theItem[i].iGAGAllGuige == value.iGAGAllGuige) {
			theItem[i].itemOneGuigeLen -= 1;
			if(theItem[i].itemOneGuigeLen < 1){
				theItem.splice(i,1);
			}
			theGoodsLen.length -= 1;
			if (theGoodsLen.length < 1) {
//				theGoodsLen.splice(i,1);
				delete this.shopCarDB[value.goodsItem.goodsId];
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
//	    console.log(this.shopCarDB)
//	    console.log(n)
	    return n		
	}
	
	
}

export default shopCarTool;
