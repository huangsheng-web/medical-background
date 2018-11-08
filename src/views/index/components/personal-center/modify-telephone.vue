<template>
  <div class="modify-telephone">
    <div class="title"><i class="icon iconfont">&#xe68e;</i><span>修改手机号码</span></div>
    <div class="telephone-box">
      <h4>当前绑定手机号：{{oldTelephone}}</h4>
      <el-form :model="telephoneForm" :rules="formRules" ref="telephoneForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="新手机号" prop="newTelephone">
          <el-input  size="small" v-model.number="telephoneForm.newTelephone" placeholder="请输入新手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input size="small" v-model.number="telephoneForm.code" style="width: 50%" placeholder="请输入验证码"></el-input>
          <el-button size="small" v-if="sendAuthCode" class="create-code" @click="getTelephoneCode('telephoneForm', telephoneForm.newTelephone, 2)" style="width: 45%">获取验证码</el-button>
          <el-button size="small" v-if="!sendAuthCode" class="create-code" :disabled="true" style="width: 45%">还剩{{auth_time}}秒</el-button>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" size="small" @click="modifyTelephone('telephoneForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modify-telephone',
  data () {
    var checkTelephone = (rule, value, callback) => {
      let patern = /^1\d{10}$/
      if (value === '') {
        return callback(new Error('请输入手机号'));
      } else if (!patern.test(value)) {
        return callback(new Error('手机号码格式不对'))
      } else {
        this.axios.get('/hisServices/users/account?account=' + value).then(res => {
          if (res.data) {
            callback(new Error('该手机号码已注册'))
          } else {
            this.sendCodeBtn = true
            callback()
          }
        })
      }
    };
    return {
      sendAuthCode: true, // 倒计时控制
      sendCodeBtn: false, // 手机号验证控制
      auth_time: 0, // 倒计时
      oldTelephone: '', // 当前手机号
      telephoneForm: {
        newTelephone: '',
        code: ''
      },
      formRules: {
        newTelephone: [
          { required: true, validator: checkTelephone, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getTelephone();
  },
  methods: {
    // 获取当前的手机号
    getTelephone () {
      this.oldTelephone = this.$store.state.token.telephone;
    },
    // 获取短信验证码
    getTelephoneCode (mobile, value, type) {
      let patter1 = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      this.$refs['telephoneForm'].validateField('newTelephone');
      if (this.sendCodeBtn) {
        this.sendAuthCode = false;
        this.sendCodeBtn = false;
        this.auth_time = 60;
        let timetimer = null;
        // 倒计时
        timetimer = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.sendAuthCode = true;
            clearInterval(timetimer);
          }
        }, 1000);
        this.axios.get('/hisServices/users/messageValidateCode?telephone=' + value + '&operationType=' + type).then(res => {
          if (res) {}
        })
      } else {
        this.$refs['telephoneForm'].validateField('newTelephone');
      }
    },
    // 修改手机号(确定按钮)
    modifyTelephone (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            uid: this.$store.state.token.uid,
            telephone: this.$store.state.token.telephone,
            type: 0,
            newTelephone: this.telephoneForm.newTelephone,
            smsValidateCode: this.telephoneForm.code
          }
          this.axios.put('/hisServices/users/user', params).then(res => {
            if (res) {
              this.oldTelephone = this.telephoneForm.newTelephone;
              this.$message({
                type: 'success',
                message: '修改成功！',
                center: true
              });
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
  .modify-telephone{
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
    .telephone-box{
      width: 350px;
      margin: auto;
      h4{
        text-align: center;
        height: 50px;
        line-height: 50px;
      }
      .create-code{
        margin-top: 4px;
        width: 38%;
        float: right;
        text-align: center;
        cursor: pointer;
        background-color: rgba(235,245,255,1);
        border-color: rgba(235,245,255,1);
        color: rgba(16,158,255,1);
      }
    }
  }
</style>
