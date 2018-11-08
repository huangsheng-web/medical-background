<template>
  <div class="upload-pic-components" :class="{hidden: maxSize === picNum}">
    <el-upload
      ref="uploadPic"
      multiple
      accept="image/*"
      :limit="maxSize"
      :on-exceed="uploadPicExceed"
      :action="$store.state.fileUploadUrl + '/api/network/upload/new'"
      :data="{projectType: 2}"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-success="uploadPicSucess"
      :on-error="uploadPicError"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog class="el-dialog-no-header" :modal-append-to-body="true" :append-to-body="true" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['maxSize', 'fileList'],
  data () {
    return {
      // 插入图片
      dialogVisible: false,
      dialogImageUrl: '',
      picNum: null
    }
  },
  mounted () {
    console.log(this.maxSize);
  },
  methods: {
    uploadPicSucess (response, file, fileList) {
      console.log('图片', file);
      this.$emit('uploadPicSubmit', file);
      this.$emit('uploadPicFileList', fileList);
      this.picNum = fileList && fileList.length;
    },
    uploadPicError () {
      this.$emit('uploadPicError', true);
      this.$message.error('上传失败！');
    },
    uploadPicExceed (files, fileList) {
      this.$message.warning('最多一次可上传' + this.maxSize + '张图片,不能上传非图片文件');
    },
    handleRemove (file, fileList) {
      this.$emit('uploadPicDel', fileList);
      this.picNum = fileList && fileList.length;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload (file) {
      console.log(file);
      this.$emit('uploadPicBefore', true);
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .upload-pic-components {
    .el-icon-upload-success{
      position: relative;
      left: 0px;
      bottom: 34px;
    }
    &.hidden .el-upload--picture-card{
      display: none;
    }
  }
</style>
