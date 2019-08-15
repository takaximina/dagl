<template>
  <div>
    <div>
      <Button @click="printBtn">打印</Button>
      <!--<Button v-print="'#printBox'">打印</Button>-->
    </div>
    <div class="print-box" id="printBox">
      <div class="print-main">
        <div id="printTitle"
             style="box-sizing: border-box;text-align: center;height: 60px;display: table-cell;vertical-align: middle;width: 690px;">
          <span v-html="title" style="font-size: 20px;font-weight: bold"></span></div>
        <div id="printHeader" class="print-item clear-fix">
          <div class="print-item-row" style="width: 530px;">仓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库：{{orderData.warehouseName}}</div>
          <div class="print-item-row" style="width: 160px;">单号：{{orderData.billNo}}</div>
          <div class="print-item-row" style="width: 330px;">往来单位：{{orderData.intercourseEntName ||''}}</div>
          <div class="print-item-row" style="width: 200px;">部门：{{orderData.deptName}}</div>
          <div class="print-item-row" style="width: 160px;">日期：{{orderData.billDate || '' | toDate}}</div>
        </div>
        <div class="print-item clear-fix">
          <!--<Table :columns="columns" :data="data" size="small"></Table>-->
          <div class="print-table">
            <div id="printTbHead" class="print-table-head clear-fix">
              <div class="print-table-td"><span>#</span></div>
              <div class="print-table-td"><span>品类</span></div>
              <div class="print-table-td"><span>品名</span></div>
              <div class="print-table-td"><span>规格</span></div>
              <!--<div class="print-table-td"><span>价格</span></div>-->
              <div class="print-table-td"><span>数量</span></div>
              <!--<div class="print-table-td"><span>金额</span></div>-->
            </div>
            <div id="printTbBody" class="print-table-tBody">
              <div class="print-table-body clear-fix" v-for="(v, i) in orderData.items">
                <div class="print-table-td"><span>{{ i + 1 }}</span></div>
                <div class="print-table-td"><span>{{ v.productClassName }}</span></div>
                <div class="print-table-td"><span>{{ v.skuName }}</span></div>
                <div class="print-table-td"><span>{{ v.skuDesc }}</span></div>
                <!--<div class="print-table-td"><span>￥ {{ v.price | toFixed2}}</span></div>-->
                <div class="print-table-td"><span>{{ v.amount }}</span></div>
                <!--<div class="print-table-td"><span>￥ {{ v.price * v.amount | toFixed2 }}</span></div>-->
              </div>
            </div>
          </div>
        </div>
        <div id="printFooter" class="print-item print-item-footer clear-fix">
          <!--<div class="clear-fix"
               style="box-sizing: border-box;height: 30px;line-height: 28px;border-bottom: 1px solid #111;font-size: 12px;">
            <div style="width: 540px;float: left;text-align: right">合计：</div>
            <div style="width: 60px;float: left;text-align: right"> {{ sumAmount }}</div>
            <div style="width: 90px;float: left;text-align: right">￥ {{ sumPrice | toFixed2}}</div>
          </div>-->
          <div style="box-sizing: border-box;height: 3px; border-bottom: 1px solid #111;"></div>
          <div class="print-item-row">
            制单： {{orderData.submitPersonnelName}} [ {{orderData.createdDate | getDateToStr}} ]
          </div>
          <div class="print-item-row">
            经办： {{orderData.personnelName}}
          </div>
          <div class="print-item-row">
            审核： {{orderData.submitPersonnelName}} [ {{orderData.submitDate | getDateToStr}} ]
          </div>
          <div class="print-item-row">
            打印： {{userInfo.userName}} [ {{ date }} ]
          </div>
          <div class="print-item-row">
            经办人签字：<span style="text-decoration: underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
        <div style="text-align: center">【 第 1 页 &nbsp; / &nbsp; 共 1 页 ，共 1 条】</div>
      </div>
    </div>
  </div>

</template>

<script>
  import print from 'print-js'
  import {getLodop} from "@/libs/lodopFuncs";
  import {forEach, getNewDate, getDateToStr} from "@/libs/tools";
  import { mapGetters } from 'vuex'

  export default {
    name: "printView",
    props: {
      title: String,
      orderData: Object
    },
    filters: {
      toDate(v) {
        if ( v )
          return getNewDate( new Date(v), 1);
        else
          return '';
      },
      getDateToStr(v) {
        if (!v) return '';
        return getDateToStr(v)
      },
      toFixed2(val) {
        if (isNaN(val) || !val) return val;
        return val.toFixed(2);
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
      sumAmount() {
        if (!this.orderData.items) return '';
        let sum = 0;
        forEach(this.orderData.items, function (v, i) {
          sum += v.amount;
        });
        return sum;
      },
      sumPrice() {
        if (!this.orderData.items) return '';
        let sum = 0;
        forEach(this.orderData.items, function (v, i) {
          sum += v.price * v.amount;
        });
        return sum;
      }
    },
    data() {
      return {
        date: ''
      }
    },
    mounted() {
      let this_ = this;
      this.timer = setInterval(function () {
        this_.date = getNewDate();
      }, 1000);
    },
    methods: {
      printBtn() {
        this.createLodop();
      },
      createLodop() {
        let LODOP = getLodop();
        LODOP.SET_PRINT_PAGESIZE(0, 2410, 1400);

        let strBodyStyle = "<style>" + document.getElementById("printStyle").innerHTML + "</style>";
        let title = document.getElementById("printTitle").outerHTML;
        let header = strBodyStyle + "<body>" + document.getElementById("printHeader").outerHTML + "</body>";
        let footer = strBodyStyle + "<body>" + document.getElementById("printFooter").outerHTML + "</body>";
        let tHead = strBodyStyle + "<body>" + document.getElementById("printTbHead").outerHTML + "</body>";
        let tBody = document.getElementById('printTbBody').childNodes;
        for (let i = 0, index = 0; i < tBody.length; i += 6, index++) {
          let html = '';
          for (let a = i; a < i + 6; a++) {
            if (a < tBody.length)
              html += tBody[a].outerHTML;
          }
          let sum = Math.ceil(tBody.length / 6);
          let page = `<div style="width: 230px;font-size: 12px;line-height: 25px">【 第 ${index + 1} 页 &nbsp; / &nbsp; 共 ${sum} 页，共 ${tBody.length} 条 】</div>`;
          LODOP.NewPage();
          LODOP.ADD_PRINT_HTM(30, 40, 700, 60, title);
          LODOP.ADD_PRINT_HTM(90, 40, 700, 60, header);
          LODOP.ADD_PRINT_HTM(150, 40, 700, 30, tHead);
          LODOP.ADD_PRINT_HTM(180, 40, 700, 210, strBodyStyle + "<body>" + html + "</body>");
          LODOP.ADD_PRINT_HTM(390, 40, 700, 85, footer);
          LODOP.ADD_PRINT_HTM(448, 500, 190, 25, page);
        }
        LODOP.PREVIEW();
      },
      beforeDestroy() {
        if (this.timer) {
          clearInterval(this.timer);
        }
      }
    }
  }
</script>
