<template>
  <div class="card">
    <div class="title">
      <span>{{hotelCard.title}}</span>
      <label>{{hotelCard.introduce}}</label>
    </div>
    <div class="mes">
        <div class="mes1" v-for="(item,index) in hotelCard.children" :key="index">
          <delhotel :hotel = "item"/>
        </div>
    </div>
  </div>
</template>

<script>
import delhotel from "@/components/delhotel/index"

export default {
  name: "hotelCard",
  props: ["hotelCard"],
  components: {
    delhotel
  },
  data(){
    return{
    }
  },
  created() {
  },
  methods:{

  }
}
</script>

<style lang="less" scoped>
.card{
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  .title{
   flex: 1;
    display: flex;
    align-items: center;

    span{
      font-size: 30px;
    }

    label{
      font-size: 18px;
      margin-left: 10px;
      color: #666666;
    }
  }

  .mes{
    flex: 3;
    display: flex;
    flex-wrap: wrap;


    .mes1{
      width: 20%;
      box-sizing: border-box;
      padding-right: 20px;
      border-right: 2px solid #F5F5F5;

      &:last-child{
        border-right:none;
        padding-right: 0;

      }
    }


  }

}
</style>