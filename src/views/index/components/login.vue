<template>
  <div class="main">
    <div class="top"></div>
    <div class="ipt-form">
      <h2 class="form-title" v-show="loginVisible">欢迎登录</h2>
      <div class="form-content" v-show="loginVisible">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <el-form-item style="border: none;" prop="telephone">
            <el-input prefix-icon="" v-model="loginForm.telephone" placeholder="请输入手机号">
            <i slot="prefix" class="icon iconfont">&#xe694;</i>
            </el-input>
          </el-form-item>
          <el-form-item prop="logpassword">
            <el-input type="password" prefix-icon="" v-model="loginForm.logpassword" placeholder="请输入密码">
              <i slot="prefix" class="icon iconfont">&#xe693;</i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" style="width: 50%" placeholder="验证码" @keyup.enter.native="login('loginForm')"></el-input>
            <img class="create-code" :src="this.picSrc" @click="getPicCode">
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button type="primary" style="width: 100%" @click="login('loginForm')">登录</el-button>
            <span style="color: #1890FF;cursor: pointer;" @click="forgetPassBtn">忘记密码？</span>
          </el-form-item>
        </el-form>
      </div>
      <h2 class="form-title" v-show="!loginVisible">找回密码</h2>
      <div class="form-content" v-show="!loginVisible">
        <el-form ref="passForm" :model="passForm" :rules="passRules">
          <el-form-item style="border: none;" prop="telephone">
            <el-input v-model="passForm.telephone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model.number="passForm.code" style="width: 50%" placeholder="验证码"></el-input>
            <el-button v-if="sendAuthCode" class="create-code" type="primary" @click="getCode('passForm',passForm.telephone, 3)" style="width: 45%">获取验证码</el-button>
            <el-button v-if="!sendAuthCode" class="create-code" :disabled="true" style="width: 45%">还剩{{auth_time}}秒</el-button>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="passForm.password" placeholder="设置新密码,6-20字符,区分大小写"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" v-model="passForm.checkPass" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="findPass('passForm')">确定</el-button>
            <p style="text-align: center;color: #1890FF;cursor: pointer;" @click="returnLogin">返回登录></p>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <p>Copyright © 2018 湖南省溆浦县卫生和计划生育局 版权所有丨湖南奥昇信息技术有限公司 技术支持</p>
    </div>
  </div>
</template>
<script>
import {setCookie, getCookie} from '@/utils/util.js';
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    // 手机号注册
    var checkTelephone = (rule, value, callback) => {
      let patern = /^1\d{10}$/;
      if (value === '') {
        return callback(new Error('请输入手机号'));
      } else if (!patern.test(value)) {
        return callback(new Error('手机号码格式不对'))
      } else {
        this.axios.get('/hisServices/users/account?account=' + value).then(res => {
          if (res.data) {
            this.sendCodeBtn1 = true;
          } else {
            callback(new Error('该手机号码未注册'));
            callback()
          }
        })
      }
    };
    // 再次输入密码验证
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      sendCodeBtn1: false, // 手机号验证
      loginVisible: true, // 登录，找回密码切换显隐
      sendAuthCode: true, // 获取验证码切换显隐
      auth_time: 0, // 倒计时
      picSrc: '', // 图片验证码
      picImgUid: '', // 图片验证ID
      // 登录
      loginForm: {
        telephone: '',
        logpassword: '',
        code: ''
      },
      // 找回密码
      passForm: {
        telephone: '',
        password: '',
        code: '',
        checkPass: ''
      },
      // 密码验证规则
      passRules: {
        telephone: [
          {validator: checkTelephone, trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: /^[a-zA-Z0-9]{6,20}$/, message: '设置密码，6-20字符,区分大小写', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass, trigger: 'blur', required: true}
        ]
      },
      // 登录验证规则
      loginRules: {
        telephone: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {
            pattern: /^1\d{10}$/,
            message: '手机号码格式不对',
            trigger: 'blur'
          }
        ],
        logpassword: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {pattern: /^[a-zA-Z0-9]{6,20}$/, message: '设置密码，6-20字符,区分大小写', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    this.getPicCode();
  },
  computed: {
    // 获取是否登录的信息
    userInfo () {
      return this.$store.state.token;
    },
    ...mapGetters([
      'routers'
    ])
  },
  methods: {
    // 返回登录按钮
    returnLogin () {
      this.$refs['loginForm'].resetFields();
      this.loginVisible = !this.loginVisible
    },
    // 忘记密码按钮
    forgetPassBtn () {
      this.$refs['passForm'].resetFields();
      this.sendAuthCode = true;
      this.loginVisible = !this.loginVisible;
    },
    // 找回密码
    findPass (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            telephone: this.passForm.telephone,
            smsValidateCode: this.passForm.code,
            newPassword: this.passForm.password
          }
          this.axios.put('/hisServices/users/password', params).then(res => {
            if (res) {
              this.$message({
                message: '找回成功！请用新密码登录！',
                type: 'success'
              });
              this.$refs['passForm'].resetFields();
              this.loginVisible = true;
            }
          })
        } else {
          return false;
        }
      })
    },
    // 获取手机验证码
    getCode (mobile, value, type) {
      let patter1 = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      this.$refs[mobile].validateField('telephone');
      if (this.sendCodeBtn1) {
        this.sendAuthCode = false;
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
        this.$refs[mobile].validateField('telephone');
      }
    },
    // 用户登录
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let loginParams = {
            account: this.loginForm.telephone,
            password: this.loginForm.logpassword,
            imgValidateCode: this.loginForm.code,
            imgUid: this.picImgUid,
            plateType: 2
          }
          this.axios.post('/hisServices/users/login', loginParams).then(res => {
            if (res) {
              console.log(res, 'res')
              // 获取用户权限
              let par = res.data.roleList.some(item => {
                if (item.roleName === '医院' || item.roleName === '卫生院' || item.roleName === '医调委' || item.roleName === '卫计局' || item.roleName === '维护人员') {
                  return true;
                } else {
                  return false
                }
              });
              if (par) {
                this.$message({
                  type: 'success',
                  message: '登录成功'
                })
                // 保存请求sessionId
                if (res.data.sessionId) {
                  if (sessionStorage.getItem('sessionId')) {
                    sessionStorage.removeItem('sessionId');
                  }
                  sessionStorage.setItem('sessionId', res.data.sessionId);
                }
                setCookie('proKey', res.data.proKey, 24, '/');
                // 保存用户信息到本地
                if (sessionStorage.getItem('token')) {
                  sessionStorage.removeItem('token')
                }
                // 写入本地
                let userInfo = res.data;
                sessionStorage.setItem('token', JSON.stringify(userInfo));
                // 写入store
                this.$store.commit('setToken', {
                  token: userInfo
                });
                this.addRouters(res.data.roleAuthList);
                this.$router.addRoutes(this.routers);
                console.log(this.routers, '------')
                const skipMenu = this.routers[0].children.find(item => item.meta.header === true).meta.menu;
                this.$router.push({path: '/main', query: {id: skipMenu}});
              } else {
                this.$message({type: 'warning', message: '账号不存在该登录权限，请选择正确的登录账号！'})
              }
            }
          }).finally(() => {
            this.getPicCode()
          })
        } else {
          return false;
        }
      })
    },
    // 获取图片验证码
    getPicCode () {
      this.axios.get('/hisServices/users/imgValidateCode?imgValidateCodeType=1').then(res => {
        if (res) {
          this.picSrc = '';
          this.picSrc = 'data:image/jpeg;base64,' + res.data.byteArray;
          this.picImgUid = res.data.imgUid
        }
      })
    },
    ...mapActions([
      'addRouters'
    ])
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .main{
    background-color: #f0f2f5;
    margin: 0 auto;
    width: 100%;
    min-width: 1120px;
    max-width: 1920px;
    min-height: 580px;
    max-height: 980px;
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    .top{
      min-height: 480px;
      max-height: 726px;
      height: 74%;
      width: 100%;
      background: url('../../../assets/img/login-bg.png') no-repeat center;
    }
    .bottom{
      p{
        text-align: center;
        position: absolute;
        left: 0;
        bottom: 5%;
        width: 100%;
        font-size: 14px;
        font-family: "Microsoft YaHei";
        color: #999999;
      }
    }
    .ipt-form{
      position: absolute;
      left: 50%;
      top: 50%;
      width: 337px;
      transform: translate(-50%,-50%);
      background-color: #fff;
      .form-title{
        height: 80px;
        line-height: 80px;
        text-align: center;
        color: #1890FF;
        font-size: 18px;
        font-weight: bold;
      }
      .form-content{
        padding: 0 20px;
        .create-code{
          width: 38%;
          float: right;
          cursor: pointer;
          text-align: center;
        }
      }
    }
  }
</style>
