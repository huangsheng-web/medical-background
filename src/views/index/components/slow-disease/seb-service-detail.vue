<template>
  <div>
    <div is="disease-crumbs" :titleList="titleList"></div>
    <div class="seb-service-detail">
      <el-form ref="serviceData" :model="serviceData" :label-position="labelPosition" label-width="120px">
        <el-form-item class="flex">
          <el-form-item label="服务包名称:" prop="packName" style="width: 40%;" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
            <el-input :disabled="serviceData.packType === '1'" v-model="serviceData.packName" size="small" maxlength="30"></el-input><span class="unit">{{serviceData.packName.length}}/30</span>
          </el-form-item>
          <el-form-item label="所属年份:" prop="packYear" style="width: 25%;" :rules="{required: true, message: '不能为空', trigger: 'change'}">
            <el-select v-model="serviceData.packYear" size="small" filterable placeholder="请选择">
              <el-option label="2018" value="'2018'"></el-option>
              <el-option label="2019" value="'2019'"></el-option>
              <el-option label="2020" value="'2020'"></el-option>
              <el-option label="2021" value="'2021'"></el-option>
            </el-select>
          </el-form-item>
          <!-- 新增服务包，没有基础服务包时 -->
          <el-form-item v-if="type === 1 && basicServiceData && basicServiceData.length === 0" label="服务包类别:" prop="packType" style="width: 25%;" :rules="{required: true, message: '不能为空', trigger: 'change'}">
            <el-select v-model="serviceData.packType" size="small" filterable placeholder="请选择" @change="changeServiceType()">
              <el-option label="基础服务包" :value="'1'"></el-option>
              <el-option label="个性化服务包" :value="'9'"></el-option>
            </el-select>
          </el-form-item>
          <!-- 新增服务包，有基础服务包时 -->
          <el-form-item v-if="type === 1 && basicServiceData && basicServiceData.length > 0" label="服务包类别:" prop="packType" style="width: 25%;" :rules="{required: true, message: '不能为空', trigger: 'change'}">
            <el-select :disabled="true" v-model="serviceData.packType" size="small" filterable placeholder="请选择">
              <el-option label="基础服务包" :value="'1'"></el-option>
              <el-option label="个性化服务包" :value="'9'"></el-option>
            </el-select>
          </el-form-item>
          <!-- 修改、复用服务包 -->
          <el-form-item v-if="type !== 1" label="服务包类别:" prop="packType" style="width: 25%;" :rules="{required: true, message: '不能为空', trigger: 'change'}">
            <el-select :disabled="true" v-model="serviceData.packType" size="small" filterable placeholder="请选择">
              <el-option label="基础服务包" :value="'1'"></el-option>
              <el-option label="个性化服务包" :value="'9'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" style="width: 10%;padding-top: 4px;">
            <el-button type="primary" size="small" @click="addDomain()">新增子项</el-button>
          </el-form-item>
        </el-form-item>
        <div class="container" v-for="(item, index) in serviceData.subitems" :key="index">
          <el-form-item class="flex">
            <el-form-item label="子项名称:" :prop="'subitems.' + index + '.subitemName'" :rules="{required: true, message: '不能为空', trigger: 'blur'}" style="width: 100%;padding-right: 52px;">
              <el-input
                type="textarea"
                :rows="4"
                maxlength="100"
                v-model="item.subitemName">
              </el-input>
              <span style="display: inline-block;margin-top: 25px;margin-left: 10px;color: #ccc;">{{item.subitemName.length}}/100</span>
            </el-form-item>
          </el-form-item>
          <el-form-item class="flex">
            <el-form-item label="子项价格:" :prop="'subitems.' + index + '.subitemPrice'" :rules="[{required: true, message: '不能为空'}, {validator: validator, trigger: 'blur'}]" style="width: 33%;margin-right: 46px;">
              <el-input :disabled="serviceData.packType === '1'" v-model="item.subitemPrice" size="small"></el-input><span class="unit">元</span>
            </el-form-item>
            <el-form-item label="最低服务频率:" :prop="'subitems.' + index + '.frequencyMin'" :rules="[{required: true, message: '不能为空'}, {validator: validator, trigger: 'blur'}]" style="width: 33%;margin-right: 46px;">
              <el-input v-model="item.frequencyMin" size="small"></el-input><span class="unit">次</span>
            </el-form-item>
            <el-form-item label="超出频率每次单价:" :prop="'subitems.' + index + '.frequencyExcessPrice'" :rules="[{required: true, message: '不能为空'}, {validator: validator, trigger: 'blur'}]" class="unit-price" style="width: 33%;margin-right: 46px;">
              <el-input v-model="item.frequencyExcessPrice" size="small"></el-input><span class="unit">元</span>
            </el-form-item>
          </el-form-item>
          <span style="position: absolute;right: -40px;top: 94px;color: #1890FF;cursor: pointer;" @click="removeDomain(item)">删除</span>
        </div>
        <el-form-item style="padding-top: 26px;margin-bottom: 0;text-align: center;" v-if="type === 1 || type === 3">
          <el-button plain size="small" :loading="loadingAdd" @click="addService('serviceData', '1')">保存</el-button>
          <el-button type="primary" :loading="loadingAnline" size="small" @click="addService('serviceData', '2')">保存并上线</el-button>
          <el-button size="small" @click="skipIsList()">取消</el-button>
        </el-form-item>
        <el-form-item style="padding-top: 26px;margin-bottom: 0;text-align: center;" v-if="type === 2">
          <el-button plain size="small" :loading="loadingAdd" @click="putService('serviceData', null)">修改</el-button>
          <el-button type="primary" :loading="loadingAnline" size="small" @click="putService('serviceData', '2')">修改并上线</el-button>
          <el-button size="small" @click="skipIsList()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {checkPositiveInteger} from '@/utils/validator.js';
import diseaseCrumbs from '@/components/common/slow-disease/disease-crumbs.vue';
export default {
  components: {diseaseCrumbs},
  data () {
    return {
      titleList: ['服务包管理'],
      path: 'seb-service-list',
      labelPosition: 'right',
      serviceData: {
        subitems: [{
          subitemName: '',
          subitemPrice: '',
          frequencyMin: '',
          frequencyExcessPrice: ''
        }],
        packName: '',
        packYear: '2018',
        packType: ''
      },
      validator: '',
      type: null,
      serviceId: null,
      basicServiceData: null,
      loadingAdd: false,
      loadingAnline: false
    }
  },
  created () {
    this.validator = checkPositiveInteger;
  },
  mounted () {
    this.type = parseInt(this.$route.query.type);
    this.serviceId = this.$route.query.serviceId;
    if (this.type === 2) {
      this.titleList.push('修改服务包');
      this.getServiceDetial();
    } else if (this.type === 1) {
      this.titleList.push('新增服务包');
      this.getServiceList();
    } else {
      this.titleList.push('复用服务包');
      this.getServiceDetial();
      // this.getServiceList();
    }
  },
  methods: {
    skipIsList () {
      this.$router.push({ name: 'seb-service-list' });
    },
    changeServiceType () {
      if (this.serviceData.packType === '1') {
        this.serviceData.packName = '基础服务包';
        this.serviceData.subitems.map(item => {
          item.subitemPrice = 0;
          return item;
        })
      } else {
        this.serviceData.packName = '';
        this.serviceData.subitems.map(item => {
          item.subitemPrice = null;
          return item;
        })
      }
    },
    // 新增服务包
    addService (formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let value = this.Trim(this.serviceData.packName, 'g');
          if (!this.serviceData.packName && value.length === 0) {
            this.$message.error('服务包名称不能为空！');
            return false;
          }
          const params = {
            packUserType: '1',
            packUserUid: '00000000-0000-0000-0000-000000000000',
            superiorUid: '00000000-0000-0000-0000-000000000000',
            packName: value,
            packYear: this.serviceData.packYear,
            packType: this.serviceData.packType,
            packStatus: status,
            subitems: this.serviceData.subitems
          }
          if (this.serviceData.subitems.length === 0) {
            this.$message.error('必须要有子项！');
            return false;
          }
          if (status === '1') {
            this.loadingAdd = true;
          } else {
            this.loadingAnline = true;
          }
          this.axios.post('/hisServices/chronic/pack', params)
            .then(res => {
              if (res) {
                console.log(res);
                this.$message.success('新增成功！');
                this.$router.push({ name: 'seb-service-list' });
              }
            })
            .finally(() => {
              this.loadingAdd = false;
              this.loadingAnline = false;
            })
        } else {
          return false;
        }
      });
    },
    // 获取单个服务包详情
    getServiceDetial () {
      const params = {uid: this.serviceId}
      this.axios.get('/hisServices/chronic/pack', {params})
        .then(res => {
          if (res) {
            console.log(res);
            this.serviceData = res.data;
          }
        })
    },
    // 更新服务包
    putService (formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let value = this.Trim(this.serviceData.packName, 'g');
          if (!this.serviceData.packName && value.length === 0) {
            this.$message.error('服务包名称不能为空！');
            return false;
          }
          let params = {
            uid: this.serviceData.uid,
            packName: value,
            packYear: this.serviceData.packYear,
            packStatus: status,
            subitems: this.serviceData.subitems.map(item => {
              return {
                uid: item.uid,
                subitemName: item.subitemName,
                subitemPrice: parseInt(item.subitemPrice),
                frequencyMin: parseInt(item.frequencyMin),
                frequencyExcessPrice: parseInt(item.frequencyExcessPrice)
              }
            })
          }
          if (this.serviceData.subitems.length === 0) {
            this.$message.error('服务包必须要有一个子项！');
            return false;
          }
          if (status === '1') {
            this.loadingAdd = true;
          } else {
            this.loadingAnline = true;
          }
          this.axios.put('/hisServices/chronic/pack', params)
            .then(res => {
              if (res) {
                console.log(res);
                this.$message.success('更新成功！');
                this.$router.push({ name: 'seb-service-list' });
              }
            })
            .finally(() => {
              this.loadingAdd = false;
              this.loadingAnline = false;
            })
        } else {
          return false;
        }
      });
    },
    // 查询是否有基础服务包
    getServiceList () {
      let jsonStr = {
        pageSize: 1,
        pageNum: 1,
        where: {
          userUid: '00000000-0000-0000-0000-000000000000',
          isSuperiorAndMarkOwn: true,
          userType: '1',
          packType: '1'
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/packs/' + jsonStr)
        .then(res => {
          if (res) {
            this.basicServiceData = res.data;
            if (this.basicServiceData && this.basicServiceData.length > 0 && this.type === 1) {
              this.serviceData.packType = '9';
            } else {
              this.serviceData.packType = '1';
              this.serviceData.subitems[0].subitemPrice = 0;
              this.serviceData.packName = '基础服务包';
            }
          }
        })
    },
    removeDomain (item) {
      if (this.serviceData.subitems.length === 1) {
        this.$message.error('服务包必须要有一个子项！');
        return false;
      }
      var index = this.serviceData.subitems.indexOf(item)
      if (index !== -1) {
        this.serviceData.subitems.splice(index, 1)
      }
    },
    addDomain: function () {
      this.serviceData.subitems.push({
        subitemName: '',
        subitemPrice: '',
        frequencyMin: '',
        frequencyExcessPrice: ''
      });
      // 新增或者复用基础服务包时，子项价格置0
      if ((this.type === 1 || this.type === 3) && this.serviceData.packType === '1') {
        this.serviceData.subitems.map(item => {
          item.subitemPrice = 0;
          return item;
        });
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .seb-service-detail{
    .el-form{
      padding-top: 30px;
      .container{
        width: 93%;
        position: relative;
        border: 1px solid #E8E8E8;
        padding-top: 26px;
        margin-bottom: 20px;
      }
      .unit{
        margin-left: 10px;
        color: #ccc;
      }
    }
  }
</style>
<style lang="less">
  .seb-service-detail{
    .flex.el-form-item .el-form-item__content{
      display: flex;
      margin-left: 0 !important;
    }
    .flex.el-form-item .el-form-item__content .el-form-item{
      padding-right: 30px;
    }
    .unit-price .el-form-item__label{
      width: 140px !important;
    }
  }
</style>
