<template>
  <div class="container ">
    <div class="center">
      <div class="center-search">
        <input type="text" placeholder="输入搜索内容关键字" v-model="queryInfo.query" @keyup.enter="getGameInformation">
        <button class="seatch-btn"  @click="clearSearch">清空</button>
      </div>
    </div>
    <div class="marquee">
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="(item, index) in imgs" :key="index">
          <img :src="item" alt="" :style="{ width: '90%', height: '100%' }">
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="panel">
      <div class="label">
        <h3>最新游戏资讯</h3>
      </div>
      <div class="articles-container">
        <div class="article" v-for="(gamelist, index) in reversedGamelist" :key="index" @click="goToDetailPage(gamelist)">
          <img :src="gamelist.imagePath[0]" alt="">
          <div class="title">{{ gamelist.title }}</div>
          <div class="info">
            <p>{{ gamelist.author }}</p>
            <p>{{ gamelist.createTime | dateFormat }}</p>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" background>
        </el-pagination>
  </div>
 </template>
<script>
import axios from '../axios'
export default {
  data () {
    return {
      imgs: [],
      gamelist: [],
      newgamelist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  computed: {
    reversedGamelist () {
      // 使用 slice() 方法来创建一个新的数组，以免修改原始数据
      return this.gamelist.slice().reverse()
    }
  },
  mounted () {
    this.loadImages()
    this.getGameInformation()
  },
  methods: {
    async getGameInformation () {
      const { data: res } = await axios.get('fetchgame', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取游戏资讯失败')
      this.gamelist = res.data.gamelist
      this.total = res.data.total
      this.newgamelist = this.gamelist.slice().reverse()
    },
    loadImages () {
      const imagesContext = require.context('/imgs/merry-go-round', false, /\.(png|jpg|svg)$/)
      const imagePaths = imagesContext.keys().map(imagesContext)
      this.imgs = imagePaths
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGameInformation()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGameInformation()
    },
    clearSearch () {
      this.queryInfo.query = '' // 将搜索关键字清空
      this.getGameInformation()
    },
    goToDetailPage (gamelist) {
      // 使用路由进行页面跳转到详情页
      this.$router.push({ name: 'detail', params: { gamelist } })
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
 .center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  .center-search {
    width: 60%;
    height: 40px;
    display: flex;
    align-items: center;

    input {
      width: 100%;
      height: 38px;
      padding: 0 10px;
      border: 1px solid #ccc;
      border-radius: 3px;
      border-radius: 15px 0 0 15px;
    }

    button {
      width: 100px;
      height: 40px;
      background-color: #373D41;
      color: #fff;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      border-radius: 0 15px 15px 0;
    }
  }
 }
 .label h3{
  font-size: 30px;
 }
.marquee{
  margin-top: 20px;
  width: 100%;
}
.panel {
  width: 85%;
  margin-top: 20px;
}

.articles-container {
  display: flex; /* 使用弹性盒子布局 */
  justify-content: flex-start; /* 左对齐 */
  flex-wrap: wrap;
}

.article {
  width: 250px; /* 控制每个 article 的宽度，根据需要调整 */
  height: 300px;
  margin: 10px 10px; /* 控制 article 之间的间距，根据需要调整 */
  border: 1px solid transparent; /* 初始状态下的边框是透明的 */
  padding: 10px; /* 添加内边距 */
  transition: border 0.3s; /* 添加过渡效果，使变化平滑 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 初始状态下的模糊边框 */
}
.article:hover {
  border: 1px solid #ccc; /* 鼠标悬浮时的边框颜色 */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); /* 鼠标悬浮时的模糊边框 */
}
.article div {
  font-weight: bold; /* 加粗 */
}
.title{
  font-size: 20px;
  margin-top: 10px;
}
.article img {
  width: 250px; /* 根据需要设置图片的宽度 */
  height: auto; /* 保持纵横比 */
  cursor: pointer;
}
.info {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 将容器分为两列，每列等分 */
  position: relative;
  top: 40px;
}
.title:hover {
  color: red; /* 字体变红 */
  cursor: pointer;
}
</style>
