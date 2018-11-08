<template>
  <div>
    <div is="disease-crumbs" :titleList="titleList"></div>
    <div class="contract-detail" v-if="stepIndex === 1">
      <div class="info">
        <div>
          <img src="../../../../assets/img/portrait.png" alt="" v-if="contractInfo && !contractInfo.userAvatar">
          <img :src="contractInfo && contractInfo.userAvatar && contractInfo.userAvatar.fileFullPath" alt="" v-else>
        </div>
        <div class="text">
          <h1><span>{{contractInfo && contractInfo.userName}}</span><span>({{contractInfo && contractInfo.teamWithAvatar.teamName}}<label v-if="isWJJ || isYY">▪{{contractInfo && contractInfo.teamWithAvatar.belongToHospital}}</label>)</span><span>{{transcodingSignedStatus(contractInfo && contractInfo.signedStatus.signedStatus)}}</span><span>￥{{contractInfo && contractInfo.signedPrice}}</span></h1>
          <p style="width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" :title="contractInfo && transcodingUserType(contractInfo.userType)">人员类别：{{contractInfo && transcodingUserType(contractInfo.userType)}}</p>
          <p style="width: 90%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" :title="contractInfo && contractInfo.userAddress"><span>身份证号：{{contractInfo && contractInfo.userIdcrad}}</span><span>手机号：{{contractInfo && contractInfo.userTelephone}}</span><span>居住地址：{{contractInfo && contractInfo.userAddress}}</span></p>
        </div>
        <div v-if="contractInfo && contractInfo.signedReplace === '1'" @click="getContractDoc()">签约文件</div>
      </div>
      <div class="content">
        <div class="navs clearfix">
          <div :class="{ active: type === 1 }" @click="getVisitsList()">巡诊记录</div>
          <div :class="{ active: type === 2 }" @click="getServiceList()">签约服务包</div>
          <div></div>
          <div style="color: #999;">签约时间：{{contractInfo && contractInfo.signedStatus.reviewTime | moment('YYYY-MM-DD')}}</div>
        </div>
        <div class="visits" v-show="type === 1">
          <div class="table">
            <el-table
              :data="visitsList.list"
              stripe>
              <el-table-column
                type="index"
                label="序号"
                width="140"
                :index="indexMethod">
              </el-table-column>
              <el-table-column
                label="巡诊时间">
                <template slot-scope="scope">
                  {{scope.row.patrolTime | moment('YYYY-MM-DD')}}
                </template>
              </el-table-column>
              <el-table-column
                prop="patrolDoctor.name"
                :show-overflow-tooltip="true"
                label="录入人">
              </el-table-column>
              <el-table-column
                label="录入时间">
                <template slot-scope="scope">
                  {{scope.row.patrolDoctor.createTime | moment('YYYY-MM-DD')}}
                </template>
              </el-table-column>
              <el-table-column
                :formatter="transcodingAppraise"
                label="巡诊评价">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <router-link class="operate" tag="span" :to="{ name: 'contract-detail', query: {stepIndex: 2, visitsId: scope.row.uid} }" @click.native="getVisitsInfo(scope.row.uid)">查看</router-link>
                </template>
              </el-table-column>
              <div class="not-content" slot="empty">
                <img src="../../../../assets/img/not.png" alt="">
                <p>抱歉，暂无相关内容</p>
              </div>
            </el-table>
            <div class="pagination-box" v-if="visitsList && visitsList.list && visitsList.list.length > 0">
              <el-pagination
                background
                @size-change="onPageSizeChange"
                @current-change="onPageChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                :page-sizes="[10, 20]"
                layout="total, prev, pager, next, sizes, jumper"
                :total="visitsList.total">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="server" v-show="type === 2">
          <div><span>签约金额：￥{{contractInfo && contractInfo.signedPrice}}</span><span>优惠金额：￥{{contractInfo && contractInfo.discountPrice}}</span><span>实付金额：￥{{contractInfo && contractInfo.payPrice}}</span></div>
          <div is="collapse" :serviceList="serviceList" :type="1"></div>
        </div>
      </div>
    </div>
    <div class="visits-del" v-if="stepIndex === 2">
      <el-form label-width="80px">
        <el-form-item label="巡诊时间:">
          <el-input style="width: 240px;" size="small" v-model="visitsTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="巡诊情况:">
          <el-input
            type="textarea"
            :rows="4"
            size="small"
            :disabled="true"
            placeholder="请输入内容"
            v-model="textarea">
          </el-input>
        </el-form-item>
        <el-form-item label="转诊建议:" v-if="refAdvice">
          <el-input size="small" v-model="refAdvice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="转诊建议:" v-else>
          无
        </el-form-item>
        <el-form-item label="图片:">
          <div id="imgs" style="height: 100px;"></div>
        </el-form-item>
        <template v-if="appraiseNum !== '0'">
          <el-form-item label="巡诊评价:" style="margin-bottom: 6px;">
            <el-radio-group v-model="appraiseNum" :disabled="true">
              <el-radio :label="'1'">非常满意</el-radio>
              <el-radio :label="'2'">满意</el-radio>
              <el-radio :label="'3'">基本满意</el-radio>
              <el-radio :label="'4'">不满意</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" v-if="appraiseNum === '4'">
            <el-input size="small" v-model="appraiseContent" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="服务建议:" v-if="serviceSug">
            <el-input
              type="textarea"
              :rows="6"
              :disabled="true"
              size="small"
              placeholder="请输入内容"
              v-model="serviceSug">
            </el-input>
          </el-form-item>
          <el-form-item label="服务建议:" v-else>
            无
          </el-form-item>
        </template>
        <el-form-item label="巡诊评价:" v-else>
          用户未评价
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import diseaseCrumbs from '@/components/common/slow-disease/disease-crumbs.vue';
import collapse from '@/components/common/slow-disease/collapse.vue';
export default {
  components: { collapse, diseaseCrumbs },
  data () {
    return {
      stepIndex: 1,
      titleList: ['居民签约管理', '签约详情'],
      path: 'team-list',
      type: 1,
      serviceList: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      visitsTime: '',
      refAdvice: '',
      appraiseNum: 2,
      appraiseContent: '',
      serviceSug: '',
      textarea: '',
      contractId: '',
      contractInfo: null,
      visitsList: [],
      packStatus: null,
      isWJJ: false,
      isWSY: false,
      isYY: false,
      visitsId: null
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  watch: {
    $route (to) {
      this.getData();
      this.getCrumbs();
    }
  },
  mounted () {
    this.isWJJ = this.userInfo.roleList.some(item => item.roleName === '卫计局');
    this.isWSY = this.userInfo.roleList.some(item => item.roleName === '卫生院');
    this.isYY = this.userInfo.roleList.some(item => item.roleName === '医院');
    if (this.isWJJ) {
      this.packStatus = '2';
    }
    this.getData();
    this.getCrumbs();
  },
  methods: {
    getData () {
      this.stepIndex = parseInt(this.$route.query.stepIndex);
      this.contractId = this.$route.query.contractId;
      this.visitsId = this.$route.query.visitsId;
      if (this.stepIndex === 1 && this.contractId) {
        this.getDiseaseContractInfo();
        this.getVisitsList();
      } else if (this.stepIndex === 2 && this.visitsId) {
        this.getVisitsInfo(this.visitsId);
      }
    },
    transcodingUserType (userType) {
      let typeList = userType.split('|');
      let typeStr = '';
      for (let i = 0; i < typeList.length; i++) {
        typeStr += typeList[i] === '01' ? '儿童' : typeList[i] === '02'
          ? '老年人' : typeList[i] === '03'
            ? '孕产妇' : typeList[i] === '04'
              ? '高血压' : typeList[i] === '05'
                ? '糖尿病' : typeList[i] === '06'
                  ? '结核病' : typeList[i] === '07'
                    ? '严重精神障碍' : typeList[i] === '08'
                      ? '残疾人' : typeList[i] === '09'
                        ? '农村建档立卡贫困人' : typeList[i] === '10'
                          ? '计划生育特殊家庭' : typeList[i] === '11'
                            ? '城乡低保五保人口' : typeList[i] === '12'
                              ? '重点人群' : typeList[i] === '99'
                                ? '其他重点人群' : ''
        if (i < typeList.length - 1) {
          typeStr += '、';
        }
      }
      return typeStr;
    },
    transcodingAppraise (row) {
      let type = row.patrolEvaluateType;
      return type === '0' ? '未评价' : type === '1'
        ? '非常满意' : type === '2'
          ? '满意' : type === '3'
            ? '基本满意' : type === '4'
              ? '不满意' : ''
    },
    transcodingSignedStatus (status) {
      return status === '0' ? '待审核' : status === '1'
        ? '首签中' : status === '2'
          ? '复签中' : status === '3'
            ? '已结案' : ''
    },
    getCrumbs () {
      if (this.stepIndex === 1) {
        this.titleList = ['居民签约管理', '签约详情'];
        this.path = 'contract-list';
      } else if (this.stepIndex === 2) {
        this.titleList = ['居民签约管理', '签约详情', '巡诊详情'];
        this.path = 'contract-detail';
      }
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
      this.getVisitsList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getVisitsList();
    },
    // 查询慢病团队签约信息
    getDiseaseContractInfo () {
      const params = {uid: this.contractId}
      this.axios.get('/hisServices/chronic/signed/', {params})
        .then(res => {
          if (res) {
            this.contractInfo = res.data;
          }
        })
    },
    // 分页查询巡诊列表
    getVisitsList () {
      this.type = 1;
      let jsonStr = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        where: {
          signedUid: this.contractId
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/patrols/' + jsonStr)
        .then(res => {
          if (res) {
            this.visitsList = res.data;
          }
        })
    },
    // 获取服务包列表
    getServiceList () {
      this.type = 2;
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          userUid: this.contractId,
          userType: '4',
          packStatus: this.packStatus // 服务包状态，卫计局有效
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/packs/' + jsonStr)
        .then(res => {
          if (res) {
            this.serviceList = res.data;
          }
        })
    },
    // 获取巡诊详情
    getVisitsInfo (uid) {
      const params = {uid: uid}
      this.axios.get('/hisServices/chronic/patrol', {params})
        .then(res => {
          let info = res.data;
          this.visitsTime = this.moment(info.patrolTime).format('YYYY-MM-DD');
          this.textarea = info.patrolSituation;
          this.refAdvice = info.referralSuggest;
          this.appraiseNum = info.patrolEvaluateType;
          this.appraiseContent = info.patrolEvaluate;
          this.serviceSug = info.serviceSuggest;
          if (info.patrolPictures && info.patrolPictures.length > 0) {
            this.previewPictures(info.patrolPictures, 2);
          }
        })
    },
    // 获取签约文件
    getContractDoc () {
      const params = {contentUid: this.contractId}
      this.axios.get('S2/usersServices/appendixs', {params})
        .then(res => {
          if (res) {
            if (res && res.data.length > 0) {
              this.previewPictures(res.data, 1);
            }
          }
        })
    },
    newPicView (imgs, _ziv) {
      // 使用方法
      let ziv;
      if (_ziv) {
        ziv = _ziv;
      } else {
        ziv = new ZxImageView(this.config, imgs);
      }
      if (ziv.$img.height) {
        ziv.view(0);
      } else {
        setTimeout(() => {
          this.newPicView(imgs, ziv)
        }, 300)
      }
    },
    // 预览图片公共方法
    previewPictures (data, type) {
      let imgs = data.map(item => item.fileFullPath);
      if (type === 1) {
        // 图片数组2
        let imgs2 = []
        imgs.forEach(function (src) {
          imgs2.push({
            url: src,
            angle: 0
          })
        })
        this.newPicView(imgs);
      } else if (type === 2) {
        setTimeout(() => {
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
      }
    }
  }
}
</script>
<style scoped lang="less">
  .contract-detail{
    .info{
      display: flex;
      padding: 30px 0 15px;
      border-bottom: 1px solid #E8E8E8;
      > div:nth-child(1){
        padding-right: 20px;
        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      > div:nth-child(2){
        width: 86%;
        line-height: 26px;
        h1{
          span{
            margin-right: 20px;
            &:nth-child(1){
              color: #666;
              font-weight: bold;
            }
            &:nth-child(2){
              color: #999;
            }
            &:nth-child(3){
              display: inline-block;
              width: 50px;
              height: 20px;
              line-height: 16px;
              text-align: center;
              border: 1px solid #1890FF;
              border-radius:3px;
              font-size: 12px;
              color: #1890FF;
            }
            &:nth-child(4){
              color: #FF6600;
              font-size: 12px;
            }
          }
        }
        p{
          color: #999;
        }
        p > span{
          margin-right: 20px;
          color: #999;
        }
      }
      > div:nth-child(3){
        line-height: 80px;
        color: #1890FF;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .content{
      .navs{
        position: relative;
        > div:nth-child(1), > div:nth-child(2){
          float: left;
          padding: 15px 20px;
          color: #999;
          font-weight: bold;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          &:hover, &.active{
            border-bottom-color: #1890FF;
          }
        }
        > div:nth-child(3){
          width: 100%;
          height: 2px;
          background: #E8E8E8;
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: -999;
        }
        > div:nth-child(4){
          float: right;
          padding: 15px 0;
        }
      }
      .visits{
        padding-top: 20px;
      }
      .server{
        div:nth-child(1){
          padding: 15px 0;
          text-align: right;
          span{
            color: #666;
          }
          span:not(:last-child){
            margin-right: 20px;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .visits-del{
    padding-top: 30px;
    .el-form-item__label{
      color: #000;
    }
    .el-input__inner, .el-textarea__inner{
      color: #000;
    }
  }
</style>
