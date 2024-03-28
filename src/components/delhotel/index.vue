<template>
  <div class="hotel" @click="todetails">
    <div class="hotel_top">
      <img :src="$url+hotel.Photo">
    </div>
    <div class="hotel_btn">
      <span>{{hotel.name}}</span>
      <label>￥{{hotel.money}}</label>
    </div>
  </div>
</template>

<script>
export default {
  props:['hotel'],
  name: "index",
  mounted(){
  },
  methods: {
    todetails(){
      this.$router.push({
        name: "details",
        query: {
          ID: this.hotel.ID
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.hotel{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .hotel_top{
    flex: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 265px;
    max-height: 300px;
    img{
      width: 100%;
      height:100%;
    }
  }
  .hotel_btn{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    span{
      margin-top: 5px;
      font-size: 28px;
    }

    label{
      font-size: 20px;
      color: #D04444;
    }
  }
}
</style>