<template>
  <el-tree
    :data="data"
    :props="defaultProps"
    :show-checkbox="isShow"
    :node-key="id"
    :check-strictly="checkStrict"
    :expand-on-click-node="expandOnClick"
    ref="tree"
    :default-expand-all="expand"
    highlight-current
    @node-click="handleNodeClick"
    @check-change="handleCheckChange"
    @check="handleCheck"
  ></el-tree>
</template>

<script>
export default {
  name: "Tree",
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    id: {
      type: String,
      default: "id"
    },
    expandOnClick: {
      type: Boolean,
      default: true
    },
    checkStrict: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: true
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {};
      }
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //checked
    };
  },
  methods: {
    handleNodeClick: function(data, node) {
      this.$emit("node-click", data, node);
    },
    handleCheckChange: function(data, check) {
      this.$emit("check-change", data, check);
    },
    handleCheck: function(data, selection) {
      this.$emit("check", data, selection);
    }
  }
};
</script>

<style></style>
