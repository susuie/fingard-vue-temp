<template>
  <div class="menu-wrap">
    <div class="clearfix">
      <el-tag
        :closable="item.url !== defaultPage.url"
        v-for="item in TagLists"
        :key="item.url"
        :index="item.url"
        :class="{
          active:
            selectMenu.url === item.url || (item.url === '/' && !selectMenu)
        }"
        size="small"
        @close="handleTabRemove(item.url, item.title)"
        @click="handleTabClick(item.url, item.title)"
        >{{ item.title }}</el-tag
      >
      <el-dropdown trigger="click" @command="handleClose">
        <el-button size="mini">
          关闭操作
          <i class="el-icon-arrow-down"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0">全部关闭</el-dropdown-item>
          <el-dropdown-item command="1">关闭其他</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: "Tag",
  props: {
    TagLists: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    selectMenu: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    },
    defaultPage: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      activeInfo: {}
    };
  },
  watch: {
    selectMenu: {
      immediate: true,
      handler(val) {
        this.activeInfo = val;
      }
    },
    TagLists(val) {
      return val;
    },
    defaultPage(val) {
      return val;
    }
  },
  methods: {
    handleClose(name) {
      if (name === "0" || this.tabUrl === this.defaultPage.url) {
        this.$emit("tabRemove", this.TagLists[0], "All");
      } else {
        this.$emit("tabRemove", this.activeInfo, "Other");
      }
    },
    handleTabRemove(url, title) {
      let delInfo = { url: url, title: title };
      this.$emit("tabRemove", this.activeInfo || {}, delInfo);
    },
    handleTabClick(url, title) {
      this.$emit("tabClick", url, { title: title });
    }
  }
};
</script>
<style lang="less">
@media screen and(max-width: 1200px) {
  .menu-wrap {
    width: 1220px;
  }
  .el-dropdown {
    margin-right: 10px;
  }
}
.menu-wrap {
  height: 32px;
  padding-top: 8px;
  padding-left: 20px;
  overflow: hidden;
  background-color: #ffffff;
  border-top: 1px solid #f5f5f5;
  text-align: left;
  .el-tag {
    margin-right: 3px;
    cursor: default;
    &.active {
      background-color: #409fff;
      color: #ffffff;
      border-color: #409fff;
      i {
        color: #ffffff;
      }
    }
  }
}
.el-dropdown {
  float: right;
  margin-right: 10px;
}
</style>
