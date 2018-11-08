<template>
  <div class="info-add">
    <h1>
      <i class="icon iconfont" style="cursor: pointer;" @click="cancel">&#xe681;</i>
      <span v-if="modifytype==1">信息管理&nbsp;>&nbsp;修改通知公告</span>
      <span v-if="modifytype==2">信息管理&nbsp;>&nbsp;修改常见问题</span>
      <span v-if="type==1 && modifytype==null">信息管理&nbsp;>&nbsp;添加通知公告</span>
      <span v-if="type==2 && modifytype==null">信息管理&nbsp;>&nbsp;添加常见问题</span>
    </h1>
    <div class="form-input-content">
      <el-form :rules="formRules" ref="addForm" :model="addForm" label-width="70px">
        <div class="form">
          <el-form-item label="标题:" prop="title">
            <el-input maxlength="30" size="small" class="title-input" v-model="addForm.title"></el-input>
            <span>{{currentFont}}/30</span>
          </el-form-item>
        </div>
        <div class="form">
          <el-form-item label="内容:" prop="content" class="content-input">
            <div>
              <!-- 图片上传组件辅助-->
              <el-upload
                style="display: none;"
                class="avatar-uploader"
                :action="serverUrl"
                name="file"
                multiple
                :data="{projectType: 2}"
                accept="image/*"
                :headers="header"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload">
              </el-upload>
              <!--富文本编辑器组件-->
              <el-row v-loading="quillUpdateImg">
                <quill-editor
                  v-model="addForm.content"
                  style="height: 384px;"
                  ref="myQuillEditor"
                  :options="editorOption">
                </quill-editor>
              </el-row>
            </div>
          </el-form-item>
        </div>
        <div class="form">
          <el-form-item style="text-align: center;">
            <el-button type="primary" size="small" @click="modifyInfo('addForm')" v-show="modifytype!=null">保存</el-button>
            <el-button type="primary" size="small" @click="addInfo('addForm')" v-if="modifytype==null">发布</el-button>
            <el-button type="default" size="small" @click="cancel">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor, Quill} from 'vue-quill-editor'
export default {
  name: 'info-add',
  components: { quillEditor },
  data () {
    return {
      type: null, // type 1为公告 2为问题
      modifytype: null, // modifytype 1为公告修改 2为问题修改 根据是否存在判断是修改还是添加操作
      uid: '', // 消息Id
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      header: null, // 图片上传头部
      serverUrl: this.$store.state.fileUploadUrl + '/api/network/upload/new', // 这里写你要上传的图片服务器地址
      // 富文本插件配置
      editorOption: {
        placeholder: '',
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{'size': ['small', false, 'large', 'huge']}],
              ['underline', 'strike'],
              [{'header': 1}, {'header': 2}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'indent': '-1'}, {'indent': '+1'}],
              [{'direction': 'rtl'}],
              [{'color': []}, {'background': []}],
              [{'align': []}],
              ['link', 'image']
            ], // 工具栏
            handlers: {
              'image': function (value) {
                if (value) {
                // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },
      // 添加区域
      addForm: {
        content: '',
        title: ''
      },
      // 表单验证
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符之间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getQuery();
  },
  computed: {
    // 获取用户Id
    userUid () {
      return this.$store.state.token.uid
    },
    // 字数变化
    currentFont () {
      if (this.addForm.title !== '') {
        return this.addForm.title.length;
      } else {
        return 0
      }
    }
  },
  methods: {
    // 上传图片前
    beforeUpload (res, file) {
      this.quillUpdateImg = true;
    },
    // 上传图片成功
    uploadSuccess (res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code === '00000000' && res.data !== null) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.data为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.data.fileFullPath)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 上传图片失败
    uploadError (res, file) {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
    // 返回管理列表
    cancel () {
      this.$router.push({name: 'info-list', query: {type: this.type, id: this.$route.query.id}})
    },
    // 获取相关的路由参数信息
    getQuery () {
      let url = '';
      if (this.$route.query.type) {
        this.type = this.$route.query.type
      }
      if (this.$route.query.modifytype) {
        this.modifytype = this.$route.query.modifytype;
        this.uid = this.$route.query.uid;
        if (parseInt(this.modifytype) === 1) {
          url = '/hisServices/personalcenter/notice?uid='
        } else if (parseInt(this.modifytype) === 2) {
          url = '/hisServices/personalcenter/question?uid='
        } else {}
        this.axios.get(url + this.uid).then(res => {
          if (res) {
            this.addForm.content = res.data.content;
            this.addForm.title = res.data.title;
          }
        })
      }
    },
    // 修改信息
    modifyInfo (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '';
          let params = {
            title: this.addForm.title,
            content: this.addForm.content,
            uid: this.uid
          };
          if (parseInt(this.modifytype) === 2) {
            // 修改问题
            url = '/hisServices/personalcenter/question';
          } else {
            // 修改公告
            url = '/hisServices/personalcenter/notice';
          }
          this.axios.put(url, params).then(res => {
            if (res) {
              this.$message({type: 'success', message: '修改成功！'})
              this.$router.push({name: 'info-list', query: {type: this.type, id: this.$route.query.id}})
            }
          })
        } else {
          return false;
        }
      });
    },
    // 添加信息
    addInfo (formName2) {
      this.$refs[formName2].validate((valid) => {
        if (valid) {
          let url = '';
          let params = {
            title: this.addForm.title,
            userUid: this.userUid,
            content: this.addForm.content
          };
          if (this.type === 2) {
            // 添加通知公告
            url = '/hisServices/personalcenter/question'
          } else {
            // 添加常见问题
            url = '/hisServices/personalcenter/notice'
          }
          this.axios.post(url, params).then(res => {
            if (res) {
              this.$message({type: 'success', message: '添加成功！'})
              this.$router.push({name: 'info-list', query: {type: this.type, id: this.$route.query.id}})
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
  .info-add{
    h1{
      span{
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
        color:rgba(51,51,51,1);
      }
    }
    .form-input-content{
      padding-top: 30px;
      .form{
        margin-bottom: 0;
        padding-bottom: 0;
        width: 100%;
        height: auto;
        .title-input{
          width: 40%;
        }
        .content-input{
          padding: 0;
          overflow: hidden;
          height: 436px;
        }
      }
    }
  }
</style>
<style lang="less">
  .info-add{
    .quill-editor{
      .ql-snow{
        line-height: normal;
      }
    }
  }
</style>
