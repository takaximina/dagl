<template>
  <div class="pdt-list" v-bind:class="{active: isShow.show}">
    <div style="text-align: center">
      <Button @click="back" type="text" style="float: left" size="small" icon="md-close"></Button>
      <div class="brs"></div>
      <div class="brs"></div>
      <div class="brs"></div>
      <b>商品列表</b>
    </div>
    <div style="margin: 10px 10px;">
      <Input v-model="val" @on-change="loadData(1)">
        <Button slot="append" icon="ios-search" @click="loadData(1)"></Button>
      </Input>
      <div class="brs"></div>
      <page-table
        :tabData="pdtData"
        :columns="pdtColumns"
        :pagesize="pagesize"
        :page="page"
        :total="total"
        :noEdit="true"
        @page-change="pageChange"
        @selected="selectPdt"
      ></page-table>
    </div>
  </div>
</template>

<script>
  import pageTable from '@/apps/components/page_table'
  import { listSkuBySkuName } from '@/api/goods'
  import { forEach } from '@/libs/tools'
  export default {
    name: "pro_list",
    components:{
      pageTable
    },
    props: {
      isShow: Object
    },
    data() {
      return {
        val : '',
        pdtData:[],
        pdtColumns:[
          {
            title: '商品名',
            align:'center',
            key: 'sKUName'
          },
          {
            title: '价格',
            align:'center',
            key: 'salePrice'
          }
        ],
        pagesize: 15,
        page: 1,
        total: 0
      }
    },
    mounted(){
      this.loadData(1)
    },
    methods:{
      loadData(page){
        let this_ = this;
        let data= {
          page: page,
          param: this_.val,
          size: this_.pagesize
        };
        listSkuBySkuName(data).then(res=>{
          if( !res )
            return ;
          let pageList = res.pageList;
          this_.total = pageList.totalElements;
          this_.page = pageList.page+1;
          this_.pdtData = res.skuList;
        })
      },
      pageChange(page){
        this.loadData(page)
      },
      selectPdt(row){
        this.$emit('selectPdt',row)
      },
      back(){
        this.isShow.show = false;
        this.$emit('leftMove',false);
        this.val = '';
        this.loadData(1)
      }
    }
  }
</script>

<style lang="less">
  .pdt-list{
    position: absolute;
    top: -25px;
    right: -375px;
    width: 350px;
    bottom: auto;
    transition: right .3s;
    background: #fff;
    border-left: #eee;
    overflow: auto;
    &.active{
      right: -375px;
    }
  }
</style>
