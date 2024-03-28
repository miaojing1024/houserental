<template>
  <div class="details">
    <div class="main">
      <div class="hotels">
        <div class="hotelImg">
          <el-card>
            <img :src="$url+hotelDet.Photo" style="width: 100%;height: 460px" />
          </el-card>
        </div>
        <div class="hotelTitle">
          <div class="info">
            <h1>
              {{hotelDet.name}}
            </h1>
            <span style="display: block;font-size: 30px;color: #CF4444">
              ￥{{hotelDet.money}}/天
            </span>
            <div class="mes">
              <div class="mes_count">
                销量：{{hotelDet.buy_count}}
              </div>
              <div class="mes_count">
                剩余房间：{{hotelDet.Count}}
              </div>
              <div class="mes_show">
                服务：提供早餐、干净整洁、免费WIFI
              </div>
              <div class="mes_type">
                类型：{{hotelDet.type_name}}
              </div>
            </div>
            <div class="count">
              数量： <el-input-number :precision="0"  :min="1" :max="1" size="mini" v-model="count"></el-input-number>
            </div>
            <div class="count">
              <el-button v-if="hotelDet.Count>0" type="success" @click="ToCar" style="width: 100%">加入购物车</el-button>
            </div>
          </div>
        </div>

      </div>
      <el-tabs v-model="activeName" type="card" style="padding: 10px" @tab-click="handleClick">
        <el-tab-pane label="房间详情" name="first">
          <p style="text-indent: 2em">
            {{hotelDet.introduction}}
          </p>
        </el-tab-pane>
        <el-tab-pane label="用户评价" name="second">
          <ul class="commnetul">
            <li v-for="(item,index) in hotelcomm" :key="index">
              <label style="display: block;font-weight: bold;font-size: 18px">评论时间：{{item.add_time}}</label>
              <div style="display: flex">
                <div>
                  <img src="../../assets/images/mine.png" style="width: 50px;height: 50px;border-radius: 50%">
                </div>
                <div>
                  <span style="padding:5px;color: #27BA9B;font-weight: bold">用户{{item.user_id}}：</span>
                  <span>{{item.content}}</span>
                </div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ApiDetails from "@/api/details.js"
export default {
  name: "index",
  data(){
    return{
      hotelDet:{},
      hotelcomm:[],
      count:0,
      activeName: 'first'
    }
  },
  created() {
    this.getDetails()
    this.getDetailsComm()
  },
  methods: {
    // 加入购物车
    ToCar(){
      let _ = JSON.parse(sessionStorage.getItem('User'))
      if(_){
        let parms = {
          User_ID: _.ID,
          hotel_id: this.hotelDet.ID,
          hotel_name: this.hotelDet.name,
          img: this.hotelDet.Photo,
          money: this.hotelDet.money,
          count: this.count
        }
        ApiDetails.addCar(parms).then(
            res=>{
             if(res.code!=201){
              this.$message.success(res.msg)
             }
            }
        )
      }else{
        this.$message.warning('请先登录')
      }
    },
    async getDetails(){
      let {data} = await  ApiDetails.hoteldet({ID:this.$route.query.ID})
      this.hotelDet = data
    },
    async getDetailsComm(){
      let {data} = await ApiDetails.hotelcomm({ID:this.$route.query.ID})
      data.forEach(
          res=>{
            res.add_time = this.$dayjs(res.add_time).format("YYYY-MM-DD HH:mm:ss")
            res.user_id = res.user_id.replace((res.user_id).substr(1,4),'****')
          }
      )
      this.hotelcomm = data
    },
    handleClick(tab, event) {
      console.log(tab, event);
    }

  }
}
</script>

<style lang="less" scoped>
.details{
  width: 100%;
  height: calc(100vh - 230px);


  .main{
    width: 60%;
    height: 100%;
    margin: 10px auto;
    background-color: #FFFFFF;
    overflow: auto;


    .hotels{
        margin: 30px;
        height: 500px;
        display: flex;


      .hotelImg{
        flex: 1;
      }

      .hotelTitle{
        flex: 1;

        .info{
          padding: 20px;

          .mes{
            height: 150px;
            background-color: #f5f5f5;
            display: flex;
            flex-direction: column;

            .mes_count{
              flex: 1;
              display: flex;
              align-items: center;
              padding-left: 10px;
            }

            .mes_show{
              flex: 1;
              display: flex;
              align-items: center;
              padding-left: 10px;
            }

            .mes_type{
              flex: 1;
              display: flex;
              align-items: center;
              padding-left: 10px;

            }
          }

          .count{
            padding: 10px;
          }

        }

      }
    }

    .commnetul{
      li{
        list-style: none;
        line-height: 40px;
        border-bottom: 2px solid #F5F5F5;

        span{
          vertical-align: top;
        };
      }
    }


  }

}
</style>