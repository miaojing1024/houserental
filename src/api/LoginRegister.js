import {post} from '@/utils/http'
export default {
    // 登录
    login:(data)=>{
        return post('/api/login/',data)
    },
    // 注册
    register:(data)=>{
        return post('/api/register/',data)
    },
}