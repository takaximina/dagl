<template>
  <Card>
    <query-page ref="queryPage" :api="pageApi" :pageUrl="pageUrl" v-show="!modalShow" @add='add' :operation="operation"></query-page>
    <Drawer @on-visible-change="clearDarTbl" title="商品列表" v-model="showPdtList.show" :mask-style="{background:'rgba(0,0,0,0)'}" width="720">
      <query-page ref="drawer_table" :api="'BUSINESS'" :pageSize="15" :noEdit="true" :pageUrl="pdtUrl" @slt="selectPdt"></query-page>
    </Drawer>
    <div v-if="modalShow">
      <Row>
        <div style="line-height: 40px;">
          <b>{{ flag == '0' ? '新增' : flag == '1' ? '修改' : '查看'}}出库单</b>
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
            <!--<Row :gutter="10">
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
            </Row>-->
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="出库类型：">
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
                <FormItem label="出库时间：">
                  <!--<DatePicker :readonly="true" type="date" v-model="modalForm.billDate" style="width: 100%"></DatePicker>-->
                  <DatePicker type="date" v-model="modalForm.billDate" style="width: 100%"></DatePicker>
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
          <div>
            <Input type="password" :disabled="isReadonly" autofocus v-model="proCode" @on-enter="entCode" placeholder="扫描或输入产品SN添加出库商品" style="width: 100%;"/>
          </div>
          <div class="brs"></div>
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
      v-model="snModal"
      title="序列号"
      @on-ok="entSn"
      @on-cancel="snModal = false">
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
          <Tag v-for="v in snList" :key="v.serialNo" :name="v.serialNo" :closable="!isReadonly" @on-close="closeSN">{{v.serialNo}}</Tag>
        </div>
        <div class="brs"></div>
        <Row>
          总条数：{{ snList.length }}
        </Row>
      </div>
      <!-- <div>
        <div>
          <Tag v-for="v in snList" :key="v.serialNo" :name="v.serialNo" :closable="!isReadonly" @on-close="closeSN">{{v.serialNo}}</Tag>
        </div>
      </div> -->
    </Modal>
    <div v-show="false">
      <print-view ref="printView" :title="userInfo.entName+' <br/> ' + ( modalForm.typeDict == 'product_line.out' ? '领料单': '出库单') "  :orderData="printData"></print-view>
    </div>
  </Card>
</template>

<script>
  import queryPage from '@/apps/components/query_pages'
  import pageTable from '@/apps/components/page_table'
  import pdtList from '@/apps/components/pdt_list'
  import printView from '@/apps/components/printView'
  import { forEach } from '@/libs/tools'
  import { mapGetters } from 'vuex'

  import { listDept, ListPersonnel, listWarehouse, listIntercourseEnt} from "@/api/store/inStore";
  import { addOutBill, queryById, outBillSubmit, outBillRemove, outBillUpdate, skuInfoQueryBySn } from "@/api/store/outStore"
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
        'userInfo'
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
      listAppDictValueByCode('out.bill.type').then( res => {
        if(res && res.length)
          this.typeDictArr = res;
      });
      listIntercourseEnt().then( res => {
        if(res && res.length)
          this.intercourseEntArr = res;
      })
    },
    data(){
      let this_ = this;
      return {
        inStoreForm: {},
        pageApi: 'BUSINESS',
        pageUrl: '/outbill/queryByFilter',
        pdtUrl: '/inventory/queryStockSkuByFilter',
        modalShow: false,
        autoSnStr:'',
        autoSnOn:'',
        autoSnNum:0,
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
            key: 'price',
            width: 100,
            render: (h, params) => {
              return h('span', {}, '￥ ' + isNaN(params.row.price)? params.row.price: params.row.price.toFixed(2));
            }
          },
          {
            title: '操作',
            align: 'left',
            width: 120,
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
                  style: {display: this_.isReadonly? 'none' : 'inline-block'},
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
                  style: {marginLeft: '5px'},
                  on: {
                    click() {
                      /*this_.SNListIndex = p.index;
                      this_.SNList = p.row.itemSns || [];
                      this_.SNModal = true;*/
                      this_.showSnList(p)
                    }
                  }
                }, '条码'));
              }
              return h('div', {}, btn);
            }
          }
        ],
        priceSum: 0,
        printData: {},
        proCode: '',
        snList: [],
        snListIndex: 0,
        nptRow: {},
        snModal: false,
        fileList: [],
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
      selectPdt(row, key) {
        if(!row || !row.skuId) return ;
        if (JSON.stringify(this.nptData).indexOf(JSON.stringify(row.skuId)) < 0) {
          let item = row;
          item.packNumber = 1;
          item.itemSns = [];
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
          this.$Message.error('选择出库类型');
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
            itemSns: v.itemSns
          };
          items.push(item);
        });
        let data = { ...this.modalForm };
        data.items = items;
        data.attachment = this.fileList.join('|') + '|';
        if(this.flag){
          outBillUpdate(data).then( res => {
            if(!res) return;
            if(typeof cbk == 'function'){
              return cbk();
            }
            this.$Message.info('保存成功');
            this.$refs.queryPage.loadData(1);
          })
        }else{
          addOutBill(data).then( res => {
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
      saveSN(){
        if(this.isReadonly) return ;
        this.nptData[this.SNListIndex].itemSns = this.SNList;
        this.nptData[this.SNListIndex].packNumber = this.SNList.length;
        this.getPriceSum();
        this.snList = [];
      },
      autoAddSn(){
        this.snList = [];
        let sf = this;
        for( let i = 0; i< sf.autoSnNum; i++){
          let sn = sf.autoSnStr + autoNumber( sf.autoSnOn, i );
          sf.snList.push({
            serialNo: sn
          })
        }
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
          content: '<p>确认将此出库单作废？</p>',
          onOk: () => {
            outBillRemove( row[key] ).then(res => {
              if(!res) return ;
              this.$Message.info('作废成功');
              this.back();
              this.$refs.queryPage.loadData(1);
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
              itemSns: v.itemSns
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
        outBillSubmit(this.modalForm.id).then( res => {
          if(!res) return;
          this.isReadonly = true;
          this.thisSubmit = false;
          this.$Message.info('提交成功');
          this.$refs.queryPage.loadData(1);
          this.edi( null, this.modalForm.id )
        })
      },
      doPrint(){
        this.$refs.printView.printBtn();
      },

      entCode(){
        const code = this.proCode;
        skuInfoQueryBySn( code ).then( r => {
          if( !r ) return;
          let ySku = this.nptData.filter( f => {
            return f.skuId == r.skuId
          });
          if( ySku.length ){
            let ySn = ySku[0].itemSns.filter( f=> {
              return f.serialNo == code;
            });
            if( !ySn.length ){
              ySku[0].itemSns.push({
                serialNo: code,
                skuId: r.skuId
              });
              ySku[0].packNumber ++ ;
            }
          }else{
            let item = r;
            item.packNumber = 1;
            item.itemSns = [];
            item.itemSns.push({
              serialNo: code,
              skuId: r.skuId
            });
            this.nptData.push(item)
          }
          this.proCode = '';
          this.getPriceSum();
        })
      },
      showSnList(index,row){
        this_.SNListIndex = p.index;
        this_.SNList = p.row.itemSns || [];
        this.nptRow = row;
        this.snList = row.itemSns;
        this.snModal = true;
      },
      closeSN (event, name) {
        this.snList = this.snList.filter( item => {
          return item.serialNo != name
        })
      },
      entSn(){
        let sf = this;
        sf.nptRow.itemSns = sf.snList;
        sf.nptRow.packNumber = sf.snList.length;
        forEach(sf.nptData , (v ,i) => {
          if( v.skuId == sf.nptRow.skuId ){
            sf.nptData[i] = sf.nptRow
          }
        })
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
    }
  }
</script>

<style scoped>

</style>
