<template>
  <div>
    <el-upload
      :drag="drag"
      :auto-upload="true"
      action="/"
      :list-type="type"
      :limit="limit"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :data="{
        fileType: fileType,
        mark: mark
      }"
      :multiple="multiple"
      :http-request="uploadFile"
      :disabled="disabled || isUpload"
    >
      <div v-if="drag" slot="file" slot-scope="{ file }">
        <!-- <ul class="el-upload-list el-upload-list--text">
          <li
            class="el-upload-list__item is-success"
            v-for="(item, index) in fileList"
            :key="index"
          > -->
        <a class="el-upload-list__item-name"
          ><i class="el-icon-document"></i>{{ file.name }}</a
        ><label class="el-upload-list__item-status-label"
          ><i
            v-if="file.status === 'success'"
            class="el-icon-upload-success el-icon-circle-check"
          ></i> </label
        ><i class="el-icon-close" @click="handleRemove(file)"></i
        ><i class="el-icon-close-tip">按 delete 键可删除</i>
        <!-- </li>
        </ul> -->
        <el-progress
          v-if="file.percentage < 99"
          type="circle"
          :percentage="file.percentage"
        ></el-progress>
      </div>
      <slot name="context">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em><slot name="tips"></slot>
        </div>
      </slot>
    </el-upload>
    <el-dialog
      :visible.sync="dialog"
      :modal="false"
      :fullscreen="fullscreen"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <div class="zoom">
        <i class="el-icon-zoom-in" @click="fullscreen = true" />
        <i class="el-icon-zoom-out" @click="fullscreen = false" />
      </div>
      <iframe
        v-if="dialogImageUrl.indexOf('.pdf') > 0"
        :src="dialogImageUrl"
        width="100%"
        :height="fullscreen ? fullHeight : '400px'"
        frameborder="1"
      >
      </iframe
      ><img width="100%" :src="dialogImageUrl" alt="" v-else />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Upload",
  props: {
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    drag: {
      type: Boolean,
      default: false
    },
    mark: { type: String, default: "" },
    fileType: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "text"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  watch: {
    fileList(val) {
      return val;
    },
    disabled(val) {
      return val;
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialog: false,
      fullscreen: false,
      fullHeight: screen.height - 300,
      isUpload: false
    };
  },
  methods: {
    handlePreview: function(file) {
      if (!file.url) {
        return;
      }
      this.dialogImageUrl = file.url;
      let p = file.name.split(".");
      if (
        ["pdf", "png", "jpg", "jpeg", "svg", "bmp"].indexOf(
          p[p.length - 1].toLocaleLowerCase()
        ) >= 0 ||
        this.type === "picture-card"
      ) {
        this.dialog = true;
      } else {
        let $a = document.createElement("a");
        $a.href = this.dialogImageUrl;
        $a.download = "";
        document.body.appendChild($a);
        $a.click();
        document.body.removeChild($a);
      }
    },
    handleSuccess: function() {
      this.isUpload = false;
    },
    handleRemove: function(file) {
      if (file.status === "ready") {
        return false;
      }
      this.isUpload = false;
      this.dialogImageUrl = "";
      this.$emit("handleRemove", file);
    },

    uploadFile: function(param) {
      this.isUpload = true;
      this.$emit("uploadFile", param);
    },
    beforeUpload: function(file) {
      if (
        [
          "doc",
          "docx",
          "xls",
          "xlsx",
          "pdf",
          "jpg",
          "png",
          "jpeg",
          "zip",
          "rar"
        ].indexOf(
          file.name.substr(file.name.lastIndexOf(".") + 1).toLocaleLowerCase()
        ) < 0
      ) {
        this.$message.warning(
          "当前仅支持doc、docx、xls、xlsx、pdf、jpg、png、jpeg,zip,rar文件！"
        );
        return false;
      }
      if (file.size > 200 * 1024 * 1024) {
        this.$message.error("上传文件过大，每个文件上限200M！");
        return false;
      }
    },
    handleError: function() {
      this.isUpload = false;
    },
    handleExceed: function() {
      this.$message.warning(
        `文件数量过多，最多只能选取${this.limit}个文件上传！`
      );
    }
  }
};
</script>

<style lang="less">
.el-upload-dragger {
  width: 465px;
  height: 596px;
  border: none;
  img {
    width: 120px;
    margin-top: 119px;
  }
  .el-upload__text {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    margin-top: 60px;
  }
  .el-button {
    margin-top: 33px;
    margin-bottom: 88px;
  }
  .el-button--warning {
    color: #fff;
    background-color: #fb9f00;
    border-color: #fb9f00;
  }
  ol {
    width: 355px;
    margin: 0 auto;
    font-size: 12px;
    color: #666;
    text-align: left;
    line-height: 14px;
  }
}
.el-upload-list--text {
  width: 465px;
  margin-top: -205px;
}
.el-upload-list__item:first-child {
  margin: 0 auto;
  margin-top: -482px;
  height: 126px;
  width: 126px;
  line-height: 280px;
  border-radius: 50%;
  background-color: #e3eaf9;
}
.el-upload-list__item-name {
  margin-right: 0;
}
.zoom {
  text-align: right;
  i {
    font-size: 20px;
    margin-right: 10px;
  }
}
.el-upload-list__item .el-progress {
  top: 0;
  left: 0;
}
.el-progress__text {
  color: #fff;
  font-size: 20px !important;
  font-weight: 600;
}
</style>
