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
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      ></r-table>
    </el-main>
  </div>
</template>
<script>
import * as user from "@/http/implement/user";
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
        pageSize: 200,
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
        .getColumns("/order/agent/queryList.pub")
        .then(res => {
          this.columns = this.$columns(res, true);
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
      user.getUserList(this.searchData).then(res => {
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
