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
        <el-button type="primary" size="small" @click="savePerm"
          >保存</el-button
        >
        <el-button type="primary" size="small" @click="cancelSave"
          >关闭</el-button
        >
      </div>
      <div class="content">
        <h2>
          权限信息
        </h2>
        <Tree
          ref="assign"
          :data="treeData"
          :defaultProps="defaultProps"
          :id="'id'"
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
      currentItem: "分配权限",
      urid: this.$route.query.data,
      treeData: [],
      checkedTid: {},
      defaultProps: {
        children: "children",
        label: "title"
      }
    };
  },
  created() {
    this.getPerm();
  },
  methods: {
    //获取系统权限
    getPerm: function() {
      let that = this;
      this.$api.user.getPerm({ userId: that.urid }).then(res => {
        //this.treeData = res.data;
        let //i = 0,
          checkedkeys = [];
        let getCheckedKeys = data => {
          data.map(item => {
            // i++;
            // item.trid = i;
            // this.checkedTid[i] = item.id;
            if (item.checked === "1" && item.children === null) {
              checkedkeys.push(item.id);
            }
            if (item.children !== null) {
              getCheckedKeys(item.children);
            }
          });
        };
        getCheckedKeys(res.data);
        this.treeData = res.data;
        this.$refs.assign.$children[0].setCheckedKeys(checkedkeys, true);
      });
    },
    //取消/关闭
    cancelSave: function() {
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
    },

    //保存权限分配
    savePerm: function() {
      let that = this;
      let perm = this.$refs.assign.$children[0]
        .getCheckedNodes(false, true)
        .map(item => {
          return item.id;
        });
      this.$api.user
        .perm({ userId: that.urid, permissionIdList: perm })
        .then(res => {
          this.$message.success(res.info);
        });
    }
  }
};
</script>
<style lang="less">
.el-breadcrumb {
  float: left;
}
.tac {
  text-align: center;
  .sucess {
    font-size: 18px;
    line-height: 36px;
    margin-top: 30px;
    color: #68c23a;
  }
  .sub-explain {
    line-height: 24px;
    color: #666;
  }
}
</style>
