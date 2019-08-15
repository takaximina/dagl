<template>
  <page-table
    ref="mxTable"
    :tabData="data"
    :columns="columns"
    :noEdit="true"
    :border="true"
    :pagesize="size"
    :page="page"
    :total="total"
    @page-change="loadData"
  ></page-table>
</template>

<script>
  import pageTable from '@/apps/components/page_table';
  import { queryJXCDetail } from "@/api/store/report";
  import { getDateToStr, toFixed2 } from "@/libs/tools";
  export default {
    name: "tabTable",
    components: {
      pageTable
    },
    props: {
      params: String,
      skuId: String,
      accountMonth: Number
    },
    data(){
      return {
        data: [],
        columns: [
          {
            title: '#',
            type: 'index',
            align: 'center',
            width: 35
          },{
            title: '品名',
            align: 'center',
            key: 'skuName',
          },{
            title: '日期',
            align: 'center',
            key: 'skuName',
            render(h, p){
              let str = getDateToStr( p.row.billDate);
              return h('span',{},str)
            }
          },{
            title: '单号',
            align: 'center',
            key: 'billNo'
          },{
            title: '价格',
            align: 'right',
            key: 'price'
          },{
            title: '数量',
            align: 'right',
            key: 'amount'
          },{
            title: '金额',
            align: 'right',
            render( h, p){
              let str = p.row.price * p.row.amount;
              return h( 'span', {}, str)
            }
          },{
            title: '经办人',
            align: 'center',
            key: 'billPersonnelName'
          },{
            title: '经办部门',
            align: 'center',
            key: 'deptName'
          },{
            title: this.params == 'out'?'出库类别':'入库类别',
            align: 'center',
            key: 'typeDictDesc'
          }
        ],
        page: 0,
        size: 5,
        total: 0
      }
    },
    watch: {
      skuId(val){
        this.loadData(1);
      }
    },
    mounted(){
      this.loadData(1);
    },
    methods: {
      loadData( page ){
        let data = {
          condition: {
            skuId: this.skuId,
            typeEnum: this.params,
            accountMonth: this.accountMonth
          },
          pageIndex: page,
          pageSize: this.size,
          searchText: ''
        };
        queryJXCDetail( data ).then( res => {
          this.data = res.respnoseData;
          this.total =  res.resultCount;
          this.page = res.pageIndex;
        })
      },
    }
  }
</script>

<style scoped>

</style>
