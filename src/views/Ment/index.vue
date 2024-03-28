<template>
<div class="Ment">
  <div class="main">
    <div style="padding: 10px;display: flex;justify-content: right">
      <el-button type="primary" icon="el-icon-plus" @click="batchAdd">手动新增</el-button>
    </div>
    <div style="padding: 15px">
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
              label="商品名称"
          >
          </el-table-column>
          <el-table-column
              label="商品图片"
          >
            <template slot-scope="scope">
              <img :src="$url+scope.row.Photo" style="width: 100%;height: 100%;"/>
            </template>
          </el-table-column>
          <el-table-column
              prop="money"
              width="160"
              label="商品金额（元）">
          </el-table-column>
          <el-table-column
              prop="type_name"
              width="160"
              label="分类">
          </el-table-column>
          <el-table-column
              prop="Count"
              width="160"
              label="剩余房间">
          </el-table-column>
          <el-table-column
              prop="buy_count"
              width="160"
              label="销售量">
          </el-table-column>
          <el-table-column
              prop="Up_time"
              label="商品添加时间">
          </el-table-column>
          <el-table-column
              label="操作"
              width="160">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)"  size="mini">查看</el-button>
              <el-button @click="handleDel(scope.row)"    type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :title="changeTitle" :visible.sync="outerVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="房型名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.name" autocomplete="off" maxlength="15"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="type"  :label-width="formLabelWidth">
          <el-select v-model="ruleForm.type" placeholder="请选择房型分类">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name"
                       :value="(item.ID +'|'+ item.name)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="introduction" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.introduction" autocomplete="off" maxlength="255"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="money" :label-width="formLabelWidth">
          <el-input type="number" v-model="ruleForm.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="总房间" prop="Count" :label-width="formLabelWidth">
          <el-input type="number" v-model="ruleForm.Count" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img" :label-width="formLabelWidth">
          <el-upload
              class="upload-demo"
              action=""
              :limit="1"
              :auto-upload="false"
              :on-change="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="toAddhzp('ruleForm')" >确定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import ApiMent from "@/api/Ment"
import ApiHome from "@/api/home";


export default {
  name: "index",
  data(){
    return{
      user:{},
      tableData: [],
      outerVisible: false,
      ruleForm: {
        name: '',
        introduction: '',
        money: '',
        Count:"",
        type:""
      },
      fileList:[],
      form:{},
      imageUrl: '',
      typeList: [],
      changeTitle:"",
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请填写房型名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择房型分类', trigger: 'change' }
        ],
        pic: [
          { required: true, message: '请选择房型图片', trigger: 'change' }
        ],
        introduction: [
          { required: true, message: '请填写房型简介', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请填写房型金额', trigger: 'blur' }
        ],
        Count: [
          { required: true, message: '请填写总房间', trigger: 'blur' }
        ]
      },
      fileUp:''
    }
  },
  created() {
    this.gethotelAll()
    this.user = JSON.parse(sessionStorage.getItem("User"))
  },
  methods:{
    cancel(formName){
      this.outerVisible =false
      this.$refs[formName].resetFields();
    },
    async getAllType(){
      let {data} = await ApiHome.typeAll()
      this.typeList = data
    },
    handleRemove(file, fileList) {
      this.fileUp = ""
    },
    handlePreview(file) {
      this.fileUp = file.raw
      this.ruleForm.img = file.raw
    },
    async gethotelAll() {
      let {data} = await ApiMent.hotelAll()
      data.forEach(res=>{
        res.Up_time = this.$dayjs(res.Up_time).format("YYYY-MM-DD HH:mm:ss")
      })
      this.tableData = data
    },
    batchAdd(formName) {
      this.getAllType()
      this.changeTitle = "添加房型信息"
      this.outerVisible = true
    },
    // 添加房型信息
    toAddhzp(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let type = (this.ruleForm.type).split('|')
          let formData = new FormData();
          formData.append("file",this.fileUp);
          ApiMent.fileAdd(formData).then(res=>{
            this.ruleForm.type = type[0]
            this.ruleForm.type_name = type[1]
            this.ruleForm.img = res.data
            this.ruleForm.User_ID=this.user.ID
            ApiMent.hotelAdd(this.ruleForm).then(res=>{
              this.$message.success(res.msg)
              this.outerVisible = false
              this.gethotelAll()
              this.$refs[formName].resetFields();
            })
          })
        } else {
          return false;
        }
      });

    },
    handleDel(row){
      this.$confirm('此操作将永久删除该房型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ApiMent.hzpDel(
            {ID:row.ID}
        ).then(res=>{
          this.$message.success(res.msg)
          this.gethotelAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    handleClick(row){
      this.$router.push({
        name: "details",
        query: {
          ID: row.ID
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.Ment{
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
