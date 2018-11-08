<template>
  <div class="disease-add">
    <div><i class="icon iconfont" style="cursor: pointer;" @click="skipIsList">&#xe681;</i>
      <span style="color: #666666;">疾病维护></span>
      <span style="color: #333333;">{{ createOrUpdate === 1? '添加疾病': '修改疾病' }}</span>
    </div>
    <div style="padding-top: 30px;">
      <el-form :model="ruleForm" :rules="rules" :show-message="false" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item class="form">
          <el-form-item label="科室名称:" prop="deptUid">
            <el-select v-model="ruleForm.deptUid" size="small" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.deptName"
                :value="item.uid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="疾病名称:" prop="diseaseName">
            <el-input v-model="ruleForm.diseaseName" size="small" :maxlength="100"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;">
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
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="疾病简介" name="one">
              <el-row v-loading="quillUpdateImg">
                <quill-editor
                  v-model="introduction"
                  ref="myQuillEditorOne"
                  :options="editorOption">
                </quill-editor>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="临床表现" name="two">
              <el-row v-loading="quillUpdateImg">
                <quill-editor
                  v-model="expression"
                  ref="myQuillEditorTwo"
                  :options="editorOption">
                </quill-editor>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="疾病预防" name="three">
              <el-row v-loading="quillUpdateImg">
                <quill-editor
                  v-model="prevent"
                  ref="myQuillEditorThree"
                  :options="editorOption">
                </quill-editor>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="康复指导" name="four">
              <el-row v-loading="quillUpdateImg">
                <quill-editor
                  v-model="guide"
                  ref="myQuillEditorFour"
                  :options="editorOption">
                </quill-editor>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item style="text-align: center;margin-bottom: 0;">
          <el-button type="primary" plain size="small" :loading="loadingOne" @click="createOrUpdateDiseaseInfo('ruleForm',1)" v-if="createOrUpdate === 1">保存</el-button>
          <el-button type="primary" size="small" :loading="loading" @click="createOrUpdateDiseaseInfo('ruleForm',null)" v-if="createOrUpdate === 2">保存</el-button>
          <el-button type="primary" size="small" :loading="loadingTwo" @click="createOrUpdateDiseaseInfo('ruleForm',2)" v-if="createOrUpdate === 1">保存并新增</el-button>
          <el-button size="small" @click="skipIsList" plain>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import {quillEditor, Quill} from 'vue-quill-editor';
export default {
  components: { quillEditor },
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
      ruleForm: {
        deptUid: '',
        diseaseName: null
      },
      options: [],
      diseaseInfo: {},
      rules: {
        deptUid: [
          { required: true, message: '请选择科室名称', trigger: 'change' }
        ],
        diseaseName: [
          { required: true, message: '请输入疾病名称', trigger: 'blur' }
        ]
      },
      createOrUpdate: null,
      activeName: 'one',
      sendDeitor: '',
      introduction: '',
      expression: '',
      prevent: '',
      guide: '',
      diseaseUid: null,
      userId: '',
      loading: false,
      loadingOne: false,
      loadingTwo: false
    }
  },
  mounted () {
    this.createOrUpdate = parseInt(this.$route.query.type);
    console.log(this.$route.query.diseaseUid);
    this.getDeptDropdownList();
    if (this.createOrUpdate === 2) {
      this.getDiseaseDetailById();
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
      let quill = null;
      if (this.activeName === 'one') {
        quill = this.$refs.myQuillEditorOne.quill;
      } else if (this.activeName === 'two') {
        quill = this.$refs.myQuillEditorTwo.quill;
      } else if (this.activeName === 'three') {
        quill = this.$refs.myQuillEditorThree.quill;
      } else {
        quill = this.$refs.myQuillEditorFour.quill;
      }
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
    handleClick (tab, event) {
      console.log(tab, event);
    },
    // 判断是否为空公用函数
    isEmpty (content) {
      let value = content && content.replace(/\s+/g, '');
      if (!content || value.length === 0) {
        return false;
      } else {
        return true;
      }
    },
    // 新增或者修改疾病信息
    createOrUpdateDiseaseInfo (formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            diseaseDeptUid: this.ruleForm.deptUid,
            uid: this.diseaseUid,
            diseaseName: this.ruleForm.diseaseName,
            diseaseIntro: this.introduction,
            clinicalFeature: this.expression,
            diseasePrevention: this.prevent,
            recoveryGuide: this.guide
          }
          if (this.isEmpty(this.introduction) && this.isEmpty(this.expression) && this.isEmpty(this.prevent) && this.isEmpty(this.guide)) {
            params.diseaseType = 2;
          } else {
            params.diseaseType = 1;
          }
          let value = this.Trim(this.ruleForm.diseaseName, 'g');
          if ((!this.ruleForm.diseaseName || value) && value.length === 0) {
            this.$message.error('疾病名称不能为空！');
            return false;
          }
          if (this.createOrUpdate === 1) {
            // 新增
            if (type === 1) {
              this.loadingOne = true;
            } else {
              this.loadingTwo = true;
            }
            this.axios.post('/hisServices/repository/disease', params)
              .then(res => {
                if (res) {
                  // 保存完跳转
                  this.$message.success('新增疾病成功！');
                  if (type === 1) {
                    this.skipIsList();
                  } else {
                    // 保存并新增
                    this.ruleForm.deptUid = ''; // 清空科室
                    this.ruleForm.diseaseName = ''; // 清空疾病名称
                    this.activeName = 'one';
                    this.introduction = '';
                    this.expression = '';
                    this.prevent = '';
                    this.guide = '';
                  }
                }
              })
              .finally(() => {
                this.loadingOne = false;
                this.loadingTwo = false;
              })
          } else {
            // 修改
            this.loading = true;
            this.axios.put('/hisServices/repository/disease', params)
              .then(res => {
                if (res) {
                  console.log(res);
                  this.$message.success('修改疾病成功！');
                  this.skipIsList();
                }
              })
              .finally(() => {
                this.loading = false;
              })
          }
        } else {
          return false;
        }
      });
    },
    skipIsList () {
      this.$router.push({ name: 'disease-list', query: {id: this.$route.query.id} });
    },
    // 根据疾病标识获取疾病详情
    getDiseaseDetailById () {
      this.diseaseUid = this.$route.query.diseaseUid;
      if (!this.diseaseUid) {
        return false;
      }
      this.axios.get('/hisServices/repository/disease?uid=' + this.diseaseUid + '&userUid=' + this.userId)
        .then(res => {
          if (res) {
            this.diseaseInfo = res.data;
            // 回填数据
            this.ruleForm.deptUid = this.diseaseInfo.diseaseDeptUid;
            this.ruleForm.diseaseName = this.diseaseInfo.diseaseName;
            this.introduction = this.diseaseInfo.diseaseIntro;
            this.expression = this.diseaseInfo.clinicalFeature;
            this.prevent = this.diseaseInfo.diseasePrevention;
            this.guide = this.diseaseInfo.recoveryGuide;
          }
        })
    },
    // 分页查询科室下拉列表
    getDeptDropdownList () {
      let jsonStr = {
        pageNum: 0,
        pageSize: 0,
        where: {
          resultType: 1
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/repository/diseasedepts/' + jsonStr)
        .then(res => {
          console.log(res);
          if (res) {
            this.options = res.data.list;
          }
        })
    }
  }
}
</script>
<style lang="less">
  .disease-add{
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
    .form{
      margin-bottom: 0;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(232,232,232,1);
      .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        .el-form-item{
          margin-right: 16px;
          .el-form-item__label{
            width: 94px !important;
            color:#000000;
          }
        }
      }
    }
    .el-form-item__content{
      margin-left: 0 !important;
      .el-input__inner{
        width: 200px;
        height: 32px;
      }
    }
  }
</style>
