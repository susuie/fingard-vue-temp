<template>
  <el-button
    :size="size"
    :type="type"
    :icon="icon"
    :loading="loading"
    v-if="hasPerms(page, btn)"
    :plain="plain"
    @click="handleClick"
  >
    {{ label }}
  </el-button>
</template>

<script>
export default {
  name: "PButton",
  props: {
    label: {
      // 按钮显示文本
      type: String,
      default: "Button"
    },
    icon: {
      // 按钮显示图标
      type: String,
      default: ""
    },
    size: {
      // 按钮尺寸
      type: String,
      default: "mini"
    },
    type: {
      // 按钮类型
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: false
    },
    loading: {
      // 按钮加载标识
      type: Boolean,
      default: false
    },
    disabled: {
      // 按钮是否禁用
      type: Boolean,
      default: false
    },
    page: {
      // 按钮权限标识，外部使用者传入
      type: String,
      default: ""
    },
    btn: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClick: function() {
      // 按钮操作处理函数
      this.$emit("click");
    },
    hasPerms: function(page, btn) {
      // 根据权限标识和外部指示状态进行权限判断
      let permission = this.$store.state.perms;
      if (permission[page] && permission[page].indexOf(btn) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {}
};
</script>

<style scoped></style>
