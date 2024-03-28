<template>
  <div class="type">
    <div class="main">
      <div style="padding: 10px;display: flex;justify-content: right">
        <el-button type="primary" icon="el-icon-plus" @click="typeAdd">手动新增</el-button>
      </div>
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
              prop="name"
              label="分类名"
          >
          </el-table-column>
          <el-table-column
              prop="add_time"
              show-overflow-tooltip
              label="添加时间">
          </el-table-column>
          <el-table-column
              prop="introduce"
              label="分类简介">
          </el-table-column>
          <el-table-column
              label="操作"
              width="180">
            <template slot-scope="scope">
              <el-button @click="handleDel(scope.row)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog title="新增分类信息" width="800px" :visible.sync="outerVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名" prop="name" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="简介描述" prop="introduce" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.introduce" autocomplete="off"></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="toAddType('ruleForm')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ApiType from "@/api/type";

export default {
  name: "index",
  data() {
    return {
      user:{},
      tableData: [],
      outerVisible: false,
      ruleForm: {
        name: "",
        introduce: ""
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          {required: true, message: '请填写分类', trigger: 'blur'}
        ],
        introduce: [
          {required: true, message: '请选择描述', trigger: 'blur'}
        ],
      },
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("User"))
    this.getTypeAll()
  },
  methods: {
    cancel(formName){
      this.outerVisible =false
      this.$refs[formName].resetFields();
    },
    // 添加房型信息
    toAddType(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.User_ID = this.user.ID
          ApiType.typeAdd(this.ruleForm).then(res => {
            this.$message.success(res.msg)
            this.outerVisible = false
            this.getTypeAll()
            this.$refs[formName].resetFields();
          })
        } else {
          return false;
        }
      });

    },
    typeAdd() {
      this.outerVisible = true
      this.toAddType()
    },
    async getTypeAll() {
      let {data} = await ApiType.typeAll()
      data.forEach(res => {
        res.add_time = this.$dayjs(res.add_time).format("YYYY-MM-DD HH:mm:ss")
      })

      this.tableData = data
    },
    handleDel(row) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiType.typeDel(
            {ID: row.ID,
              User_ID: this.user.ID
              }
        ).then(res => {
          if(res.code !=201){
            this.$message.success(res.msg)

          }
          this.getTypeAll()
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
.type {
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