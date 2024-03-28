<template>
  <header class='header'>
    <!--    导航栏-->
    <div class="main">
      <div class="con">
        <div class="con_mid" v-if="$route.path.indexOf('details')==-1">
          <el-input
              placeholder="请输入内容"
              v-model.trim="SearchVal"
              clearable>
          </el-input>
          <el-button type="primary" @click="Search" style="margin-left:10px">搜索</el-button>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </header>
</template>
<script>
import ApiHome from "@/api/home"

export default {
  name: 'index',
  data(){
    return{
      TypeList:[],
      SearchVal:''
    }
  },
  created() {
  },
  methods:{
    Search(){
     if(this.SearchVal){
        ApiHome.search({
          name:this.SearchVal
        }).then(res=>{
          if(res.code!=201){
            this.$router.push({
              name: "details",
              query: {
                ID: res.data.ID
              }
            })
          }
         
            this.SearchVal = ""
            

        })
     }else {
       this.$message.error("输入内容不能为空")
     }

    }


  },

}
</script>
<style scoped lang='less'>
.header {
  background: #F5F5F5;
  height: calc(100vh - 60px);

  // 导航栏
  .main {
    width: 100%;
    height: 100px;
    overflow: auto;
    background-color: #FFFFFF;

    .con {
      width: 60%;
      height: 100%;
      margin: auto;
      display: flex;
      align-items: center;
      position: relative;


      .con_mid {
        width: 50%;
        margin: auto;
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
  }



}
</style>
