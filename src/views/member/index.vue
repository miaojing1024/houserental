<template>
  <div class="member">
    <div class="main">
      <div class="mine">
        <!--          头像-->
        <div class="mine_left">
          <div @click="toMine" style="display: flex; align-items: center">
            <img :src="$url+DetailsData.avatarUrl" style="border-radius: 50%">
            <span>{{DetailsData.user}}</span>
          </div>
        </div>
        <div class="mine_mid">
          <el-button size="medium" icon="el-icon-user" circle @click="ToMember"></el-button>
        </div>
        <div class="mine_right">
          <el-button size="medium" icon="el-icon-phone-outline" circle @click="ToAddress"></el-button>
        </div>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import ApiMember from "@/api/member";

export default {
  name: "index",
  data(){
    return{
      DetailsData:"",
      user:{}
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("User"))
    // res.
    this.getDetails()
  },
  methods:{
    toMine(){
      this.$router.push({
            name: "memberMine"
          }
      )
    },
    ToMember(){
      this.$router.push({
        name: "memberJoin"
         }
      )
    },
    ToAddress(){
      this.$router.push({
            name: "memberContact"
          }
      )
    },
    getDetails(){
      ApiMember.Details(
        {ID: this.user.ID}
      ).then(
        res=>{
          this.DetailsData = res.data
          res.data.RegisterTime = this.$dayjs(res.data.RegisterTime).format("YYYY-MM-DD HH:mm:ss")
          res.data.member_time = this.$dayjs(res.data.member_time).format("YYYY-MM-DD HH:mm:ss")
          sessionStorage.setItem("User", JSON.stringify(res.data))
         this.toMine()
        }
      )
      
    }
  }
}
</script>

<style lang="less" scoped>
.member {
  width: 100%;
  height: calc(100vh - 230px);

  .main {
    width: 60%;
    height: 100%;
    margin: 10px auto;
    background-color: #FFFFFF;
    overflow: auto;

    .mine {
      height: 150px;
      margin: 20px;
      background: url("../../assets/images/center-bg.jpg") no-repeat center;
      background-size: 100% 100%;
      display: flex;
      border-radius: 10px;

      .mine_left {
        flex: 4;
        display: flex;
        align-items: center;

        img {
          width: 120px;
          height: 120px;
          margin-left: 50px;
        }

        span {
          font-size: 26px;
          font-weight: bold;
          margin-left: 20px;
          color: #409EFF;
        }
      }

      .mine_mid {
        flex: 1;
        display: flex;
        justify-content: center;
        button {
          position: relative;
          margin-top: 30px;

          &::after {
            content: "会员中心";
            position: absolute;
            bottom: -27px;
            font-size: 20px;
            left: 50%;
            color: #409EFF;
            transform: translateX(-50%);

          }
        }

      }

      .mine_right {
        flex: 1;
        display: flex;
        justify-content: center;
        button {
          position: relative;
          margin-top: 30px;

          &::after {
            content: "联系人管理";
            position: absolute;
            bottom: -27px;
            font-size: 20px;
            left: 50%;
            color: #409EFF;
            transform: translateX(-50%);

          }
        }

      }
    }

  }
}

/deep/ .el-button--default {
  width: 70px;
  height: 70px;
}

/deep/ .el-icon-user,/deep/ .el-icon-phone-outline{
  font-size: 32px;
}
</style>