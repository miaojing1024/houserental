import {get, post} from '@/utils/http'
export default {
    // 查询评价
    reviewAll:()=>{
        return get('/comment/all/')
    },
    // 删除评价
    reviewDel:(data)=>{
        return post('/comment/del/',data)
    },





}