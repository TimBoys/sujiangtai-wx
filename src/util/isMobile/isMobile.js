/**
 * 判断访问类型是电脑还是手机
 * 
 * @author 吴军炎
 * 
 * 2018年9月21日
 */

class isMobile{
	
	constructor(){
	}
	
	isMobile(){
		var userAgentInfo = navigator.userAgent;
		var mobileAgents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad","iPod"];
		var mobile_flag = false; // true为手机端，false为PC端
//		console.log(userAgentInfo)
	    //根据userAgent判断是否是手机
	    for (var v = 0; v < mobileAgents.length; v++) {
	        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
	            mobile_flag = true;
	            break;
	        }
	    }
		
		return mobile_flag;
	}
	
	
	
	
	
}

export default isMobile;