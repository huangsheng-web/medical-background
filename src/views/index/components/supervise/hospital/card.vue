<template>
  <div class="sup-main my-sup-h clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe699;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span>{{item.name}}</span></span>
      </div>
    </div>
    <!--村医卡号维护-->
    <div class="sup-content-box clearfix">
      <div class="sup-content" v-show="sideFiveCurP === 0">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          村卫生室:
          <el-select v-model="villageRoom" style="width: 200px;" placeholder="请选择">
            <el-option
              label="全部"
              :value="null"
            ></el-option>
            <el-option
              v-for="item in villageRoomList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="sup-c3-btn">
          <el-button type="primary" @click.native="addVCardNo">新增</el-button>
          <el-button style="display: none;"></el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel17"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            width="176">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            min-width="176"
            :show-overflow-tooltip="true"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="176"
            :show-overflow-tooltip="true"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="bankAccount"
            min-width="176"
            :show-overflow-tooltip="true"
            label="一卡通账号">
          </el-table-column>
          <el-table-column
            prop="status"
            min-width="176"
            label="状态">
            <template slot-scope="scope">
              <p v-if="scope.row.status === '3' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '8'">已审核</p>
              <p v-else>{{villageStatus[scope.row.status]}}</p>
            </template>
          </el-table-column>
          <el-table-column
            width="176"
            label="操作">
            <template slot-scope="scope">
              <span class="pay-online" @click="reviseVillage(scope.row)" v-if="scope.row.status === '3' || scope.row.status === '4' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '7' || scope.row.status === '8'">修改</span>
              <span  class="cant-tap" v-else>修改</span>
              <span  class="cancel-reg" @click="delVillage(scope.row)" v-if="scope.row.status === '3' || scope.row.status === '4' || scope.row.status === '5' || scope.row.status === '6' || scope.row.status === '7' || scope.row.status === '8'">删除</span>
              <span  class="cant-tap" v-else>删除</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="sup-content" v-show="sideFiveCurP === 1">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          村卫生室:
          <el-select v-model="villageRoom" style="width: 200px;" placeholder="请选择">
            <el-option
              v-for="item in villageRoomList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel154"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="150">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            min-width="150"
            :show-overflow-tooltip="true"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="150"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="newBankAccount"
            label="一卡通账号"
            :show-overflow-tooltip="true"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="operationType"
            min-width="150"
            label="操作类别">
            <template slot-scope="scope">
              {{oType[scope.row.operationType]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            min-width="150"
            label="备注">
          </el-table-column>
          <el-table-column
            prop="submitTime"
            min-width="150"
            label="提交时间">
            <template slot-scope="scope">
              {{scope.row.submitTime | moment}}
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div class="sup-content" v-show="sideFiveCurP === 2">
        <div class="village-type">
          <span :class="{'active': villageType === 0}" @click="villageType = 0">村医列表</span>
          <span :class="{'active': villageType === 1}" @click="villageType = 1">待审核</span>
          <span :class="{'active': villageType === 2}" @click="villageType = 2">审核不通过</span>
        </div>
        <div class="sup-search">
          村卫生室:
          <el-select v-model="villageRoom" style="width: 200px;" placeholder="请选择">
            <el-option
              v-for="item in villageRoomList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-button @click="getVillageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="villageCardNoList"
          key="tabel18"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="100">
          </el-table-column>
          <el-table-column
            prop="villageClinicName"
            min-width="130"
            :show-overflow-tooltip="true"
            label="村卫生室">
          </el-table-column>
          <el-table-column
            prop="name"
            width="130"
            label="村医姓名">
          </el-table-column>
          <el-table-column
            prop="newBankAccount"
            label="一卡通账号"
            :show-overflow-tooltip="true"
            min-width="220">
          </el-table-column>
          <el-table-column
            prop="operationType"
            min-width="100"
            label="操作类别">
            <template slot-scope="scope">
              {{oType[scope.row.operationType]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="submitTime"
            min-width="120"
            label="审核时间">
            <template slot-scope="scope">
              {{scope.row.reviewTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            min-width="150"
            label="不通过原因">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <span class="pay-online" @click="reviseVillage(scope.row)">重新提交</span>
            </template>
          </el-table-column>
          <div class="not-content" slot="empty">
            <img src="../../../../../assets/img/not.png" alt="">
            <p>抱歉，暂无相关内容</p>
          </div>
        </el-table>
      </div>
      <div v-show="villageCardNoList.length" class="pagination-box">
        <el-pagination
          background
          @size-change="onPageSizeChange"
          @current-change="onPageChange"
          :current-page.sync="pagination.pageNum"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20]"
          layout="total, prev, pager, next, sizes, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
    </div>
    <!--卡号维护-录入村医-->
    <el-dialog
      :title="oVType === 0 ? '新增村医' : oType[operationType] + '村医'"
      :visible.sync="vCardNoEntryDialog"
      :close-on-click-modal="false"
      width="340px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <span class="red-star" style="width: 77px;">村卫生室：</span>
          <el-select v-model="villageEntryData.villageClinicUid" @change="chooseVillage" style="width: 200px;" v-if="!villageEntryCanSelect" placeholder="请选择">
            <el-option
              v-for="item in villageRoomList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <el-input :disabled="true" v-model="curVillageEntryName"  style="width: 200px;height: 32px;" v-else></el-input>
        </div>
        <div class="town-entry-row">
          <span class="red-star"  style="width: 77px;">村医姓名：</span>
          <el-input :disabled="villageEntryCanSelect" v-model="villageEntryData.name" style="width: 200px; height: 32px;"></el-input>
        </div>
        <div class="town-entry-row">
          <span class="red-star" style="width: 77px;">一卡通：</span>
          <el-input  v-model="villageEntryData.bankAccount" style="width: 200px; height: 32px;"></el-input>
        </div>
        <div class="town-entry-row">
          <span  style="width: 77px;">备注：</span>
          <textarea  style="width: 200px;"  v-model="villageEntryData.description"  name=""  cols="30" rows="10"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!villageEntryData.bankAccount || !villageEntryData.name || !villageEntryData.villageClinicUid"  @click.native="saveVillageEntry">确定</el-button>
        <el-button @click.native="vCardNoEntryDialog = false; villageEntryCanSelect = false;">取 消</el-button>
      </span>
    </el-dialog>
    <!--删除村医-->
    <el-dialog
      title="删除村医"
      :visible.sync="delVillageCardNoDialog"
      :close-on-click-modal="false"
      width="750px"
      center>
      <div class="town-entry-box">
        <div class="town-entry-row">
          <div class="has-color">
            <span>村卫生室:{{villageEntryData.villageClinicName}}</span><span>村医姓名:{{villageEntryData.name}}</span><span style="margin-right: 0">一卡通账号:{{villageEntryData.bankAccount}}</span>
          </div>
        </div>
        <div class="town-entry-row">
          <span class="red-star"  style="width: 52px;text-align: left">备注：</span>
          <textarea  style="width: 636px;"  v-model="vDelDescription"  name=""  cols="30" rows="10"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!vDelDescription" @click="confirmDel">提交</el-button>
        <el-button @click="delVillageCardNoDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      operationType: null,
      allTotal: {
        totalActualAmount: null,
        totalBudgetAmount: null,
        totalClinicNum: null,
        totalDoctorNum: null
      },
      breadList: {
        '1': [
          {name: '村医卡号维护', sideType: 1, sideCurP: 0}
        ]
      },
      sideType: 1,
      pagination: { // 分页
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      // 村医卡号
      sideFiveCurP: 0,
      villageHos: '',
      villageRoom: '',
      villageStatus: {
        '0': '新增待审核',
        '1': '修改待审核',
        '2': '删除待审核',
        '3': '新增审核通过',
        '4': '新增审核不通过',
        '5': '修改审核通过',
        '6': '修改审核不通过',
        '7': '删除审核通过',
        '8': '删除审核不通过'
      },
      oType: {
        '0': '新增',
        '1': '修改',
        '2': '删除'
      },
      villageCardNoList: [],
      vCardNoEntryDialog: false,
      villageHosList: [], // 乡镇卫生院列表
      villageRoomList: [], // 村卫生室列表
      villageType: 0, // 0村医列表，1待审核，2审核不通过
      oVType: 0, // 0为新增，1为修改，重新提交
      villageEntryCanSelect: false,
      villageEntryList: [],
      curVillageEntryName: '',
      villageEntryData: {
        nametownshipHospUid: this.$store.state.token.organInfoList[0].uid,
        villageClinicUid: '',
        name: '',
        bankAccount: '',
        description: ''
      },
      delVillageCardNoDialog: false,
      vDelUid: '', // 准备删除的村医id
      vDelDescription: '' // 删除村医备注
    }
  },
  mounted () {
    this.getVillageList();
    this.getDrugVillageList();
  },
  methods: {
    validateNum (rule, value, cb) {
      var reg = /^((\d*)|(0))([.]\d{0,2})?$/;
      console.log(reg.test(value), value)
      if (value === '') {
        return false;
      } else if (!reg.test(value)) {
        cb(new Error('必须是正数，精确到小数点后两位'))
      }
    },
    indexMethod (index) {
      return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
    },
    // 分页
    onPageSizeChange (size) {
      this.pagination.pageSize = size;
      this.getVillageList();
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getVillageList();
    },
    // 卫计项目
    // 村医卡号
    addVCardNo () {
      this.vCardNoEntryDialog = true;
      this.villageEntryCanSelect = false;
      this.oVType = 0;
      this.villageEntryData = {
        townshipHospUid: this.$store.state.token.organInfoList[0].uid,
        villageClinicUid: '',
        name: '',
        bankAccount: '',
        description: ''
      }
    }, // 新增村医卡号
    getVillageList () {
      let params = {
        pageNum: this.pagination.pageNum,
        where: {
          townshipHospUid: this.$store.state.token.organInfoList[0].uid,
          dateType: this.villageType + ''
        }
      }
      if (this.villageRoom) {
        params.where['villageClinicUId'] = this.villageRoom;
      }
      this.axios.get('/hisServices/financialSupervision/villageDoctors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.villageCardNoList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
            this.pagination.pageSize = res.data.pageSize;
            this.allTotal = {
              totalActualAmount: res.data.totalActualAmount ? res.data.totalActualAmount : null,
              totalBudgetAmount: res.data.totalBudgetAmount ? res.data.totalBudgetAmount : null,
              totalClinicNum: res.data.totalClinicNum ? res.data.totalClinicNum : null,
              totalDoctorNum: res.data.totalDoctorNum ? res.data.totalDoctorNum : null
            }
          }
        })
    }, // 村医卡号列表
    getDrugVillageList () {
      let p = {
        pageSize: 0,
        where: {
          hospitalUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      this.axios.get('/hisServices/financialSupervision/villageClinics/' + encodeURIComponent(encodeURIComponent(JSON.stringify(p))))
        .then(res => {
          if (res) {
            this.villageRoomList = res.data.list;
          }
        })
    }, // 村卫生室下拉
    chooseVillage (e) {
    },
    saveVillageEntry () {
      if (this.oVType === 0) {
        this.axios.post('/hisServices/financialSupervision/villageDoctor', this.villageEntryData)
          .then(res => {
            if (res) {
              this.vCardNoEntryDialog = false;
              this.getVillageList();
            }
          })
      } else if (this.oVType === 1) {
        let params = {
          uid: this.villageEntryData.uid,
          status: '5',
          newBankAccount: this.villageEntryData.bankAccount,
          description: this.villageEntryData.description
        }
        this.axios.put('/hisServices/financialSupervision/villageDoctor', params)
          .then(res => {
            if (res) {
              this.vCardNoEntryDialog = false;
              this.getVillageList();
              console.log(res)
            }
          })
      }
    },
    reviseVillage (item) {
      console.log(item)
      this.operationType = item.operationType;
      this.oVType = 1;
      this.vCardNoEntryDialog = true;
      this.villageEntryCanSelect = true;
      this.curVillageEntryName = item.villageClinicName;
      this.villageEntryData.description = '';
      this.villageEntryData.uid = item.uid;
      this.villageEntryData.bankAccount = item.bankAccount;
      this.villageEntryData.villageClinicUid = '00000';
      this.villageEntryData.name = item.name;
      if (item.status === '3' || item.status === '5' || item.status === '7') {
        this.villageEntryData.status = '1';
      } else if (item.status === '4' || item.status === '6' || item.status === '8') {
        this.villageEntryData.status = '2';
      } else {
        this.villageEntryData.status = '0';
      }
    },
    delVillage (item) {
      this.delVillageCardNoDialog = true;
      this.vDelDescription = '';
      this.villageEntryData.villageClinicName = item.villageClinicName;
      this.villageEntryData.name = item.name;
      this.villageEntryData.bankAccount = item.newBankAccount;
      this.vDelUid = item.uid;
    },
    confirmDel () {
      let params = {
        uid: this.vDelUid
      }
      this.axios.delete('/hisServices/financialSupervision/villageDoctor', {params})
        .then(res => {
          if (res) {
            this.delVillageCardNoDialog = false;
            this.getVillageList();
          }
        })
    }
  },
  watch: {
    villageType (e) {
      this.sideFiveCurP = e;
      this.villageHos = '';
      this.villageRoom = '';
      this.getVillageList();
    }
  }
}
</script>
<style scoped="scoped" lang="less">
  .sup-bread{
    padding-bottom: 20px;
    > i{
      display: inline-block;
      vertical-align: middle;
    }
    >.sup-bread-list{
      display: inline-block;
      vertical-align: middle;
      >span{
        span{
          cursor: pointer;
          font-size: 14px;
          color: #666666;
        }
        &:last-child{
          span{
            color: #333333;
            font-weight: bold;
          }
        }
      }
    }
  }
  .red-star{
    &:before{
      content: '*';
      color: #FF0000;
    }
  }
  .white-star{
    &:before{
      content: '*';
      color: #FFFFFF;
    }
  }
  button{
    width: 64px;
    height:32px;
    line-height: 32px;
    padding: 0;
    text-align: center;
  }
  .town-entry-box{
    .town-entry-row{
      margin-bottom: 16px;
      >span{
        width: 92px;
        display: inline-block;
        text-align: right;
        vertical-align: top;
      }
      >textarea{
        vertical-align: top;
        width: 260px;
        resize: none;
        height: 60px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        border-color: #e8e8e8;
        text-indent: 10px;
        padding: 4px 0;
        line-height: 20px;
      }
      >.has-color{
        width: 690px;
        height: auto;
        background: #FAFAFA;
        padding: 16px;
        span{
          font-size: 14px;
          color: #999999;
          margin-right: 60px;
        }
        h5{
          color: #333333;
          margin-bottom: 15px;
        }
        p{
          margin-top: 15px;
          color: #999999;
        }
      }
      .town-entry-pic{
        >p{
          line-height: 46px;
        }
        >div{
          display: inline-block;
        }
        >span{
          display: inline-block;
          width: 148px;
          height: 148px;
          margin-right: 16px;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          position: relative;
          vertical-align: top;
          img{
            width: 100%;
            height: 100%;
          }
          >.del-icon{
            display: none;
            position: absolute;
            font-size: 20px;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: rgba(102, 102, 102, .6);
            text-align: center;
            line-height: 32px;
            color: #ffffff;
            cursor: pointer;
            line-height: 148px;
          }
          &:hover{
            .del-icon{
              display: block;
            }
          }
        }
      }
    }
  }
  .show-big-pic{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(102, 102, 102, .6);
    z-index: 999999;
    img{
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
  }
</style>
<style lang="less">
  .my-sup-h{
    .el-form{
      display: inline-block;
      >div{
        display: inline;
        .el-form-item__content{
          line-height: 32px;
        }
      }
    }
    input{
      height: 32px!important;
      line-height: 32px;
    }
    .el-input__icon{
      line-height: 32px;
    }
    .el-table {
      min-height: 0;
    }
    .sup-content{
      min-height:  770px;
      float: left;
      width: calc(100% - 160px);
      .sup-search{
        width: 100%;
        height: 48px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e8e8e8;
        >div{
          margin-right: 30px;
          &:last-child{
            margin-right: 0;
          }
        }
        >button{
          width: 64px;
          height:32px;
          line-height: 32px;
          padding: 0;
          text-align: center;
        }
      }
      .add-btn{
        height: 64px;
        padding-top: 16px;
      }
      .village-type{
        height: 48px;
        margin-bottom: 16px;
        border-bottom: 1px solid #E8E8E8;
        span{
          display: block;
          float: left;
          width: 120px;
          height: 32px;
          text-align: center;
          line-height: 32px;
          border-top: 1px solid #e8e8e8;
          border-bottom: 1px solid #e8e8e8;
          border-left: 1px solid #e8e8e8;
          color: #333333;
          font-size: 14px;
          cursor: pointer;
          &:hover{
            border: 1px solid #1890FF;
            color: #1890FF;
          }
          &:first-child{
            -webkit-border-radius: 4px 0 0 4px;
            -moz-border-radius: 4px 0 0 4px;
            border-radius: 4px 0 0 4px;
            &:hover{
              border: 1px solid #1890FF;
              color: #1890FF;
            }
          }
          &:last-child{
            border-right: 1px solid #e8e8e8;
            -webkit-border-radius: 0 4px 4px 0;
            -moz-border-radius: 0 4px 4px 0;
            border-radius: 0 4px 4px 0;
            &:hover{
              border: 1px solid #1890FF;
              color: #1890FF;
            }
          }
        }
        .active{
          background: #1890FF;
          color: #ffffff;
          position: relative;
          border: none;
          &:after{
            content: '';
            display: block;
            width: 12px;
            height: 12px;
            background: #1890FF;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
            position: absolute;
            bottom: -6px;
            left: 54px;
          }
          &:hover{
            border: none!important;
            color: #FFFFFF!important;
          }
        }
      }
      .el-table{
        &:before{
          height:0;
        }
        td{
          .cell{
            span{
              cursor: pointer;
              color: #1890FF;
              padding: 0 8px;
              border-left: 1px solid #E9E9E9;
              &:first-child{
                border-left: none;
              }
            }
            .cant-tap{
              color: #999999;
            }
          }
        }
        thead{
          tr{
            position: relative;
            .el-table_1_column_11{
              /*position: absolute;*/
              width: 300px;
              right: 0;
            }
          }
        }
        tbody{
          tr{
            position: relative;
            .el-table_1_column_11{
              /*position: absolute;*/
              width: 300px;
              right: 0;
            }
          }
        }
      }
      /*卫计项目*/
      .sup-c2-t1{
        margin-left: 15px;
        max-width: 1120px;
        .sup-c2t1-item{
          display: inline-block;
          margin-right: 30px;
          position: relative;
          margin-bottom: 16px;
          >span{
            text-align: right;
            font-size: 14px;
            color: #333333;
          }
          >i{
            font-style: normal;
            color: #CCCCCC;
            font-size: 14px;
            display: block;
            position: absolute;
            right: 22px;
            top: 6px;
          }
        }
      }
      .sup-c2-t2{
        margin-left: 15px;
        margin-bottom: 16px;
        >span{
          display: inline-block;
          vertical-align: top;
        }
        >textarea{
          width: 960px;
          resize: none;
          height: 140px;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          border-color: #e8e8e8;
          text-indent: 10px;
          padding: 4px 0;
          line-height: 20px;
        }
        >.textarea{
          display: inline-block;
          width: 960px;
          height: 140px;
          background: #f5f5f5;
          border-radius: 4px;
          text-indent: 12px;
          border: 1px solid #e8e8e8;
          color: #cccccc;
        }
        >.sup-c5-piclist{
          display: inline-block;
          width: 960px;
          height: auto;
          >div{
            display: inline-block;
            vertical-align: text-bottom;
          }
          >span{
            display: inline-block;
            width: 148px;
            height: 148px;
            margin-right: 16px;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            position: relative;
            vertical-align: top;
            img{
              width: 100%;
              height: 100%;
            }
            >.del-icon{
              display: none;
              position: absolute;
              font-size: 20px;
              bottom: 0;
              right: 0;
              width: 100%;
              height: 100%;
              background: rgba(102, 102, 102, .6);
              text-align: center;
              line-height: 32px;
              color: #ffffff;
              cursor: pointer;
              line-height: 148px;
            }
            &:hover{
              .del-icon{
                display: block;
              }
            }
          }
          >ul{
            width: 960px;
            height: auto;
            li{
              float: left;
              width: 100px;
              height: 100px;
              margin-right: 16px;
              -webkit-border-radius: 4px;
              -moz-border-radius: 4px;
              border-radius: 4px;
              position: relative;
              img{
                width: 100%;
                height: 100%;
              }
              >i{
                display: block;
                position: absolute;
                font-size: 20px;
                bottom: 0;
                right: 0;
                width: 32px;
                height: 32px;
                background: rgba(102, 102, 102, .6);
                text-align: center;
                line-height: 32px;
                color: #ffffff;
                cursor: pointer;
              }
            }
          }
        }
      }
      .sup-c2-b{
        margin-top: 26px;
        margin-left: 1px;
        >p{
          font-size: 14px;
          color: #333333;
          span{
            color: #1890FF;
            margin-left: 2px;
          }
        }
        >div{
          margin-top: 26px;
          padding-left: 94px;
          .el-transfer{
            .el-transfer-panel{
              width: 300px;
              .el-transfer-panel__header{
                .el-checkbox{
                  .el-checkbox__label{
                    font-weight: bold;
                  }
                }
              }
            }
            .el-transfer__buttons{
              width: 146px;
              height: 74px;
              position: relative;
              button{
                padding: 0;
                width: 86px;
                height: 32px;
                line-height: 32px;
                position: absolute;
                &:first-child{
                  bottom: 0px;
                  margin-bottom: 0;
                }
                &:last-child{
                }
              }
            }
          }
        }
        .sup-c2-btn{
          margin-top: 30px;
          padding-left: 424px;
          button{
            width: 64px;
            height: 32px;
            line-height: 32px;
            padding: 0;
          }
        }
      }
      .sup-c3-detail{
        color: #666666;
        font-size: 14px;
        border-bottom: 1px solid #e8e8e8;
        span{
          display: inline-block;
          margin-right: 20px;
          margin-bottom: 14px;
          &:last-child{
            margin-right: 0;
          }
        }
      }
      .sup-c3-search{
        padding: 16px 0;
        border-bottom: 1px dashed #e8e8e8;
        button{
          margin-left: 30px;
        }
      }
      .sup-c3-btn{
        padding: 16px 0;
        width: 1056px;
        button{
          &:last-child{
            float: right;
          }
        }
        >div{
          display: inline-block;
          margin-left: 30px;
          color: #000000;
          font-size: 14px;
          line-height: 32px;
          font-family: "Microsoft YaHei";
          >span{
            display: inline-block;
            width:200px;
            height:32px;
            background:rgba(245,245,245,1);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            text-indent: 12px;
            border: 1px solid #e8e8e8;
            color: #cccccc;
            span{
              float: right;
              margin-right:  12px;
            }
            i{
              float: right;
              display: block;
              width: 30px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              text-indent: 0;
              border-left: 1px solid #e8e8e8;
            }
          }
        }
      }
    }
    .pagination-box{
      position: absolute;
      bottom: 20px;
      right: 30px;
    }
  }
</style>
