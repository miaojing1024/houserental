<template>
  <div class="info_mine">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="用户名" >
        <el-col :span="12">
          <el-input v-model="form.user" clearable   maxlength="10"
                    show-word-limit :disabled="!showPwd"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="密码" v-show="showPwd">
        <el-col :span="12">
          <el-input v-model="form.pwd" clearable   maxlength="8"
                    show-word-limit :disabled="!showPwd"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-col :span="12">
          <span>{{form.Email}}</span>
        </el-col>
      </el-form-item>
      <el-form-item label="用户身份">
        <el-col :span="12">
          <span><el-tag>{{form.ismember!==2?'平台游客':'酒店会员'}}</el-tag></span>
        </el-col>
      </el-form-item>
      <el-form-item label="是否管理员" v-if="form.isAdmin==1">
        <el-col :span="12">
          <span><el-tag>是</el-tag></span>
        </el-col>
      </el-form-item>
     <el-form-item label="钱包余额">
       <el-col :span="12">
         <span style="color: #27BB9A">{{form.Money}}</span>元
       </el-col>
     </el-form-item>
      <el-form-item label="注册时间">
        <el-col :span="12">
          <span>{{form.RegisterTime}}</span>
        </el-col>
      </el-form-item>
      <el-form-item v-if="form.ismember===2" label="成为会员时间">
        <el-col :span="12">
          <span>{{form.member_time}}</span>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button :type="!showPwd?'primary':'warning'"  @click="()=>{showPwd = !showPwd}">{{showPwd?'取消':'修改'}}</el-button>
        <el-button type="success" v-if="showPwd"  @click="onUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ApiMember from "@/api/member"
export default {
  name: "mine",
  data() {
    return {
      UserDetails:'',
      showPwd: false,
      form: {},
      user:{}
    }
  },
  beforeRouteEnter(to,from,next){
    if(from.name === 'login'){
      setTimeout(()=>{
        window.location.reload()
      },1000)
      next()
    }
    next()
  },
  created() {
    // this.form =  JSON.parse(sessionStorage.getItem("User"))
    this.user = JSON.parse(sessionStorage.getItem("User"))
    this.getDetails()
    // console.log(this.user,"user")
  },
  methods: {
    onUpdate(){
      let parms = {
        User_ID:this.user.ID,
        user: this.form.user,
        pwd: this.form.pwd
      }
      ApiMember.Update(parms).then(res=>{
        this.$message.success(res.msg)
        this.showPwd = false
        this.getDetails()
      })

    },
    getDetails(){
      // console.log("this.user.id",this.user.ID)
      ApiMember.Details(
        {ID: this.user.ID}
      ).then(
        res=>{
          // console.log(res.data)
          res.data.RegisterTime = this.$dayjs(res.data.RegisterTime).format("YYYY-MM-DD HH:mm:ss")
          res.data.member_time = this.$dayjs(Number(res.data.member_time)).format("YYYY-MM-DD HH:mm:ss")

      this.form = res.data
      sessionStorage.setItem("User", JSON.stringify(res.data))
        }
      )
      
    }
  }
}
</script>

<style lang="less" scoped>
.info_mine{
width: 90%;
  margin: auto;
}
</style>