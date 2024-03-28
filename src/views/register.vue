<template>
  <div class="register">
<!--    主要内容区域-->
    <main class="main" v-loading="loading" element-loading-text="正在登录中" element-loading-spinner="el-icon-loading">
        <div class="main_left">
            <div class="img_logo"></div>
            <div class="img_title">
              饮食娱乐共一炉，幻彩丽影齐欣赏！
            </div>
        </div>
        <div class="main_right">
          <div class="content">
            <div class="nav">
              <span>用户注册</span>
              <router-link to="/login">去登录</router-link>
            </div>
            <div class="form">
              <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="user">
                  <el-input v-model="ruleForm.user" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                  <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkpwd">
                  <el-input type="password" v-model="ruleForm.checkpwd" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
    </main>
  </div>
</template>

<script>
import ApiLogin from "@/api/LoginRegister";
export default {
  name: "Register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkpwd !== '') {
          this.$refs.ruleForm.validateField('checkpwd');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        user:'',
        pwd: '',
        checkpwd: '',
        email: ''
      },
      // 遮罩层
      loading: false,
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        pwd: [
          {required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkpwd: [
          { required: true,validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.loading = true
        if (valid) {
          delete this.ruleForm.checkpwd
          ApiLogin.register(this.ruleForm)
            .then((res) => {
              this.loading = false;
              this.$message.success(res.msg);
              this.$router.push('/login')
            })


        } else {
          this.$message.warning("账户或密码不符合规范");
          this.$refs[formName].resetFields()
          return false;
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
@con: 100%;

.register {
  width: 100vw !important;
  height: 100vh !important;
  background: url("../assets/images/bg_register.jpg") no-repeat center;
  background-size: @con @con;
  overflow: hidden;
  position: relative;


  .main{
    width: 800px;
    height: 500px;
    background-color: #FFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    align-items: center;
    border-radius: 10px;

    .main_left{
      flex: 2;
      border-right: 1px solid #cccccc;


      .img_logo{
        width: 256px;
        height: 177px;
        background: url("../assets/images/logo.png") no-repeat center;
        background-size: @con @con;
        margin: 50px auto;
      }

      .img_title{
        text-align: center;
        font-family:'华文楷体';
        color: #2864C4;
        font-weight: bold;
        font-style: italic;
      }
    }

    .main_right{
      flex: 3;
      display: flex;
      align-items: center;

      .content{
        width: 80%;
        margin: 50px auto;

        .nav{
          height: 50px;
          border-bottom: 2px solid #666;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          box-sizing: border-box;

          span{
            font-size: 28px;
            font-weight: bold;
          }

          a{
            font-size: 16px;
            color: #47AA34;
          }
        }
      }

      .form{
        padding-right: 40px;
        margin-top: 20px;
      }


    }
  }
}

</style>
