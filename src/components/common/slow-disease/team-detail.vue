<template>
  <div class="team-detail">
    <div is="disease-crumbs" :titleList="titleList"></div>
    <div class="info">
      <div v-if="teamDetail && !teamDetail.leaderAvatar"><img src="../../../assets/img/doctor.png" alt=""></div>
      <div v-else><img :src="teamDetail && teamDetail.leaderAvatar && teamDetail.leaderAvatar.fileFullPath" alt=""></div>
      <div class="text">
        <h1>{{teamDetail && teamDetail.teamName}}</h1>
        <p><span>团队负责人：{{teamDetail && teamDetail.leaderName}} · {{teamDetail && teamDetail.belongToHospital}} · {{teamDetail && teamDetail.belongToDept}}</span><span>手机号：{{teamDetail && teamDetail.telephone}}</span></p>
        <p v-if="teamDetail && teamDetail.guideDoctor"><span>指导医生：{{teamDetail.guideDoctor.docName}} · {{teamDetail.guideDoctor.hospName}} · {{teamDetail.guideDoctor.deptName}}</span><span>手机号：{{teamDetail.guideDoctor.docTelephone}}</span></p>
        <p v-else><span>指导医生：暂无</span></p>
      </div>
    </div>
    <div class="content">
      <div class="navs clearfix">
        <div :class="{ active: type === 1 }" @click="getDiseaseMemberList()">团队成员</div>
        <div :class="{ active: type === 2 }" @click="getServiceList()">团队服务包</div>
        <div :class="{ active: type === 3 }" @click="getGuideDoctor()">指导医生</div>
        <div></div>
      </div>
      <div class="visits" v-show="type === 1">
        <div class="table">
          <el-table
            :data="examineList.list"
            stripe>
            <el-table-column
              type="index"
              label="序号"
              width="140"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="memberName"
              label="成员姓名">
            </el-table-column>
            <el-table-column
              prop="memberTelephone"
              :show-overflow-tooltip="true"
              label="手机号">
            </el-table-column>
            <el-table-column
              label="职业">
              <template slot-scope="scope">
                {{scope.row.occupationType === '1' ? '医生' : scope.row.occupationType === '2' ? '护士' : scope.row.occupationType === '3' ? '公卫' : scope.row.occupationType === '4' ? '乡医' : ''}}
              </template>
            </el-table-column>
            <el-table-column
              label="新增时间">
              <template slot-scope="scope">
                {{scope.row.submitTime | moment('YYYY-MM-DD')}}
              </template>
            </el-table-column>
            <div class="not-content" slot="empty">
              <img src="../../../assets/img/not.png" alt="">
              <p>抱歉，暂无相关内容</p>
            </div>
          </el-table>
          <div class="pagination-box" v-if="examineList && examineList.list && examineList.list.length > 0">
            <el-pagination
              background
              @size-change="onPageSizeChange"
              @current-change="onPageChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              :page-sizes="[10, 20]"
              layout="total, prev, pager, next, sizes, jumper"
              :total="examineList.total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="server" v-show="type === 2 && serviceList.length > 0">
        <div>共{{serviceList.length}}个服务包</div>
        <div is="collapse" :serviceList="serviceList"></div>
      </div>
      <div class="not-content" v-show="type === 2 && serviceList.length === 0">
        <img src="../../../assets/img/not.png" alt="">
        <p>抱歉，暂无相关内容</p>
      </div>
      <div class="guide-doctor" v-show="type === 3 && guideDoctorList.length > 0">
        <div v-for="item in guideDoctorList" :key="item.id">
          <div class="info">
            <div v-if="!item.doctor.avatar"><img src="../../../assets/img/doctor.png" alt=""></div>
            <div v-else><img :src="item.doctor.avatar.fileFullPath" alt=""></div>
            <div>
              <h1><span><span>{{item.doctor.docName}}</span> · <span>{{item.doctor.hospName}}</span> · <span>{{item.doctor.deptName}}（{{item.guideYear}}）</span></span></h1>
              <p><span>手机号：{{item.doctor.docTelephone}}</span><span>开始指导时间：{{item.guideDate | moment()}}</span></p>
            </div>
          </div>
          <div class="adept">
            <p class="test">
              擅长：{{item.docAdept}}
            </p>
          </div>
        </div>
      </div>
      <div class="not-content" v-show="type === 3 && guideDoctorList.length === 0">
        <img src="../../../assets/img/not.png" alt="">
        <p>抱歉，暂无相关内容</p>
      </div>
    </div>
  </div>
</template>
<script>
import diseaseCrumbs from './disease-crumbs.vue';
import collapse from './collapse.vue';
export default {
  components: { collapse, diseaseCrumbs },
  props: ['titleList', 'path', 'teamId'],
  data () {
    return {
      type: 1,
      examineList: [],
      serviceList: [],
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      teamDetail: null,
      townshipHospUid: null,
      userType: null,
      packStatus: null,
      guideDoctorList: [],
      isBubble: false,
      isShowPoint: false
    }
  },
  watch: {
    teamId () {
      if (this.teamId) {
        this.getTeamDetail();
        this.getDiseaseMemberList();
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.token;
    }
  },
  mounted () {
    console.log(this.teamId);
  },
  methods: {
    // 获取团队详情
    getTeamDetail () {
      let params = {uid: this.teamId}
      this.axios.get('/hisServices/chronic/team/', {params})
        .then(res => {
          if (res) {
            console.log(res);
            this.teamDetail = res.data;
          }
        })
    },
    // 分页查询成员列表
    getDiseaseMemberList () {
      this.type = 1;
      let jsonStr = {
        pageSize: 10,
        pageNum: 1,
        where: {
          teamUid: this.teamId,
          memberStatus: '1'
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/teamMembers/' + jsonStr)
        .then(res => {
          if (res) {
            console.log(res);
            this.examineList = res.data;
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
          userUid: this.teamId, // 用户标识 卫计局、卫生院、慢病团队、患者
          userType: '3', // 用户类型
          packStatus: '2' // 服务包状态，卫计局有效
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
    getGuideDoctor () {
      this.type = 3;
      let jsonStr = {
        pageSize: 0,
        pageNum: 1,
        where: {
          teamUid: this.teamId
        }
      }
      jsonStr = encodeURIComponent(encodeURIComponent(JSON.stringify(jsonStr)));
      this.axios.get('/hisServices/chronic/guideDocs/' + jsonStr)
        .then(res => {
          if (res) {
            this.guideDoctorList = res.data.list;
          }
        })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    onPageSizeChange (size) {
      this.pageSize = size;
    },
    onPageChange (page) {
      this.pageNum = page;
    }
  }
}
</script>
<style scoped lang="less">
  .team-detail{
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
        line-height: 26px;
        h1{
          color: #666666;
          font-weight: bold;
        }
        p > span{
          margin-right: 20px;
          color: #999;
        }
      }
      > div:nth-child(3){
        line-height: 80px;
      }
    }
    .content{
      .navs{
        position: relative;
        > div:nth-child(1), > div:nth-child(2), > div:nth-child(3){
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
        > div:nth-child(4){
          width: 100%;
          height: 2px;
          background: #E8E8E8;
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: -999;
        }
        > div:nth-child(5){
          float: right;
          padding: 15px 0;
        }
      }
      .visits{
        padding-top: 20px;
      }
      .server{
        div:nth-child(1){
          padding: 10px 0;
          text-align: right;
          color: #666;
        }
      }
      .guide-doctor{
        > div{
            padding: 10px 10px;
            margin: 10px 0;
            border: 1px solid #E8E8E8;
          .info{
            display: flex;
            padding: 10px 10px;
            border-bottom: none;
            > div:nth-child(1){
              padding-right: 20px;
              img{
                width: 60px;
                height: 60px;
                border-radius: 50%;
              }
            }
            > div:nth-child(2){
              line-height: 30px;
              h1{
                span{
                  color: #666666;
                  font-weight: bold;
                }
              }
              p > span{
                margin-right: 20px;
                color: #999;
              }
            }
          }
          .adept{
            padding: 0 10px;
            .test{
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
