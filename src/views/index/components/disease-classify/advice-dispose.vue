<template>
  <div class="advice-dispose">
    <h1>
      <i class="icon iconfont" style="cursor: pointer;" @click="cancel">&#xe681;</i>
      <span>意见反馈</span><span>&gt;</span><span v-if="handleType==1">处理</span><span v-if="handleType==2">处理修改</span>
    </h1>
    <div class="dispose-content">
      <el-form :model="handleForm" :rules="rules" ref="handleForm" label-width="100px">
        <el-form-item label="意见反馈" prop="opinon">
          <el-input
            v-model="handleForm.opinion"
            type="textarea"
            resize="none"
            rows="5"
            :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="上传图片" :style="{height: autoHeight}">
          <p v-if="dialogImageVisible">暂无图片</p>
          <div id="imgs" v-else></div>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input style="width: 40%" v-model="handleForm.telephone" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="处理备注" prop="handleDescription">
          <el-input
            v-model="handleForm.handleDescription"
            type="textarea"
            placeholder="请输入内容"
            resize="none"
            rows="5">
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="small" type="primary" @click="modifyOpinion" v-if="handleType==2">修改</el-button>
          <el-button size="small" type="primary" @click="modifyOpinion" v-if="handleType==1">保存</el-button>
          <el-button size="small" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'advice-dispose',
  data () {
    return {
      handleType: 1, // 处理类型控制
      uid: '', // 意见标识
      dialogImageVisible: false, // 图片有无控制
      // 表单内容
      handleForm: {
        handleDescription: '',
        opinion: '',
        telephone: ''
      },
      // 表单验证规则
      rules: {
        telephone: [
          {pattern: /^1\d{10}$/, message: '手机号码格式不对', trigger: 'blur'}
        ],
        handleDescription: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { max: 200, message: '备注内容不超过200字', trigger: 'blur' }
        ]
      }
    };
  },
  created () {
    this.getUid();
  },
  computed: {
    // 根据图片的有无控制显示的高度
    autoHeight () {
      if (this.dialogImageVisible) {
        return '40px'
      } else {
        return '132px'
      }
    }
  },
  methods: {
    // 获取路由参数
    getParams () {
      if (this.$route.query.uid) {
        this.uid = this.$route.query.uid;
      }
      if (this.$route.query.handleType) {
        this.handleType = this.$route.query.handleType;
      }
    },
    // 根据意见标识并且获取意见详情
    getUid () {
      this.getParams();
      if (this.uid !== '') {
        this.axios.get('/hisServices/personalcenter/opinion?uid=' + this.uid)
          .then(res => {
            if (res.data.appendixList.length !== 0) {
              this.previewPictures(res.data.appendixList)
            } else {
              this.dialogImageVisible = true;
            }
            this.handleForm.opinion = res.data.opinion;
            this.handleForm.handleDescription = res.data.handleDescription;
            this.handleForm.telephone = res.data.telephone;
          })
      }
    },
    // 预览图片公共方法
    previewPictures (data) {
      setTimeout(() => {
        let imgs = data.map(value => value.fileFullPath);
        // 图片数组2
        let imgs2 = []
        // 获取图片列表容器
        let $el = document.getElementById('imgs');
        let html = '';
        // 创建img dom
        imgs.forEach(function (src) {
          // 拼接html结构
          html += '<div class="item" style=" float: left;display: flex;align-items: center;justify-content: center;width: 82px;height: 115px;overflow: hidden;box-sizing: border-box;border: 1px solid #f1f1f1;margin: 5px;cursor: pointer;" data-angle="' + 0 + '"><img src="' + src + '" style="width: 100%;height: auto;"></div>';
          // 生成imgs2数组
          imgs2.push({
            url: src,
            angle: 0
          })
        })
        // 将图片添加至图片容器中
        $el.innerHTML = html;
        // 使用方法
        let ziv = new ZxImageView(this.config, imgs2);
        // console.log(ziv);
        // 查看第几张
        let $images = $el.querySelectorAll('.item');
        for (let i = 0; i < $images.length; i++) {
          (function (index) {
            $images[i].addEventListener('click', function () {
              ziv.view(index);
            })
          }(i))
        }
      }, 100)
    },
    // (保存按钮) 根据意见标识修改意见
    modifyOpinion () {
      let params = {
        handleStatus: 2,
        handleTime: new Date().getTime(),
        uid: this.uid,
        handleDescription: this.handleForm.handleDescription,
        telephone: this.handleForm.telephone,
        opinion: this.handleForm.opinion
      }
      this.axios.put('/hisServices/personalcenter/opinion', params)
        .then(res => {
          if (res) {
            if (this.handleType === 1) {
              this.$message({type: 'success', message: '处理成功！'})
            } else {
              this.$message({type: 'success', message: '修改成功！'})
            }
            this.$router.push({name: 'advice-list', id: this.$route.query.id})
          }
        });
    },
    // 取消按钮
    cancel () {
      this.$router.push({name: 'advice-list', id: this.$route.query.id})
    }
  }
}
</script>

<style scoped lang="less">
.advice-dispose{
  h1{
    padding-bottom: 20px;
    span{
      margin-left: 10px;
      font-size: 14px;
      font-weight: bold;
      color:rgba(51,51,51,1);
    }
  }
  .dispose-content{
    width: 80%;
    padding: 0;
    overflow: hidden;
    .img-div{
      width: 150px;
      height: 150px;
      position: relative;
      left: 0;
      top: 0;
      float: left;
      i{
        position: absolute;left: 50%;top: 50%;
        width: 32px;
        height: 32px;
        margin-left: -16px;
        margin-top: -16px;
        cursor: pointer;
      }
    }
  }
}
</style>
