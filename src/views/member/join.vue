<template>
    <div class="join">
      <div>
        <h3>酒店平台，期待会员的路上有您伴同行</h3>
        <p style="text-align: center">仅需 <span style="color: #F56C6C;font-size: 20px;font-weight: 600">99.99元</span>可成为终身会员</p >
        <p>成为会员后您将获得以下权益：</p >
        <ol style="margin-left: 20px;margin-top: 10px">
          <li>退换无忧，星级服务；</li>
          <li>所有房型9折入住；</li>
          <li>更多权益，敬请期待！</li>
        </ol>
        <el-card class="box-card">
          <img src="../../assets/images/joinBg.jpg" alt="" style="width: 100%;height: 400px">
        </el-card>
        <div style="display: flex;justify-content: center">
          <el-button type="primary" style="width: 200px;margin-top: 10px" @click="JoinVip" v-if="DetailsData.ismember === 0">立即加入</el-button>
          <p v-else-if="DetailsData.ismember===1" style="width: 100%;text-align: center;margin-top: 50px">您的申请已经提交，后台审核中，请您耐心等待...</p >
          <p v-else style="width: 100%;text-align: center;margin-top: 30px">尊敬的：{{DetailsData.user}}，您成为会员的时间是：{{DetailsData.member_time}}</p >
        </div>

      </div>
    </div>
</template>

<script>
import ApiMember from "@/api/member"

export default {
  name: "join",
  data(){
    return{
      DetailsData:JSON.parse(sessionStorage.getItem('User'))
    }
  },
  created() {
    
  },
  methods:{
    JoinVip(){
      ApiMember.Member({
        User_ID:this.DetailsData.ID
      }).then(res=>{
        this.$message.success(res.msg)

        this.getDetails()
      })
    },
    
     getDetails(){
      ApiMember.Details(
        {ID: this.DetailsData.ID}
      ).then(
        res=>{
          this.DetailsData = res.data
          res.data.RegisterTime = this.$dayjs(res.data.RegisterTime).format("YYYY-MM-DD HH:mm:ss")
          res.data.member_time = this.$dayjs(Number(res.data.member_time)).format("YYYY-MM-DD HH:mm:ss")
          sessionStorage.setItem("User", JSON.stringify(res.data))
        }
      )
     
    }
  }
}
</script>

<style lang="less" scoped>
.join{
  width: 90%;
  margin: auto;
h3{
  width: 100%;
  text-align: center;
}

.box-card {
  width: 100%;
  margin-top: 20px;
}
}
</style>