<template>
  <div class="indent">
    <div class="main">
      <el-card>
        <el-table ref="multipleTable" :data="tableData" border style="width: 100%" tooltip-effect="dark">
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column prop="ID" label="订单编号">
          </el-table-column>
          <el-table-column prop="buy_time" show-overflow-tooltip label="用户下单时间">
          </el-table-column>
          <el-table-column prop="set_time" show-overflow-tooltip label="预计入住时间">
          </el-table-column>

          <el-table-column prop="service_time" show-overflow-tooltip label="正式入住时间">
          </el-table-column>
          <el-table-column label="联系人">
            <template slot-scope="scope">
              {{ scope.row.Users.user }}
            </template>
          </el-table-column>
          <el-table-column prop="spend_money" label="金额(元)">
          </el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="scope">
              {{ scope.row.service === 0 ? "未入住" : "已入住" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button @click="handleTo(scope.row)" type="success" size="mini"
                v-if="scope.row.service === 0">确认入住</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import APIIndent from "@/api/indent";

export default {
  name: "index",
  data() {
    return {
      tableData: [],
      user:{}
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("User"))
    this.getUserAll()
  },
  methods: {
    async getUserAll() {
      let { data } = await APIIndent.allUser(
        {User_ID:this.user.ID}
      )
      data.forEach(res => {
        res.buy_time = this.$dayjs(res.buy_time).format("YYYY-MM-DD HH:mm:ss")
        res.set_time = this.$dayjs(res.set_time).format("YYYY-MM-DD HH:mm:ss")
        if(res.service_time!=""){
          res.service_time = this.$dayjs(res.service_time).format("YYYY-MM-DD HH:mm:ss")

        }
      })

      this.tableData = data
    },
    handleTo(row) {
      this.$confirm('请确定该用户已经入住, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        APIIndent.buyReceipt(
          { ID: row.ID }
        ).then(res => {
          this.$message.success(res.msg)
          this.getUserAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
  }
}
</script>

<style lang="less" scoped>
.indent {
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