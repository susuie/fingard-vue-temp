<template>
  <div>
    <Query
      size="mini"
      labelWidth="80px"
      :itemWidth="7"
      :searchData="searchData"
      :searchForm="searchForm"
      :searchHandle="searchHandle"
      :list="list"
    />
    <el-main class="table-main" v-if="columns.length > 0">
      <r-table
        ref="myTable"
        :tableData="tableData"
        :columns="columns"
        :uniqueID="'urid'"
        :current="searchData.pageNum"
        :pageSize="searchData.pageSize"
        :total="total"
        :multiSelect="true"
        :isHandle="true"
        :tableHandles="tableHandles"
        @on-select-all="onSelectAll"
        @on-select="select"
        @on-selection-change="selectChange"
        @on-row-dblclick="rowDblclick"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      ></r-table>
    </el-main>
  </div>
</template>
<script>
export default {
  name: "user",
  data() {
    return {
      searchForm: [
        {
          type: "Input",
          label: "用户名称",
          prop: "userName",
          placeholder: "请输入",
          clearable: true
        },
        {
          type: "Input",
          label: "用户账号",
          prop: "mobile",
          clearable: true,
          placeholder: "请输入"
        },
        {
          type: "Select",
          label: "用户状态",
          prop: "userStatusCodeArray",
          multiple: true,
          change: value => {
            this.searchData.userStatusCodeArray = value;
            this.getTableData();
          },
          placeholder: "请选择"
        }
      ],
      searchHandle: [
        {
          label: "查询",
          type: "primary",
          handle: () => {
            this.getTableData();
          }
        }
      ],
      tableData: [],
      total: 0,
      tableHandles: [
        {
          label: "新增",
          type: "primary",
          size: "small",
          page: "user",
          btn: "Add",
          handle: () => {
            this.$router.push({
              path: "/user/add",
              query: { state: "add" }
            });
          }
        },
        {
          label: "编辑",
          type: "primary",
          size: "small",
          page: "user",
          btn: "Edit",
          handle: () => {
            if (this.selection.length !== 1) {
              this.$message.warning("请选择一条操作记录！");
              return;
            }
            this.$router.push({
              path: "/user/add",
              query: {
                data: this.selection[0].urid,
                state: "edit",
                pageNum: this.searchData.pageNum
              }
            });
          }
        },
        {
          label: "重置密码",
          type: "primary",
          size: "small",
          page: "user",
          btn: "Reset",
          handle: () => {
            if (this.selection.length !== 1) {
              this.$message.warning("请选择一条操作记录！");
              return;
            }
            let that = this;
            this.$confirm("是否确认重置密码？", "请确认", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "info"
            }).then(() => {
              that.$api.user
                .resetPwd({ urid: that.selection[0].urid })
                .then(res => {
                  let showMessage = res.info;
                  let currentLoginUserId = JSON.parse(
                    localStorage.getItem("userInfo")
                  ).userId;
                  if (currentLoginUserId === that.selection[0].urid) {
                    showMessage += "，将为您跳转到登录页！";
                    setTimeout(() => {
                      localStorage.setItem("userInfo", "");
                      that.$router.push("/Login");
                    }, 2000);
                  } else {
                    that.getTableData();
                  }
                  that.$message.success(showMessage);
                });
            });
          }
        }
      ],
      list: {
        userStatusCodeArrayList: [],
        orgNameList: []
      },
      columns: [],
      selection: [],
      dialogVisible: false,
      searchData: {
        pageNum: this.$route.query.pageNum
          ? parseInt(this.$route.query.pageNum)
          : 1,
        pageSize: 50,
        userName: "",
        mobile: "",
        orgName: "",
        userStatusCodeArray: []
      } //search data
    };
  },
  created() {
    this.getColumns();
    this.getENData();
  },
  activated() {
    this.getTableData();
  },
  methods: {
    getColumns: function() {
      this.$root.$children[0]
        .getColumns("/system/user/queryList.do")
        .then(res => {
          this.columns = this.$columns(res);
        });
    },
    getENData: function() {
      let that = this;
      this.$root.$children[0].getDataDic("ENUserStatus").then(res => {
        that.list.userStatusCodeArrayList = res;
      });
    },
    getTableData: function(page) {
      this.searchData.pageNum = page ? page : 1;
      this.$api.user.getUserList(this.searchData).then(res => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
      });
    },
    // Triggered when the number of pages changes
    pageChange(page) {
      this.getTableData(page);
    },
    // Triggered when the number of display bars per page of the table changes
    pageSizeChange(pageSize) {
      if (this.searchData.pageSize !== pageSize) {
        this.searchData.pageSize = pageSize;
        this.searchData.pageNum = 1;
        this.getTableData();
      }
    },
    rowDblclick: function(row) {
      this.$router.push({
        path: "/user/add",
        query: {
          data: row.urid,
          state: "look",
          pageNum: this.searchData.pageNum
        }
      });
    },
    select: function(selection) {
      this.selection = selection;
    },
    selectChange: function(selection) {
      this.selection = selection;
    },
    onSelectAll: function(selection) {
      this.selection = selection;
    }
  }
};
</script>
<style lang="less" scoped>
.ces-search {
  overflow: hidden;
}
a {
  margin-left: 10px;
}
.el-select-dropdown__item {
  font-size: 12px;
}
.el-input--small {
  font-size: 12px;
}
</style>
