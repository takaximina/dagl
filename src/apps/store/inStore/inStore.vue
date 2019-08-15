<template>
  <Card>
    <query-page ref="queryPage" :api="pageApi" :pageUrl="pageUrl" v-show="!modalShow" @add='add' :operation="operation"></query-page>
    <Drawer @on-visible-change="clearDarTbl" title="商品列表" v-model="showPdtList.show" :mask-style="{background:'rgba(0,0,0,0)'}" width="720">
      <query-page ref="drawer_table" :api="'BUSINESS'" :pageSize="15" :noEdit="true" :pageUrl="pdtUrl" @slt="selectPdt"></query-page>
    </Drawer>
    <div v-if="modalShow">
      <Row>
        <div style="line-height: 40px;">
          <b>{{ flag == '0' ? '新增' : flag == '1' ? '修改' : '查看'}}入库单</b>
          <div style="float: right">
            <Button size="large" type="info" v-if="isReadonly" @click="doPrint">打印</Button>
            &nbsp;
            <Button size="large" type="info" v-if="!isReadonly" @click="formSave">保存</Button>
            &nbsp;
            <Button size="large" type="info" v-if="thisSubmit" @click="confirmSubmit">提交</Button>
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
                <FormItem label="部门：">
                  <Select v-model="modalForm.deptId" :disabled="isReadonly" @on-change="changeDept" clearable >
                    <Option v-for="item in deptArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="经办人：">
                  <Select v-model="modalForm.personnelId" :disabled="isReadonly || !modalForm.deptId" clearable >
                    <Option v-for="item in personnelArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="仓库：">
                  <Select v-model="modalForm.warehouseId" :disabled="isReadonly">
                    <Option v-for="item in warehouseArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="往来单位：">
                  <Select v-model="modalForm.intercourseEntId" :disabled="isReadonly">
                    <Option v-for="item in intercourseEntArr" :value="item.entId" :key="item.entId">{{ item.entName }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="发票日期：">
                  <DatePicker v-model="modalForm.invoiceDate" type="date" placeholder="选择发票日期" style="width: 100%" :disabled="isReadonly"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="发票号码：">
                  <Input v-model="modalForm.invoiceNo" :disabled="isReadonly"/>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="入库类型：">
                  <Select v-model="modalForm.typeDict" :disabled="isReadonly">
                    <Option v-for="item in typeDictArr" :value="item.value" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="备注：">
                  <Input v-model="modalForm.remark" :disabled="isReadonly" type="textarea"
                         :autosize="{minRows: 1,maxRows: 3}"/>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="入库时间：">
                  <!--<DatePicker :readonly="true" type="date" v-model="modalForm.billDate" style="width: 100%"></DatePicker>-->
                  <DatePicker :disabled="isReadonly" type="date" v-model="modalForm.billDate" style="width: 100%"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12"  v-if="!isReadonly">
                <FormItem label="上传附件：">
                  <Upload :show-upload-list="false" :max-size="10240" :headers="uploadHeader" style="width: 100%;" :action="uploadUrl" :on-success="uploadSuccess">
                    <Button :disabled="isReadonly" style="width: 100%;" icon="ios-cloud-upload-outline">上传附件</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row v-if="fileList.length">
              <Col span="24">
                <FormItem label="附件列表：">
                  <div class="fileList">
                    <!--<a v-for="v in fileList" :href="v.value">{{v.name}}</a>-->
                    <Tag color="primary" v-for="(v ,i) in fileList" :key="i" closable @on-close="removeFile(v)">
                      <a target="_blank" :href=" fileUrl + v ">{{v | urlToName}}</a>
                    </Tag>
                  </div>
                </FormItem>
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
    <Modal
      v-model="SNModal"
      title="请扫描或输入商品序列号"
      @on-ok="saveSN"
      @on-cancel="SNList = [],autoAdd= false;">
      <!--<div>
        <div>
          <Input type="password" :disabled="isReadonly" v-model="snModel" ref="snInput" placeholder="输入序列号" autofocus @on-keydown.enter="addSn"/>
        </div>
        <div class="brs"></div>
        <div>
          <Tag v-for="v in SNList" :key="v.serialNo" :name="v.serialNo" :closable="!isReadonly" @on-close="closeSN">{{v.serialNo}}</Tag>
        </div>
        <div class="brs"></div>
        <div>总条数：{{ SNList.length }}</div>
      </div>-->
      <div>
        <div>自动递增：<i-switch v-model="autoAdd" @on-change="autoInc"></i-switch></div>
        <div class="brs"></div>
        <div v-show="!autoAdd">
          <Input type="password" :disabled="isReadonly" v-model="snModel" ref="snInput" placeholder="输入序列号" autofocus @on-keydown.enter="addSn"/>
        </div>
        <div v-show="autoAdd">
          序列号前缀：<Input v-model="autoSnStr" style="width: 100px;margin-right: 10px" placeholder="输入序列号前缀"/>
          自增起始：<Input v-model="autoSnOn" style="width: 50px;margin-right: 10px" placeholder="输入自增起始数量"/>
          递增数量：<InputNumber v-model="autoSnNum" style="width: 50px;margin-right: 10px" placeholder="输入递增数量"></InputNumber>
          <Button type="info" @click="autoAddSn">确定</Button>
        </div>
        <div class="brs"></div>
        <div>
          <Tag v-for="v in SNList" :key="v.serialNo" :name="v.serialNo" :closable="!isReadonly" @on-close="closeSN">{{v.serialNo}}</Tag>
        </div>
        <div class="brs"></div>
        <Row>
          总条数：{{ SNList.length }}
        </Row>
      </div>
    </Modal>
    <div v-show="false">
      <print-view ref="printView" :title="userInfo.entName+'<br/> 入库单 '"  :orderData="printData"></print-view>
    </div>
    <Modal
      v-model="ediInvoiceModal"
      :title="`修改 ${ediInvoice.billNo} 的发票信息`"
      @on-ok="saveNewInvoice"
      @on-cancel="closeInvoiceModal">
      <Form label-position="left" :label-width="100">
        <FormItem label="发票号">
          <Input v-model="newInvoiceNo"></Input>
        </FormItem>
        <FormItem label="发票时间">
          <DatePicker type="date" v-model="newInvoiceDate"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>

<script>
  import queryPage from '@/apps/components/query_pages'
  import pageTable from '@/apps/components/page_table'
  import pdtList from '@/apps/components/pdt_list'
  import printView from '@/apps/components/printView'
  import { forEach, autoNumber } from '@/libs/tools'
  import { mapGetters } from 'vuex'

  import { listDept, ListPersonnel, listWarehouse, addEnterBill, listIntercourseEnt, queryById, enterBillSubmit, enterBillRemove, enterBillUpdate, updateInvoiceNo } from "@/api/store/inStore";
  import { listAppDictValueByCode } from "@/api/application/dictionary";

  import { getUploadUrl, getUploadHeader, getFileUrl, removeFile } from "@/api/uploadFlie";

  import apiConfig from '@/config/config.json'

  export default {
    name: "inStore",
    components:{
      queryPage,pageTable,pdtList,printView
    },
    filters: {
      toFixed2(val) {
        if (isNaN(val)) return val;
        return val.toFixed(2);
      },
      urlToName( val ){
        if( !val ) return '';
        let arr = val.split('/');
        if( arr.length )
          return arr[arr.length-1];
        else
          return val
      }
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'token'
      ]),
      uploadUrl(){
        return getUploadUrl('BUSINESS', '/upload/add')
      },
      uploadHeader(){
        return getUploadHeader()
      },
      fileUrl(){
        return getFileUrl()
      }
    },
    mounted(){
      listDept( this.userInfo.entId ).then( res => {
        if(res && res.length)
          this.deptArr = res;
      });
      listWarehouse().then( res => {
        if(res && res.length)
          this.warehouseArr = res;
      });
      listAppDictValueByCode('enter.bill.type').then( res => {
        if(res && res.length)
          this.typeDictArr = res;
      });
      listIntercourseEnt().then( res => {
        if(res && res.length)
          this.intercourseEntArr = res;
      });
      console.log(this.uploadUrl);
    },
    data(){
      let this_ = this;
      return {
        inStoreForm: {},
        pageApi: 'BUSINESS',
        pageUrl: '/enterbill/queryByFilter',
        pdtUrl: '/inventory/queryInventorySkuByFilter',
        modalShow: false,
        operation: {
          title: '操作',
          width: 130,
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
              h('Button', {
                props: {size: 'small', type: 'info'},
                style: {marginRight: '5px'},
                on: {
                  click() {
                    this_.ediInvoiceNo(pms.row)
                  }
                }
              }, '修改发票'),
            ];
            if (pms.row.isSubmit == false) {
              btn.push(
                h('Button', {
                  props: {size: 'small'},
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
        modalForm: {
          billDate: new Date()
        },
        thisId: '',
        thisSubmit: false,

        deptArr: [],
        personnelArr: [],
        warehouseArr: [],
        typeDictArr: [],
        intercourseEntArr: [],

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
            title: '库位',
            align: 'left',
            width: 100,
            render: (h, params) => {
              return h('Input', {
                props: {
                  size: 'small',
                  value: params.row.storageLocation
                },
                on: {
                  'on-change'(event){
                    params.row.storageLocation = event.target.value;
                    this_.nptData[params.index] = params.row;
                  }
                }
              });
            }
          },
          {
            title: '出库价格',
            align: 'left',
            key: 'skuPrice',
            width: 100,
            render: (h, params) => {
              return h('span', {}, params.row.skuPrice? '￥ ' + params.row.skuPrice.toFixed(2): '');
            }
          },

          {
            title: '数量',
            align: 'left',
            key: 'packNumber',
            width: 100,
            render: (h, params) => {
              let disabled = this_.isReadonly || (  params.row.skuAttr && params.row.skuAttr.indexOf('扫码入库：是')>=0 );
              return h('InputNumber', {
                props: {
                  size: 'small',
                  value: params.row.packNumber,
                  min: 0,
                  step: 1,
                  disabled: disabled
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
            title: '入库价格',
            align: 'left',
            key: 'price',
            width: 100,
            render: (h, params) => {
              return h('InputNumber', {
                props: {
                  size: 'small',
                  value: params.row.price || 0,
                  min: 1,
                  step: 1,
                  disabled: this_.isReadonly || !params.row.isModify
                },
                style: {width: '100%'},
                on: {
                  'on-change'(val) {
                    params.row.price = val;
                    this_.nptData[params.index] = params.row;
                    this_.getPriceSum()
                  }
                }
              });
            }
          },
          {
            title: '小计',
            align: 'left',
            key: '',
            width: 100,
            render: (h, params) => {
              let str = params.row.price * params.row.packNumber
              return h('span', {}, '￥ ' + str);
            }
          },
          {
            title: '操作',
            align: 'left',
            width: 100,
            renderHeader(h,p){
              return h('span', {}, this_.isReadonly? '' : '操作')
            },
            render: (h, p) => {
              let btn = [
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'error',
                  },
                  style: {marginRight: '5px',display: this_.isReadonly? 'none' : 'inline-block'},
                  on: {
                    click() {
                      this_.delNpt(p.row);
                    }
                  }
                }, '删除')
              ];
              if( p.row.skuAttr && p.row.skuAttr.indexOf('扫码入库：是')>=0 ){
                btn.push(h('Button', {
                  props: {
                    size: 'small',
                    type: 'info',
                  },
                  // style: {display: this_.isReadonly? 'none' : 'inline-block'},
                  on: {
                    click() {
                      this_.SNListIndex = p.index;
                      this_.SNList = p.row.itemSns || [];
                      this_.SNModal = true;
                    }
                  }
                }, '条码'));
              }
              return h('div',{}, btn);
            }
          }
        ],

        priceSum: 0,
        printData: {},

        SNModal: false,
        SNList: [],
        SNListIndex: 0,
        SNSkuId: '',
        snModel: '',

        fileList: [],

        autoAdd: false,
        autoSnOn: '',
        autoSnStr: '',
        autoSnNum: 0,

        //修改发票
        ediInvoiceModal: false,
        ediInvoice: {},
        newInvoiceNo: '',
        newInvoiceDate: '',

      }
    },
    methods: {
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
      selectPdt(row) {
        if(!row || !row.skuId) return ;
        if (JSON.stringify(this.nptData).indexOf(JSON.stringify(row.skuId)) < 0) {
          let item = row;
          item.packNumber = 1;
          if( item.skuAttr && item.skuAttr.indexOf('扫码入库：是')>=0 )
            item.packNumber = 0;
          item.price = item.skuPrice;
          this.nptData.push(item);
          this.getPriceSum();
        } else {
          this.$Message.warning('该商品已在关联列表');
        }
      },
      back() {
        this.modalShow = false;
        this.showPdtList.show = false;
        this.modalForm = {
          billDate: new Date()
        };
        this.thisId = '';
        this.thisSubmit = false;
        this.priceSum = 0;
        this.nptData = [];
        this.flag = 0;
        this.$refs.mxTable.selected = '';
      },
      validateForm(){
        if(!this.modalForm.deptId){
          this.$Message.error('选择部门');
          return false;
        }
        if(!this.modalForm.intercourseEntId){
          this.$Message.error('选择往来单位');
          return false;
        }
        /*if(!this.modalForm.invoiceDate){
          this.$Message.error('选择发票日期');
          return false;
        }
        if(!this.modalForm.invoiceNo){
          this.$Message.error('输入发票号码');
          return false;
        }*/
        if(!this.modalForm.personnelId){
          this.$Message.error('选择经办人');
          return false;
        }
        if(!this.modalForm.typeDict){
          this.$Message.error('选择入库类型');
          return false;
        }
        if(!this.modalForm.warehouseId){
          this.$Message.error('选择仓库');
          return false;
        }
        return true
      },
      formSave( cbk ){
        if( !this.validateForm() ){
          return false;
        }
        let items = [];
        forEach(this.nptData, function (v, i) {
          let item = {
            amount: v.packNumber,
            price: v.price || 0,
            skuDesc: v.skuAttr,
            skuId: v.skuId,
            skuName: v.skuName,
            productClassName: v.productClassName,
            itemSns: v.itemSns,
            storageLocation: v.storageLocation
          };
          items.push(item);
        });
        let data = { ...this.modalForm };
        data.items = items;
        data.attachment = this.fileList.join('|') + '|';
        if(this.flag){
          enterBillUpdate(data).then( res => {
            if(!res) return;
            if(typeof cbk == 'function'){
              return cbk();
            }
            this.$Message.info('保存成功');
            this.$refs.queryPage.loadData(1);
          })
        }else{
          addEnterBill(data).then( res => {
            if(!res) return;
            this.modalForm.id = res;
            this.thisSubmit = true;
            this.thisId = res;
            this.flag = 1;
            if(typeof cbk == 'function'){
              return cbk();
            }
            this.$Message.info('保存成功');
            this.$refs.queryPage.loadData(1);
          })
        }
      },
      getPriceSum(){
        let sum = 0;
        forEach(this.nptData, function (v, i) {
          sum += v.price * v.packNumber;
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
          if( this.modalForm.personnelId ) delete this.modalForm.personnelId;
          this.personnelArr = res.respnoseData;
        })
      },
      del( row,key ){
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认将此入库单作废？</p>',
          onOk: () => {
            enterBillRemove( row[key] ).then(res => {
              if(!res) return ;
              this.$Message.info('作废成功');
              this.$refs.queryPage.loadData(1);
              this.back();
            })
          }
        });
      },
      edi( row,key, id ){
        this.flag = 1;
        queryById( row[key] || id ).then( res => {
          if (!res) return;
          this.changeDept( res.deptId );
          this.isReadonly = res.isSubmit;
          this.thisSubmit = !res.isSubmit;
          this.flag = res.isSubmit ? 2 : 1;
          let items = [];
          forEach(res.items, function (v, i) {
            let item = {
              packNumber: v.amount,
              price: v.price,
              skuAttr: v.skuDesc,
              productClassName: v.productClassName,
              skuId: v.skuId,
              skuName: v.skuName,
              itemSns: v.itemSns,
              storageLocation: v.storageLocation
            };
            items.push(item);
          });
          this.nptData = items;
          this.modalForm = res;
          this.thisId = res.id;
          this.fileList = res.attachment ? res.attachment.split('|').filter(v=>v) : [];
          this.modalShow = true;
          if( res.isSubmit ){
            this.printData = res;
          }
          this.getPriceSum();
        })
      },
      confirmSubmit(){
        this.$Modal.confirm({
          title: '提示！',
          content: '<p>保存并提交订单？</p>',
          onOk: () => {
            this.formSave( this.formSubmit )
          }
        });
      },
      formSubmit(){
        enterBillSubmit(this.modalForm.id).then( res => {
          if(!res) return;
          this.isReadonly = true;
          this.thisSubmit = false;
          this.$Message.info('提交成功');
          this.$refs.queryPage.loadData(1);
          this.edi( null, null, this.modalForm.id )
        })
      },
      doPrint(){
        this.$refs.printView.printBtn();
      },
      addSn(){
        if( !this.snModel ) return false;
        let item = {
          serialNo: this.snModel
        };
        let has = this.SNList.filter( v => {
          return v.serialNo == this.snModel
        });
        if( !has.length ) {
          this.SNList.push( item );
        }else{
          this.$Message.error('重复的序列号或者条码，请重新扫描或输入');
        }
        this.snModel = '';
        this.$refs.snInput.focus()
      },
      closeSN (event, name) {
        this.SNList = this.SNList.filter( item => {
          return item.serialNo != name
        })
      },
      saveSN(){
        if(this.isReadonly) return ;
        this.nptData[this.SNListIndex].itemSns = this.SNList;
        this.nptData[this.SNListIndex].packNumber = this.SNList.length;
        this.getPriceSum();
        this.SNList = [];
      },

      uploadSuccess( res ){
        if( res.code != 0 ) return this.$Message.error('上传失败：'+ res.message)
        this.fileList.push( res.data );
        // console.log( this.fileList )
      },
      removeFile( file ){
        this.fileList= this.fileList.filter( v => {
          return v != file
        })
        /*removeFile( file ).then( r => {
          if( !r )return;
          this.fileList= this.fileList.filter( v => {
            return v != file
          })
        })*/
      },

      autoInc(){
        this.SNList = [];
        this.autoSnOn = '';
        this.autoSnStr = '';
        this.autoSnNum = 0;
      },
      autoAddSn(){
        this.SNList = [];
        let sf = this;
        for( let i = 0; i< sf.autoSnNum; i++){
          let sn = sf.autoSnStr + autoNumber( sf.autoSnOn, i );
          sf.SNList.push({
            serialNo: sn
          })
        }
      },

      //修改发票
      ediInvoiceNo( row ){
        this.ediInvoice = row;
        this.ediInvoiceModal = true;
      },
      saveNewInvoice(){
        updateInvoiceNo({
          remark: this.ediInvoice.id,
          invoiceDate: this.newInvoiceDate,
          invoiceNo: this.newInvoiceNo,
        }).then( r => {
          if( !r ) return ;
          this.closeInvoiceModal();
          this.$Message.info( '修改成功' );
        })
      },
      closeInvoiceModal(){
        this.ediInvoiceModal = false;
        this.ediInvoice = {};
        this.newInvoiceNo = '';
        this.newInvoiceDate = '';
      }
    }
  }
</script>

<style scoped>

</style>
