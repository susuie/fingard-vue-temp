<template>
  <el-header class="head">
    <i
      class="menuSet iconfont icon-menu"
      @click="collapsedSider"
      v-show="!isCollapsed"
    ></i>
    <div class="user-head">
      <ul class="headUl">
        <li class="clearfix" @click="getUserInfo">
          <i class="el-icon-s-custom"></i>
          <span class="user-head-text">{{ name }}</span>
        </li>
        <li class="clearfix" @click="logout">
          <span class="user-head-text">退出</span>
          <i class="iconfont icon-logout"></i>
        </li>
      </ul>
    </div>
    <el-dialog
      :title="isFirstLogin ? '修改密码' : '个人信息'"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="!isFirstLogin"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <Query
        ref="user"
        size="mini"
        labelWidth="100px"
        :itemWidth="20"
        :searchData="info"
        :searchForm="isFirstLogin ? pwdForm : infoForm"
        :rules="infoRules"
        :searchHandle="!pwd && !isFirstLogin ? infoHandle : []"
      />
      <span slot="footer" class="dialog-footer" v-if="pwd || isFirstLogin">
        <el-button v-if="!isFirstLogin" @click="pwd = false">取 消</el-button>
        <el-button type="primary" @click="modifyPwd">确定</el-button>
      </span>
    </el-dialog>
  </el-header>
</template>
<script>
import "@/assets/fonts/iconfont.js";
import { base64encode } from "@/utils/common.js";
import localCache from "@/utils/cache";
export default {
  name: "VHead",
  props: {
    name: {
      default: "admin"
    },
    collapsed: {
      default: false
    }
  },
  watch: {
    name(val) {
      this.userName = val;
    },
    collapsed(val) {
      this.isCollapsed = val;
    }
  },
  data() {
    return {
      userName: "",
      num: 0,
      isCollapsed: this.collapsed,
      info: {
        insurerName: "",
        userName: "",
        mobile: "",
        userRole: "",
        oldPassword: "",
        newPassword: "",
        surePassword: ""
      },
      pwd: false,
      infoRules: {
        oldPassword: [
          { required: true, message: "原密码为必填项", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码为必填项", trigger: "blur" },
          {
            message: "密码需要为8-20位且包含字母和数字",
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,20})$/,
            trigger: "blur"
          }
        ],
        surePassword: [
          { required: true, message: "确认密码为必填项", trigger: "blur" }
        ]
      },
      infoForm: [
        {
          type: "Input",
          label: "保险公司",
          prop: "insurerName",
          disable: true,
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "用户名称",
          prop: "userName",
          disable: true,
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "用户账号",
          prop: "mobile",
          disable: true,
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "用户角色",
          prop: "userRole",
          disable: true,
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "原密码",
          prop: "oldPassword",
          rowType: "password",
          show: () => {
            return this.pwd;
          },
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "新密码",
          prop: "newPassword",
          rowType: "password",
          show: () => {
            return this.pwd;
          },
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "确认密码",
          prop: "surePassword",
          rowType: "password",
          show: () => {
            return this.pwd;
          },
          handle: () => {
            let that = this;
            if (that.info.surePassword !== that.info.newPassword) {
              that.info.surePassword = "";
              that.$message.warning("两次输入的用户密码不一致，请重新输入！");
            }
          },
          placeholder: "请输入"
        }
      ],
      infoHandle: [
        {
          label: "修改密码",
          type: "primary",
          handle: () => {
            this.pwd = true;
            this.info.oldPassword = "";
            this.info.newPassword = "";
            this.info.surePassword = "";
          }
        }
      ],
      pwdForm: [
        {
          type: "Input",
          label: "原密码",
          prop: "oldPassword",
          rowType: "password",
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "新密码",
          prop: "newPassword",
          rowType: "password",
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "确认密码",
          prop: "surePassword",
          rowType: "password",
          handle: () => {
            let that = this;
            if (that.info.surePassword !== that.info.newPassword) {
              that.info.surePassword = "";
              that.$message.warning("两次输入的用户密码不一致，请重新输入！");
            }
          },
          placeholder: "请输入"
        }
      ],
      dialogVisible: false,
      isFirstLogin: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.isFirstLogin = localCache.getCache("userInfo")?.firstLoginFlag;
      if (this.isFirstLogin) {
        this.dialogVisible = true;
      }
    },
    collapsedSider() {
      this.$emit("on-collapsedSider");
    },
    getUserInfo() {
      let that = this;
      this.dialogVisible = true;
      this.pwd = false;
      this.$api.common.getInfo().then(res => {
        that.info = { ...that.info, ...res.data };
      });
    },
    //modifypwd pop
    modifyPwd() {
      let that = this;
      if (that.info.newPassword !== that.info.surePassword) {
        that.$message.warning("两次输入的用户密码不一致，请重新输入！");
        that.info.surePassword = "";
        return;
      }
      this.$refs.user.$children[0].validate(valid => {
        if (valid) {
          this.$confirm("确认修改密码？", "修改密码", {
            callback(action) {
              if (action === "confirm") {
                let oldPassword = base64encode(that.info.oldPassword),
                  newPassword = base64encode(that.info.newPassword);
                that.$api.common
                  .modifyPwd({ oldPassword, newPassword })
                  .then(res => {
                    that.dialogVisible = false;
                    let showMessage = res.info + "，将为您跳转到登录页！";
                    that.$message.success(showMessage);
                    setTimeout(() => {
                      localCache.deleteCache("userInfo");
                      that.$router.push("/Login");
                    }, 2000);
                  });
              }
            }
          });
        } else {
          that.$message.warning("密码必须为8-20位且包含字母和数字！");
        }
      });
    },
    // logout
    logout: function() {
      let that = this;
      this.$confirm("是否确认退出登录？", "消息", {
        callback(action) {
          if (action === "confirm") {
            that.$api.common.logOut().then(() => {
              localCache.deleteCache("userInfo");
              that.$router.push("/Login");
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-header.head {
  background-color: #ffffff;
  line-height: 46px;
  height: 46px !important;
  overflow: hidden;
  text-align: left;
  font-size: 14px;
  .el-input {
    width: 180px;
    float: left;
  }
  .merchant-name {
    display: contents;
  }
  .user-head {
    float: right;
    .headUl {
      margin: 0px;
      li {
        display: inline-block;
        vertical-align: middle;
        margin-right: 40px;
        cursor: pointer;
        color: #6e7680;
        .user-head-icon .user-head-badge {
          background: #f85d71;
          color: #fff;
          font-size: 14px;
          line-height: 14px;
          padding-left: 5px;
          padding-right: 5px;
          border-radius: 8px;
          min-width: 20px;
          text-align: center;
          display: inline-block;
        }
        i {
          margin: 0 5px;
        }
      }
    }
    /deep/.el-dropdown-menu {
      width: 260px;
      padding: 15px 20px;
    }
  }
  .menuSet {
    float: left;
    margin-top: 0;
    height: 30px;
    color: #303c4a;
    line-height: 46px;
    text-align: left;
    cursor: pointer;
    font-size: 26px;
    margin-right: 20px;
  }
  .icon-Group:before {
    content: "\e601";
  }
}
.message {
  position: relative;
}
.message-num {
  position: absolute;
  top: 15px;
  right: -5px;
  height: 5px;
  min-width: 5px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  background-color: #f94b4b;
  color: #fff;
  font-size: 12px;
}
.msg-time {
  float: right;
}
.msg-count {
  display: inline-block;
  width: 25px;
  height: 15px;
  line-height: 15px;
  font-size: 14px;
  color: #fff;
  background: #1f82fb;
  border-radius: 5px;
  margin: 0 10px;
  text-align: center;
}
.msg-title {
  max-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.errMsg {
  padding: 10px 0;
}
.errMsg-btn {
  display: inline-block;
}
.errMsg-wrap {
  z-index: 1999 !important;
  width: 400px;
  .el-notification__group {
    width: 100%;
  }
}
.el-select-dropdown {
  width: 180px;
}
.el-select-dropdown__item {
  font-size: 12px;
}
</style>
<style scoped lang="less">
/deep/.el-dialog {
  .el-dialog__body {
    padding: 10px 0;
    .el-form-item {
      margin-bottom: 5px;
      vertical-align: middle;
    }
    .el-form--inline .el-form-item__content {
      vertical-align: middle;
    }
    .search-button {
      float: right;
      margin-right: 15%;
    }
  }
}
@media screen and (max-width: 800px) {
  .el-header.head {
    width: 1240px;
  }
}
</style>
