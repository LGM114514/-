<template>
  <div class="detail-page">
    <button class="back-button" @click="goBack">返回</button>
    <div class="content-container">
      <div class="Translate">
        <h1>{{ gamelist.title }}</h1>
        <p>作者: {{ gamelist.author }}</p>
        <p>时间: {{ gamelist.createTime | dateFormat }}</p>
        <div v-if="gamelist.imagePath && gamelist.imagePath.length > 0">
          <img v-for="(path, index) in gamelist.imagePath" :key="index" :src="path" alt="" class="zoomIn">
        </div>
        <div class="content" v-html="gamelist.content"></div>
      </div>
      <!-- 评论区 -->
      <div class="comments">
        <h2>评论区</h2>

        <form @submit.prevent="addComment">
          <textarea v-model="newComment" placeholder="添加评论"></textarea> <br/>
          <button type="submit">提交评论</button>
        </form>

        <div v-for="(comment, index) in comments" :key="index" class="comment">
          <p>{{ comment.content }}</p>
          <small>用户: {{ comment.commentator }}</small><br/>
          <small>时间: {{ comment.createTime | dateFormat }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios'
export default {
  data () {
    return {
      gamelist: {},
      formData: {},
      detail: {},
      newComment: '',
      comments: []
    }
  },
  mounted () {
    this.gamelist = this.$route.params.gamelist
    this.loadComments(this.gamelist)
    const userInfo = window.sessionStorage.getItem('userInfo')
    this.formData = JSON.parse(userInfo) // 直接将 userInfo 赋值给 formData
  },
  methods: {

    goBack () {
      // 返回上一个页面
      this.$router.go(-1)
    },
    async loadComments (gamelist) {
      const params = {
        gid: gamelist.gid
      }
      const { data: res } = await axios.get('comments', { params })
      if (res.meta.status !== 200) return this.$message.error('获取游讯评论失败')
      this.comments = res.data.commentlist
    },
    async addComment () {
      const requestData = {
        newComment: this.newComment,
        userName: this.formData.userName,
        gid: this.gamelist.gid
      }
      const { data: res } = await axios.post('addComment', requestData)
      if (res.meta.status !== 200) return this.$message.error('评论失败')
      this.loadComments(this.gamelist)
      this.newComment = ''
    }
  }
}
</script>

<style lang="less" scoped>
.detail-page {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: backgroundAnimation 6s infinite alternate;
}

@keyframes backgroundAnimation {
  0% {
    background-color: #f8f8f8;
  }
  50% {
    background-color: #E6F7FF;
  }
}
.content-container {
  display: flex;
  flex-direction: column;
}

.back-button {
  position: absolute;
  left: 20px; /* 距离左侧的距离 */
  top: 20px; /* 距离顶部的距离 */
  font-size: 1.2em; /* 返回按钮的字体大小 */
  padding: 10px 20px; /* 添加内边距 */
  background-color: #373D41; /* 背景颜色 */
  color: #fff; /* 字体颜色 */
  border: none; /* 去掉边框 */
  border-radius: 5px; /* 添加圆角 */
  cursor: pointer; /* 鼠标指针样式 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  transition: background-color 0.3s; /* 添加过渡效果 */
}

.back-button:hover {
  background-color: #0056b3; /* 鼠标悬停时的背景颜色 */
}
.Translate  {
  max-width: 1100px;
  padding: 20px;
  text-align: center;
}
.Translate h1 {
  font-size: 2.5em; /* 设置标题字体大小 */
  font-weight: bold; /* 加粗标题 */
  margin-bottom: 10px; /* 增加标题与下方内容的间距 */
}

.Translate p {
  font-size: 1.5em; /* 设置作者和时间字体大小 */
  color: #555; /* 设置字体颜色 */
  margin-bottom: 15px; /* 增加作者和时间与下方内容的间距 */
}
.content{
  text-align: left;
  font-size: 20px;
}

.Translate img {
  max-width: 100%;
  height: auto;
  border-radius: 8px; /* 添加圆角效果 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 图片放大效果 */
.zoomIn {
  cursor: pointer;
  transition: transform 0.3s;
}
.zoomIn:hover {
  transform: scale(1.05);
}

.comments {
  width: 100%;
  max-width: 1100px;/* 设置评论区的最大宽度，根据需要调整 */
  margin: auto; /* 居中显示评论区 */

  /* 添加列表样式 */
  list-style-type: none;
  padding: 0;
  text-align: left;/* 设置评论区文本左对齐 */
}

.comment {
  border-bottom: 1px solid #ccc; /* 评论之间添加底部边框分隔线 */
  margin-bottom: 10px; /* 评论之间的间距，根据需要调整 */
  padding-bottom: 10px; /* 评论内容底部留白，根据需要调整 */

  /* 设置评论内容的字体样式 */
  font-family: 'Arial', sans-serif;
}

/* 样式化提交评论表单 */
form {
  margin-top: 20px; /* 设置表单与评论区的间距，根据需要调整 */
  text-align: right; /* 设置表单文本右对齐 */
}

textarea {
  width: 100%;
  height: 60px;
  box-sizing: border-box; /* 使textarea的宽度包括padding和border */
  margin-bottom: 10px; /* 设置评论输入框与提交按钮的间距，根据需要调整 */
}

button {
  background-color: #4CAF50; /* 设置按钮背景色 */
  color: white; /* 设置按钮文字颜色 */
  padding: 10px 15px; /* 设置按钮内边距，根据需要调整 */
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: inline-block; /* 将按钮设置为行内块元素 */

}

button:hover {
  background-color: #45a049; /* 设置按钮鼠标悬停时的背景色 */
}
</style>
