<template>
  <div>
    <Card>
      <query-page ref="queryPage" :api="pageApi" :pageUrl="pageUrl" :operation="operation" :noEdit="true"></query-page>
      <!--<Row style="padding: 10px 0">
        <Button @click="loadData"> 刷新 </Button>
      </Row>
      <Table :loading="loading" highlight-row disabled-hover size="small" :columns="columns" :data="data"></Table>-->
    </Card>
    <Modal
      v-model="modal"
      title="库存批次"
      :footer-hide="true"
      width="1500"
      @on-cancel="cancel">
      <page-table
        ref="pageTable"
        :tabData="dtlData"
        :columns="dtlColumns"
        :pagesize="10"
        :page="page"
        :total="total"
        :noEdit="true"
        @page-change="loadSkuDtl"
      ></page-table>
      <div slot="footer">
        <Button long @click="cancel">返回</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import pageTable from '@/apps/components/page_table'
  import queryPage from '@/apps/components/query_pages'
  import { queryAll, queryBySkuId } from "@/api/store/invQuery";

  export default {
    name: "invQuery",
    components: {
      pageTable, queryPage
    },
    data(){
      let this_ = this;
      return {
        pageApi: 'BUSINESS',
        pageUrl: '/inventory/queryAll',
        operation: {
          title: '操作',
          render(h, pms) {
            let btn = [
              h('Button', {
                props: {size: 'small', type: 'primary'},
                style: {marginRight: '5px'},
                on: {
                  click() {
                    this_.seeDtl(pms.row.skuId)
                  }
                }
              }, '查看'),
            ];
            return h('div', {}, btn)
          }
        },

        modal: false,
        sltId: '',
        dtlData: [],
        dtlColumns: [
          {
            title: '商品名称',
            key: 'skuName'
          },{
            title: '商品描述',
            key: 'skuDesc'
          },{
            title: '商品价格',
            width: 100,
            key: 'price'
          },{
            title: '批次数量',
            width: 100,
            key: 'amount'
          },{
            title: '冲销数量',
            width: 100,
            key: 'writeOffAmount'
          },{
            title: '时间',
            width: 100,
            key: 'billNo'
          },{
            title: '库位',
            width: 100,
            key: 'storageLocation'
          },{
            title: '客户',

            key: 'entName'
          }
        ],
        page: 0,
        total: 0,

      }
    },
    mounted(){
      // this.loadData();
    },
    methods: {
      loadData(){
        this.loading = true;
        queryAll().then( res => {
          this.data = res;
          this.loading = false;
        })
      },
      seeDtl( id ){
        this.modal = true;
        this.sltId = id;
        this.loadSkuDtl( 1 );
      },
      loadSkuDtl( page ){
        let data = {
          pageIndex: page,
          pageSize: 10,
          condition: { paramString: this.sltId }
        };
        queryBySkuId( data ).then( res => {
          this.dtlData = res.respnoseData;
          this.page = res.pageIndex + 1;
          this.total = res.resultCount;
        })
      },
      cancel(){
        this.sltId = '';
        this.modal = false;
        this.dtlData = [];
      }
    },
  }
</script>

<style scoped>

</style>
