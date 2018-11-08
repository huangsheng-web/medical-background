<template>
  <div class="modify-password">
    <div class="title"><i class="icon iconfont">&#xe6c7;</i><span>修改密码</span></div>
    <div class="psw-box">
      <el-form :model="passForm" :rules="passRules" ref="passForm" label-width="80px">
        <el-form-item label="原密码" prop="oldpass">
          <el-input size="small" type="password" v-model="passForm.oldpass" placeholder="请输入原始密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input size="small" type="password" v-model="passForm.pass" placeholder="设置新密码，6-20字符，区分大小写"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input size="small" type="password" v-model="passForm.checkPass" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="small" type="primary" @click="modifyPass('passForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modify-password',
  data () {
    // 再次输入密码验证
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      // 密码输入框
      passForm: {
        pass: '',
        checkPass: '',
        oldpass: ''
      },
      // 密码规则校验
      passRules: {
        oldpass: [
          {required: true, message: '请输入原密码', trigger: 'blur'},
          {min: 6, max: 20, message: '密码长度为6-20字符', trigger: 'blur'}
        ],
        pass: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {pattern: /^[a-zA-Z0-9]{6,20}$/, message: '设置密码，6-20字符,区分大小写', trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass, trigger: 'blur', required: true}
        ]
      }
    };
  },
  methods: {
    // 修改密码
    modifyPass (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            telephone: this.$store.state.token.telephone,
            password: this.passForm.oldpass,
            newPassword: this.passForm.pass,
            type: '1',
            uid: this.$store.state.token.uid
          }
          this.axios.put('/hisServices/users/user', params)
            .then(res => {
              if (res) {
                this.passForm.pass = '';
                this.passForm.oldpass = '';
                this.passForm.checkPass = '';
                this.$message({type: 'success', message: '修改成功！下次请用新密码登陆！'});
              }
            })
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
  .modify-password{
    height: 100%;
    .title{
      padding-bottom: 30px;
      i{
        margin-right: 10px;
      }
      span{
        color:rgba(51,51,51,1);
        font-weight: bold;
      }
    }
    .psw-box{
      width: 350px;
      margin: auto;
    }
  }
</style>
