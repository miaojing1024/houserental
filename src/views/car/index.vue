<template>
  <div class="car">
    <div class="main">
      <div style="padding: 10px;display: flex;justify-content: right">
        <el-button type="primary" icon="el-icon-finished" @click="batchAdd">单笔购买</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="batchDel">批量删除</el-button>
      </div>
      <div>
        <el-card>
          <el-table
              ref="multipleTable"
              :data="tableData"
              border
              style="width: 100%"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
          >
            <el-table-column
                type="selection"
                width="55">
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
                prop="money"
                label="商品价格（元）">
            </el-table-column>
            <el-table-column
                prop="count"
                label="商品数量">
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <el-dialog title="选择联系人信息" :visible.sync="outerVisible">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="联系人">
            <el-select v-model="ruleForm.ID" placeholder="请选择联系人" @change="changeAdd(ruleForm.ID)">
              <el-option v-for="(item,index) in customerList" :key="index" :label="item.name"
                         :value="item.ID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话号码">
            {{ ruleForm.phone }}
          </el-form-item>
          <el-form-item label="身份证号">
            {{ ruleForm.IDCard }}
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="openZF">立即支付</el-button>
        </div>
      </el-dialog>
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
    <el-button @click="ZFB(0)">取 消</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="请选择预计入住时间"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <el-date-picker
        :picker-options="expireTimeOPtion"
      v-model="timeValue"
      type="date"
      placeholder="选择日期时间">
    </el-date-picker>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="OKbuy">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import ApiCar from "@/api/car"
import ApiMember from "@/api/member"

export default {
  name: "index",
  data() {
    return {
      expireTimeOPtion: {
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;  //如果没有后面的-8.64e7就是不可以选择今天的 
      }
    },
      dialogVisible: false,
      timeValue:"",
      tableData: [],
      multipleSelection: [],
      outerVisible: false,
      ruleForm: {
        ID: "",
        name: '',
        phone: '',
        IDCard: ''
      },
      customerList: [],
      dialogVisibles:false,
      OrderCode:'',
      orderID:'',
      timer:null,
      IDS:'',
      user:{}
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("User"))
    this.getCarAll()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async getCarAll() {
      let {data} = await ApiCar.carAll({
        User_ID:this.user.ID
      })
      this.tableData = data
    },
    batchDel() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("您还没有选择需要删除的商品")
        return
      }
      let parms = {}
      let temp = []
      this.multipleSelection.forEach(res => {
        temp.push(res.ID)
      })
      parms.ID = temp
      ApiCar.carDel(parms).then(res => {
        this.$message.success(res.msg)
        this.getCarAll()
      })
    },
    batchAdd() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("您还没有选择需要下单的商品")
        return
      }
      if (this.multipleSelection.length != 1) {
        this.$message.error("单次最多结算一个订单")
        return
      }
      this.outerVisible = true
      this.getcustomer()

    },
    // 查询联系人信息
    async getcustomer() {
      let {data} = await ApiMember.usercustomer({
        User_ID:this.user.ID
      })
      this.customerList = data
    },
    // 更改地址
    changeAdd(val) {
      for (let item of this.customerList) {
        if (item.ID == val) {
          this.ruleForm = item
        }
      }
    },
    openZF() {

      if(this.ruleForm.ID == ""){
        this.$message.error("联系人不能为空")
        return
      }
      this.dialogVisible = true
     
    },
    OKbuy(){
      if(this.timeValue==""){
        this.$message.warning("请选择预计入住时间")
        return
      }
      this.ZFB(1)
    },
    ZFB(service) {
      let user = JSON.parse(sessionStorage.getItem("User"))
      if (service) {
        // 总金额
        let money_count = 0
        this.multipleSelection.forEach(
            res => {
              money_count += Number(res.money) * Number(res.count)
            }
        )
        if (user.ismember == 2) {
          money_count = money_count * 0.95
        } else {
          money_count = money_count + 5
        }
        let arr = ['a','b','c','d','e','f','G','h','i','j','k','l','m','n']
        this.IDs = arr[Math.floor(Math.random()*arr.length)]+''+Date.now()+''+arr[Math.floor(Math.random()*arr.length)]
        let parms = {
          User_ID:this.user.ID,
          hotel: JSON.stringify(this.multipleSelection),
          customer: JSON.stringify(this.ruleForm),
        set_time: new Date(this.timeValue).getTime(),
        spend_money: Math.floor(money_count),
          service: service,
          orderID:this.IDs
        }
        ApiCar.carAdd(parms).then(res => {
          this.dialogVisibles = true
          this.OrderCode=res.msg
          this.OrderSearch(this.IDs)
          this.dialogVisible = false
        this.outerVisible = false
        this.timeValue=""
        })
      } else {
        this.$alert('订单状态变更为：待付款', '系统提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.dialogVisibles = false
            this.outerVisible = false
            clearTimeout(this.timer)
            this.timer = null
            this.getCarAll()
          }
        });

      }
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
            this.getCarAll()
          }
        })
      },2000)
    },
    cancel() {
      this.outerVisible = false;
      this.ruleForm = {
        ID: "",
        name: '',
        phone: '',
        IDCard: ''
      }
    },
    handleClose(done){
      clearTimeout(this.timer)
      this.timer = null
      done()
    }
  }
}
</script>

<style lang="less" scoped>
.car {
  width: 100%;
  height: calc(100vh - 230px);

  .main {
    width: 60%;
    height: 100%;
    margin: 10px auto;
    background-color: #FFFFFF;
    overflow: auto;
  }
}
</style>