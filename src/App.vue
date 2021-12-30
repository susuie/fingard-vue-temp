<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      timeOut: ""
    };
  },
  created() {
    this.isTimeOut();
  },
  methods: {
    // throttle（Timestamp + timer）节流
    throttle(fn, wait) {
      var timer = null;
      var startTime = Date.now();
      return function() {
        var curTime = Date.now();
        var remaining = wait - (curTime - startTime);
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        if (remaining <= 0) {
          fn.apply(context, args);
          startTime = Date.now();
        } else {
          timer = setTimeout(fn, remaining);
        }
      };
    },
    handle() {
      clearInterval(this.timeOut);
      if (this.$route.path === "/Login") {
        return;
      }
      let uuid = window.$cookies.get("token");
      this.$cookies.set("token", uuid, 8 * 60 * 60); //in seconds
      this.timeOut = setInterval(() => {
        this.$message.success("长时间未操作，请重新登录");
        localStorage.setItem("userInfo", "");
        this.$router.push({ name: "Login" });
      }, 8 * 60 * 60 * 1000); //In milliseconds
    },
    isTimeOut() {
      document.body.onmouseup = this.throttle(this.handle, 1000);
      document.body.onmouseover = this.throttle(this.handle, 1000);
      document.body.onkeyup = this.throttle(this.handle, 1000);
      document.body.onclick = this.throttle(this.handle, 1000);
      document.body.ontouchend = this.throttle(this.handle, 1000);
      window.addEventListener("resize", this.throttle(this.handle, 1000));
      window.addEventListener("scroll", this.throttle(this.handle, 1000));
    },
    async getDataDic(name) {
      let data = {};
      await this.$api.common.getDataDic({ enumName: name }).then(res => {
        data = res.data;
      });
      return data;
    },
    async getColumns(path) {
      let data = {};
      await this.$api.common.getColumns({ tablePageName: path }).then(res => {
        data = res.data;
      });
      return data;
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: PingFangSC-Regular, -apple-system-font, Source Han Sans,
    Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.el-tag {
  max-width: 76%;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}
.isLong {
  .el-tag.el-tag--info {
    &:first-child {
      padding-right: 12px;
    }
  }
  .el-tag {
    margin-left: 2px;
  }
  .el-select__input.is-mini {
    height: 0px;
  }
  .el-tag__close.el-icon-close {
    position: absolute;
    right: -2px !important;
    top: 3px !important;
    &::before {
      background-color: #bdbfc3;
      border-radius: 50%;
      color: #fff;
    }
  }
}
.el-date-editor .el-range-separator {
  width: 20px;
  padding: 0;
}
</style>
