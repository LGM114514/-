<template>
  <div class="king">
    <el-container>
      <el-header>
        <div class="menu">
          <el-menu
            class="el-menu-demo"
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
            background-color="#373D41"
            active-text-color="#ffd04b"
            text-color="#fff"
            router
          >
            <el-menu-item index="/userhomepage">首页</el-menu-item>
            <el-submenu index="2">
                <template slot="title" ><span style="font-size:20px">分类</span></template>
                <el-submenu v-for="catItem in catelist" :key="catItem.cat_id" :index="'2-' + catItem.cat_id">
                  <template slot="title">
                    <span>{{ catItem.cat_Name }}</span>
                  </template>
                  <el-submenu  v-for="childItem in catItem.children" :key="childItem.cat_id" :index="'2-' + childItem.cat_id">
                    <template slot="title">
                      <span>{{ childItem.cat_Name }}</span>
                    </template>
                    <el-menu-item v-for="subItem in childItem.children" :key="subItem.id">
                      <template slot="title">
                        <span style="font-size:15px">{{ subItem.cat_Name }}</span>
                      </template>
                    </el-menu-item>
                  </el-submenu>
                </el-submenu>
              </el-submenu>
            <el-menu-item index="/userprofile">个人中心</el-menu-item>
          </el-menu>
        </div>
        <div class="titleName">
          <h2 class="funTitle">PixelPress</h2>
        </div>
        <div class="GameName">
          <img src="../assets/xiaoxin.png" alt="" style="border-radius: 50%;">
          <span style="margin-right: 10px;">{{ formData.userName }}</span>
          <el-button type="info" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer class="footer">
        <p class="text">© 2023 游戏资讯</p>
      </el-footer>
    </el-container>
  </div>
 </template>
<script>
import axios from '../axios'
export default {
  data () {
    return {
      activeIndex: '/userhomepage',
      formData: {},
      catelist: []
    }
  },
  mounted () {
    const userInfo = window.sessionStorage.getItem('userInfo')
    this.formData = JSON.parse(userInfo) // 直接将 userInfo 赋值给 formData
    this.gatCateList()
  },
  methods: {
    handleSelect (key, keyPath) {
      // console.log('Selected:', key, keyPath)
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async gatCateList () {
      const { data: res } = await axios.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.catelist = res.data.result
    }
  }
}
</script>
 <style lang="less" scoped>
//  .el-header {
//   background-color: #B3C0D1;
//   color: #333;
//  }
 .king{
  background-color: #E6F7FF;
 }
 .el-header {
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-content: center;
  color: white;
  font-size: 15px;
  text-align: center;
  line-height: 60px;
 }
 .GameName {
  display: flex;
  align-items: center;
  span {
    margin-left: 15px;
    font-size: 25px;
  }
  img {
    width: 50px;
    height: 50px;
  }
 }
 .el-header > div {
  display: flex;
  align-items: center;
 }
 .el-menu-item {
  font-size: 20px;
 }
 .footer {
  background-color: #373D41;
  color: white;
  text-align: center;
  height: 60px;
  line-height: 60px;
}

.text {
  font-size: 14px;
  margin: 0;
}

.titleName {
  text-align: center;
}

.funTitle {
  font-family: 'Comic Sans MS', cursive, sans-serif; /* 使用一些有趣的字体 */
  font-size: 2em; /* 设置字体大小 */
  color: #FF6600; /* 使用一种鲜艳的颜色 */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* 添加文字阴影效果 */
  transform: rotate(-5deg); /* 使标题稍微倾斜 */
}
 </style>
