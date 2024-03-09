<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/game.png" alt="">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!-- 用户 -->
            <el-form-item prop="username" >
              <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom" ></el-input>
            </el-form-item>
             <!-- 密码 -->
            <el-form-item prop="password" >
              <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
            </el-form-item>
            <el-form-item class="btns" >
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="danger" @click="addUserVisible = true" >注册</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      title="注册用户"
      :visible.sync="addUserVisible"
      width="50%" @close="addClosed">
      <el-form :model="addFrom" :rules="addUserFromRules" ref="addUserFromRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="addFrom.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '../axios'
export default {
  data () {
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },

      addFrom: {
        username: '',
        password: '',
        email: ''
      },
      addUserVisible: false,

      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },

      addUserFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码在6~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        try {
          const { data: res } = await axios.post('login', this.loginForm)
          // console.log(res)
          if (res.status === 200) {
            this.$message.success('登录成功！')
            window.sessionStorage.setItem('token', res.token)
            // console.log(res.userInfo)
            window.sessionStorage.setItem('userInfo', JSON.stringify(res.userInfo))
            if (res.token) {
              // 如果是管理员
              this.$router.push('/home')
            } else {
              // 如果是普通用户
              this.$router.push('/homepage') // 替换为你想要跳转的普通用户页面
            }
          } else {
            this.$message.error('登录失败！')
          }
        } catch (error) {
          this.$message.error(error.message)
        }
      })
    },

    addClosed () {
      this.$refs.addUserFromRef.resetFields()
    },
    addUser () {
      this.$refs.addUserFromRef.validate(async valid => {
        if (!valid) return
        // console.log(this.addFrom)
        const { data: res } = await axios.post('users', this.addFrom)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加用户成功')
        this.addUserVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns{
      display: flex;
      justify-content: flex-end;
    }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

  }
</style>
