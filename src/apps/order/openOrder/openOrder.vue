<template>
  <Card>
    <query-page ref="queryPage" :api="api" :pageUrl="pageUrl" v-show="!modalShow" @add='add' :operation="operation"></query-page>
    <Drawer @on-visible-change="clearDarTbl" title="商品列表" v-model="showPdtList.show" :mask-style="{background:'rgba(0,0,0,0)'}" width="720">
      <query-page ref="drawer_table" :api="pdtApi" :pageSize="15" :noEdit="true" :pageUrl="pdtUrl" @slt="selectPdt"></query-page>
    </Drawer>
    <div v-show="modalShow">
      <Row>
        <div style="line-height: 40px;">
          <b>订单： {{ flag == '0' ? ' 新增' : ''}}{{orderCode}}</b>
          <div style="float: right">
            <Button size="large" type="info" v-if="!isReadonly" @click="saveOrder">保存订单</Button>
            &nbsp;
            <Button size="large" type="primary" v-if="!isReadonly" @click="confirmOrder">提交订单</Button>
            &nbsp;
            <Button size="large" v-if="!isReadonly && flag" @click="del">删除订单</Button>
            &nbsp;
            <Button size="large" v-if="isReadonly" @click="cel">撤销订单</Button>
            &nbsp;
            <Button size="large" @click="back">返回</Button>
          </div>
        </div>
        <Divider style="margin: 15px 0;" />
      </Row>
      <div class="brs"></div>
      <Row :gutter="20">
        <Col span="24">
          <Form ref="modalForm" :model="modalForm" :label-width="100">
            <Row :gutter="10">
              <Col :lg="12" :sm="24">
                <FormItem label="客户：">
                  <Select ref="atSelect"
                    v-model="atVal" filterable clearable
                    :loading="ldgSlt" :disabled="isReadonly"
                    @on-query-change="queryChange"
                    @on-change="atChange"
                    @on-clear="clearAt">
                    <Option v-for="(v, i) in atData" :value="v.idGroup" :key="i" :label="v.custName || v.title">
                      <div class="cus-box" v-if="v.id">
                        <span>{{v.custName}}</span>
                        <span>联系人：{{v.primaryContactName}}</span>
                        <span>联系电话：{{v.primaryContactPhone}}</span>
                        <span v-if="v.objName">逝者姓名：{{v.objName}}</span>
                        <span v-if="v.objName">逝者证件：{{v.objCard}}</span>
                      </div>
                      <div class="cus-box" style="text-align: center" v-if="!v.id">
                        <span>{{v.title}}</span>
                      </div>
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :lg="12" :sm="24">
                <FormItem label="备注说明：">
                  <Input v-model="modalForm.remarks" type="textarea" :autosize="{minRows: 1,maxRows: 3}" :disabled="isReadonly"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col :lg="6" :sm="12">
                <FormItem label="逝者姓名：">
                  <Input disabled v-model="modalForm.objName"></Input>
                </FormItem>
              </Col>
              <Col :lg="6" :sm="12">
                <FormItem label="逝者证件：">
                  <Input disabled v-model="modalForm.objCard"></Input>
                </FormItem>
              </Col>
              <Col :lg="6" :sm="12">
                <FormItem label="联系人：">
                  <Input disabled v-model="modalForm.contactName"></Input>
                </FormItem>
              </Col>
              <Col :lg="6" :sm="12">
                <FormItem label="联系电话：">
                  <Input disabled v-model="modalForm.contactPhone"></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span="24">
          <div>
            <b>订单详情</b>
          </div>
          <div class="brs"></div>
          <page-table
            ref="pageTable"
            :tabData="nptData"
            :columns="nptColumns"
            :pagesize="pagesize"
            :page="page"
            :total="total"
            :noEdit="true"
            :noPage="true"
            :noDataText="'暂无商品'"
          ></page-table>
          <div></div>
          <div style="position: relative;top: -1px;z-index: 100;">
            <Button long size="large" v-if="!isReadonly" @click="addNpt" icon="md-add"><b>添加商品</b></Button>
          </div>
          <div class="brs"></div>
          <Row v-if="nptData.length">
            <div style="padding-right: 100px;text-align: right;line-height: 30px">
              <span style="color: #bbb">总价：</span>
              <span style="font-size: 24px;color: #e4393c">￥ {{sumPrice}}</span>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
  import queryPage from '@/apps/components/query_pages'
  import pageTable from '@/apps/components/page_table'
  import pdtList from '@/apps/components/pdt_list'
  import { forEach } from '@/libs/tools'
  import { queryPackItem } from "@/api/package"
  import { listByVagueParameter, customerList } from "@/api/customer"
  import { saveOrder, queryById, orderDelete, orderCancel, orderSubmit } from "@/api/order"
  import tbExpand from './tb_expand'

  export default {
    name: "orderPage",
    components:{
      queryPage,pageTable,pdtList,tbExpand
    },
    data(){
      let this_ = this;
      return {
        api: 'order',
        pdtApi: 'product',
        pageUrl:'/order/queryOrderByFilter',//
        pdtUrl: '/product/querySkuOrPackByView',
        atVal:'',
        ldgSlt: false,
        disDeath: true,
        atData: [],
        loading: false,
        modalShow: false,
        modalForm: {},
        nptData:[],
        nptColumns:[
          {
            type:'index',
            width: 30,
            align: 'center',
            title: '#'
          },
          {
            type: 'expand',
            width: 26,
            render: (h, params) => {
              return h( tbExpand , {
                props:{
                  list: params.row.products,
                  skuName:params.row.productName,
                  amount: params.row.chargeAmount
                },
                on: {
                  changeTime(d1, index){
                    params.row.products[index].chargeStartDate = d1[0];
                    params.row.products[index].chargeEndDate = d1[1];
                    this_.nptData[params.index] = params.row;
                  }
                }
              })
            }
          },
          {
            title: '商品',
            align:'left',
            key: 'productName',
            render: (h, params)=>{
              return h('div',{}, [
                h('div', {style: {float: 'left'}}, [
                  h('div', {'class':
                      {hasDesc: params.row.desc,noDesc: !params.row.desc}
                  }, [
                    h('span',{
                      style: {
                        fontSize: '14px',
                        marginTop:'2px',
                        marginRight: '5px'
                      },
                    },params.row.productName || params.row.packName),
                    (params.row.products && params.row.products.length) ?
                      h('icon',{
                        props:{
                          type:'md-albums',
                          size: 18
                        },
                        style: {
                          verticalAlign: 'sub'
                        }
                      }): ''
                  ]),
                  h('div', {
                    style: {fontSize: '12px', color: '#bbb',height: '21px', display: params.row.desc?'block':'none'}
                  }, params.row.desc)
                ]),
                h('div', {
                  style: {
                    float: 'right',lineHeight: '50px',
                    display: (params.row.productType == 'SERVICE_PRODUCT' || params.row.productType == 'RESOURCE_PRODUCT') ? 'block' : 'none'
                  }
                }, [
                  h('span', {}, '选择时间：'),
                  h('DatePicker',{
                    props: {
                      size: 'small',
                      type: 'datetimerange',
                      format: 'yyyy-MM-dd HH:mm',
                      value: [params.row.chargeStartDate, params.row.chargeEndDate]
                    },
                    style: {
                      width: '260px'
                    },
                    on: {
                      'on-change'(d1){
                        params.row.chargeStartDate = d1[0];
                        params.row.chargeEndDate = d1[1];
                        this_.nptData[params.index] = params.row;
                      }
                    }
                  })
                ])
              ])
            }
          },
          {
            title: '单价',
            width: 100,
            align:'right',
            key: 'price',
            render: (h, params) => {
              return h('div', {},'￥ '+ params.row.price.toFixed(2) )
            }
          },
          {
            title: '数量',
            width: 60,
            align:'center',
            key: 'chargeAmount',
            render: (h, params) => {
              return h('InputNumber', {
                props:{
                  size: 'small',
                  value: params.row.chargeAmount || 1,
                  min: 1,
                  step: 1,
                  disabled: this_.isReadonly
                },
                style: {width: '100%'},
                on:{
                  'input'(val){
                    params.row.chargeAmount = val || 1;
                    this_.nptData[params.index] = params.row;
                    this_.getSumPrice()
                  }
                }
              });
            }
          },
          {
            title: '小计',
            align:'right',
            width: 100,
            render: (h, params) => {
              return h('div', {},'￥ '+ (params.row.price * params.row.chargeAmount).toFixed(2) )
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            renderHeader: (h, p) => {
              return h('div' ,{
                style: {
                  display: this_.isReadonly ? 'none' : 'block'
                }
              } ,'操作')
            },
            render: (h, params) => {
              return h('Button', {
                props: {
                  size: 'small',
                  icon: 'md-remove',
                },
                style: {
                  display: this_.isReadonly ? 'none' : 'inline-block'
                },
                on: {
                  click() {
                    this_.delNpt(params.row);
                  }
                }
              });
            }
          }
        ],
        pagesize: 10,
        page: 1,
        total: 100,
        showPdtList:{show:false},
        sumPrice: 0,
        isReadonly: false,
        flag: 0,
        operation: {
          title:'操作',
          render( h, pms) {
            let btn = [
              h('Button',{
                props:{size: 'small', type: 'primary'},
                style: {marginRight: '10px'},
                on: {
                  click() {
                    this_.edi(pms.row, this_.$refs.queryPage.ParamsKey)
                  }
                }
              },'查看')
            ];
            if(pms.row.orderStatus == '未提交'){
              btn.push(
                h('Button',{
                  props:{size: 'small'},
                  style: {marginRight: '10px'},
                  on: {
                    click() {
                      this_.del(pms.row, this_.$refs.queryPage.ParamsKey)
                    }
                  }
                },'删除')
              )
            }else{
              btn.push(
                h('Button',{
                  props:{size: 'small'},
                  style: {marginRight: '10px'},
                  on: {
                    click() {
                      this_.cel(pms.row, this_.$refs.queryPage.ParamsKey)
                    }
                  }
                },'撤销')
              )
            }
            return h('div', {}, btn)
          }
        },
        orderId : '',
        orderCode: ''
      }
    },
    mounted(){
      this.loadAtData();
    },
    methods:{
      clearDarTbl( flag ){
        if(flag){
          this.$refs.drawer_table.focusIpt();
        }else{
          this.$refs.drawer_table.clearTable();
        }
      },
      loadAtData(val, dft){
        let data = {
          condition: {},
          pageIndex: 0,
          pageSize: 10,
          searchText: val || ''
        };
        customerList(data).then(res=>{
          let data = res.respnoseData;
          let atData = [];
          let addItem = {
            idGroup: 'add_item',
            custName: 'add_item_'+ val,
            title: '新增'
          };
          if(data.length){
            forEach(data, (v) => {
              if(v.deads && v.deads.length){
                forEach(v.deads, (k) => {
                  let item = {
                    id: v.id,
                    idGroup: v.id+k.id,
                    custName: v.custName,
                    primaryContactName: v.primaryContactName,
                    primaryContactPhone: v.primaryContactPhone,
                    objectId: k.id,
                    objName: k.name,
                    objCard: k.idNumber,
                  };
                  atData.push(item);
                })
              }else{
                let item = {
                  id: v.id,
                  idGroup: v.id,
                  custName: v.custName,
                  primaryContactName: v.primaryContactName,
                  primaryContactPhone: v.primaryContactPhone,
                  objectId: '',
                  objName: '',
                  objCard: '',
                };
                atData.push(item);
              }
            });
          }
          atData.push(addItem);
          this.atData = atData;
          if(dft){
            this.atVal = dft;
            this.atChange(dft)
          }
          this.ldgSlt = false;
        })
      },
      atChange(val){
        if(val == 'add_item'){
          const route = {
            name: 'params',
            meta: {
              title: `动态路由`
            }
          };
          // this.clearAt();
          this.$router.push(route);
          return this.$refs.atSelect.clearSingleSelect();
        }
        let this_ = this;
        forEach(this_.atData,function (v, i) {
            if(v.idGroup == val){
            this_.modalForm.buyerId = v.id;
            this_.modalForm.contactName = v.primaryContactName;
            this_.modalForm.contactPhone = v.primaryContactPhone;
            this_.modalForm.objectId = v.objectId;
            this_.modalForm.objName = v.objName;
            this_.modalForm.objCard = v.objCard;
            this_.modalForm.custName = v.custName;
            this_.disDeath = false;
            return false;
          }
        });
      },
      queryChange(val){
        this.ldgSlt = true;
        this.loadAtData(val)
      },
      clearAt(){
        this.modalForm = {};
        this.disDeath = true;
        this.loadAtData();
      },
      back(){
        this.modalShow = false;
        this.sumPrice = 0;
        this.showPdtList.show= false;
        this.modalForm = {};
        this.atVal = '';
        this.orderId = '';
        this.orderCode = '';
        this.nptData = [];
        this.$refs.atSelect.clearSingleSelect();
        this.$refs.pageTable.selected='';
      },
      add(){
        this.flag = 0;
        this.modalShow = true;
        this.isReadonly = false;
      },
      edi(row,key){
        this.flag = 1;
        queryById(key ? row[key] : row).then(res=>{
          if(!res) return;
          this.isReadonly = res.orderStatus == '已提交'? true : false;
          this.orderId = res.orderId;
          this.orderCode = res.orderCode;
          this.loadAtData(res.contactName, res.buyerId + res.objectId);
          this.modalForm.remarks = res.orderRemarks;
          this.modalForm.orderId = res.orderId;
          let dto = [];
          forEach(res.items,function (v, i) {
            if(v.skuId && !v.productPackId){
              let item = {...v};
              item.price = item.chargePrice;
              item._disableExpand = true;
              dto.push(item);
            }
            if(v.productPackId && !v.skuId){
              let item = {...v};
              item.price = item.chargePrice;
              item.products = [];
              forEach(res.items, (k) => {
                let item_ = {...k};
                item_.price = item_.chargePrice;
                if( k.productPackId && k.skuId && (k.productPackId == v.productPackId )){
                  item_.chargeAmount = item_.chargeAmount / item.chargeAmount;
                  item.products.push( item_ );
                }
              });
              item._expanded = true;
              dto.push(item);
            }
          });
          this.nptData = dto;
          this.sumPrice = res.chargeMoney.toFixed(2);
          // this.getSumPrice();
          this.modalShow = true;
        });
      },
      del(row,key){
        let this_ = this;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该订单？</p>',
          onOk: () => {
            orderDelete(key ? row[key] : this.orderId).then(res => {
              if(!res) return ;
              this_.$Message.info('删除成功');
              this_.back();
              this_.$refs.queryPage.loadData(1);
            })
          },
          onCancel: () => {
            // this.$Message.info('Clicked cancel');
          }
        });
      },
      cel(row,key){
        let this_ = this;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认撤销该订单？</p>',
          onOk: () => {
            orderCancel(key ? row[key]: this.orderId).then(res => {
              if(!res) return ;
              this_.$Message.info('撤销成功');
              this_.$refs.queryPage.loadData(1);
            });
          },
          onCancel: () => {
            // this.$Message.info('Clicked cancel');
          }
        });
      },
      selectPdt(row,key){
        if(!row || !row.skuOrPackId) return;
        if(JSON.stringify(this.nptData).indexOf(JSON.stringify(row.skuOrPackId))<0){
          let item = {};
          item.chargeAmount = 1;
          item.price = row.price;
          item.productName = row.skuOrPackName;
          item.packType = row.packType;
          item.desc = row.skuOrPackDesc;
          if(row.packType){
            item.productPackId = row.skuOrPackId;
            queryPackItem(row.skuOrPackId).then(res=>{
              item.products = [];
              forEach(res.packItemViewDTOS, (v) => {
                let item_ ={
                  attrs: [],
                  balancePrice: 0,
                  chargeAmount: v.packNumber,
                  price: v.packPrice,
                  productName: v.skuName,
                  productPackId: '',
                  skuId: v.skuId,
                  productType: v.productType
                };
                item.products.push(item_);
              });
              // item.products = res.packItemViewDTOS;
              item._expanded = true;
              console.log(item);
              this.nptData.push(item);
              this.getSumPrice();
            })
          }else{
            item.skuId = row.skuOrPackId;
            item.productType = row.productTypeEnum;
            item._disableExpand = true;
            this.nptData.push(item);
            console.log(item);
            this.getSumPrice();
          }
        }else{
          this.$Message.warning('该商品已在关联列表');
        }
      },
      saveOrder(back){
        if(this.isReadonly) return ;
        if(!this.atVal || !this.modalForm.objectId){
          return this.$Message.error('请选择客户及逝者')
        }
        let items = [];
        console.log(this.nptData)
        forEach(this.nptData,function (v, i) {
          let item = {
            chargeAmount: v.chargeAmount,
            remark: '',
            desc: v.desc,
            attrs:[],
            chargeEndDate: v.chargeEndDate,
            chargeStartDate: v.chargeStartDate,
          };
          v.productPackId && (item.productPackId = v.productPackId);
          v.skuId && (item.skuId = v.skuId);
          if(v.products && v.products.length){
            forEach(v.products,function (j, k ) {
              let pro = {
                chargeAmount: j.chargeAmount * v.chargeAmount,
                productPackId: v.productPackId,
                skuId: j.skuId || '',
                remark: '',
                chargeEndDate: j.chargeEndDate,
                chargeStartDate: j.chargeStartDate,
                attrs:[]
              };
              items.push(pro);
            })
          }
          // if( !item.skuid ) return ;
          items.push(item);
        });
        this.modalForm.items = [...items];
        let data = {...this.modalForm};
        delete data.objCard;
        delete data.objName;
        delete data.custName;
        saveOrder( data ).then(res => {
          if(!res) return;
          if(typeof back == 'function'){
            return back(res);
          }
          if(!this.flag){
            this.edi(res);
          }
          this.$Message.info('保存成功');
          this.$refs.queryPage.loadData(1);
        })
      },
      confirmOrder(){
        if(!this.atVal || !this.modalForm.objectId){
          return this.$Message.error('请选择客户及逝者')
        }
        this.$Modal.confirm({
          title: '提示！',
          content: '<p>确认保存并提交订单？</p>',
          onOk: () => {
            this.saveOrder( this.submitOrder )
          }
        });
      },
      submitOrder(id){
        this.orderId = id;
        orderSubmit(id).then(res => {
          if(!res) return;
          this.isReadonly = true;
          this.$Message.info('提交成功');
          this.$refs.queryPage.loadData(1);
        })
      },
      addNpt(){
        this.showPdtList.show= true;
      },
      delNpt(row){
        this.nptData = this.nptData.filter(v => {
          if( v.productPackId && v.productPackId !== row.productPackId ){
            return v
          }else if(v.skuId && v.skuId !== row.skuId){
            return v
          }
        })
        this.getSumPrice()
      },
      getSumPrice(){
        let sum = 0 ;
        this.nptData.map( v => {
          sum += v.price * v.chargeAmount;
        });
        this.sumPrice = sum.toFixed(2);
      }
    }
  }
</script>

<style lang="less">
  td.ivu-table-expanded-cell{
    padding: 0;
    border: 0;
    .ivu-table-wrapper{
      border: 0;
    }
  }
  .cus-box{
    line-height: 32px;
    span{
      margin-right: 15px;
      &:nth-child(2n+1){
        color: #aaa;
      }
      &:first-child{
        font-size: 14px;
        margin-right: 20px;
        color: #002240;
      }
    }
  }
  .cus-box-info{
    line-height: 32px;
    text-align: center;
    color: #2d8cf0;
    span{
      margin-right: 20px;
    }
  }
  .right-date-input{
    float: right;
  }
  .is-hide{
    display: none;
  }
  .ivu-table{
    overflow: visible !important;
  }
  .noDesc{
    line-height: 50px;
  }
  .hasDesc{
    height: 30px;
    line-height: 35px;
  }
</style>
