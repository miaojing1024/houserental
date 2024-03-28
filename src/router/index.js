//引入Vue
import Vue from "vue";
//引入vue-router
import VueRouter from "vue-router";

// 使用VueRouter
Vue.use(VueRouter);
const routerPush = VueRouter.prototype.push;

VueRouter.prototype.push = function (location) {

    return routerPush.call(this, location).catch(err => {})

};

//配置路由

//2.定义路由(路由对应相应的页面)
//path:配置的路由接口  component:path对应的组件
let routes = [
    {
        path: "/",
        component: ()=>import('@/components/layout'),
        children: [
            {
                path: "/",
                name: "index",
                redirect:'/home',
                component: ()=>import('@/views/index/index'),
                children:[
                    // 商城首页
                    {
                        path:'home',
                        name:'home',
                        component:()=>import('@/views/index/home')
                    },
                    // 我的订单
                    {
                        path:'order',
                        name:'order',
                        component:()=>import('@/views/order/index')
                    },
                    // 商品详情
                    {
                        path:'details',
                        name:'details',
                        component:()=>import('@/views/details/index')
                    },
                    // 我的购物车
                    {
                        path:'car',
                        name:'car',
                        component:()=>import('@/views/car/index')
                    },
                    // 化妆品管理
                    {
                        path:'Ment',
                        name:'Ment',
                        component:()=>import('@/views/Ment/index')
                    },
                    // 评价管理
                    {
                        path:'review',
                        name:'review',
                        component:()=>import('@/views/review/index')
                    },
                    // 用户管理
                    {
                        path:'admin',
                        name:'admin',
                        component:()=>import('@/views/admin/index')
                    },
                    // 订单管理
                    {
                        path:'indent',
                        name:'indent',
                        component:()=>import('@/views/indent/index')
                    },
                    // 分类管理
                    {
                        path:'type',
                        name:'type',
                        component:()=>import('@/views/type/index')
                    },
                    // 用户中心
                    {
                        path:'member',
                        name:'member',
                        redirect:'/member/mine',
                        component:()=>import('@/views/member/index'),
                        children:[
                            {
                                path: "mine",
                                name:'memberMine',
                                component:()=>import('@/views/member/mine'),
                            },
                            {
                                path: "join",
                                name:'memberJoin',
                                component:()=>import('@/views/member/join'),
                            },
                            {
                                path: "contact",
                                name:'memberContact',
                                component:()=>import('@/views/member/contact'),
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // 登录
    {
        path: "/login",
        name: "login",
        component: ()=>import('@/views/login')
    },
    // 注册
    {
        path: "/register",
        name: "register",
        component: ()=>import('@/views/register')
    },
]

//3.创建router实例,然后传routes配置
let router = new VueRouter({
    routes //缩写ES6:routes:routes
})

//4.暴露router对象
export default router

//在main.js中将router实例挂载到整个Vue实例对象上
