<template>
<div class="review">
  <div class="main">
    <div>
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
              prop="add_time"
              label="评论时间"
          >
          </el-table-column>
          <el-table-column
              prop="content"
              label="评论内容"
          >
          </el-table-column>
          <el-table-column
              prop="hotel_id"
              label="有关房型ID">
          </el-table-column>
          <el-table-column
              prop="user_id"
              label="评价用户ID">
          </el-table-column>
          <el-table-column
              label="操作"
              width="80">
            <template slot-scope="scope">
              <el-button @click="handleDel(scope.row)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  </div>
  </div>

</div>
</template>

<script>
import ApiReview from "@/api/review";

export default {
  name: "index",
  data(){
    return{
      tableData: [],
    }
  },
  created() {
    this.getReviewAll()
  },
  methods: {
    async getReviewAll() {
      let {data} = await ApiReview.reviewAll()
      data.forEach(res=>{
        res.add_time = this.$dayjs(res.add_time).format("YYYY-MM-DD HH:mm:ss")
      })

      this.tableData = data
    },
    handleDel(row){
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiReview.reviewDel(
            {ID:row.ID}
        ).then(res=>{
          this.$message.success(res.msg)
          this.getReviewAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
.review{
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