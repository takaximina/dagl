<template>
  <Card>
    <query-page ref="queryPage" :api="api" :operation="operation" :pageUrl="pageUrl" @add='add'
                v-show="!modalShow"></query-page>
    <Drawer title="商品列表" v-model="showPdtList.show" :mask-style="{background:'rgba(0,0,0,0)'}" width="720">
      <query-page @on-close="clearDarTbl" ref="drawer_table" :pageSize="15" :noEdit="true" :api="api" :pageUrl="pdtUrl" @slt="selectPdt"></query-page>
    </Drawer>
    <div v-show="modalShow">
      <Row>
        <div style="line-height: 40px;">
          <b>{{ flag == '0' ? '新增' : flag == '1' ? '修改' : '查看'}}打包品</b>
          <div style="float: right">
            <Button size="large" type="info" v-if="!isReadonly" @click="submitPack">保存</Button>
            &nbsp;
            <Button size="large" @click="back">返回</Button>
          </div>
        </div>
        <Divider style="margin: 15px 0;"/>
      </Row>
      <div class="brs"></div>
      <Row :gutter="20">
        <Col span="24">
          <Form ref="modalForm" :model="modalForm" :rules="ruleCustom" :label-width="150">
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="名称：" prop="packName">
                  <Input type="text" :disabled="isReadonly" v-model="modalForm.packName"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="描述：" prop="describe">
                  <Input v-model="modalForm.describe" :disabled="isReadonly" type="textarea"
                         :autosize="{minRows: 1,maxRows: 3}"/>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="折扣率(%)：" prop="discountRate">
                  <InputNumber
                    @on-change="changeDiscountRate"
                    v-model="discountRate"
                    :min="1"
                    :step="1"
                    :disabled="isReadonly"
                    :formatter="value => `${value.toFixed(2)}%`"
                    :parser="value => value.replace('%', '')"
                  ></InputNumber>
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
            ref="pageTable"
            :tabData="nptData"
            :columns="nptColumns"
            :pagesize="pagesize"
            :page="page"
            :total="total"
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
              <span>
                报价：
                <InputNumber
                  @on-change="changeOffer"
                  style="width:100px;"
                  v-model="offer"
                  size="small"
                  :min="0"
                  :formatter="value => `￥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                  :parser="value => value.replace(/￥s?|(,*)/g, '')"
                ></InputNumber>
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
  import addBtnRight from './add-btn-right'
  import { mapGetters } from 'vuex'
  import { forEach } from '@/libs/tools'
  import {
    saveProductPack,
    getProductPackAndItemByProductPackId,
    queryPackItem,
    removeProductPack,
    auditProductPack,
    cancelAuditProductPack,
    productPackNoSaleToCanSale,
    productPackCanSaleToNoSale
  } from "@/api/package";
  import {contextEnums} from "@/api/context";

  export default {
    name: 'package',
    components: {
      queryPage, pageTable, pdtList, addBtnRight
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
    async created() {
      await this.loadEnums();
    },
    data() {
      let this_ = this;
      return {
        Enums: {},
        api: 'product',
        pageUrl: '/product/queryPackByView',
        pdtUrl: '/product/querySkuByView',
        modalShow: false,
        modalForm: {
          describe: "",
          discountRate: 100,
          packName: "",
          price: 0,
          remark: "",
          productPackItemDTOS: []
        },
        ruleCustom: {
          packName: [
            {required: true, message: '请输入打包品名称', trigger: 'blur'}
          ],
          describe: [
            {required: true, message: '请输入打包品描述', trigger: 'blur'},
          ]
        },
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
            title: '原始价格',
            align: 'left',
            key: 'skuPrice',
            width: 100,
            render: (h, params) => {
              return h('span', {}, '￥ ' + params.row.skuPrice.toFixed(2));
            }
          },
          {
            title: '优惠价格',
            align: 'left',
            key: 'packPrice',
            width: 100,
            render: (h, params) => {
              let packPrice = ( params.row.skuPrice * this_.discountRate / 100).toFixed(2);
              this_.nptData[params.index].packPrice = packPrice;
              return h('span', {}, '￥ ' + packPrice);
            }
          },
          {
            title: '其他选项',
            align: 'left',
            width: 400,
            render: (h, p) => {
              return h( addBtnRight , {
                props: {
                  data: p.row,
                  replaceEnum: this_.Enums.ProReplaceEnum,
                  addOrDescEnum: this_.Enums.ProAddOrDescEnum,
                  isReadonly: this_.isReadonly
                },
                on: {
                  changeReplace(val){
                    if(val){
                      p.row.isReplace = 1;
                      p.row.replacePriceEnum = this_.Enums.ProReplaceEnum[0].name;
                    }else{
                      p.row.isReplace = 0;
                      if( p.row.replacePriceEnum )
                        delete p.row.replacePriceEnum;
                    }
                    this_.nptData[p.index] = p.row;
                  },
                  sltRle(val){
                    p.row.replacePriceEnum = val;
                    this_.nptData[p.index] = p.row;
                  },
                  changeNum(val){
                    if(val){
                      p.row.isChange = 1;
                      p.row.changePriceEnum = this_.Enums.ProAddOrDescEnum[0].name;
                      p.row.changeMin = 1;
                      p.row.changeMax = 1;
                    }else{
                      p.row.isChange = 0;
                      if( p.row.changePriceEnum ){
                        delete p.row.changePriceEnum;
                        delete p.row.changeMin;
                        delete p.row.changeMax;
                      }
                    }
                    this_.nptData[p.index] = p.row;
                  },
                  sltNum(val){
                    p.row.changePriceEnum = val;
                    this_.nptData[p.index] = p.row;
                  },
                  changeMin(val){
                    p.row.changeMin = val;
                    this_.nptData[p.index] = p.row;
                  },
                  changeMax(val){
                    p.row.changeMax = val;
                    this_.nptData[p.index] = p.row;
                  }
                }
              })
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
        pagesize: 10,
        page: 1,
        total: 100,
        row: '',
        showPdtList: {show: false},
        operation: {
          title: '操作',
          render(h, pms) {
            let btn = [
              h('Button', {
                props: {size: 'small', type: 'primary'},
                style: {marginRight: '10px'},
                on: {
                  click() {
                    this_.edi(pms.row, this_.$refs.queryPage.ParamsKey)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {size: 'small'},
                style: {marginRight: '10px'},
                on: {
                  click() {
                    this_.Audit(pms.row, this_.$refs.queryPage.ParamsKey)
                  }
                }
              }, pms.row.saleAuditStatus == 'UNABLE_AUDIT' ? '审核' : '取审'),
              h('Button', {
                props: {size: 'small'},
                style: {marginRight: '10px'},
                on: {
                  click() {
                    this_.sale(pms.row, this_.$refs.queryPage.ParamsKey)
                  }
                }
              }, pms.row.saleStatus == 'UNABLE_SALE' ? '上架' : '下架'),
            ];
            if (pms.row.saleAuditStatus == 'UNABLE_AUDIT') {
              btn.push(
                h('Button', {
                  props: {size: 'small'},
                  style: {marginRight: '10px'},
                  on: {
                    click() {
                      this_.del(pms.row, this_.$refs.queryPage.ParamsKey)
                    }
                  }
                }, '删除')
              )
            }
            return h('div', {}, btn)
          }
        },
        isReadonly: false,
        flag: 0,
        offer: 0,
        priceSum: 0,
        discountRate: 100,
      }
    },
    methods: {
      async loadEnums() {
        let data = await contextEnums('product');
        for (let v in data) {
          let str = v.split('.');
          str = str[str.length - 1];
          data[str] = data[v];
          delete data[v];
        }
        this.Enums = data;
      },
      back() {
        this.modalShow = false;
        this.showPdtList.show = false;
        this.$refs.modalForm.resetFields();
        this.modalForm = {
          describe: "",
          discountRate: 100,
          packName: "",
          price: 0,
          remark: "",
          productPackItemDTOS: []
        };
        this.offer = 0;
        this.priceSum = 0;
        this.discountRate = 100;
        this.nptData = [];
        this.$refs.pageTable.selected = '';
      },
      clearDarTbl(){
        this.$refs.drawer_table.clearTable()
      },
      add() {
        this.offer = 0;
        this.flag = 0;
        this.isReadonly = false;
        this.modalShow = true;
      },
      edi(row, key) {
        queryPackItem(row[key]).then(res => {
          if (!res) return;
          this.modalForm = res.productPackDTO;
          this.nptData = res.packItemViewDTOS;
          this.offer = res.productPackDTO.price;
          this.discountRate = res.productPackDTO.discountRate;
          if (res.productPackDTO.saleAuditStatus == 'UNABLE_AUDIT') {
            this.isReadonly = false;
            this.flag = 1;
          } else {
            this.isReadonly = true;
            this.flag = 2;
          }
          this.modalShow = true;
          this.getPriceSum();
        });
      },
      del(row, key) {
        if (row.saleAuditStatus == 'PASS_AUDIT' || row.saleStatus == 'CAN_SALE') {
          return this.$Message.info('已审核或上架商品无法删除');
        }
        let this_ = this;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该打包品？删除后无法恢复！</p>',
          onOk: () => {
            removeProductPack(row[key]).then(res => {
              if (!res) return;
              this_.$Message.info('删除成功');
              this_.$refs.queryPage.loadData(1);
            })
          },
          onCancel: () => {
            // this.$Message.info('Clicked cancel');
          }
        });
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
      submitPack() {
        let this_ = this;
        this.$refs['modalForm'].validate((valid) => {
          if (valid) {
            let items = [];
            forEach(this_.nptData, function (v, i) {
              let item = {
                changeMax: v.changeMax || 0,
                changeMin: v.changeMin || 0,
                changePriceEnum: v.changePriceEnum || 0,
                isChange: v.isChange || 0,
                isReplace: v.isReplace || 0,
                replacePriceEnum: v.replacePriceEnum || 0,
                packNumber: v.packNumber || 0,
                packPrice: v.packPrice || 0,
                providerEntId: v.providerEntId || '',
                //remark: v.remark || '',
                packId: v.packId || '',
                skuId: v.skuId ? v.skuId : v.id,
                id: v.id
              };
              items.push(item);
            });
            let data = {...this_.modalForm};
            data.productPackItemDTOS = [...items];
            data.discountRate = this_.discountRate.toFixed(2);
            data.price = this_.offer.toFixed(2);

            saveProductPack(data).then(res => {
              if (!res) return;
              this_.$Message.info('保存成功');
              this_.back();
              this_.$refs.queryPage.loadData(1);
            })
          }
        })
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
      Audit(row, key) {
        let flag;
        flag = row.saleAuditStatus == 'UNABLE_AUDIT' ? 1 : 0;
        this.$Modal.confirm({
          title: '确定！',
          content: flag ? '<p>确认通过审核？</p>' : '<p>确认取消审核？</p>',
          onOk: () => {
            let data = {
              productPackId: row[key],
              saleAudiPersonId: this.userInfo.userId
            };
            flag ? auditProductPack(data).then(res => {
              if (!res) return;
              this.$Message.info('审核成功');
              this.$refs.queryPage.loadData(1);
            }) : cancelAuditProductPack(data).then(res => {
              if (!res) return;
              this.$Message.info('已取消审核');
              this.$refs.queryPage.loadData(1);
            })
          },
          onCancel: () => {
          }
        });
      },
      sale(row, key) {
        let flag;
        flag = row.saleStatus == 'UNABLE_SALE' ? 1 : 0;
        this.$Modal.confirm({
          title: '确定！',
          content: flag ? '<p>确认上架该商品？</p>' : '<p>确认下架改商品？</p>',
          onOk: () => {
            flag ? productPackNoSaleToCanSale(row[key]).then(res => {
              if (!res) return;
              this.$Message.info('上架成功');
              this.$refs.queryPage.loadData(1);
            }) : productPackCanSaleToNoSale(row[key]).then(res => {
              if (!res) return;
              this.$Message.info('下架成功');
              this.$refs.queryPage.loadData(1);
            })
          },
          onCancel: () => {
          }
        });
      },

      getPriceSum(){
        let sum = 0;
        forEach(this.nptData, function (v, i) {
          sum += v.skuPrice * v.packNumber;
        });
        this.priceSum = sum;
        this.offer = this.priceSum * this.discountRate / 100;
      },
      changeDiscountRate(){
        this.getPriceSum();
      },
      changeOffer(val){
        if(val)
          this.discountRate = val / this.priceSum * 100
      },
    }
  }
</script>

<style lang="less"></style>
