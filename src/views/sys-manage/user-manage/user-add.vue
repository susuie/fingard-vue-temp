<template>
  <div class="add-content">
    <section
      v-loading="loading"
      element-loading-text="正在处理，请耐心等待..."
      element-loading-spinner="el-icon-loading"
    >
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          :to="{
            path: '/user',
            query: { pageNum: $route.query.pageNum }
          }"
          >用户管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>{{ currentItem }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="handle">
        <el-button
          type="primary"
          v-show="isEdit !== 'look'"
          size="small"
          @click="saveUserInfo"
          >保存</el-button
        >
        <el-button type="primary" size="small" @click="cancelSave">{{
          isEdit === "look" ? "关闭" : "取消"
        }}</el-button>
      </div>
      <div class="content">
        <h2>用户信息<span class="sub-title">以下所有字段都为必填字段</span></h2>
        <Query
          size="mini"
          labelWidth="200px"
          ref="user"
          :itemWidth="12"
          :searchData="searchData"
          :searchForm="userForm"
          :rules="userRules"
          :list="list"
          :disable="isEdit === 'look'"
        />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      currentItem: "新增用户",
      searchData: {
        insureName: JSON.parse(localStorage.getItem("userInfo")).insurerName,
        orgConfigId: "",
        userName: "",
        mobile: "",
        userStatus: ""
      },
      userRules: {
        insureName: [
          { required: true, message: "保险公司是必填项", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "用户账户是必填项", trigger: "blur" },
          {
            pattern: /^\w{1,32}$/,
            message: "用户账户可以由字母+数字组成，最大32位",
            trigger: "blur"
          }
        ],
        userName: [
          {
            required: true,
            message: "用户名称是必填项",
            trigger: "blur"
          }
        ],
        orgConfigId: [
          { required: true, message: "用户角色是必填项", trigger: "change" }
        ],
        userStatus: [
          { required: true, message: "用户状态是必填项", trigger: "change" }
        ]
      },
      userForm: [
        {
          type: "Input",
          label: "保险公司",
          prop: "insureName",
          placeholder: "请输入",
          disable: true
        },
        {
          type: "Input",
          label: "用户名称",
          prop: "userName",
          placeholder: "请输入"
        },
        {
          type: "Input",
          label: "用户账号",
          prop: "mobile",
          placeholder: "请输入"
        },
        {
          type: "Select",
          label: "用户角色",
          prop: "orgConfigId",
          change: value => {
            this.searchData.orgConfigId = value;
          },
          disable: () => {
            return this.isEdit !== "add";
          },
          placeholder: "请选择"
        },
        {
          type: "Select",
          label: "用户状态",
          prop: "userStatus",
          change: value => {
            this.searchData.userStatus = value;
          },
          placeholder: "请选择"
        }
      ],
      list: {
        orgConfigIdList: [],
        userStatusList: []
      },
      isEdit: this.$route.query.state
    };
  },
  created() {
    this.getENData();
  },
  mounted() {
    this.initUser();
  },
  methods: {
    initUser: function() {
      let uid = this.$route.query.data;
      this.currentItem =
        this.isEdit === "add"
          ? "新增用户"
          : this.isEdit === "edit"
          ? "编辑用户"
          : "查看用户";
      if (this.isEdit !== "add") {
        this.getUserInfo(uid);
      }
    },
    getENData: function() {
      let that = this;
      this.$root.$children[0].getDataDic("ENUserStatus").then(res => {
        that.list.userStatusList = res;
      });
      this.$api.user.roleList().then(res => {
        that.list.orgConfigIdList = res.data;
      });
    },
    getUserInfo: function(uid) {
      this.$api.user.getUserDetail({ urid: uid }).then(res => {
        this.searchData = res.data;
      });
    },
    saveUserInfo: function() {
      let that = this;
      this.$refs.user.$children[0].validate(valid => {
        if (valid) {
          if (this.isEdit === "add") {
            this.$api.user.saveUserInfo(this.searchData).then(res => {
              this.$message.success(res.info);
              this.$router.push({ path: "/user" });
            });
          } else {
            this.searchData.urid = this.$route.query.data;
            this.$api.user.editUser(this.searchData).then(res => {
              this.$message.success(res.info);
              this.$router.push({
                path: "/user",
                query: { pageNum: that.$route.query.pageNum }
              });
              let currentLoginUserId = JSON.parse(
                localStorage.getItem("userInfo")
              ).userId;
              if (currentLoginUserId === this.searchData.urid) {
                this.$emit("showUserName", this.searchData.userName);
              }
            });
          }
        } else {
          this.$message.warning("还有字段未正确填写，请检查！");
        }
      });
    },
    //取消/关闭
    cancelSave: function() {
      if (this.isEdit === "look") {
        this.$router.push({
          path: "/user",
          query: { pageNum: this.$route.query.pageNum }
        });
        return;
      }
      this.$confirm("是否确认取消？", "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.$router.push({
            path: "/user",
            query: { pageNum: this.$route.query.pageNum }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  float: left;
}
.el-row {
  .el-col-4 {
    text-align: right;
    &::before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
}
</style>
