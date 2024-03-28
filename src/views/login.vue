<template>
  <div class="login">
    <!--    首页标题-->
    <header>酒店在线预订平台</header>
    <!--      登录框-->
    <main v-loading="loading" element-loading-text="正在登录中" element-loading-spinner="el-icon-loading">
      <!--      上面-->
      <div class="content_top">
        <span>用户登录</span>
      </div>
      <!--      下面-->
      <div class="content_bto">
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="demo-loginForm" style="height: 80%;display: flex;flex-direction: column;justify-items: center">
          <el-form-item prop="user" style="flex: 1;">
            <el-input placeholder="请输入邮箱" prefix-icon="el-icon-user-solid" v-model="loginForm.user" autocomplete="off">
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd" style="flex: 1;margin:10px 0;">
            <el-input placeholder="请输入密码" prefix-icon="el-icon-s-cooperation" type="password" v-model="loginForm.pwd" autocomplete="off" show-password @focus="focusText"></el-input>
          </el-form-item>
          <el-form-item style="flex: 1;">
            <div style="display: flex;justify-content: space-between">
              <el-checkbox v-model="checked">记住密码</el-checkbox>
              <router-link to="/register">立即注册</router-link>
            </div>
          </el-form-item>
          <el-form-item style="flex: 1">
            <el-button type="primary" @click="submitForm('loginForm')" class="btn">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </main>
    <footer>Copyright&nbsp;&nbsp;&copy;&nbsp;化妆品网站项目部版权所有</footer>
  </div>
</template>

<script>
import ApiLogin from "@/api/LoginRegister";
const Base64 = require("js-base64").Base64

export default {
  name: "Login",
  data () {
    // 校验账户
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账户'));
      } else {
        callback();
      }
    };
    // 校验密码
    var validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      // else if (value.length <= 12) {
      //   callback(new Error('密码长度不能低于12位'));
      // } else if (value.search(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%.^&*])[\da-zA-Z~!@#$.%^&*]{12,}$/)) {
      //   callback(new Error('密码必须包含：数字、字母、特殊字符'));
      // }
      else {
        callback();
      }
    };
    return {
      loginForm: {
        user: '',
        pwd: '',
      },
      rules: {
        user: [
          { validator: validateUser, trigger: 'change' }
        ],
        pwd: [
          { validator: validatePwd, trigger: 'change' }
        ],
      },
      // 遮罩层
      loading: false,
      // 记住密码
      checked: false
    };
  },
  mounted () {
    //登录绑定事件
    window.addEventListener('keydown', this.keyDown);
    this.getCookie();
  },
  methods: {
    // 登录提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          /* ------ 账号密码的存储 ------ */
          if (this.checked) {
            let password = Base64.encode(this.loginForm.pwd); // base64加密
            this.setCookie(this.loginForm.user, password, 7);
          } else {
            this.setCookie("", "", -1); // 修改2值都为空，天数为负1天就好了
          }
          /* ------ http登录请求 ------ */

          let params = {
            email: this.loginForm.user,
            pwd: this.loginForm.pwd
          };
          ApiLogin.login(params)
            .then((res) => {
              this.loading = false
              if(res.code !== 200){
                return
              }
              sessionStorage.setItem("User",JSON.stringify(res.data))
              // this.$store.commit("setUserInfo", data.data.user);
              // this.$store.commit("setMenuList", data.data.menu);
              this.$router.replace('/member')
            })


        } else {
          this.$message.warning("账户或密码不符合规范");
          this.$refs[formName].resetFields()
          return false;
        }
      });
    },
    //按enter自动登录
    keyDown (e) {
      //如果是回车则执行登录方法
      if (e.keyCode == 13) {
        this.submitForm("loginForm");
      }
    },
    // 密码框获取焦点
    focusText () {
      console.log("密码框获取焦点")
    },
    // 设置cookie
    setCookie (userId, password, days) {
      let date = new Date(); // 获取时间
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days); // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        "userId" + "=" + userId + ";path=/;expires=" + date.toGMTString();
      window.document.cookie =
        "password" + "=" + password + ";path=/;expires=" + date.toGMTString();
    },
    // 读取cookie 将用户名和密码回显到input框中
    getCookie () {
      if (document.cookie.length > 0) {
        let arr = document.cookie.split("; "); //分割成一个个独立的“key=value”的形式
        for (let i = 0; i < arr.length; i++) {
          let arr2 = arr[i].split("="); // 再次切割，arr2[0]为key值，arr2[1]为对应的value
          if (arr2[0] === "userId") {
            this.loginForm.user = arr2[1];
          } else if (arr2[0] === "password") {
            this.loginForm.pwd = Base64.decode(arr2[1]);// base64解密
            this.checked = true;
          }
        }
      }
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.keyDown, false);
  }
}
</script>


<style lang="less" scoped>
@con: 100%;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login {
  width: 100vw !important;
  height: 100vh !important;
  background: url("../assets/images/bg_login.jpg") no-repeat center;
  background-size: @con @con;
  position: relative;

  //登录页面标题
  header {
    width: @con;
    text-align: center;
    position: relative;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
    font-size: 70px;
    letter-spacing: 10px;
    font-weight: bold;
    text-shadow: 2px 2px #0077ff;

    &::before {
      content: "酒店在线预订平台";
      position: absolute;
      background: linear-gradient(to bottom, #ffffff, #b6ebff);
      -webkit-background-clip: text;
      color: transparent;
      text-shadow: none;
    }
  }

  // 登录主体部分
  main {
    width: 800px;
    height: 300px;
    padding: 20px;
    background: hsla(0, 0%, @con, 0.25) border-box;
    overflow: hidden;
    border-radius: 5px;
    box-shadow: 0 0 0 1px hsla(0, 0%, @con, 0.3) inset,
      0 0.5em 1em rgba(0, 0, 0, 0.6);
    text-shadow: 0 1px 1px hsla(0, 0%, @con, 0.3);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    // 使用滤镜模糊边缘
    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: -30px;
      z-index: -1;
      backdrop-filter: blur(5px);
    }

    // 用户登录
    .content_top {
      width: 80%;
      height: 30%;
      display: flex;
      align-items: flex-end;
      padding-bottom: 10px;
      span {
        color: #000;
        font-size: 32px;
        border-bottom: 8px solid #0077ff;
        font-weight: bold;
        letter-spacing: 3px;
      }
    }

    // 表单部分
    .content_bto {
      width: 80%;
      height: 100%;

      .btn {
        width: 100%;
        height: 40px;
        font-size: 16px;
        border-radius: 5px;
        background: linear-gradient(to bottom, #0077ff, #01aeff);
        border: none;
      }
    }
  }

  // 版权部分
  footer {
    color: #ffffff;
    width: @con;
    text-align: center;
    position: absolute;
    left: 50%;
    bottom: 10%;
    transform: translateX(-50%);
    font-size: 16px;
  }

  /deep/ .el-input__inner {
    height: 50px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #ffffff;
    text-indent: 1em;
    font-size: 20px;
    color: #222;
    border-radius: 0;
  }

  /deep/ .el-icon-user-solid {
    line-height: 40px;
  }

  /deep/ .el-icon-s-cooperation {
    line-height: 40px;
  }

  /deep/ .el-input__prefix,
  /deep/ .el-input__clear,
  /deep/ input::-webkit-input-placeholder {
    color: #222;
    font-size: 18px;
  }

  /deep/ .el-form-item__error {
    font-size: 16px;
  }

  /deep/ .el-icon-loading {
    font-size: 24px;
  }

  /deep/ .el-checkbox__label {
    font-size: 14px;
  }

  /deep/ .el-checkbox__inner {
    width: 15px;
    height: 15px;
  }
}
</style>
