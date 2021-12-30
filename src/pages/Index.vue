<template>
  <el-container style="overflow: hidden; height: 100%">
    <el-aside
      ref="menuSider"
      class="menu-aside"
      :width="isCollapsed ? '80px' : '200px'"
    >
      <div class="menu">
        <div class="menuNormal">
          <div class="menuTop">
            <div v-show="!isCollapsed">
              <img :src="logo" />
            </div>
            <i
              @click="collapsedSider"
              v-show="isCollapsed"
              class="iconfont icon-menu"
            ></i>
          </div>
          <div class="menu-side-bar" style="height: calc(100% - 79px)">
            <v-sidebar
              @handleMenu="handleMenu"
              :default-active="activeURL"
              :menu-lists="MenuLists"
              :isCollapse="isCollapsed"
            ></v-sidebar>
          </div>
        </div>
      </div>
    </el-aside>
    <el-main>
      <v-head
        :name="userName"
        :collapsed="isCollapsed"
        @on-collapsedSider="collapsedSider"
      ></v-head>
      <Tag
        :TagLists="tagLists"
        :selectMenu="activeInfo"
        @tabClick="handleMenu"
        @tabRemove="handleTabRemove"
      />
      <el-main id="page-wrapper">
        <keep-alive :include="keepList">
          <router-view
            style="height: 100%"
            v-if="hasPerms"
            @routerHandle="handleMenu"
            @showUserName="showUserName"
          ></router-view>
        </keep-alive>
      </el-main>
    </el-main>
  </el-container>
</template>
<script>
import VSidebar from "@/components/navbar/v-sidebar";
import VHead from "@/components/v-head";
import * as common from "@/http/implement/common";
export default {
  name: "index",
  data() {
    return {
      Modal: false, // modify pwd pop
      userName: "admin", // login accout
      userId: "", // userid
      menuTheme: "dark",
      MenuLists: [], // menuList
      activeURL: "", // current menu url
      activeInfo: { url: "/home" }, // current info
      rootid: "", // the root of menuTree
      defaultFirstUrl: null,
      isCollapsed: false,
      isActive: false,
      index: -1,
      selectMenuId: "",
      tagindex: -1,
      isRouterAlive: false,
      logo: require("@assets/images/logo.png"),
      hasPerms: false,
      tagLists: [{ url: "/home", title: "首页", name: "home" }],
      keepList: ["home"]
    };
  },
  components: {
    VHead,
    VSidebar
  },
  created() {
    this.getPerms();
    this.getMenuList(); // get menu data
  },
  mounted() {
    let userInfo = localStorage.getItem("userInfo");
    let tags = sessionStorage.getItem("tagLists");
    let active = sessionStorage.getItem("activeInfo");
    let keepList = sessionStorage.getItem("keepList");
    this.userName = userInfo ? JSON.parse(userInfo).userName : userInfo;
    this.tagLists = tags ? JSON.parse(tags) : this.tagLists;
    this.keepList = keepList ? JSON.parse(keepList) : this.keepList;
    this.activeInfo = active ? JSON.parse(active) : this.activeInfo;
  },
  watch: {
    tagLists(val) {
      sessionStorage.setItem("tagLists", JSON.stringify(val));
      sessionStorage.setItem("keepList", JSON.stringify(this.keepList));
    },
    $route: {
      handler(to) {
        this.tagLists.map(item => {
          if (item.url === to.path) {
            item.name = to.name;
          }
        });
        this.keepList = this.tagLists.map(item => {
          return item.name;
        });
        sessionStorage.setItem("keepList", JSON.stringify(this.keepList));
        this.activeInfo.name = to.name;
      }
    },
    activeInfo(val) {
      sessionStorage.setItem("activeInfo", JSON.stringify(val));
    }
  },
  methods: {
    showUserName(val) {
      this.userName = val;
    },
    // get menu data
    getMenuList: function() {
      let that = this;
      common.getMenuList().then(res => {
        that.MenuLists = res.data;
      });
    },
    getPerms: function() {
      common.getPerms().then(res => {
        let perm = {};
        res.data.map(item => {
          perm[item.menuCode] = item.permissionList;
        });
        this.$store.commit("setPerms", perm);
        this.hasPerms = true;
      });
    },
    // translate style of the sign title
    collapsedSider: function() {
      this.index = -1;
      this.isCollapsed = !this.isCollapsed;
      this.saveMenuStatus();
    },
    // save menu status
    saveMenuStatus: function() {
      this.$cookies.set("menuIsCollapsed", this.isCollapsed);
    },
    // handle menu route
    handleMenu(url, param) {
      let that = this;
      let tags = that.tagLists;
      let isOpen = tags.filter(tab => {
        return tab.url === url;
      });
      if (isOpen.length) {
        this.$router.push({ path: url, query: param.query });
        this.activeInfo = { url: url, title: param.title, query: param.query };
      } else if (tags.length < 10) {
        that.tagLists.push({
          url: url,
          title: param.title,
          query: param.query
        });
        this.activeInfo = {
          url: url,
          title: param.title,
          query: param.query
        };
        if (!param || (param && !param.route))
          this.$router.push({ path: url, query: param.query });
      } else {
        that.$message.warning("最多开启10个窗口，请关闭其他窗口！");
      }
    },
    // 小菜单关闭事件
    handleTabRemove(activeInfo, delInfo) {
      let that = this;
      this.activeInfo = activeInfo;
      if (delInfo === "All") {
        that.tagLists.splice(1);
        this.keepList.splice(1);
      } else if (delInfo === "Other") {
        if (activeInfo.url === "/home") {
          this.tagLists.splice(1);
          this.keepList.splice(1);
        } else {
          that.tagLists = that.tagLists.filter(tag => {
            return tag.url === "/home" || tag.url === activeInfo.url;
          });
          that.keepList = that.keepList.filter(name => {
            return name === "home" || name === activeInfo.name;
          });
        }
      } else {
        that.tagLists = that.tagLists.filter((tag, index) => {
          if (delInfo.url === activeInfo.url && tag.url === delInfo.url) {
            that.activeInfo = that.tagLists[index - 1];
          }
          return tag.url !== delInfo.url;
        });
      }
      this.keepList = this.tagLists.map(item => {
        return item.name;
      });
      that.$router.push({
        path: that.activeInfo.url,
        query: that.activeInfo.query
      });
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-main {
  padding: 0px;
}
@media screen and (max-width: 1200px) {
  .el-main {
    width: 1240px;
  }
}
.menuTop {
  img {
    vertical-align: middle;
    margin-top: 25px;
  }
}
</style>
