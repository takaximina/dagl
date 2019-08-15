<template>
  <div>
    <info-table
      v-if="row.id && skuData.length"
      :title="'SKU'"
      :data="skuData"
      :columns="classColumns"
      :id="row.id"
      :noEdit="true"
      @table-selected="selected"
      @add-btn="add"
      @edi-btn="edi"
      @del-btn="del"
    >
    </info-table>
    <Modal
      v-model="skuModal"
      title="修改SKU"
      :footer-hide="true"
    >
      <Form ref="skuForm" :model="skuForm" :label-width="50">
        <FormItem label="名称" prop="skuName">
          <Input v-model="skuForm.skuName"></Input>
        </FormItem>
        <FormItem label="编码" prop="skuCode">
          <Input v-model="skuForm.skuCode"></Input>
        </FormItem>
        <FormItem label="价格" prop="salePrice">
          <Input v-model="skuForm.salePrice"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="skuSubmit" style="float: right">确定</Button>
          <Button type="text" @click="skuReset" style="float: right">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="toPackModal"
      title="商品正在使用，无法删除"
      width="300">
      <!--@on-ok="toPack(sltRow)">
      <p>查看相关打包品？</p>-->
    </Modal>
  </div>
</template>

<script>
  import {getRelativeTime,forEach,unique_} from '@/libs/tools'
  import infoTable from './infoTable'
  import { mapMutations } from 'vuex'
  import { listProductSKU, removeSku, updateSku, isCanRemoveSku } from '@/api/goods'
  import Main from '@/components/main'

  export default {
    name: "sku",
    components:{
      infoTable
    },
    props:{
      row: Object
    },
    watch:{
      row(n,o){
        if(n != o){
          this.loadTab();
        }
      }
    },
    data(){
      return {
        classColumns:[],
        skuData: [],
        sltRow: '',
        skuModal: false,
        skuForm:{
          skuName: '',
          skuCode: '',
          salePrice: ''
        },
        toPackModal: false
      }
    },
    mounted(){
      this.loadTab()
    },
    methods:{
      ...mapMutations([
        'addTag',
        'closeTag'
      ]),
      loadTab(){
        if(!this.row.id) return;
        let this_ = this;
        let tabClassColumns = [
          {
            title: '序号',
            width: 60,
            align:'center',
            type: 'index'
          },
          {
            title: '名称',
            align:'center',
            key: 'name'
          }
        ];
        listProductSKU(this.row.id).then(res => {
          if(!res) {
            this_.skuData = [];
            return;
          }
          let infoData = res;
          let classColumns = [];
          if(!infoData || !infoData.length){
            this_.skuData = [];
            return ;
          }
          forEach(infoData,function (v,i) {
            if(!v.skuAttrInfoList || !v.skuAttrInfoList.length){
              return ;
            }
            forEach(v.skuAttrInfoList,function (value,index) {
              let item = {
                title:  value.attrName,
                align:'center',
                key: value.attrId
              };
              tabClassColumns.push(item);
              v[value.attrId] = value.attrValueName.join(',')
            })
          });
          this_.skuData = infoData;
          tabClassColumns.push({
            title: '价格',
            align:'center',
            key: 'salePrice'
          });
          tabClassColumns.push({
            title: '数量',
            align:'center',
            key: 'amount'
          });
          tabClassColumns.push({
            title: '操作',
            width: 100,
            align:'center',
            render(h, p){
              return h('div', {}, [
                h('Button', {
                  props: {size: 'small'},
                  on: {
                    click(){
                      this_.edi( p.row )
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {size: 'small'},
                  on: {
                    click(){
                      this_.del( p.row )
                    }
                  }
                }, '删除'),
              ])
            }
          });
          this_.classColumns = unique_(tabClassColumns,'title');
        })
      },
      selected(row){},
      add(){},
      edi(row){
        this.skuModal = true;
        this.skuForm.skuName = row.name;
        this.skuForm.skuCode = row.skuCode;
        this.skuForm.salePrice = row.salePrice || '';
        this.skuForm.id = row.id;
      },
      del(row){
        // return this.toPack(row);
        isCanRemoveSku(row.id).then( res=> {
          if(!res){
            this.sltRow = row;
            return this.toPackModal = true;
          }
          this.$Modal.confirm({
            title: '警告！',
            content: '<p>确认删除该SKU？</p>',
            onOk: () => {
              removeSku( row.id ).then(res => {
                if(!res) return;
                this.$Message.info('删除成功');
                this.loadTab();
              })
            }
          });
        });
      },
      validate(){
        if( !this.skuForm.skuName ){
          return false;
        }
        if( !this.skuForm.salePrice ){
          return false;
        }
        return true
      },
      skuSubmit(){
        if( !this.validate() ){
          return this.$Message.error('请输入SKU名称和价格')
        }
        let data = {...this.skuForm};
        updateSku( data ).then(res => {
          if(!res ) return ;
          this.$Message.info('修改成功');
          this.loadTab();
        })
      },
      skuReset(){
        this.skuModal = false;
      },
      toPack(row){
        this.$router.push({
          name: 'package_query',
          query: { skuId: row.id },
        });
      }
    }
  }
</script>

<style scoped>

</style>
