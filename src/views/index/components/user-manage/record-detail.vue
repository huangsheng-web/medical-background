<template>
  <div>
    <div class="health-file">
      <div class="title"><i class="icon iconfont" style="margin-right: 10px;">&#xe68b;</i><span><router-link :to="{name: 'record-list', query: {id: this.$route.query.id}}" style="text-decoration: none;font-weight: bold;color: #333333;">关联健康档案</router-link>></span><span>健康档案详情</span></div>
      <div class="num"><span>档案编号：{{detail.cgrdaid}}</span><span>建档机构：{{detail.cjdjgmc}}</span></div>
      <div>
        <table border="1" cellpadding="3" cellspacing="0" bgcolor="#ffffff" bordercolor="#E8E8E8" style="width: 950px;border-collapse:collapse;">
          <tr>
            <td colspan="2" width="156px" class="label">姓名</td>
            <td width="156px">{{detail.cxm}}</td>
            <td width="156px" class="label">性别</td>
            <td width="156px">{{detail.cxbmc}}</td>
            <td width="156px" class="label">出生日期</td>
            <td width="156px">{{detail.dcsny && detail.dcsny.slice(0, 11)}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">身份证号</td>
            <td>{{detail.csfzh}}</td>
            <td class="label">其他证件名称</td>
            <td>{{detail.czjlx}}</td>
            <td class="label">其他证件号码</td>
            <td>{{detail.czjhm}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">医疗保险号</td>
            <td>{{detail.cylbxh}}</td>
            <td class="label">村（居）委会</td>
            <td>{{detail.cjzdJw !== null ? detail.cjzdJw : detail.cjzdCun}}</td>
            <td class="label">本人电话</td>
            <td>{{detail.cbrdh}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">联系人姓名</td>
            <td>{{detail.clxrxm}}</td>
            <td class="label">联系人电话</td>
            <td>{{detail.clxrdh}}</td>
            <td class="label">居住类型</td>
            <td>{{detail.cjzlx}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">常住类型</td>
            <td>{{detail.bhjbz === '0' ? '非户籍' : detail.bhjbz === '1' ? '户籍' : ''}}</td>
            <td class="label">血型</td>
            <td>{{detail.cxxmc}}</td>
            <td class="label">RH</td>
            <td>{{crhxxbm}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">民族</td>
            <td>{{detail.cmzmc}}</td>
            <td class="label">文化程度</td>
            <td>{{detail.cwhcd}}</td>
            <td class="label">婚姻状况</td>
            <td>{{detail.chymc}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">医疗费用支付方式</td>
            <td>{{detail.cylfyzfmc}}</td>
            <td class="label">职业</td>
            <td colspan="3">{{detail.cmqzymc}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">工作单位</td>
            <td colspan="5">{{detail.cgzdwmc}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">现住址</td>
            <td colspan="5">{{detail.cjtzz}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">户籍地址</td>
            <td colspan="5">{{detail.chkdz}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">药物过敏史</td>
            <td colspan="5">{{detail.cgmsmc}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">暴露史</td>
            <td colspan="5">{{detail.cblsmc}}</td>
          </tr>
          <tr>
            <td rowspan="4" style="width: 26px;" class="label">既往史</td>
            <td style="width: 112px;" class="label">疾病</td>
            <td colspan="5">{{jwjbsList}}</td>
          </tr>
          <tr>
            <td class="label">手术</td>
            <td colspan="5">{{jwsssList}}</td>
          </tr>
          <tr>
            <td class="label">外伤 </td>
            <td colspan="5">{{jwwssList}}</td>
          </tr>
          <tr>
            <td class="label">输血</td>
            <td colspan="5">{{jwsxsList}}</td>
          </tr>
          <tr>
            <td rowspan="2" class="label">家族史</td>
            <td class="label">父亲</td>
            <td colspan="2">{{jzjbsList(5)}}</td>
            <td class="label">母亲</td>
            <td colspan="2">{{jzjbsList(5)}}</td>
          </tr>
          <tr>
            <td class="label">兄弟姐妹</td>
            <td colspan="2">{{jzjbsList(7)}}</td>
            <td class="label">子女</td>
            <td colspan="2">{{jzjbsList(2)}}</td>
          </tr>
          <tr>
            <td colspan="2" class="label">遗传病史</td>
            <td colspan="2">{{detail.cycbsmc}}</td>
            <td class="label">残疾情况</td>
            <td colspan="2">{{detail.ccjqkmc}}</td>
          </tr>
          <tr>
            <td rowspan="3" class="label">生活环境</td>
            <td class="label">厕所</td>
            <td colspan="2">{{detail.ccsmc}}</td>
            <td class="label">厨房排风设施</td>
            <td colspan="2">{{detail.ccfpfssmc}}</td>
          </tr>
          <tr>
            <td class="label">燃料类型</td>
            <td colspan="2">{{detail.crllxmc}}</td>
            <td class="label">禽畜栏</td>
            <td colspan="2">{{detail.cqxlmc}}</td>
          </tr>
          <tr>
            <td class="label">饮水</td>
            <td colspan="2">{{detail.cysmc}}</td>
            <td></td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="2" class="label">农合号</td>
            <td>{{detail.cnhh}}</td>
            <td class="label">医疗卡号</td>
            <td>{{detail.cylkh}}</td>
            <td class="label">贫困人群</td>
            <td>{{detail.bknrq === '1' ? '是' : detail.bknrq === '0' ? '不是' : ''}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      listInfo: null, // 存放身份证号
      detail: {}
    }
  },
  mounted () {
    this.listInfo = this.$route.query.idcard;
    this.getHealthDetail();
  },
  computed: {
    // RH
    crhxxbm () {
      return this.detail.crhxxbm === '1' ? '阴性' : this.detail.crhxxbm === '2'
        ? '阳性' : this.detail.crhxxbm === '3'
          ? '不详' : this.detail.crhxxbm === '4'
            ? '未查' : '';
    },
    // 既往史 疾病
    jwjbsList () {
      if (this.detail && this.detail.jwjbsList && this.detail.jwjbsList.length === 0) {
        return '';
      } else {
        let value = '';
        if (this.detail && this.detail.jwjbsList) {
          this.detail.jwjbsList.forEach(item => {
            value += `${item.cjbmc}(确诊时间 ${item.dqzrq})、`
          })
        }
        return value;
      }
    },
    // 既往史 手术
    jwsssList () {
      if (this.detail && this.detail.jwsssList && this.detail.jwsssList.length === 0) {
        return '';
      } else {
        let value = '';
        if (this.detail && this.detail.jwsssList) {
          this.detail.jwsssList.forEach(item => {
            value += `${item.cssmc}(手术时间 ${item.dssrq})、`
          })
        }
        return value;
      }
    },
    // 既往史 外伤
    jwwssList () {
      if (this.detail && this.detail.jwwssList && this.detail.jwwssList.length === 0) {
        return '';
      } else {
        let value = '';
        if (this.detail && this.detail.jwwssList) {
          this.detail.jwwssList.forEach(item => {
            value += `${item.cwsmc}(受伤时间 ${item.dwsrq})、`
          })
        }
        return value;
      }
    },
    // 既往史 输血
    jwsxsList () {
      if (this.detail && this.detail.jwsxsList && this.detail.jwsxsList.length === 0) {
        return '';
      } else {
        let value = '';
        if (this.detail && this.detail.jwsxsList) {
          this.detail.jwsxsList.forEach(item => {
            value += `${item.csxyy}(输血时间 ${item.dsxrq})、`
          })
        }
        return value;
      }
    }
  },
  methods: {
    // 查询健康档案详情
    getHealthDetail () {
      this.axios.get('/hisServices/selfHelpSearch/healthFile/detail?patientIdCard=' + this.listInfo + '&channel=2')
        .then(res => {
          if (res) {
            console.log('healthDetail', res.data);
            this.detail = res.data;
          }
        })
    },
    // 家族史
    jzjbsList (type) {
      if (this.detail.jzjbsList && this.detail.jzjbsList.length === 0) {
        return '';
      }
      // 子女
      if (type === 2) {
        let value = '';
        if (this.detail && this.detail.jzjbsList) {
          this.detail.jzjbsList.filter(value => value.cgxdm === '2' || value.cgxdm === '3').forEach(item => {
            value += `${item.cjbmc}、`
          })
        }
        return value;
        // 父母
      } else if (type === 5) {
        let value = '';
        if (this.detail && this.detail.jzjbsList) {
          this.detail.jzjbsList.filter(value => value.cgxdm === '5').forEach(item => {
            value += `${item.cjbmc}、`
          })
        }
        return value;
        // 兄弟姐妹
      } else if (type === 7) {
        let value = '';
        if (this.detail && this.detail.jzjbsList) {
          this.detail.jzjbsList.filter(value => value.cgxdm === '7').forEach(item => {
            value += `${item.cjbmc}、`
          })
        }
        return value;
      }
    }
  }
}
</script>
<style scoped lang="less">
  .health-file{
    table{
      word-break:break-all;
      td{
        height: 44px;
        padding: 0 14px;
        color:rgba(74,74,74,1);
      }
      .label{
        background:rgba(250,250,250,1);
        box-shadow:0px 1px 0px 0px rgba(232,232,232,1),1px 0px 0px 0px rgba(232,232,232,1);
        color:rgba(0,0,0,1);
        font-weight: bold;
      }
      .active{
        border-bottom-color: #333;
      }
    }
    .num{
      margin-top: 30px;
      padding-bottom: 20px;
      span{
        margin-right: 40px;
      }
    }
  }
</style>
