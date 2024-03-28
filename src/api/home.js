import {get,post} from '@/utils/http'
export default {
    // 所有分类
    typeAll:()=>{
        return get('/api/type/all/')
    },
//    所有酒店
    hotelAll:()=>{
        return get('/api/hotel/recommend/')
    },
    // 搜索酒店
    search: (data)=>{
        return post('/api/hotel/search/',data)
    }




}