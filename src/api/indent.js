import {get, post} from '@/utils/http'
export default {
    // 查看所有订单
    allUser:(data)=>{
        return post('/buy/allUser/', data)
    },
      // 确认入驻
      buyReceipt:(data)=>{
        return post('/buy/user/receipt/', data)
    },

}