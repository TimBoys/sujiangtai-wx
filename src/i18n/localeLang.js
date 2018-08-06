import VueDB from '../util/vue-db/vue-db-long'
let DB = new VueDB();

//export let localLang = navigator.language.slice(0,2);

var localLangs = DB.getItem("localLang").toString();
console.log(localLangs)

var localLang = localLangs || "en";

console.log(localLang)



export default{
	localLang:localLang
	
};

