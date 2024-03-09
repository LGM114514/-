<template>
  <div class="personal-center">
    <div class="avatar">
      <img src="../assets/xiaoxin.png" alt="Avatar" />
    </div>
    <h2 class="title">个人信息</h2>

    <!-- 编辑模式 -->
    <el-form :model="formData" label-width="80px" ref="infoForm" v-if="editMode">
      <el-form-item label="姓名">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.dolpassword" placeholder="请输入旧密码" type="password"></el-input>
        <el-input v-model="formData.newpassword" placeholder="请输入新密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveInfo">保存</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 非编辑模式 -->
      <div v-else class="info-container">
        <div class="info-item">
          <div class="label">姓名:</div>
          <div class="value" style="font-weight: bold;">{{ formData.userName }}</div>
        </div>
        <div class="info-item">
          <div class="label">邮箱:</div>
          <div class="value">{{ formData.email }}</div>
        </div>
        <div class="info-item">
          <div class="label">类型:</div>
          <div class="value">{{ formData.rightId }}</div>
        </div>
        <el-button @click="startEdit" class="btu">修改</el-button>
      </div>
    </div>
</template>

<script>
import axios from '../axios'
export default {
  data () {
    return {
      editMode: false,
      formData: {}
    }
  },
  mounted () {
    const userInfo = window.sessionStorage.getItem('userInfo')
    this.formData = JSON.parse(userInfo) // 直接将 userInfo 赋值给 formData

    if (this.formData.rightId === 0) {
      this.formData.rightId = '普通用户'
    }
  },
  methods: {
    startEdit () {
      this.editMode = true
    },
    cancelEdit () {
      this.editMode = false
    },
    async saveInfo () {
      this.editMode = false
      const { data: res } = await axios.post('userprofile', this.formData)
      if (res.meta.status !== 200) {
        this.$message.error('旧密码错误，修改失败！')
      } else {
        this.$message.success('修改成功！')
      }
      this.$router.push('/login') // 请将 '/login' 替换为你的登录页路径
    }
  }
}
</script>

<style lang="less" scoped>
.personal-center {
  max-width: 800px; /* 调大整个个人中心展示的尺寸 */
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.avatar img {
  width: 150px; /* 调大头像的尺寸 */
  height: 150px; /* 调大头像的尺寸 */
  border-radius: 50%;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

button {
  margin-right: 10px;
}

.info-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;
  position: relative;
  left: 30%;
}

.info-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.label {
  width: 80px; /* 或者适当的宽度 */
  font-size: 20px;
}

.value {
  flex-grow: 1;
  font-size: 18px;
}
.btu{
  position: relative;
  top: 13px;
  left: 27%;
}
</style>
