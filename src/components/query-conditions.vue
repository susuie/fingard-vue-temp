<!-- 搜索表单 -->
<template>
  <div class="ces-search">
    <el-form
      :size="size"
      inline
      :label-width="labelWidth"
      :rules="rules"
      :model="searchData"
      @validate="saveForm"
    >
      <el-col
        :span="item.span ? item.span : itemWidth"
        v-for="item in searchForm"
        :key="item.prop"
        v-show="item.show ? item.show() : true"
      >
        <el-form-item
          :prop="item.prop"
          :label-width="item.width"
          :required="item.required"
        >
          <span slot="label">
            {{ item.label }}
            <slot name="tool" v-if="item.tool"></slot>
          </span>
          <!-- 输入框 -->
          <el-tooltip
            v-if="item.type === 'Input'"
            :content="
              searchData[item.prop]
                ? searchData[item.prop] + ''
                : item.placeholder
            "
            placement="top"
            :disabled="isShowTooltip"
            ><el-input
              v-model="searchData[item.prop]"
              size="mini"
              :ref="item.prop"
              @mouseover.native="onMouseOver(item.prop, 'input')"
              :type="item.rowType ? item.rowType : 'text'"
              :autosize="{
                minRows: item.rows ? item.rows : 2,
                maxRows: item.maxRows
              }"
              :show-word-limit="item.maxlength ? true : false"
              :maxlength="item.maxlength"
              @blur="item.handle ? item.handle() : null"
              @focus="item.click ? item.click() : null"
              @keyup.native="item.keyUp ? item.keyUp() : null"
              @clear="item.clear ? item.clear() : null"
              :disabled="
                item.disable
                  ? typeof item.disable === 'function'
                    ? item.disable()
                    : item.disable
                  : disable
              "
              :clearable="item.clearable"
              :placeholder="item.disable || disable ? '暂无' : item.placeholder"
              @dblclick.native="copy(searchData[item.prop])"
            ></el-input>
          </el-tooltip>
          <!-- 下拉框 -->

          <el-select
            v-if="item.type === 'Select'"
            :class="{ isLong: item.long }"
            v-model="searchData[item.prop]"
            size="mini"
            filterable
            :clearable="item.clearable ? item.clearable : false"
            :multiple="item.multiple ? item.multiple : false"
            :collapse-tags="item.multiple ? !item.collapse : false"
            :placeholder="item.placeholder"
            :disabled="
              item.disable
                ? typeof item.disable === 'function'
                  ? item.disable()
                  : item.disable
                : disable
            "
            @change="item.change ? item.change(searchData[item.prop]) : null"
            @clear="item.clear ? item.clear() : null"
          >
            <el-tooltip
              v-for="op in item.options
                ? item.options
                : list[item.prop + 'List']"
              :key="op.value"
              :content="op.label"
              placement="top"
              :disabled="isShowTooltip"
            >
              <el-option
                :label="op.label"
                :value="op.value"
                @mouseover.native="
                  hasMouse ? onMouseOver(op.label, 'select') : null
                "
              ></el-option>
            </el-tooltip>
          </el-select>

          <!--级联下拉-->
          <el-cascader
            v-if="item.type === 'Cascader'"
            placeholder="请选择"
            v-model="searchData[item.prop]"
            :key="Math.random()"
            :options="item.options ? item.options : list[item.prop + 'List']"
            :props="defaultProps"
            :disabled="
              item.disable
                ? typeof item.disable === 'function'
                  ? item.disable()
                  : item.disable
                : disable
            "
            @change="item.change ? item.change(searchData[item.prop]) : null"
            filterable
          ></el-cascader>

          <!-- 单选 -->
          <el-radio-group
            v-if="item.type === 'Radio'"
            v-model="searchData[item.prop]"
            :disabled="item.disable ? item.disable : disable"
          >
            <el-radio
              v-for="ra in item.radios"
              :label="ra.value"
              :key="ra.value"
              >{{ ra.label }}</el-radio
            >
          </el-radio-group>
          <!-- 单选按钮 -->
          <el-radio-group
            v-if="item.type === 'RadioButton'"
            v-model="searchData[item.prop]"
            :disabled="item.disable ? item.disable : disable"
            @change="item.change && item.change(searchData[item.prop])"
          >
            <el-radio-button
              v-for="ra in item.radios"
              :label="ra.value"
              :key="ra.value"
              >{{ ra.label }}</el-radio-button
            >
          </el-radio-group>
          <!-- 复选框 -->
          <el-checkbox-group
            v-if="item.type === 'Checkbox'"
            v-model="searchData[item.prop]"
            :disabled="item.disable ? item.disable : disable"
          >
            <el-checkbox
              v-for="ch in item.checkboxs"
              :label="ch.value"
              :key="ch.value"
              >{{ ch.label }}</el-checkbox
            >
          </el-checkbox-group>
          <!-- 日期 -->
          <el-date-picker
            v-if="item.type === 'Date'"
            :value-format="item.valueFormat"
            :default-time="item.defaultTime"
            :picker-options="item.pickerOptions"
            :type="item.dateType ? item.dateType : 'date'"
            :placeholder="item.disable || disable ? '暂无' : item.placeholder"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="searchData[item.prop]"
            @change="item.change ? item.change() : null"
            :disabled="item.disable ? item.disable : disable"
            :clearable="item.clear === '0' ? false : true"
          ></el-date-picker>
          <!-- 时间 -->
          <el-time-select
            v-if="item.type === 'Time'"
            v-model="searchData[item.prop]"
            :disabled="item.disable ? item.disable : disable"
            type=""
          ></el-time-select>
          <!-- 日期时间 -->
          <el-date-picker
            v-if="item.type === 'DateTime'"
            type="datetime"
            v-model="searchData[item.prop]"
            :disabled="item.disable && item.disable(searchData[item.prop])"
          ></el-date-picker>
          <!-- 滑块 -->
          <el-slider
            v-if="item.type === 'Slider'"
            v-model="searchData[item.prop]"
          ></el-slider>
          <!-- 开关 -->
          <el-switch
            v-if="item.type === 'Switch'"
            v-model="searchData[item.prop]"
          ></el-switch>
          <!--文件上传-->
          <Upload
            v-if="item.type === 'Upload'"
            :type="item.uploadType"
            :fileList="fileList[item.prop]"
            :fileType="item.prop"
            :multiple="multiple"
            :mark="item.mark ? item.mark : ''"
            :disabled="item.disable ? item.disable : disable"
            :url="item.url ? item.url : '#'"
            :download="item.download ? item.download : false"
            @handleRemove="handleRemove"
            @uploadFile="uploadFile"
          ></Upload>
          <span v-if="item.type === 'UploadImg'">
            <img :src="searchData[item.prop]" />
          </span>
          <span v-if="item.type.indexOf('text') >= 0">
            <a
              v-if="item.type === 'textUrl'"
              :href="searchData[item.prop] ? searchData[item.prop] : '#'"
              target="_blank"
            >
              {{ searchData[item.prop] ? searchData[item.prop] : "暂无" }}</a
            >
            <span class="acolor" v-else>{{
              searchData[item.prop] ? searchData[item.prop] : "暂无"
            }}</span>
          </span>
        </el-form-item>
      </el-col>
      <el-form-item
        class="search-button"
        v-for="item in searchHandle"
        :key="item.label"
        :style="{ clear: clear ? 'left' : 'none' }"
      >
        <p-button
          v-if="item.perm"
          :page="item.page"
          :size="item.size || size"
          :type="item.type"
          :label="item.label"
          :btn="item.btn"
          @click="item.handle"
        />
        <el-button
          v-else
          :type="item.type"
          :size="item.size || size"
          @click="item.handle()"
          >{{ item.label }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Query",
  props: {
    isHandle: {
      type: Boolean,
      default: true
    },
    hasMouse: { type: Boolean, default: true },
    clear: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: "100px"
    },
    itemWidth: {
      type: Number,
      default: 6
    },
    size: {
      type: String,
      default: "mini"
    },
    searchForm: {
      type: Array,
      default: () => []
    },
    searchHandle: {
      type: Array,
      default: () => []
    },
    searchData: {
      type: Object,
      default: () => {}
    },
    defaultProps: { type: Object, default: () => {} },
    rules: { type: Object, default: () => {} },
    fileList: {
      type: Object,
      default: () => {}
    },
    multiple: {
      type: Boolean,
      default: false
    },
    list: {
      type: Object,
      default: () => {}
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowTooltip: true
    };
  },
  watch: {
    fileList(val) {
      return val;
    },
    list(val) {
      return val;
    },
    disable(val) {
      return val;
    },
    searchForm(val) {
      return val;
    }
  },
  methods: {
    uploadFile: function(param) {
      this.$emit("uploadFile", param);
    },
    handleRemove: function(file) {
      this.$emit("handleRemove", file);
    },
    saveForm: function() {
      this.$emit("save-form");
    },
    copy: function(value) {
      this.$clipboard(value);
      this.$message.success("复制成功");
    },
    onMouseOver(str, type) {
      let parentWidth, contentWidth;
      if (type === "input") {
        parentWidth = this.$refs[str][0].$refs.input
          ? this.$refs[str][0].$refs.input.offsetWidth
          : 550;
        contentWidth = this.$refs[str][0].value
          ? this.$refs[str][0].value.length * 14 + 14
          : this.$refs[str][0].$refs.input
          ? this.$refs[str][0].$refs.input.placeholder.length * 14 + 14
          : 280;
      }
      if (type === "select") {
        let ele = document.getElementsByClassName("el-select-dropdown");
        for (let j = 0; j < ele.length; j++) {
          if (ele[j].style.display !== "none") {
            parentWidth = parseInt(
              document.getElementsByClassName("el-select-dropdown")[j].style
                .minWidth
            );
            break;
          }
        }
        parentWidth = parentWidth > 180 ? parentWidth : 180;
        contentWidth = str.length * 12 + 40;
      }
      // 判断是否开启tooltip功能
      if (contentWidth >= parentWidth) {
        this.isShowTooltip = false;
      } else {
        this.isShowTooltip = true;
      }
    },
    exportData: function(url, data) {
      let that = this;
      this.$api.common.exportData(url, data).then(res => {
        that.$message.success({ message: "操作成功！", showClose: true });
        let $a = document.createElement("a");
        $a.href = res.data.excelUrl;
        $a.download = "";
        document.body.appendChild($a);
        $a.click();
        document.body.removeChild($a);
      });
    }
  }
};
</script>

<style lang="less">
@media screen and(max-width: 1200px) {
  width: 1240px !important;
}
.ces-search {
  text-align: left;
  overflow: hidden;
  margin-top: 10px;
  position: relative;
  .el-button {
    margin-left: 15px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 12px;
  }
  .el-form-item__label {
    line-height: 32px;
    font-size: 12px;
    color: #333;
  }
  .el-form-item__content {
    span {
      max-width: 200px;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }
  .el-input__inner {
    width: 180px;
    text-overflow: ellipsis;
  }
  .el-date-editor.el-input__inner {
    width: 200px;
    padding: 3px 5px;
  }
  .el-col-24 {
    .el-input__inner {
      width: 550px;
    }
    .el-textarea__inner {
      width: 550px;
    }
  }
  .el-col-12 {
    .el-input__inner {
      width: 280px;
      text-overflow: ellipsis;
    }
  }
  .acolor {
    color: #4070fc;
  }
  .search-button {
    float: left;
  }
}
@media screen and (max-width: 1200px) {
  .el-date-range-picker {
    width: 90%;
    overflow: auto;
    .el-picker-panel__body {
      min-width: 400px;
    }
    .el-date-range-picker__content {
      .el-date-range-picker__header {
        div {
          margin-left: 10px;
          margin-right: 10px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
