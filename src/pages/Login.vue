<template>
  <div id="login">
    <el-form class="loginFrom" :model="loginData" :rules="rules" ref="ruleForm">
      <el-form-item class="login-item">
        <div class="logo">
          <img :src="loginLogo" alt="logo" />
        </div>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input
          class="login-inputorbuttom"
          prefix-icon="el-icon-s-custom"
          placeholder="账号"
          v-model="loginData.mobile"
        ></el-input>
      </el-form-item>
      <el-form-item prop="verificationCode">
        <el-input
          class="login-inputorbuttom"
          prefix-icon="el-icon-lock"
          placeholder="密码"
          type="password"
          v-model="loginData.verificationCode"
        >
        </el-input>
      </el-form-item>
      <el-form-item class="login-item">
        <el-button
          class="login-inputorbuttom login-bottom  submit"
          type="primary"
          v-popover:popover
          @click="loginClick"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <!--验证码弹窗-->
  </div>
</template>
<script>
import * as useable from "../utils/common";
import * as common from "@/http/implement/common";
import localCache from "@utils/cache";
export default {
  name: "login",
  data() {
    return {
      loginLogo: require("@assets/images/loginLogo.png"),
      loginData: {
        mobile: "",
        verificationCode: "",
        numberInfo: "获取验证码"
      },
      time: null, //验证码倒计时
      rules: {},
      disable: false
    };
  },
  methods: {
    loginClick() {
      this.varifyCode();
    },
    varifyCode: function() {
      let that = this;
      let uuid = useable.getuuid();
      localCache.setCookie("token", uuid, 8 * 60 * 60); //by seconds
      clearInterval(that.time);
      let verificationCode = useable.base64encode(
        that.loginData.verificationCode
      );
      common
        .loginDo({
          mobile: that.loginData.mobile,
          password: verificationCode,
          platform: "07",
          channelSource: "09"
        })
        .then(res => {
          let userInfo = res.data;
          localCache.clearSession();
          localCache.setCache("userInfo", userInfo);
          localCache.setCookie("userId", userInfo.userId);
          that.$router.push({ path: "/" });
        });
    }
  }
};
</script>
<style>
.slidingPictures {
  padding: 0;
  width: 300px;
  border-radius: 2px;
}
</style>
<style scoped lang="less">
#login {
  width: 100%;
  height: 100%;
  background-color: #f7f8fa;
  .loginFrom {
    width: 400px;
    padding: 60px 0px 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    .login-item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .logo {
      font-size: 30px;
      img {
        width: 8vw;
      }
    }
    .login-title {
      color: #262626;
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }
    .login-bottom {
      margin-top: 15px;
    }
    .login-bottom:hover {
      background: rgba(28, 136, 188, 0.9);
    }
    .login-bottom:active {
      background: rgba(228, 199, 200, 0.9);
    }
    /deep/.login-inputorbuttom {
      height: 40px;
      width: 300px;
      background: #fff;
      border-radius: 0.4vw;
      border: #d9d9d9 solid 1px;
      font-size: 14px;
      box-shadow: 0px 0px 8px 0px rgba(10, 8, 68, 0.1);
      color: #333333;
      .el-input--small,
      .el-input__inner {
        line-height: 43px;
        border: none;
        color: #333333;
        font-size: 14px;
        height: 40px;
      }
      .el-input__icon {
        line-height: 40px;
        font-size: 16px;
      }
    }
    /deep/.el-input-group__append {
      background-color: #ffffff;
      color: #4070fc;
      border: none;
    }
    .submit {
      background-color: #4070fc;
      color: #fff;
      &:hover {
        background-color: rgba(62, 112, 252, 0.9);
      }
    }
  }
}
/*该样式最终是以弹窗插入*/
.sliding-pictures {
  width: 100%;
  .vimg {
    width: 100%;
    height: 170px;
    #codeImg,
    #sliderBlock {
      padding: 7px 7px 0 7px;
      width: inherit;
      height: inherit;
    }
    #sliderBlock {
      position: absolute;
      z-index: 4000;
    }
  }
  .slider {
    width: 100%;
    height: 65px;
    border-bottom: #c7c9d0 1px solid;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .track {
      margin-left: 7px;
      width: 286px;
      height: 38px;
      background: rgba(28, 136, 188, 0.5);
      border-radius: 25px;
      font-size: 14px;
      line-height: 38px;
      padding-right: 15px;
      padding-left: 70px;
    }
    .pintuTrue {
      background: #67c23a;
      color: #ffffff;
    }
    .button {
      position: absolute;
      width: 50px;
      height: 50px;
      bottom: 48px;
      line-height: 48px;
      background: #ffffff;
      box-shadow: #b9bdc8 0 0 3px;
      border-radius: 50%;
      left: 7px;
      text-align: center;
      font-size: 28px;
      color: #3e5d8b;
      &:hover {
        color: #2181bd;
      }
    }
  }
  .operation {
    width: 100%;
    height: 40px;
    > span {
      color: #9fa3ac;
      display: inline-block;
      width: 40px;
      height: 40px;
      font-size: 25px;
      line-height: 40px;
      text-align: center;
      &:hover {
        background: #e2e8f5;
      }
    }
  }
}
</style>
