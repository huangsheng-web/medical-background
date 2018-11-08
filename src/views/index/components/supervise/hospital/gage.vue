<template>
  <div class="sup-main my-sup-h clearfix">
    <div class="sup-bread">
      <i class="iconfont">&#xe696;</i>
      <div class="sup-bread-list">
        <span v-for="(item, index) in breadList[sideType]"  :key="item.id"><i v-show="index > 0" class="el-icon-arrow-right"></i><span @click="breadTap(item.sideType, index, item.sideCurP)">{{item.name}}</span></span>
      </div>
    </div>
    <!--卫计项目-->
    <div class="sup-content-box clearfix">
      <!--待处理-->
      <div class="sup-content" v-show="sideOneCurP === 0">
        <div class="village-type">
          <span :class="{'active': sideOneCurP === 0}" @click="sideOneCurP = 0">待处理</span>
          <span :class="{'active': sideOneCurP === 1}" @click="sideOneCurP = 1">已处理</span>
        </div>
        <div class="sup-search">
          项目名称:
          <el-input style="width: 200px" v-model="proName"></el-input>
          指标文号:
          <el-input style="width: 200px" v-model="quotaNum"></el-input>
          <el-button @click.native="getGageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="proGageList"
          key="tabel1"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            :index="indexMethod"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            :show-overflow-tooltip="true"
            min-width="160">
          </el-table-column>
          <el-table-column
            prop="year"
            width="100"
            label="项目年度">
          </el-table-column>
          <el-table-column
            prop="quotaNum"
            min-width="100"
            :show-overflow-tooltip="true"
            label="指标文号">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="executeStatus"
            label="状态">
            <template slot-scope="scope">
              <i v-if="scope.row.status === '1'" style="background-color:#FB8C00;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '2'" style="background-color:#67c23a;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '3'" style="background-color:#EF5555;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <i v-if="scope.row.status === '0'" style="background-color:#1890FF;display: inline-block;vertical-align: middle;width: 6px;height: 6px;border-radius: 50%;"></i>
              <span style="border: none;" :style="{'color': scope.row.projectTownshipHosp.executeStatus === '2' ? '#EF5555' : '#888888'}">{{scope.row.projectTownshipHosp.executeStatus === '2' ? '已逾期' : '未提交'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="appropriateTime"
            min-width="150"
            label="财政预计拨付时间">
            <template slot-scope="scope">
              {{scope.row.appropriateTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="scope.row.projectTownshipHosp.deadlineTime"
            label="截止时间">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.deadlineTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="scope.row.projectTownshipHosp.requirements"
            min-width="160"
            :show-overflow-tooltip="true"
            label="项目要求">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.requirements}}
            </template>
          </el-table-column>
          <el-table-column
            prop="scope.row.projectTownshipHosp.budgetAmount"
            min-width="140"
            label="预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.budgetAmount}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="80">
            <template slot-scope="scope">
              <span  class="cancel-reg" @click="handlePro(scope.row)"  v-if="scope.row.status !== '3' || scope.row.overdueType === '1'">处理</span>
              <span  class="cancel-reg cant-tap"  v-else>处理</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--已处理-->
      <div class="sup-content" v-show="sideOneCurP === 1">
        <div class="village-type">
          <span :class="{'active': sideOneCurP === 0}" @click="sideOneCurP = 0">待处理</span>
          <span :class="{'active': sideOneCurP === 1}" @click="sideOneCurP = 1">已处理</span>
        </div>
        <div class="sup-search">
          项目年度：
          <el-select v-model="proYear" style="width: 120px;" placeholder="请选择">
            <el-option
              label="全部"
              :value="null">
            </el-option>
            <el-option
              v-for="item in proYearList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          项目名称:
          <el-input style="width: 200px" v-model="proName"></el-input>
          指标文号:
          <el-input style="width: 200px" v-model="quotaNum"></el-input>
          <el-button @click="getGageList" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table
          :data="proGageList"
          key="tabel2"
          stripe
          style="width: 100%;">
          <el-table-column
            type="index"
            :index="indexMethod"
            label="序号"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            :show-overflow-tooltip="true"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="year"
            width="100"
            label="项目年度">
          </el-table-column>
          <el-table-column
            prop="quotaNum"
            :show-overflow-tooltip="true"
            min-width="100"
            label="指标文号">
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="deadlineTime"
            label="截止时间">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.deadlineTime | moment}}
            </template>
          </el-table-column>
          <el-table-column
            prop="budgetAmount"
            min-width="103"
            label="预算金额（元）">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.budgetAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actualAmount"
            min-width="103"
            label="实发金额（元）">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.actualAmount}}
            </template>
          </el-table-column>
          <el-table-column
            prop="finishSituation"
            min-width="200"
            :show-overflow-tooltip="true"
            label="项目完成情况">
            <template slot-scope="scope">
              {{scope.row.projectTownshipHosp.finishSituation}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <span class="pay-online" @click="showProDetail(scope.row)">查看详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--处理页-->
      <div class="sup-content" v-if="sideOneCurP === 2">
        <div class="sup-c3-detail">
          <span>项目名称：{{proGageDetail.name}}</span>
          <span>指标文号：{{proGageDetail.quotaNum}}</span>
          <span>财政预计拨付时间：{{proGageDetail.appropriateTime | moment}}</span>
          <span>预算金额：{{proGageDetail.projectTownshipHosp.budgetAmount}}</span>
          <span>截止时间：{{proGageDetail.projectTownshipHosp.deadlineTime | moment}}</span><br>
          <span>项目要求：{{proGageDetail.projectTownshipHosp.requirements}}</span>
        </div>
        <div class="sup-c3-btn">
          <div>
            <i class="red-star" style="padding-right: 2px;font-style: normal;"> </i>实发金额：
            <el-form :model="proGageHandleData" class="demo-ruleForm">
              <el-form-item
                prop="actualAmount"
                :rules="[
                    {validator: validateNum, required: false}
                  ]"
              >
                <el-input type="actualAmount" style="width: 200px;height: 32px;" v-model="proGageHandleData.actualAmount" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <i class="red-star" style="padding-right: 2px;font-style: normal;"></i>到账时间：
            <el-date-picker
              style="width: 200px;"
              v-model="proGageHandleData.hospArriveTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="sup-c2-t2" style="margin-left: 0;">
          <span class="red-star" >项目完成情况：</span>
          <textarea  v-model="proGageHandleData.finishSituation"  name=""  cols="30" rows="10"></textarea>
        </div>
        <div class="sup-c2-t2">
          <span class="red-star" style="width: 100px;text-align: right">项目现场：</span>
          <div class="sup-c5-piclist">
            <el-upload
              ref="gageUpload"
              multiple
              :action="$store.state.fileUploadUrl + '/api/network/upload/new'"
              :data="{projectType: 1}"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSucess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <div class="sup-c2-t2">
          <span style="width: 100px;text-align: right;">备注：</span>
          <textarea  v-model="proGageHandleData.description"  name=""  cols="30" rows="10"></textarea>
        </div>
        <div class="sup-c2-b">
          <div class="sup-c2-btn">
            <el-button type="primary" :disabled="!proGageHandleData.actualAmount || !proGageHandleData.hospArriveTime || !proGageHandleData.finishSituation || !commentImgList.length" @click="sendGagePro">提交</el-button>
            <el-button @click="cancelGagePro">取消</el-button>
          </div>
        </div>
      </div>
      <!--详情页-->
      <div class="sup-content" v-show="sideOneCurP === 3">
        <div class="sup-c3-detail">
          <span>项目名称：{{proGageDetail.projectName}}</span>
          <span>实施单位：{{proGageDetail.townshipHospName}}</span>
          <span>预算金额：{{proGageDetail.budgetAmount}}</span>
          <span>截止时间：{{proGageDetail.deadlineTime | moment}}</span><br>
          <span>项目要求：{{proGageDetail.requirements}}</span>
        </div>
        <div v-show="!canRevisePro">
          <div class="sup-c3-btn">
            <div>
              实发金额：<span>{{proGageDetail.actualAmount}} <span>元</span></span>
            </div>
            <div>
              到账时间：<span>{{proGageDetail.hospArriveTime | moment}} <i class="el-icon-date"></i></span>
            </div>
          </div>
          <div class="sup-c2-t2" style="margin-left: 0">
            <span >项目完成情况：</span>
            <div class="textarea">{{proGageDetail.finishSituation}}</div>
          </div>
          <div class="sup-c2-t2" style="margin-left: 28px">
            <span >项目现场：</span>
            <div class="sup-c5-piclist" id="proE">
              <!--<ul class="clearfix">-->
              <!--<li v-for="item in proGageDetail.appendices" :key="item.id">-->
              <!--<img :src="item.thumbnailFullPath ? item.thumbnailFullPath : item.thumbnailPath" alt="">-->
              <!--<i class="iconfont" @click="showPic(item.fileFullPath)">&#xe689;</i>-->
              <!--</li>-->
              <!--</ul>-->
            </div>
          </div>
          <div class="sup-c2-t2" style="margin-left: 54px">
            <span >备注：</span>
            <div class="textarea">{{proGageDetail.description}}</div>
          </div>
          <div class="sup-c2-b">
            <div class="sup-c2-btn">
              <el-button type="primary" :disabled="proGageDetail.updateType === '0'" @click="reviseGagePro">修改</el-button>
            </div>
          </div>
        </div>
        <div v-show="canRevisePro">
          <div class="sup-c3-btn">
            <div>
              <i class="red-star" style="padding-right: 2px;font-style: normal;"> </i>实发金额：
              <el-input style="width: 200px;" v-model="proGageHandleData.actualAmount"></el-input>
            </div>
            <div>
              <i class="red-star" style="padding-right: 2px;font-style: normal;"></i>到账时间：
              <el-date-picker
                style="width: 200px;"
                v-model="proGageHandleData.hospArriveTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="sup-c2-t2" style="margin-left: 0;">
            <span class="red-star" >项目完成情况：</span>
            <textarea  v-model="proGageHandleData.finishSituation"  name=""  cols="30" rows="10"></textarea>
          </div>
          <div class="sup-c2-t2">
            <span class="red-star" style="width: 100px;text-align: right">项目现场：</span>
            <div class="sup-c5-piclist">
              <span v-for="(item, index) in proGageHandleData.appendices" :key="item.id">
                <img :src="item.thumbnailFullPath ? item.thumbnailFullPath : item.thumbnailPath" alt="">
                <i class="del-icon el-icon-delete" @click="delPic(index)"></i>
              </span>
              <el-upload
                multiple
                ref="gageUpload1"
                :action="$store.state.fileUploadUrl + '/api/network/upload/new'"
                :data="{projectType: 1}"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSucess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <div class="sup-c2-t2">
            <span style="width: 100px;text-align: right;">备注：</span>
            <textarea  v-model="proGageHandleData.description"  name=""  cols="30" rows="10"></textarea>
          </div>
          <div class="sup-c2-b">
            <div class="sup-c2-btn">
              <el-button type="primary" :disabled="!proGageHandleData.actualAmount || !proGageHandleData.hospArriveTime || !proGageHandleData.finishSituation" @click="sendGagePro">保存</el-button>
              <el-button @click="cancelPro">取消</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box" v-show="sideOneCurP !== 3 && sideOneCurP !== 2">
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
    <!--查看大图-->
    <div class="show-big-pic" v-show="showBigPic" @click="showBigPic = false">
      <img :src="bigPicUrl" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      allTotal: {
        totalActualAmount: null,
        totalBudgetAmount: null,
        totalClinicNum: null,
        totalDoctorNum: null
      },
      breadList: {
        '1': [
          {name: '卫计项目投入监测', sideType: 1, sideCurP: 0}
        ]
      },
      sideType: 1,
      showBigPic: false, // 查看大图
      bigPicUrl: '',
      pagination: { // 分页
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      },
      proMonth: '', // 搜索
      proMonthList: [
        {label: '1月份', value: '00'},
        {label: '2月份', value: '01'},
        {label: '3月份', value: '02'},
        {label: '4月份', value: '03'},
        {label: '5月份', value: '04'},
        {label: '6月份', value: '05'},
        {label: '7月份', value: '06'},
        {label: '8月份', value: '07'},
        {label: '9月份', value: '08'},
        {label: '10月份', value: '09'},
        {label: '11月份', value: '10'},
        {label: '12月份', value: '11'}
      ], // 搜索
      proYearList: [], // 搜索
      proYear: '', // 搜索
      quotaNum: '', // 文号，代码
      // 卫计项目
      sideOneCurP: 0, // 0待处理，1已处理
      proName: '', // 卫计项目名称
      proGageList: [], // 卫计项目列表
      proGageDetail: {}, // 卫计项目详情
      commentImgList: [], // 处理项目上传图片
      proGageHandleData: {
        uid: '',
        actualAmount: '',
        hospArriveTime: '',
        finishSituation: '',
        description: '',
        appendices: []
      }, // 处理卫计项目的数据
      canRevisePro: false
    }
  },
  mounted () {
    this.getGageList();
    this.getCurYear();
  },
  methods: {
    // 预览图片公共方法
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
    previewPictures (data, id) {
      if (id === 'bigPic') {
        let imgs2 = [{
          url: data,
          angle: 0
        }]
        this.newPicView(imgs2)
      } else {
        let imgs = data.map(value => value.fileFullPath);
        // 图片数组2
        let imgs2 = []
        // 获取图片列表容器
        let $el = document.getElementById(id);
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
      }
    },
    comfirmExportBase () {
      this.exportDialog = false;
      delete this.exportBaseParams.month;
      this.exportBaseParams.where.year += ''
      this.axios.get('/hisServices/financialSupervision/exportServiceTownshipHosp/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
        responseType: 'arraybuffer'
      }).then(res => {
        if (res) {
          let linkElement = document.createElement('a');
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute('download', '溆浦县卫计惠农补贴项目资金发放明细表.xls.xls');
          let clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
          linkElement.dispatchEvent(clickEvent);
        }
      })
    }, // 导出基卫项目
    comfirmExportDrug () {
      delete this.exportBaseParams.where.quarter;
      this.exportBaseParams.where.year += ''
      console.log(this.exportBaseParams)
      this.exportDrugDialog = false;
      this.axios.get('/hisServices/financialSupervision/exportDrugTownshipHosp/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
        responseType: 'arraybuffer'
      }).then(res => {
        if (res) {
          let linkElement = document.createElement('a');
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute('download', '溆浦县卫计惠农补贴项目资金发放明细表.xls.xls');
          let clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
          linkElement.dispatchEvent(clickEvent);
        }
      })
    }, // 导出基础药物-卫生院
    comfirmExportDrugV () {
      delete this.exportBaseParams.where.month;
      this.exportBaseParams.where.year += ''
      this.exportDrugDialog = false;
      this.axios.get('/hisServices/financialSupervision/exportDrugDoctor/' + encodeURIComponent(encodeURIComponent(JSON.stringify(this.exportBaseParams))), {
        responseType: 'arraybuffer'
      }).then(res => {
        if (res) {
          let linkElement = document.createElement('a');
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
          let url = window.URL.createObjectURL(blob);
          linkElement.setAttribute('href', url);
          linkElement.setAttribute('download', '溆浦县卫计惠农补贴项目资金发放明细表.xls.xls');
          let clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
          });
          linkElement.dispatchEvent(clickEvent);
        }
      })
    }, // 导出基础药物-卫生室
    validateNum (rule, value, cb) {
      var reg = /^((\d*)|(0))([.]\d{0,2})?$/;
      console.log(reg.test(value), value)
      if (value === '') {
        return false;
      } else if (!reg.test(value)) {
        cb(new Error('必须是正数，精确到小数点后两位'))
      }
    },
    validateNum1 (rule, value, cb) {
      var reg = /^((\d*)|(0))$/;
      console.log(reg.test(value), value)
      if (value === '') {
        return false;
      } else if (!reg.test(value)) {
        cb(new Error('账号必须为数字'))
      }
    },
    indexMethod (index) {
      return index + 1 + this.pagination.pageSize * (this.pagination.pageNum - 1);
    },
    getCurYear () {
      let y = new Date().getFullYear() - 2010;
      for (let i = 0; i <= y; i++) {
        let o = {
          label: 2010 + i,
          value: 2010 + i
        }
        this.proYearList.push(o)
      }
      this.proYearList.reverse();
    }, // 获取当前年份，
    showPic (url) {
      this.bigPicUrl = url;
      this.showBigPic = true;
    },
    // 分页
    onPageSizeChange (size) {
      this.pagination.pageSize = size;
      if (this.sideOneCurP === 0 || this.sideOneCurP === 1) {
        this.getGageList();
      }
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      if (this.sideOneCurP === 0 || this.sideOneCurP === 1) {
        this.getGageList();
      }
    },
    breadTap (type, index, curP) {
      this.breadList[type].splice(index + 1);
      this.sideType = type;
      console.log(type, curP)
      if (this.sideOneCurP === 3) {
        this.sideOneCurP = 1;
      } else {
        this.sideOneCurP = curP;
      }
    }, // 面包屑点击
    // 卫计项目
    getGageList () {
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        where: {
          status: this.sideOneCurP + '',
          hospitalUid: this.$store.state.token.organInfoList[0].uid
        }
      }
      if (this.proYear && this.sideOneCurP === 1) {
        params.where['year'] = this.proYear;
      }
      if (this.proName) {
        params.where['name'] = this.proName;
      }
      if (this.quotaNum) {
        params.where['quotaNum'] = this.quotaNum;
      }
      this.axios.get('/hisServices/financialSupervision/projectMonitors/' + encodeURIComponent(encodeURIComponent(JSON.stringify(params))))
        .then(res => {
          if (res) {
            this.proGageList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          }
        })
    }, // 获取卫计项目列表
    handlePro (item) {
      this.proGageHandleData = {
        uid: '',
        actualAmount: '',
        hospArriveTime: '',
        finishSituation: '',
        description: '',
        appendices: []
      }
      let params = {
        uid: item.projectTownshipHosp.uid
      }
      // this.axios.get('/hisServices/financialSupervision/projectTownshipHosp', {params})
      // .then(res => {
      // if (res) {
      // this.proGageDetail = res.data;
      //  }
      // })
      this.proGageDetail = item;
      this.sideOneCurP = 2;
      this.breadList['1'].push({name: '处理', sideType: 1, sideCurP: 2})
      // this.$refs.gageUpload.clearFiles();
    }, // 处理卫计项目
    sendGagePro () {
      let imgList = [];
      // this.proGageHandleData.appendices = [];
      if (this.commentImgList && this.commentImgList.length > 0) {
        for (let i = 0; i < this.commentImgList.length; i++) {
          if (this.commentImgList[i].response) {
            let oRes = this.commentImgList[i].response.data;
            if (oRes) {
              imgList.push({
                cname: oRes.fileName, // 附件名称 ,
                // desci: '', // 备注 ,
                filePathName: oRes.fileName, // 附件保存名称 ,
                fileType: '', // 文件类型 ,
                imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
                imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
                imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
                // otherFlag: '', // 其他标识 ,
                path: oRes.fileFullPath, // 附件路径 ,
                fileFullPath: oRes.fileFullPath,
                thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
                thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
                // uid: '' //  附件标识
              });
            }
          }
        }
      }
      if (this.sideOneCurP === 2) {
        this.proGageHandleData.uid = this.proGageDetail.projectTownshipHosp.uid;
      } else {
        this.proGageHandleData.uid = this.proGageDetail.uid;
      }
      this.proGageHandleData.appendices.splice(0, 0, ...imgList);
      this.axios.put('/hisServices/financialSupervision/projectTownshipHosp', this.proGageHandleData)
        .then(res => {
          if (res) {
            this.sideOneCurP = 1;
            this.breadList['1'].splice(1);
            this.$refs.gageUpload.clearFiles();
          }
        })
    }, // 提交处理卫计项目
    cancelGagePro () {
      this.sideOneCurP = 0;
      this.breadList['1'].splice(1);
      if (this.commentImgList.length) {
        this.$refs.gageUpload.clearFiles();
      }
    }, // 取消处理卫计项目
    cancelPro () {
      this.canRevisePro = false;
      if (this.commentImgList.length) {
        this.$refs.gageUpload1.clearFiles();
      }
    },
    delPic (index) {
      this.proGageHandleData.appendices.splice(index, 1);
    }, // 删除执行情况项目现场图片
    reviseGagePro () {
      this.canRevisePro = !this.canRevisePro;
      this.proGageHandleData.uid = this.proGageDetail.uid;
      this.proGageHandleData.actualAmount = this.proGageDetail.actualAmount;
      this.proGageHandleData.hospArriveTime = this.proGageDetail.hospArriveTime;
      this.proGageHandleData.finishSituation = this.proGageDetail.finishSituation;
      this.proGageHandleData.description = this.proGageDetail.description;
      this.proGageHandleData.appendices = Object.assign([], this.proGageDetail.appendices);
    }, // 修改卫计项目
    showProDetail (item) {
      this.commentImgList = [];
      this.canRevisePro = false;
      let params = {
        uid: item.projectTownshipHosp.uid
      }
      this.axios.get('/hisServices/financialSupervision/projectTownshipHosp', {params})
        .then(res => {
          if (res) {
            this.proGageDetail = res.data;
            this.proGageDetail.updateType = item.updateType;
            this.previewPictures(res.data.appendices, 'proE')
          }
        })
      this.sideOneCurP = 3;
      this.breadList['1'].push({name: '执行情况', sideType: 1, sideCurP: 3})
    },
    handleRemove (file, fileList) {
      // console.log('this.commentImgList', this.commentImgList.length)
      // console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.showPic(file.url)
    },
    beforeAvatarUpload (file) {
      if (this.commentImgList && this.commentImgList.length >= 6) {
        this.$message.warning('最多只能上传5张图片!');
        return false;
      }
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error('只能上传 JPG / PNG 格式图片!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 100MB!');
      }
      return isJPG && isLt;
    },
    uploadSucess (response, file, fileList) {
      this.commentImgList = fileList;
    }
  },
  watch: {
    sideOneCurP (e) {
      if (e === 0 || e === 1) {
        this.quotaNum = '';
        this.proYear = '';
        this.proName = '';
        this.getGageList();
      }
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
