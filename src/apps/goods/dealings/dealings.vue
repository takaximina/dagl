<template>
  <Card>
    <query-page ref="queryPage" :api="pageApi" :pageUrl="pageUrl" v-show="!modalShow" @add='add' :operation="operation"></query-page>
    <div v-if="modalShow">
      <Row>
        <b v-if="!flag"> 新增往来单位 </b>
        <b v-if="flag"> 修改往来单位: {{ dataForm.entName }} </b>
      </Row>
      <Divider style="margin: 15px 0;"/>
      <div class="brs"></div>
      <div style="width: 500px">
        <Form :model="dataForm" label-position="left" :label-width="120">
          <FormItem label="单位名称：">
            <Input v-model="dataForm.entName"></Input>
          </FormItem>
          <FormItem label="联系人：">
            <Input v-model="dataForm.linkMan"></Input>
          </FormItem>
          <FormItem label="联系电话：">
            <Input v-model="dataForm.telephone"></Input>
          </FormItem>
          <FormItem label="联系地址：">
            <Input v-model="dataForm.address"></Input>
          </FormItem>
          <FormItem label="企业编码：">
            <Input v-model="dataForm.entCode"></Input>
          </FormItem>
          <FormItem label="单位类型：">
            <Select v-model="dataForm.partnerType">
              <Option v-for="v in partnerType" :value="v.name" :key="v.name">{{ v.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="formSave">保存</Button>
            <Button @click="back" style="margin-left: 8px">返回</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </Card>
</template>

<script>
  import queryPage from '@/apps/components/query_pages'
  import { addPartner, removePartner, updatePartner, queryByPartnerId } from "@/api/goods";
  import { contextEnumsByApiType } from "@/api/context";

  export default {
    name: "dealings",
    components:{
      queryPage
    },
    data(){
      let this_ = this;
      return {
        pageApi: 'product',
        pageUrl: '/partner/queryByFilter',
        modalShow: false,
        flag: 0,
        operation: {
          title: '操作',
          width: 120,
          render(h, pms) {
            let btn = [
              h('Button', {
                props: {size: 'small', type: 'primary'},
                style: {marginRight: '5px'},
                on: {
                  click() {
                    this_.edi( pms.row.id )
                  }
                }
              }, '查看'),
              h('Button', {
                props: {size: 'small', type: 'error'},
                style: {marginRight: '5px'},
                on: {
                  click() {
                    this_.del( pms.row.id )
                  }
                }
              }, '删除'),
            ];
            return h('div', {}, btn)
          }
        },
        partnerType: [],
        dataForm: {}
      }
    },
    created(){
      contextEnumsByApiType('product', 'com.ebs.business.product.core.enumeration.PartnerTypeEnum').then( res => {
        if( res )
          this.partnerType = res
      })
    },
    methods:{
      add(){
        this.flag = 0;
        this.modalShow = true;
      },
      back(){
        this.modalShow = false;
        this.dataForm = {};
        this.$refs.queryPage.loadData(1);
      },
      formValidate(){
        if( !this.dataForm.entName ){
          this.$Message.error('请输入往来单位名称');
          return false;
        }
        if( !this.dataForm.partnerType ){
          this.$Message.error('请选择往来单位类型');
          return false;
        }
        return true
      },
      formSave(){
        if( !this.formValidate() ){
          return false;
        }
        if( this.flag ){
          updatePartner( this.dataForm ).then( res => {
            if( res ){
              this.$Message.info('保存成功');
              this.back()
            }
          })
        }else {
          addPartner( this.dataForm ).then( res => {
            if( res ){
              this.$Message.info('保存成功');
              this.back()
            }
          })
        }
      },
      edi( id ){
        queryByPartnerId( id ).then( res => {
          if(res){
            this.flag = 1;
            this.dataForm = res;
            this.modalShow = true;
          }
        })
      },
      del( id ){
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除？删除后无法恢复！</p>',
          onOk: () => {
            removePartner( id ).then(res => {
              if(!res) return ;
              this.$Message.info('删除成功');
              this.back();
            })
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
