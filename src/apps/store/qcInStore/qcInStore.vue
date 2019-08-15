<template>
  <Card>
    <query-page ref="queryPage" :api="pageApi" :pageUrl="pageUrl" v-show="!modalShow" @add='add' :operation="operation"></query-page>
    <Drawer @on-visible-change="clearDarTbl" title="商品列表" v-model="showPdtList.show" :mask-style="{background:'rgba(0,0,0,0)'}" width="720">
      <query-page ref="drawer_table" :api="'product'" :pageSize="15" :noEdit="true" :pageUrl="pdtUrl" @slt="selectPdt"></query-page>
    </Drawer>
    <div v-if="modalShow">
      <Row>
        <div style="line-height: 40px;">
          <b>{{ flag == '0' ? '新增' : flag == '1' ? '修改' : '查看'}}期初入库</b>
          <div style="float: right">
            <Button size="large" type="info" v-if="!isReadonly" @click="formSave">保存</Button>
            &nbsp;
            <Button size="large" type="info" v-if="thisSubmit" @click="formSubmit">提交</Button>
            &nbsp;
            <Button size="large" @click="back">返回</Button>
          </div>
        </div>
        <Divider style="margin: 15px 0;"/>
      </Row>
      <div class="brs"></div>
      <Row :gutter="20">
        <Col span="24">
          <Form ref="modalForm" :model="modalForm" :label-width="150">
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="会计月：">
                  <DatePicker @on-clear="clearMonth" @on-change="changeMonth" type="month" placeholder="选择会计月" format="yyyyMM" style="width: 100%" :disabled="isReadonly"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="仓库：">
                  <Select v-model="modalForm.warehouseId" :disabled="isReadonly">
                    <Option v-for="item in warehouseArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label=" "></FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span="24">
          <Row>
            <b>关联商品</b>
          </Row>
          <div class="brs"></div>
          <page-table
            ref="mxTable"
            :tabData="nptData"
            :columns="nptColumns"
            :noEdit="true"
            :noPage="true"
          ></page-table>
          <div style="position: relative;top: -1px;z-index: 100;">
            <Button long size="large" v-if="!isReadonly" @click="addNpt" icon="md-add"><b>添加商品</b></Button>
          </div>
          <div class="brs"></div>
          <Row style="line-height: 30px;">
            <div style="padding-right: 100px;text-align: right;line-height: 30px">
              <span style="margin-right: 20px;">
                总金额：<b style="font-size: 24px;color: #e4393c">{{priceSum | toFixed2}}</b>
              </span>
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
  import { mapGetters } from 'vuex'

  import { listDept, ListPersonnel, listWarehouse, addEnterBill, listIntercourseEnt } from "@/api/store/inStore";
  import { Add, queryById, Submit, Remove, Update } from "@/api/store/qcInStore";
  import { listAppDictValueByCode } from "@/api/application/dictionary";

  export default {
    name: "inStore",
    components:{
      queryPage,pageTable,pdtList
    },
    filters: {
      toFixed2(val) {
        if (isNaN(val)) return val;
        return val.toFixed(2);
      }
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
    },
    mounted(){
      listWarehouse().then( res => {
        if(res && res.length)
          this.warehouseArr = res;
      });
    },
    data(){
      let this_ = this;
      return {
        inStoreForm: {},
        pageApi: 'BUSINESS',
        pageUrl: '/initbill/queryByFilter',
        pdtUrl: '/product/querySkuByView',
        modalShow: false,
        operation: {
          title: '操作',
          render(h, pms) {
            let btn = [
              h('Button', {
                props: {size: 'small', type: 'primary'},
                style: {marginRight: '5px'},
                on: {
                  click() {
                    this_.edi(pms.row, this_.$refs.queryPage.ParamsKey)
                  }
                }
              }, '查看'),
            ];
            if (pms.row.isSubmit == false) {
              btn.push(
                h('Button', {
                  props: {size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click() {
                      this_.del(pms.row, this_.$refs.queryPage.ParamsKey)
                    }
                  }
                }, '作废')
              )
            }
            return h('div', {}, btn)
          }
        },
        showPdtList:{show:false},
        flag: 0,
        isReadonly: false,
        modalForm: {},
        thisId: '',
        thisSubmit: false,

        warehouseArr: [],

        nptData: [],
        nptColumns: [
          {
            type:'index',
            width: 20,
            title: '#'
          },
          {
            title: '商品',
            align: 'left',
            key: 'skuName',
            render: (h, params) => {
              return h('div', {}, [
                h('div', {
                  style: {
                    fontSize: '14px',
                    marginTop: '2px'
                  },
                }, params.row.skuName),
                h('div', {
                  style: {
                    fontSize: '12px',
                    color: '#9ea7b4'
                  },
                }, params.row.skuAttr || '')
              ])
            }
          },
          {
            title: '数量',
            align: 'left',
            key: 'packNumber',
            width: 100,
            render: (h, params) => {
              return h('InputNumber', {
                props: {
                  size: 'small',
                  value: params.row.packNumber || 1,
                  min: 1,
                  step: 1,
                  disabled: this_.isReadonly
                },
                style: {width: '100%'},
                on: {
                  'on-change'(val) {
                    params.row.packNumber = val;
                    this_.nptData[params.index] = params.row;
                    this_.getPriceSum()
                  }
                }
              });
            }
          },
          {
            title: '价格',
            align: 'left',
            key: 'skuPrice',
            width: 100,
            render: (h, params) => {
              return h('span', {}, '￥ ' + params.row.skuPrice.toFixed(2));
            }
          },
          {
            title: '操作',
            align: 'left',
            width: 60,
            renderHeader(h,p){
              return h('span', {}, this_.isReadonly? '' : '操作')
            },
            render: (h, p) => {
              return h('Button', {
                props: {
                  size: 'small',
                  type: 'error',
                },
                style: {display: this_.isReadonly? 'none' : 'inline-block'},
                on: {
                  click() {
                    this_.delNpt(p.row);
                  }
                }
              }, '删除');
            }
          }
        ],

        priceSum: 0
      }
    },
    methods: {
      changeMonth(val){
        this.modalForm.accountMonth = parseInt(val);
      },
      clearMonth(){
        delete this.modalForm.accountMonth;
      },
      add(){
        this.flag = 0;
        this.isReadonly = false;
        this.modalShow = true;
      },
      addNpt() {
        this.showPdtList.show = true;
      },
      delNpt(row) {
        forEach(this.nptData, (v, i) => {
          if (v.skuId == row.skuId) {
            delete this.nptData[i]
          }
        });
        this.nptData = this.nptData.filter(v => v)
      },
      clearDarTbl(){
        this.$refs.drawer_table.clearTable()
      },
      selectPdt(row, key) {
        if(!row || !row.skuId) return ;
        if (JSON.stringify(this.nptData).indexOf(JSON.stringify(row.skuId)) < 0) {
          let item = row;
          item.packNumber = 1;
          item.replacePriceEnum = 1;
          this.nptData.push(item);
          this.getPriceSum();
        } else {
          this.$Message.warning('该商品已在关联列表');
        }
      },
      back() {
        this.modalShow = false;
        this.showPdtList.show = false;
        this.modalForm = {};
        this.thisId = '';
        this.thisSubmit = false;
        this.priceSum = 0;
        this.nptData = [];
        this.flag = 0;
        this.$refs.mxTable.selected = '';
      },
      validateForm(){
        if(!this.modalForm.warehouseId){
          this.$Message.error('选择仓库');
          return false;
        }
        if(!this.modalForm.accountMonth){
          this.$Message.error('会计月');
          return false;
        }
        return true
      },
      formSave(){
        if( !this.validateForm() ){
          return false;
        }
        let items = [];
        forEach(this.nptData, function (v, i) {
          let item = {
            amount: v.packNumber,
            price: v.skuPrice || 0,
            skuDesc: v.skuAttr,
            skuId: v.skuId,
            skuName: v.skuName
          };
          items.push(item);
        });
        let data = { ...this.modalForm };
        data.items = items;
        if(this.flag){
          Update(data).then( res => {
            if(!res) return;
            this.$Message.info('保存成功');
            this.$refs.queryPage.loadData(1);
          })
        }else{
          Add(data).then( res => {
            if(!res) return;
            this.modalForm.id = res;
            this.thisSubmit = true;
            this.thisId = res;
            this.flag = 1;
            this.$Message.info('保存成功');
            this.$refs.queryPage.loadData(1);
          })
        }
      },
      getPriceSum(){
        let sum = 0;
        forEach(this.nptData, function (v, i) {
          sum += v.skuPrice * v.packNumber;
        });
        this.priceSum = sum;
      },
      async changeDept(val){
        if(!val){
          return this.personnelArr = [];
        }
        let data = {
          "condition": val,
          "pageIndex": 0,
          "pageSize": 9999,
        };
        await ListPersonnel( data ).then( res => {
          this.personnelArr = res.respnoseData;
        })
      },
      del( row,key ){
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认将此入库单作废？</p>',
          onOk: () => {
            Remove( row[key] ).then(res => {
              if(!res) return ;
              this.$Message.info('作废成功');
              this.back();
              this.$refs.queryPage.loadData(1);
            })
          }
        });
      },
      edi( row,key ){
        this.flag = 1;
        queryById( row[key] ).then( res => {
          if (!res) return;
          this.changeDept( res.deptId );
          this.isReadonly = res.isSubmit;
          this.thisSubmit = !res.isSubmit;
          this.flag = res.isSubmit ? 2 : 1;
          let items = [];
          forEach(res.items, function (v, i) {
            let item = {
              packNumber: v.amount,
              skuPrice: v.price,
              skuAttr: v.skuDesc,
              skuId: v.skuId,
              skuName: v.skuName
            };
            items.push(item);
          });
          this.nptData = items;
          this.modalForm = res;
          this.thisId = res.id;
          this.modalShow = true;
          this.getPriceSum();
        })
      },
      formSubmit(){
        Submit(this.modalForm.id).then( res => {
          if(!res) return;
          this.isReadonly = true;
          this.thisSubmit = false;
          this.$Message.info('提交成功');
          this.$refs.queryPage.loadData(1);
        })
      },
    }
  }
</script>

<style scoped>

</style>
