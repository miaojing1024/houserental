<template>
<div>
  <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      :router=true
      active-text-color="#409EFF">
    <el-menu-item index="/home">平台首页</el-menu-item>
      <el-menu-item index="/order"  v-if="users">我的订单</el-menu-item>
      <el-menu-item index="/car"  v-if="users">我的购物车</el-menu-item>
    <el-menu-item index="/member" v-if="users">用户中心</el-menu-item>
    <el-menu-item index="/review" v-if="user">评价管理</el-menu-item>
      <el-menu-item index="/Ment" v-if="user">酒店管理</el-menu-item>
      <el-menu-item index="/type" v-if="user">分类管理</el-menu-item>
      <el-menu-item index="/admin" v-if="user">用户管理</el-menu-item>
      <el-menu-item index="/indent" v-if="user">订单管理</el-menu-item>
      <el-menu-item index="/login" v-if="!users">请登录</el-menu-item>
      <el-menu-item @click.native="LoginOut" v-else>{{users.user}} 欢迎您！</el-menu-item>
  </el-menu>
</div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      users:JSON.parse(sessionStorage.getItem('User')),
      user:false
    };
  },
  created() {
   if(this.users){
     if(this.users.isAdmin===1){
       this.user = true
     }
   }
  },
  methods: {
    LoginOut(){
      this.$confirm('此操作将退出该系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.clear()
        this.$message.success('退出成功！')
        this.$router.replace('/')
        setTimeout(()=>{

          window.location.reload()
        },1000)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '祝您有个好的体验！'
        });
      });
    }
  }
}
</script>

<style lang="less"  scoped>
.el-menu{
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}
</style>