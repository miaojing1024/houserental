<template>
  <div class="customer">
    <el-button type="primary" icon="el-icon-plus" @click="addscustomer">新增联系人</el-button>
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            label="联系人"
            prop="name"
            width="180">
        </el-table-column>
        <el-table-column
            label="电话号码"
            prop="phone"
            width="180">
        </el-table-column>
        <el-table-column
            prop="IDCard"
            label="身份证号"
        >
        </el-table-column>
        <el-table-column
            label="添加时间"
            prop="add_time"
            width="260">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules"  ref="ruleForm" >
        <el-form-item label="联系人" :label-width="formLabelWidth" prop="name">
          <el-input v-model.trim="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone">
          <el-input  v-model.number="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth">
          <el-input  v-model.trim="form.IDCard" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="Cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="CreateAdd('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
import ApiMember from "@/api/member"

export default {
  name: "customer",
  data() {
    return {
      user:{},
      tableData: [],
      dialogFormVisible: false,
      form: {
        name: "",
        phone: "",
        IDCard: ""
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请填写联系人', trigger: 'blur' }
        ],
        phone: [
          {
            required: true,
            pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
            message: "请填写正确的手机号码",
            trigger: "blur"
          },
        ],
      },
      cr_add:0,
      diaTitle:""
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("User"))
    this.getList()
  },
  methods: {
    handleEdit(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
     this.cr_add = 1
      this.diaTitle = "修改收货地址"
    },
    handleDelete(index, row) {

      this.$confirm('此操作将永久删除该联系人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiMember.delcustomer({
          ID: row.ID
        }).then(
            res=>{
              this.$message.success(res.msg)
              this.getList()
            }
        )

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    async getList(){
      let {data} = await ApiMember.usercustomer({
        User_ID:this.user.ID
      })
      data.forEach(res=>{
        res.add_time = this.$dayjs(res.add_time).format("YYYY-MM-DD HH:mm:ss")

      })
      this.tableData = data
    },
    //新增联系人信息
    addscustomer(){
      this.dialogFormVisible = true
      this.cr_add = 0
      this.diaTitle = "创建联系人"
    },
    CreateAdd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.cr_add===0){
            this.form.User_ID = this.user.ID
            ApiMember.newcustomer(this.form).then(
                res=>{
                  this.$message.success(res.msg)
                  this.dialogFormVisible = false
                  this.getList()
                }
            )
          }else{
            ApiMember.updatecustomer(this.form).then(res=>{
              this.$message.success(res.msg)
              this.dialogFormVisible = false
              this.getList()
            })
          }
        } else {
          return false;
        }
      });
    },
    Cancel(formName){
      this.dialogFormVisible = false
      this.$refs[formName].resetFields();
      this.form = {
        name: "",
        phone: "",
        customer: ""
      }
    }
  }
}
</script>

<style scoped lang="less">
.customer{
    width: 90%;
    margin: auto;
}
</style>