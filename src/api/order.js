import {get, post} from '@/utils/http'
export default {
    // 查询订单
    buyAll:(data)=>{
        return post('/buy/all/user/', data)
    },
    // 入驻评价
    commEvaluate:(data)=>{
        return post('/comment/add/', data)
    },
    // 轮询查询订单
    buyOrder:(data)=>{
        return post('/buy/order/one/', data)
    },
    // 增加参数
    orderID:(data)=>{
        return post('/buy/add/', data)
    },
    // 退房
    Chargeback:(data)=>{
        return post('/buy/Chargeback/', data)
    },
    // 删除订单
    cancelOrder:(data)=>{
    return post('/buy/user/del/', data)
}



}