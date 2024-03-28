<template>
  <div class="order">
    <div class="main">
      <el-tabs v-model="activeName" stretch @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="2">
        </el-tab-pane>
        <el-tab-pane label="待付款" name="-1"></el-tab-pane>
        <el-tab-pane label="已付款" name="0"></el-tab-pane>
        <el-tab-pane label="已完成" name="1"></el-tab-pane>
      </el-tabs>
      <div class="cardBox">
        <el-card class="box-card" v-for="(item,index) in tableData" :key="index">
          <div slot="header" class="clearfix">
            <span>下单时间：{{ item.buy_time }}</span>
            <span style="margin: 0 50px">订单编号：{{ item.ID }}</span>
            <span>总金额：{{ item.spend_money }}元</span>
            <el-button style="float: right;padding: 3px 10px" @click="cancelitem(item.ID)" type="text">删除订单</el-button>
            <el-button style="float: right;padding: 3px 10px" @click="Chargeback(item.ID)" type="text" v-if="item.service==0">退房退款</el-button>
            <el-button style="float: right;padding: 3px 0" @click="handleitem(item)" type="text">查看详情</el-button>
          </div>
          <div class="text item">
            <el-table
                :data="JSON.parse(item.hotel_List)"
                border
                max-height="250"
                style="width: 100%">
              <el-table-column
                  type="index"
                  width="50">
              </el-table-column>
              <el-table-column
                  prop="hotel_name"
                  label="商品名称"
              >
              </el-table-column>
              <el-table-column
                  label="商品图片"
              >
                <template slot-scope="scope">
                  <img :src="$url+scope.row.img" style="width: 50%;height: 50%;"/>
                </template>
              </el-table-column>
              <el-table-column
                  label="商品金额（元）">
                <template slot-scope="scope">
                  {{ (Number(scope.row.money) * Number(scope.row.count)).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column
                  prop="count"
                  label="商品数量（件）">
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
      <el-dialog
          title="扫码支付"
          :visible.sync="dialogVisibles"
          width="500px"
          :before-close="handleClose">
        <div style="width: 100%;height: 450px;display: flex;flex-direction: column;justify-content: center;align-items: center">
          <span v-html="OrderCode" style="display:inline-block;width: 200px;height: 200px;font-size: 32px;"></span>
          <img src="../../assets/images/wx_zfb.jpg" alt="" style="width: 100%;height: 150px;margin-top: 20px">
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
  </span>
      </el-dialog>
      <el-dialog title="订单详情" :visible.sync="outerVisible">
        <el-form label-width="150px" class="demo-ruleForm">
          <el-form-item label="联系人：">
            {{ ruleForm.customer_id.name }}
          </el-form-item>
          <el-form-item label="联系电话：">
            {{ ruleForm.customer_id.phone }}
          </el-form-item>
          <el-form-item label="身份证号：">
            {{ ruleForm.customer_id.IDCard }}
          </el-form-item>
          <el-form-item label="房屋预订时间：">
            {{ ruleForm.buy_time }}
          </el-form-item>
          <el-form-item label="预计入住时间：">
            {{ ruleForm.set_time }}
          </el-form-item>
          <el-form-item label="预订手续费：">
            {{ user.ismember === 2 ? "酒店会员全平台0元" : "平台游客5元" }}
          </el-form-item>
          <el-form-item label="商品优惠：">
            {{ user.ismember === 2 ? "酒店会员全平台95折" : "平台游客无优惠" }}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">确 定</el-button>
          <el-button type="success" @click="openBuy(ruleForm)" v-if="ruleForm.service == -1">立即购买</el-button>
          <el-button type="primary" @click="openEvaluate(ruleForm.list)" v-if="ruleForm.service == 1">立即评价</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="请选择预计入住时间"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <el-date-picker
      v-model="timeValue"
      :picker-options="expireTimeOPtion"
      type="date"
      placeholder="选择日期时间">
    </el-date-picker>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="OKbuy">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ApiOrder from "@/api/order"
import ApiCar from "@/api/car"


export default {
  name: "index",
  data() {
    return {
      expireTimeOPtion: {
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;  //如果没有后面的-8.64e7就是不可以选择今天的 
      }
    },
      timeValue:"",
      activeName: '2',
      tableData: [],
      outerVisible: false,
      dialogVisible: false,
      ruleForm: {
        customer_id: '',
        service: '',
        list: [],
        buy_time: "",
        set_time: "",
        ID: ""
      },
      dialogVisibles: false,
      OrderCode: "",
      timer:null,
      user: JSON.parse(sessionStorage.getItem("User"))

    };
  },
  created() {
    this.getbuyAll("")
  },
  methods: {
    close(){
      this.dialogVisibles=false
      clearTimeout(this.timer)
      this.timer = null
    },
    handleClose(done){
      clearTimeout(this.timer)
      this.timer = null
      done()
    },
    OrderSearch(id){
      this.timer = setTimeout(()=>{
        ApiCar.OrderSearch({ID:id}).then(res=>{
          if(res.code!==200){
            this.OrderSearch(id)
          }else{
            clearTimeout(this.timer)
            this.timer = null
            this.dialogVisibles = false
            this.$message.success(res.msg)
            this.getbuyAll("")
          }
        })
      },2000)
    },
    // 退房退款
    Chargeback(val){
      this.$confirm('退房退款并扣除支付金额3%的违约金, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parms = {
          ID: val
        }
        ApiOrder.Chargeback(parms).then(res=>{
          this.$message.success(res.msg)
          this.activeName = "2"
          this.getbuyAll("")
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 删除订单
    cancelitem(val){
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parms = {
          ID: val
        }
        ApiOrder.cancelOrder(parms).then(res=>{
          this.$message.success(res.msg)
          this.getbuyAll(this.activeName)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    // 切换订单状态
    handleClick(tab, event) {
      this.tableData = []
      let flag = ""
      if(tab.name !== '2'){
        flag = tab.name
      }
      this.getbuyAll(flag)
    },
    // 查看详情
    handleitem(row) {
      this.ruleForm.customer_id = JSON.parse(row.customer_id)
      this.ruleForm.service = row.service
      this.ruleForm.list = JSON.parse(row.hotel_List)
      this.ruleForm.buy_time = row.buy_time
      this.ruleForm.set_time = row.set_time
      this.ruleForm.ID = row.ID
      this.outerVisible = true

    },
    cancel() {
      this.outerVisible = false
    },
    // 立即购买
    openBuy(){
      // 先判断是否选择入住时间
      this.dialogVisible = true
    },
    OKbuy(){
      if(this.timeValue==""){
        this.$message.warning("请选择预计入住时间")
        return
      }
      let money_count = 0
      let hotel_List = this.ruleForm.list
      hotel_List.forEach(
            res => {
              money_count += Number(res.money) * Number(res.count)
            }
        )
      if (this.user.ismember == 2) {
        money_count = money_count * 0.95
      } else {
        money_count = money_count + 5
      }
      let parms = {
        User_ID:this.user.ID,
        hotel: JSON.stringify(this.multipleSelection),
        customer: JSON.stringify(this.ruleForm),
        set_time: new Date(this.timeValue).getTime(),
        spend_money: Math.floor(money_count),
        service: 1,
        Buy_dfId: this.ruleForm.ID
      }
      ApiCar.carAdd(parms).then(res => {
        this.dialogVisibles = true
        this.OrderCode=res.msg
        this.OrderSearch(this.ruleForm.ID)
        this.dialogVisible = false
        this.outerVisible = false
        this.timeValue=""

      })

    },
    // 立即评价
    openEvaluate(val) {
      this.$prompt('请输入商品评价', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        let list = []
        val.forEach(res => {
          list.push(res.hotel)
        })

        let parms = {
          User_ID:this.user.ID,
          content: value,
          hotel_id: list
        }
        ApiOrder.commEvaluate(parms).then(res => {
          this.outerVisible = false
          this.getbuyAll("")
          this.activeName= '2'
          this.$message.success(res.msg)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    // 获取信息
    async getbuyAll(type) {
      let flag = ""
      if(type !== '2'){
        flag = type
      }
      let parms = {
        service: flag,
        User_ID :this.user.ID
      }
      let {data} = await ApiOrder.buyAll(parms)
     if(data==undefined || data==null){
      return
     }
      data.forEach(res => {
        res.buy_time = this.$dayjs(res.buy_time).format("YYYY-MM-DD HH:mm:ss")
        res.set_time = this.$dayjs(res.set_time).format("YYYY-MM-DD HH:mm:ss")
      })
      // console.log(data,"-=-=-=-=-=-=-=-=-=")
      this.tableData = data
      if(this.tableData.length===0){
        this.$message.warning('暂时没有您的订单信息')
      }
    },
  }
}
</script>

<style lang="less" scoped>
.order {
  width: 100%;
  height: calc(100vh - 230px);

  .main {
    width: 60%;
    height: 100%;
    margin: 10px auto;
    overflow: auto;
    background-color: #FFFFFF;

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }

    .cardBox {
      width: 100%;
      //height: 750px;
      overflow: auto;
    }

    .box-card {
      margin: auto;
      width: 90%;
    }
  }
}

///deep/ .el-tabs__content{
//  height: 750px;
//  overflow: auto !important;
//}
</style>