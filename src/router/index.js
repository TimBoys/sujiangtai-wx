import Vue from 'vue'
import Router from 'vue-router'
import _ from 'lodash'
import test from '@/components/test'

console.log(_.assignIn({
	time:new Date().getTime()
}, {}))
Router.prototype.openPage = function(link,query){
	console.log(link)
	this.push({
		path:link,
		query:_.assignIn({
			time:new Date().getTime()
		},query || {})
		
	})
}

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			redirect: '/home'
		},
		{
			path: '/test',
			name: 'test',
			component: test
		},
		{
			path: '/home',
			name: 'home',
		    component(resolve){
		       require(['@/views/home/home.vue'], resolve)
		    }
		},		
		{
			path: '/classification',
			name: 'classification',
		    component(resolve){
		       require(['@/views/classification/classification.vue'], resolve)
		    }
		},	
		{
			path: '/mine',
			name: 'mine',
		    component(resolve){
		       require(['@/views/mine/mine.vue'], resolve)
		    }
		},
		{
			path: '/closeAccount',
			name: 'closeAccount',
		    component(resolve){
		       require(['@/views/classification/closeAccount/closeAccount.vue'], resolve)
		    }
		},
		{
			path: '/login',
			name: 'login',
		    component(resolve){
		       require(['@/views/login/login.vue'], resolve)
		    }
		},
		{
			path: '/register',
			name: 'register',
		    component(resolve){
		       require(['@/views/register/register.vue'], resolve)
		    }
		},
		{
			path: '/helpCenter',
			name: 'helpCenter',
		    component(resolve){
		    	console.log(124444444444)
		       require(['@/views/helpCenter/helpCenter.vue'], resolve)
		    },
		},
		{
		    	path:'/hcDetail',
		    	name:'hcDetail',
			    component(resolve){
			       require(['@/views/helpCenter/hcDetail/hcDetail.vue'], resolve)
			    },		    	
		},
		{
			path: '/news',
			name: 'news',
		    component(resolve){
		       require(['@/views/news/news.vue'], resolve)
		    }
		},		
		{
			path: '/indent',
			name: 'indent',
		    component(resolve){
		       require(['@/views/indent/indent.vue'], resolve)
		    }
		},		
		
	]
})