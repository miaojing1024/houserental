<template>
  <div class="home">
      <!--  轮播图  -->
      <div class="banner">
        <div class="info">
          <el-carousel :interval="5000" arrow="always" height="500px">
            <el-carousel-item v-for="(item,index) in bannerList" :key="index">
              <img :src="item.img" style="width: 100%;height: 100%">
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!--    酒店房型展示区域-->
      <div class="content">
        <div class="temp">
          <hotelCard v-for="(item,index) in hotelAll" :key="index" :hotelCard="item"></hotelCard>
        </div>
      </div>
  </div>
</template>

<script>

import ApiHome from "@/api/home";

export default {
  name: "home",
  components: {
    hotelCard:()=>import("@/views/index/components/hotelCard")
  },
  data(){
    return{
      hotelAll: [],
      bannerList: [
        {
           img: require("../../assets/images/ban1.jpg")
        },
        {
           img: require("../../assets/images/ban2.jpg")
        },
        {
           img: require("../../assets/images/ban3.jpg")
        },
        {
           img: require("../../assets/images/ban4.jpg")
        },
    ]

    }
  },
  created() {
    this.gethotelAll()

  },
  methods:{
    async gethotelAll(){
      let {data} = await  ApiHome.hotelAll()
      this.hotelAll = data
    },
  }
}
</script>

<style scoped lang="less">
.home{
  // 轮播图
  .banner {
    width: 100%;
    height: 500px;

    .info {
      width: 60%;
      height: 100%;
      margin: auto;
    }
  }

  // 房型内容
  .content {
    width: 100%;
    background-color: #FFFFFF;

    .temp {
      width: 60%;
      margin: auto;
    }
  }
}

</style>