<template>
  <div class="seb-protocol-detail">
    <h1><i class="icon iconfont">&#xe6c3;</i><span>签约协议维护</span></h1>
    <div class="form" v-if="type === 1">
      <el-form :label-position="labelPosition" label-width="80px">
        <div class="title">
          <el-form-item label="标题:">
            <el-input v-model="ruleForm.title" size="small" style="width: 500px;"></el-input>
          </el-form-item>
          <el-form-item style="width: 64%;">
            <div class="publish"><span @click="skipIsList()">发布记录</span></div>
          </el-form-item>
        </div>
        <el-form-item label="内容:">
          <div class="ql-container ql-snow">
            <div class="ql-editor">
              <p v-html="ruleForm.content"></p>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <div style="text-align: center;">
            <el-button type="primary" size="small" @click="type = 2">修改</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="form" v-if="type === 2">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="labelPosition" label-width="80px">
        <div class="title">
          <el-form-item label="标题:" prop="title">
            <el-input v-model="ruleForm.title" size="small" style="width: 500px;" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item class="number">
            <span>{{ruleForm.title.length}}/30</span>
          </el-form-item>
          <el-form-item style="width: 64%;">
            <div class="publish"><span @click="skipIsList()">发布记录</span></div>
          </el-form-item>
        </div>
        <el-form-item label="内容:" prop="content">
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
                v-model="ruleForm.content"
                ref="myQuillEditor"
                :options="editorOption">
              </quill-editor>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="">
          <div style="text-align: center;">
            <el-button type="primary" size="small" :loading="loading" @click="addDiseaseProtocol('ruleForm')">发布</el-button>
            <el-button size="small" @click="getDiseaseProtocolList(1);">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import {quillEditor, Quill} from 'vue-quill-editor'
export default {
  components: {quillEditor},
  data () {
    return {
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      header: null,
      serverUrl: this.$store.state.fileUploadUrl + '/api/network/upload/new', // 这里写你要上传的图片服务器地址
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
      type: 1,
      titleList: ['签约协议维护', '发布记录', '发布详情'],
      path: 'seb-protocol-list',
      labelPosition: 'right',
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      ruleForm: {
        title: '',
        content: ''
      },
      loading: false
    }
  },
  mounted () {
    this.getDiseaseProtocolList();
  },
  methods: {
    // 上传图片前
    beforeUpload (res, file) {
      this.quillUpdateImg = true;
    },
    // 上传图片成功
    uploadSuccess (res, file) {
      console.log(res)
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
    skipIsList () {
      this.$router.push({ name: 'seb-protocol-list', query: {stepIndex: 1} });
    },
    // 新增或者修改慢病签约协议
    addDiseaseProtocol (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            title: this.ruleForm.title,
            content: this.ruleForm.content
          }
          this.loading = true;
          this.axios.post('/hisServices/chronic/agreement', params)
            .then(res => {
              if (res) {
                this.$router.push({ name: 'seb-protocol-list', query: {stepIndex: 1} });
              }
            })
            .finally(() => {
              this.loading = false;
            })
        } else {
          return false;
        }
      });
    },
    // 获取最新的慢病签约协议
    getDiseaseProtocolList (value) {
      let jsonStr = {
        pageSize: 1,
        pageNum: 1
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/agreements/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            if (res.data.list.length === 0) {
              this.$message.error('暂无最新签约协议，请新增！');
              this.type = 2;
            } else {
              this.ruleForm = res.data.list && res.data.list[0];
              if (value) {
                this.type = 1;
              }
            }
          }
        })
    }
  }
}
</script>
<style lang="less" scoped>
  .seb-protocol-detail{
    h1{
      i{
        font-size: 18px;
        vertical-align: bottom;
      }
      span{
        margin-left: 10px;
        color: #333333;
        font-weight: bold;
      }
    }
    .publish{
      text-align: right;
      span{
        color: #1890FF;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
</style>
<style lang="less">
  .seb-protocol-detail{
    .form{
      padding-top: 20px;
      .quill-editor{
        .ql-snow{
          line-height: normal;
        }
        .ql-editor{
          img{
            width: 100px;
            height: 100px;
          }
        }
      }
      .el-form-item__label{
        color: #000;
        font-weight: bold;
      }
      .title{
        display: flex;
      }
      .number .el-form-item__content{
        margin-left: 10px !important;
        span{
          color: #999;
        }
      }
      .ql-editor{
        min-height: 495px;
      }
    }
  }
</style>
