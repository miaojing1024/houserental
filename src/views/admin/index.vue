<template>
<div class="admin">
  <div class="main">
      <el-card>
        <el-table
            ref="multipleTable"
            :data="tableData"
            border
            style="width: 100%"
            tooltip-effect="dark"
        >
          <el-table-column
              type="index"
              width="50">
          </el-table-column>
          <el-table-column
              prop="user"
              label="用户名"
          >
          </el-table-column>
          <el-table-column
              prop="pwd"
              label="密码"
          >
          </el-table-column>
          <el-table-column
          width="200"
              prop="RegisterTime"
              show-overflow-tooltip
              label="注册时间">
          </el-table-column>
          <el-table-column
              prop="Email"
              label="邮箱">
          </el-table-column>
          <el-table-column
              label="头像"
          >
            <template slot-scope="scope">
              <img :src="$url+scope.row.avatarUrl" style="width: 50%;height: 50%;"/>
            </template>
          </el-table-column>
          <el-table-column
              prop="Money"
              label="钱包余额(元)">
          </el-table-column>
          <el-table-column
              label="系统身份"
          >
            <template slot-scope="scope">
              {{scope.row.isAdmin===1?"管理员":"普通用户"}}
            </template>
          </el-table-column>
          <el-table-column
              label="平台身份"
          >
            <template slot-scope="scope">
              {{scope.row.ismember===2?"酒店会员":"平台游客"}}
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="180">
            <template slot-scope="scope">
              <el-button @click="handleTo(scope.row)" v-if="scope.row.ismember===1" type="success" size="mini">审批</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  </div>
</div>
</template>

<script>
import ApiAdmin from "@/api/admin";

export default {
  name: "index",
  data(){
    return{
      tableData: [],
    }
  },
  created() {
    this.getUserAll()
  },
  methods: {
    async getUserAll() {
      let {data} = await ApiAdmin.userAll()
      data.forEach(res=>{
        res.RegisterTime = this.$dayjs(res.RegisterTime).format("YYYY-MM-DD HH:mm:ss")
      })

      this.tableData = data
    },
    handleTo(row){
      this.$confirm('同意该成员成为酒店会员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiAdmin.memberAdd(
            {ID:row.ID}
        ).then(res=>{
          this.$message.success(res.msg)
          this.getUserAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    }
}
</script>

<style lang="less" scoped>
.admin{
  width: 100%;
  height: calc(100vh - 230px);

  .main{
    width: 60%;
    height: 100%;
    margin: 10px auto;
    background-color: #FFFFFF;
    overflow: auto;



  }
}
</style>