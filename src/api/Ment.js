import {get, post} from '@/utils/http'
export default {
    // 查询酒店
    hotelAll:()=>{
        return get('/api/hotel/all/')
    },
    // 添加酒店
    hotelAdd:(data)=>{
        return post('/hotel/add/',data)
    },
    // 上传图片
    fileAdd:(data)=>{
        return post('/file/add/',data)
    },
    // 删除酒店
    hotelDel:(data)=>{
        return post('/hotel/del/',data)
    },





}