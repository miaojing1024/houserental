<template>
  <div id="app">
    <!-- router-view路由视图--接收对应页面的路由,必须配置,否则显示不出来 -->
    <router-view></router-view>
  </div>
</template>


<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
body{
  margin: 0;
  padding: 0;
}
</style>
