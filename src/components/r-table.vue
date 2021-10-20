<template>
  <div class="rtable-box">
    <div class="ces-handle" v-if="isHandle">
      <el-button
        v-for="item in permBtns"
        :key="item.label"
        :size="item.size || 'small'"
        :type="item.type || type"
        :icon="item.icon"
        :disabled="item.disable ? edit : false"
        @click="item.handle()"
        >{{ item.label }}</el-button
      >
    </div>
    <div class="Rtable">
      <div ref="tableBox" class="my-table">
        <el-table
          ref="table"
          style="width: 100%"
          :data="tableData"
          :row-key="uniqueID"
          :stripe="stripe"
          :border="border"
          :height="tableHeight"
          :fit="fit"
          size="small"
          :show-header="showHeader"
          :default-sort="defaultSort"
          :highlight-current-row="highlightCurrentRow"
          :current-row-key="currentRowKey"
          v-loading="loading"
          @select="selectChange"
          @select-all="selectALL"
          @selection-change="selectGroupChange"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          @sort-change="sortChange"
          @current-change="currentChange"
          :row-style="currentRowStyle"
          :cell-style="setCellStyle"
          :header-cell-style="headerCellStyle"
          cell-class-name="cell-class"
          header-cell-class-name="header-cell-class"
          :row-class-name="currentRowClassName"
        >
          <p v-show="containDefault">
            <slot></slot>
          </p>
          <el-table-column
            v-if="multiSelect"
            type="selection"
            width="40"
            fixed
          ></el-table-column>
          <el-table-column
            v-for="item in columns"
            :key="item.key"
            :prop="item.prop"
            :fixed="item.fixed"
            :label="item.label"
            :width="isDialog ? null : item.width"
            :min-width="item.minWidth"
            :show-overflow-tooltip="item.tooltip ? item.tooltip : true"
            :sortable="item.sort ? item.sort : false"
            :formatter="item.format ? item.format : null"
            :resizable="item.resize ? item.resize : true"
            :align="item.align ? item.align : 'left'"
            :header-align="item.headerAlign ? item.headerAlign : 'left'"
            ><div v-if="scope.row.edit" slot-scope="scope">
              <Ecol
                :item="{
                  ...scope,
                  ...item
                }"
              />
            </div>
            <div v-else>
              <span>{{ scope.row[item.prop] }}</span>
            </div></el-table-column
          >
          <slot name="operationColumns"></slot>
        </el-table>
      </div>
    </div>
    <el-row :style="rowStyle" v-if="showPage">
      <el-col :span="12">
        <div v-if="showSumLabel" class="summary">
          <slot name="sum">
            <div class="my-page-total">
              <slot name="showInfo"></slot>
            </div>
          </slot>
        </div>
      </el-col>
      <el-col :span="12" class="my-page-wrap">
        <el-pagination
          :background="background"
          :layout="layout"
          style="width:100%;text-align: right"
          :current-page.sync="currentPage"
          :total="currentTotal"
          :page-size="currentPageSize"
          :page-sizes="pageSizes"
          :pager-count="5"
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "RTable",
  props: {
    isHandle: {
      type: Boolean,
      default: true
    },
    isDialog: {
      type: Boolean,
      default: false
    },
    edit: { type: Boolean, default: true }, //是否根据某个字段值可选操作
    defaultSort: {
      type: Object,
      default() {
        return {};
      }
    },
    showPage: {
      type: Boolean,
      default: true
    },
    highlightSelectRow: {
      type: Boolean,
      default: true
    },
    rowStyle: {
      type: Object,
      default() {
        return { padding: "2px 0px" };
      }
    },
    setCellStyle: {
      type: Function
    },
    rowClassName: {
      type: Function
    },
    hasShift: {
      type: Boolean,
      default: false
    },
    showSumLabel: {
      type: Boolean,
      default: false
    },
    // unique id in table raws
    uniqueID: {
      type: [Function, String],
      default: "pkId"
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    tableHandles: {
      type: Array,
      default: () => []
    },
    stripe: {
      type: Boolean,
      default: false
    },
    fit: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    currentRowKey: {
      type: [Number, String]
    },
    loading: {
      type: Boolean,
      default: false
    },
    headerCellStyle: {
      type: Function
    },
    verticalResizeOffset: {
      type: Number,
      default: 60
    },
    height: {
      type: [Number, String]
    },
    border: {
      type: Boolean,
      default: true
    },
    //表格列props
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    // 分页props
    background: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: "sizes, prev, pager, next, jumper"
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 50, 100, 150, 200];
      }
    },
    current: {
      type: Number,
      default: 1
    },
    containDefault: {
      type: Boolean,
      default: false
    },
    rowClickCheck: {
      type: Boolean,
      default: true
    },
    multiSelect: {
      //是否需要多选
      type: Boolean,
      default: false
    },
    editTable: {
      //是否需要多选
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableHeight: -1,
      maxHeight: 0,
      data: this.tableData,
      sort: this.defaultSort,
      column: this.columns,
      isloading: this.loading,
      currentPage: this.current,
      currentPageSize: this.pageSize,
      currentTotal: this.total,
      currentSelectTotal: 0,
      currentCheckNodeUrids: [],
      currentRowClassName: this.rowClassName,
      CtrlDown: false,
      shiftOrAltDown: false,
      selectionRow: [] //选择的行
    };
  },
  watch: {
    tableData(val) {
      this.data = val;
    },
    edit(val) {
      return val;
    },
    total(val) {
      this.currentTotal = val;
    },
    current(val) {
      this.currentPage = val;
    },
    pageSize(val) {
      this.currentPageSize = val;
    },
    columns(val) {
      this.columns = val;
    },
    defaultSort(val) {
      this.defaultSort = val;
    }
  },
  mounted() {
    // 设置表格高度
    this.$nextTick(() => {
      this.tableHeight = this.initTableHeight() + 15;
    });
    window.onresize = () => {
      this.tableHeight = this.initTableHeight() + 15;
    };
    //添加键盘监听事件
    window.addEventListener("keydown", this.keyDown, false);
    window.addEventListener("keyup", this.keyUp, false);
  },
  activated() {
    // 设置表格高度
    this.$nextTick(() => {
      this.tableHeight = this.initTableHeight() + 15;
    });
    window.onresize = () => {
      this.tableHeight = this.initTableHeight() + 15;
    };
  },
  methods: {
    hasPerms: function(page, btn) {
      // 根据权限标识和外部指示状态进行权限判断
      let permission = this.$store.state.perms;
      if (permission[page] && permission[page].indexOf(btn) >= 0) {
        return true;
      } else {
        return false;
      }
    },
    toggleRowSelection(row, check) {
      this.$refs.table.toggleRowSelection(row, check);
    },
    // 页面离开时保存滚动条位置
    saveScrollTop() {
      this.scrollTop = this.$el.querySelector(
        ".el-table__body-wrapper"
      ).scrollTop;
    },
    // beforeRouteEnter时设置滚动条位置
    setScrollTop() {
      this.$el.querySelector(
        ".el-table__body-wrapper"
      ).scrollTop = this.scrollTop;
    },
    // //单元格样式
    // setCellStyle: function({ row, column }) {
    //   this.$emit("cell-style", { row, column });
    // },
    // 解决翻页时滚动条不会滚动到顶部
    resetScrollTop() {
      this.scrollTop = 0;
      this.$el.querySelector(
        ".el-table__body-wrapper"
      ).scrollTop = this.scrollTop;
    },
    // 设置表格高度
    setTableHeight(height) {
      this.tableHeight = height || this.initTableHeight() + 15;
    },
    resetTableHeight() {
      this.tableHeight = -1;
      this.$nextTick(() => {
        this.tableHeight = this.initTableHeight() + 15;
        this.$refs.table.doLayout();
      });
    },
    // 获取表格可用高度
    initTableHeight() {
      if (this.height) {
        return this.height;
      } else {
        let TableBox_ = document.getElementsByClassName("rtable-box");
        if (TableBox_.length > 0) {
          let windowHeight = document.documentElement.clientHeight;
          let top = this.$refs.tableBox.getBoundingClientRect().top;
          return windowHeight - top - this.verticalResizeOffset;
        }
      }
    },
    // 全选时触发
    selectALL(selection) {
      this.currentSelectTotal = selection.length;
      this.selectionRow = selection;
      this.currentCheckNodeUrids = selection.map(x => x[this.uniqueID]);
      this.$emit("on-select-all", selection);
    },
    // 某一项 checkbox 触发
    selectChange(selection, row) {
      this.currentSelectTotal = selection.length;
      this.selectionRow = selection;
      this.currentCheckNodeUrids = selection.map(x => x[this.uniqueID]);
      this.$emit("on-select", selection, row);
    },
    // 在多选模式下有效，只要选中项发生变化时就会触发
    selectGroupChange(selection) {
      this.currentSelectTotal = selection.length;
      this.selectionRow = selection;
      this.currentCheckNodeUrids = selection.map(x => x[this.uniqueID]);
      this.$emit("on-selection-change", selection);
    },
    //键盘按下时触发的事件
    keyDown(event) {
      let key = event.keyCode;
      if (key === 17) this.CtrlDown = true;
      if (key === 16 || key === 18) this.shiftOrAltDown = true;
    },
    //离开键盘时触发的事件
    keyUp(event) {
      let key = event.keyCode;
      if (key === 17) this.CtrlDown = false;
      if (key === 16 || key === 18) this.shiftOrAltDown = false;
    },
    //获取最新最上和最下行
    getTopAndBottom(row, bottom, top) {
      let n = row.rowIndex, //当前行的行号
        mx = bottom.rowIndex, //已选择的最下行的行号
        mi = top.rowIndex; //已选择的最上行的行号
      if (n > mx) {
        return {
          top: mi,
          bottom: n
        };
      } else if (n < mx && n > mi) {
        return {
          top: mi,
          bottom: n
        };
      } else if (n < mi) {
        return {
          top: n,
          bottom: mx
        };
      } else if (n === mi || n === mx) {
        return {
          top: mi,
          bottom: mx
        };
      }
    },
    // 行单击回调
    rowClick(row, event, column) {
      if (this.editTable) {
        return;
      }
      let refsElTable = this.$refs.table;
      if (this.hasShift) {
        //按下crtl键时的事件
        if (this.CtrlDown) {
          refsElTable.toggleRowSelection(row);
          return;
        }
        //按下shift或者alt键且已选择了至少一行时的事件
        if (this.shiftOrAltDown && this.selectionRow.length > 0) {
          let topAndBottom = this.getTopAndBottom(
            row,
            this.bottomSelectionRow,
            this.topSelectionRow
          ); //获取最上行和最下行
          refsElTable.clearSelection(); //取消所有已选择的行
          for (
            let index = topAndBottom.top;
            index <= topAndBottom.bottom;
            index++
          ) {
            refsElTable.toggleRowSelection(this.tableData[index], true);
          } //将最上行到最下行之间的行设为已选择
        } else {
          //单纯的点击行时触发的事件
          refsElTable.toggleRowSelection(row); //选择当前点击这一行
          this.$emit("on-row-click", row, event, column);
        }
      } else {
        refsElTable.toggleRowSelection(row); //选择当前点击这一行
        this.$emit("on-row-click", row, event, column);
      }
    },
    // 行双击回调
    rowDblclick(row, event) {
      this.$emit("on-row-dblclick", row, event);
    },
    currentChange(current, old) {
      this.$emit("currentChange", current, old);
    },
    // 清除排序
    clearSort() {
      this.$refs.table.clearSort();
    },
    clearSelection() {
      this.$refs.table.clearSelection();
    },
    // 排序时生效
    sortChange(column) {
      let sortName = column.prop === null ? "" : column.prop;
      let sortType = "";
      if (column.order === "ascending") {
        sortType = "asc";
      } else if (column.order === "descending") {
        sortType = "desc";
      }
      this.$emit("on-sort-change", sortName, sortType);
    },

    // 每页展示条数改变
    pageSizeChange(pageSize) {
      this.currentPageSize = pageSize;
      this.$emit("on-page-size-change", pageSize);
    },
    // 当前页改变
    currentPageChange(page) {
      this.currentPage = page;
      this.$emit("update:current", page);
      this.$emit("on-change", page);
    },
    //表格行的属性配置
    getFormatter() {},
    // 选中行高亮
    currentRowStyle({ row, rowIndex }) {
      let that = this;
      if (
        that.currentCheckNodeUrids.length > 0 &&
        that.currentCheckNodeUrids[0] !== undefined &&
        this.highlightSelectRow
      ) {
        let list = that.currentCheckNodeUrids.filter(
          x => x === row[this.uniqueID]
        );
        if (list.length > 0) {
          return {
            background: "#b3e9ff"
          };
        }
      }
      Object.defineProperty(row, "rowIndex", {
        value: rowIndex,
        writable: true,
        enumerable: false
      });
      return {};
    }
  },
  //计算选择的行
  computed: {
    permBtns: function() {
      return this.tableHandles.filter(item => {
        return this.hasPerms(item.page, item.btn);
      });
    },
    bottomSelectionRow() {
      if (this.selectionRow.length === 0) return null;
      return this.selectionRow.reduce((start, end) => {
        return start.rowIndex > end.rowIndex ? start : end;
      });
    },
    topSelectionRow() {
      if (this.selectionRow.length === 0) return null;
      return this.selectionRow.reduce((start, end) => {
        return start.rowIndex < end.rowIndex ? start : end;
      });
    }
  },
  //页面销毁前移除监听事件
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  }
};
</script>
<style lang="less">
/*eslint-disable */
.rtable-box {
  padding: 15px;
  background-color: #fff;
  .el-table {
    color: #333;
    min-height: 100px;
    thead th {
      color: #333;
      background-color: #f3f9fc;
      display: table-cell !important;
    }
  }
}
.el-table--small td,
.el-table--small th {
  padding: 7px 0;
}
.ces-handle {
  text-align: left;
  .el-button--small {
    font-size: 12px;
    margin-bottom: 15px;
    margin-right: 10px;
    margin-left: 0 !important;
  }
}
</style>

<style lang="less">
.el-table--mini,
.el-table--small,
.el-table__expand-icon {
  font-size: 12px !important;
}
.my-page-wrap {
  position: relative;
  float: right;
  .el-pagination__sizes {
    float: left;
  }
  .el-pagination {
    padding: 5px 20px 5px 0px;
    .el-select .el-input {
      margin: 0;
    }
  }
}
.el-table thead {
  color: #667180;
  th > .cell {
    white-space: nowrap;
  }
}
.el-table tbody {
  color: #353b4b;
}
.summary {
  height: 38px;
}
.my-page-sum {
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  padding-left: 20px;
  border-top: 2px solid #f0f2f5;
}

.my-page-total {
  position: absolute;
  left: 0;
  height: 20px;
  line-height: 20px;
  top: 0;
  font-size: 12px;
  text-align: left;
}
a {
  color: #4070fc;
}
.operation {
  color: #4070fc;
  cursor: pointer;
}
.cell-class {
  padding: 2px 0 !important;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #fff;
  display: none;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: lightgray;
}
.table-main {
  padding: 5px 10px 20px !important;
}
.el-tooltip__popper {
  max-width: 500px;
}
</style>
