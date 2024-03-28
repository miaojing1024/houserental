import {get, post} from '@/utils/http'
export default {
    // 查询成员
    userAll:()=>{
        return post('/user/all/')
    },
    // 成为会员
    memberAdd:(data)=>{
        return post('/user/member/add/',data)
    },





}