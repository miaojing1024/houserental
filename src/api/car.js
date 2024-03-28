import {get, post} from '@/utils/http'
export default {
    // 查询购物车
    carAll:(data)=>{
        return post('/car/all/', data)
    },
    // 批量删除
    carDel: (data)=>{
        return post('/car/del/', data)
    },
    // 批量购买
    carAdd: (data)=>{
        return post('/buy/add/', data)
    },
    // 修改酒店数量
    carUpdate: (data)=>{
        return post('/car/update/', data)
    },
//    轮询查询订单
    OrderSearch:(data)=>{
        return post('/buy/order/one/',data)
    }





}