import {get, post} from '@/utils/http'
export default {
    // 查询分类
    typeAll:()=>{
        return get('/api/type/all/')
    },
    // 添加分类
    typeAdd:(data)=>{
        return post('/type/add/',data)
    },
    // 删除分类
    typeDel:(data)=>{
        return post('/type/del/',data)
    },





}