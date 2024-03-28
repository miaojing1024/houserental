<template>
  <el-container>
    <el-header>
      <!--    顶部导航栏-->
      <Nav></Nav>
    </el-header>
    <el-main>
      <!--      内容区域-->
      <router-view></router-view>
    </el-main>
  </el-container>

</template>

<script>
import Nav from "@/components/nav";

export default {
  name: "index",
  components: {
    Nav,
  }
}
</script>

<style lang="less" scoped>
*{
  margin: 0;
  padding: 0;
}
</style>