<template>
  <div class="sidebar-item-wrapper">
    <el-submenu
      v-if="!!this.item.childrenNode && this.item.childrenNode.length > 0"
      :index="item.id"
      :popper-append-to-body="true"
    >
      <template slot="title">
        <i
          :class="'iconfont ' + (item.icon ? item.icon : 'no-icon-sub-menu')"
        ></i>
        <span v-show="!isCollapse">{{ item.title }}</span>
      </template>
      <template v-for="child in children">
        <v-sidebar-item
          v-if="child.childrenNode && child.childrenNode.length > 0"
          :item="child"
          :key="child.id"
        ></v-sidebar-item>
        <el-menu-item
          class="sidebar-leaf-menu"
          :data-title="child.title"
          v-else
          :route="child.url"
          :index="child.url"
          :key="child.id"
          >{{ child.title }}</el-menu-item
        >
      </template>
    </el-submenu>
    <el-menu-item
      :data-title="item.title"
      v-else
      :route="item.url"
      :index="item.url"
      :key="item.id"
    >
      <i
        :class="'iconfont ' + (item.icon ? item.icon : 'no-icon-sub-menu')"
      ></i>
      <span v-show="!isCollapse">{{ item.title }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  computed: {
    children() {
      if (this.item.childrenNode) {
        return this.item.childrenNode;
      } else {
        return null;
      }
    }
  }
};
</script>

<style scoped lang="less">
.sidebar-item-wrapper .iconfont {
  font-weight: lighter;
}
.el-menu-item:focus,
.el-menu-item:hover {
  outline: 0;
  color: #fff;
  background-color: #272730;
}
.el-menu-item.is-active {
  color: #fff !important;
}
.el-menu-item .iconfont {
  margin-right: 15px;
}
/deep/.el-submenu__title {
  padding-left: 30px !important;
  color: rgb(191, 196, 201);
  text-align: left;
}
</style>
