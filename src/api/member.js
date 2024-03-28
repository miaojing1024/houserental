import {post} from '@/utils/http'
export default {
    // 用户信息
    Details:(data)=>{
        return post('/user/details/',data)
    },
    // 修改用户信息
    Update:(data)=>{
        return post('/user/update/',data)
    },
    // 申请会员
    Member:(data)=>{
        return post('/user/member/',data)
    },
    // 新建联系人信息
    newcustomer:(data)=>{
        return post('/customer/add/',data)
    },
    // 更新联系人信息
    updatecustomer:(data)=>{
        return post('/customer/update/',data)
    },
    // 获取联系人信息
    usercustomer:(data)=>{
        return post('/customer/user/',data)
    },
    // 删除联系人信息
    delcustomer:(data)=>{
        return post('/customer/del/',data)
    },



}