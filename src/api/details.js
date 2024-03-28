import {get, post} from '@/utils/http'
export default {
    // 酒店详情
    hoteldet:(data)=>{
        return post('/api/hotel/details/',data)
    },
    // 获取酒店评论
    hotelcomm:(data)=>{
        return post('/api/comment/hotel/',data)
    },
    // 加入购物车
    addCar:(data)=>{
        return post('/car/add/',data)
    },




}