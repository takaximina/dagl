<template>
  <Card>
    <div style="line-height: 40px;">
      <b>进销存明细报表</b>
    </div>
    <div style="margin-bottom: 20px">
      选择会计月： <DatePicker type="month" placeholder="选择会计月" format="yyyyMM" style="width: 210px" @on-change="changeMonth" @on-clear="clearMonth"></DatePicker>
      &nbsp;
      <Button type="primary" icon="md-refresh" @click="loadJxc(1)">刷新</Button>
      &nbsp;
      <Button type="primary" icon="md-download" @click="exportExcel">导出EXCEL</Button>
    </div>
    <page-table
      ref="jxcTable"
      :tabData="jxcData"
      :columns="jxcColumns"
      :noEdit="true"
      :border="true"
      :pagesize="5"
      :page="jxcPage"
      :total="jxcTotal"
      @page-change="loadJxc"
      @selected="sltJxc"
    ></page-table>
    <!--<Row>
      <Table :columns="jxcColumns" :data="jxcData" highlight-row size="small" border @on-current-change="sltJxc"></Table>
      <div class="brs"></div>
      <page style="float:right;" :page-size="5" :current="jxcPage" :total="jxcTotal" simple @on-change="loadJxc"/>
    </Row>-->
    <div v-if="modalShow">
      <Divider style="margin: 15px 0;"/>
      <Tabs type="card">
        <TabPane label="期初">
          <tabTable ref="initTable" :params="'init'" :skuId="skuId" :accountMonth="accountMonth"></tabTable>
        </TabPane>
        <TabPane label="入库">
          <tabTable ref="enterTable" :params="'enter'" :skuId="skuId" :accountMonth="accountMonth"></tabTable>
        </TabPane>
        <TabPane label="出库">
          <tabTable ref="outTable" :params="'out'" :skuId="skuId" :accountMonth="accountMonth"></tabTable>
        </TabPane>
      </Tabs>
    </div>
    <div v-show="false">
      <Table id="jxcTable" :columns="jxcColumns_" :data="bbData" :no-data-text="''" :no-filtered-data-text="''"></Table>
    </div>
  </Card>
</template>

<script>
  import pageTable from '@/apps/components/page_table'
  import tabTable from './tpl/tabTable'
  import { queryJXCByProduct, queryJXCDetail } from "@/api/store/report";
  import { toFixed2 } from "@/libs/tools";
  import excel from '@/libs/excel'

  export default {
    name: "report",
    components: {
      pageTable, tabTable
    },
    data(){
      return {
        modalShow: false,
        reportName: '',
        jxcData: [],
        jxcColumns: [
          {
            type: 'index',
            width: 35,
            align: 'center',
            title: '#'
          },{
            title: '类别',
            align: 'center',
            key: 'className'
          },{
            title: '品名',
            align: 'center',
            key: 'skuName'
          },{
            title: '仓库',
            align: 'center',
            key: 'warehouseName'
          },{
            title: '期初入库',
            align: 'center',
            children: [
              {
                title: '单价',
                align: 'right',
                width: 120,
                render(h, p){
                  let num = toFixed2(p.row.initMoney / p.row.initAmount);
                  return h( 'span', {}, num)
                }
              },{
                title: '数量',
                align: 'right',
                width: 120,
                key: 'initAmount'
              },{
                title: '金额',
                align: 'right',
                width: 120,
                key: 'initMoney'
              }
            ]
          },{
            title: '入库',
            align: 'center',
            children: [
              {
                title: '单价',
                align: 'right',
                render(h, p){
                  let num = toFixed2(p.row.enterMoney / p.row.enterAmount);
                  return h( 'span', {}, num)
                }
              },{
                title: '数量',
                align: 'right',
                key: 'enterAmount'
              },{
                title: '金额',
                align: 'right',
                key: 'enterMoney'
              }
            ]
          },{
            title: '出库',
            align: 'center',
            children: [
              {
                title: '单价',
                align: 'right',
                render(h, p){
                  let num = toFixed2(p.row.outMoney / p.row.outAmount);
                  return h( 'span', {}, num)
                }
              },{
                title: '数量',
                align: 'right',
                key: 'outAmount'
              },{
                title: '金额',
                align: 'right',
                key: 'outMoney'
              }
            ]
          },{
            title: '期末',
            align: 'center',
            children: [
              {
                title: '单价',
                align: 'right',
                render(h, p){
                  let num = toFixed2(p.row.endMoney / p.row.endAmount);
                  return h( 'span', {}, num)
                }
              },{
                title: '数量',
                align: 'right',
                key: 'endAmount'
              },{
                title: '金额',
                align: 'right',
                key: 'endMoney'
              }
            ]
          }
        ],
        jxcColumns_: [
          {
            type: 'index',
            width: 35,
            align: 'center',
            title: '#'
          },{
            title: '类别',
            align: 'center',
            key: 'className'
          },{
            title: '品名',
            align: 'center',
            key: 'skuName'
          },{
            title: '仓库',
            align: 'center',
            key: 'skuName'
          },{
            title: '期初',
            align: 'center',
            children: [
              {
                title: '单价',
                align: 'right',
                width: 120,
                render(h, p){
                  let num = toFixed2(p.row.initMoney / p.row.initAmount);
                  return h( 'span', {}, num)
                }
              },{
                title: '数量',
                align: 'right',
                width: 120,
                key: 'initAmount'
              },{
                title: '金额',
                align: 'right',
                width: 120,
                key: 'initMoney'
              }
            ]
          },{
            title: '入库',
            align: 'center',
            children: [
              {
                title: '单价',
                align: 'right',
                render(h, p){
                  let num = toFixed2(p.row.enterMoney / p.row.enterAmount);
                  return h( 'span', {}, num)
                }
              },{
                title: '数量',
                align: 'right',
                key: 'enterAmount'
              },{
                title: '金额',
                align: 'right',
                key: 'enterMoney'
              }
            ]
          },{
            title: '出库',
            align: 'center',
            children: [
              {
                title: '单价',
                align: 'right',
                render(h, p){
                  let num = toFixed2(p.row.outMoney / p.row.outAmount);
                  return h( 'span', {}, num)
                }
              },{
                title: '数量',
                align: 'right',
                key: 'outAmount'
              },{
                title: '金额',
                align: 'right',
                key: 'outMoney'
              }
            ]
          },{
            title: '期末',
            align: 'center',
            children: [
              {
                title: '单价',
                align: 'right',
                render(h, p){
                  let num = toFixed2(p.row.endMoney / p.row.endAmount);
                  return h( 'span', {}, num)
                }
              },{
                title: '数量',
                align: 'right',
                key: 'endAmount'
              },{
                title: '金额',
                align: 'right',
                key: 'endMoney'
              }
            ]
          }
        ],
        jxcPage: 0,
        jxcTotal: 0,
        skuId: '',
        accountMonth: 0,
        bbData: []
      }
    },
    methods: {
      loadJxc( page ){
        if( !this.accountMonth ) {
          this.jxcData = [];
          return
        }
        let data = {
          condition: {
            accountMonth: this.accountMonth,
          },
          pageIndex: page,
          pageSize: 5,
          searchText: ''
        };
        queryJXCByProduct( data ).then( res => {
          this.jxcData = res.respnoseData;
          this.jxcTotal =  res.resultCount;
          this.jxcPage = res.pageIndex;
        })
      },
      sltJxc( row ){
        this.skuId = row.skuId;
        this.modalShow = true;
      },
      back(){
        this.modalShow = false;
      },
      changeMonth(val){
        if(!val) return ;
        this.accountMonth = parseInt(val);
        this.loadJxc( 1 );
      },
      clearMonth(){
        this.accountMonth = 0;
      },
      exportExcel () {
        if( !this.accountMonth ) {
          this.jxcData = [];
          return  this.$Message.warning('请选择会计月')
        }
        let data = {
          condition: {
            accountMonth: this.accountMonth,
          },
          pageIndex: 1,
          pageSize: 100000,
          searchText: ''
        };
        queryJXCByProduct( data ).then( res => {
          this.bbData = res.respnoseData;
          this.$Message.loading({
            content: '正在导出...',
            duration: 2
          });
          setTimeout( function () {
            excel.export_table_to_excel('jxcTable', this.accountMonth+ '进销存报表.xlsx');
          }.bind(this), 2000)
        })
      }
    }
  }
</script>

<style scoped>

</style>
