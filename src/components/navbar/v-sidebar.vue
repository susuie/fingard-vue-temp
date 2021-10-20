<template>
  <el-scrollbar
    :wrapStyle="[{ 'overflow-x': 'hidden' }]"
    class="page-component__scroll"
  >
    <el-menu
      @select="handleMenu"
      text-color="#BFC4C9"
      active-text-color="#1F82FB"
      mode="vertical"
      :default-active="$route.path"
      :unique-opened="true"
      :collapse-transition="false"
      :collapse="isCollapse"
      :class="isCollapse ? 'collapse-menu' : 'normal-menu'"
    >
      <v-sidebar-item
        :isCollapse="isCollapse"
        v-for="menu in menuShowLists"
        :item="menu"
        :key="menu.id"
      ></v-sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import VSidebarItem from "./v-sidebar-item";
export default {
  components: { VSidebarItem },
  props: {
    defaultActive: {
      type: String,
      default: ""
    },
    defaultOpeneds: {
      type: Array,
      default() {
        return [];
      }
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    menuLists: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    menuShowLists() {
      return this.menuLists;
    }
  },
  methods: {
    handleMenu(index, indexPath, vm) {
      this.$emit("handleMenu", index, { title: vm.$el.dataset.title });
    }
  }
};
</script>
<style lang="less">
.el-menu {
  border-right: 0 !important;
}
.el-menu--collapse {
  width: 80px !important;
  text-align: center;
  .el-submenu__icon-arrow.el-icon-arrow-right {
    display: none;
  }
}
.el-menu-item,
.el-submenu__title {
  height: 50px;
  line-height: 50px;
}
.el-menu-item {
  text-align: left;
  padding-left: 30px !important;
}
</style>
