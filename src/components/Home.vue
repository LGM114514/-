<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/game.png" alt="" style="border-radius: 50%; margin: 2px 10px;">
        <h2>游戏资讯管理系统</h2>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 菜单区域 -->
          <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF"
              unique-opened
              :collapse="isCollapse"
              :collapse-transition="false"
              router
              :default-active="activePath">
              <!-- 一级菜单 -->
              <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" >
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                    </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
</template>

<script>
import axios from '../axios'
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        101: 'el-icon-user-solid',
        102: 'el-icon-folder-opened',
        103: 'el-icon-suitcase-1'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%
}
  .el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-content: center;
    color: white;
    font-size: 15px;
    > div {
      display: flex;
      align-content: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-button{
    height: 40px;
    margin-top: 10px;
  }
</style>
