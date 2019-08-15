<template>
  <div id="goodInfo">
    <div v-if="!modalShow">
      <info-table
        :title="data.title"
        :data="dataInfo"
        :columns="classColumns"
        :id="data.id"
        @table-selected="selected"
        @add-btn="add"
        @edi-btn="edi"
        @del-btn="del"
      >
        <Row>
          <Page
            style="float: right;margin-top:5px"
            :total="total"
            :page-size="size"
            show-total simple
            size="small"
            @on-change="paging" />
        </Row>
      </info-table>
      <br>
      <sku-tab :row="row"></sku-tab>
    </div>

    <div v-if="modalShow">
      <Card>
        <Form ref="goodForm" :model="goodForm" :rules="validate" :label-width="120">
          <Card>
            <p slot="title">基本属性</p>
            <FormItem label="商品名称：" prop="productName">
              <Input v-model="goodForm.productName" placeholder="商品名称..."></Input>
            </FormItem>
            <FormItem label="商品编码：" prop="productCode">
              <Input v-model="goodForm.productCode" placeholder="商品编码..."></Input>
            </FormItem>
            <FormItem label="商品分类：" prop="productType">
              <RadioGroup v-model="goodForm.productType">
                <Radio v-for="item in productTypes" :label="item.name">{{item.label}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="建议零售价：" prop="price">
              <Input v-model="goodForm.price" placeholder="建议零售价..."></Input>
            </FormItem>
            <FormItem label="所属品牌：" prop="brandId">
              <Select v-model="goodForm.brandId" clearable>
                <Option v-for="item in brand" :value="item.id" :key="item.id">{{ item.brandName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="服务流程：" prop="workflowDictCode">
              <Select v-model="goodForm.workflowDictCode" clearable>
                <Option v-for="item in workflowDictList" :value="item.value" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Card>
          <br>
          <div v-for="item in formAttr">
            <Card v-if="item.attributes.length">
              <p slot="title">{{item.isSale}}</p>
              <FormItem v-for="items in item.attributes" :label="items.attributeName+'：'">
                <RadioGroup v-if="items.isEnum && !items.isMulti" v-model="goodForm.radio[items.id]">
                  <Radio v-for="val in items.attrValues" :label="val.id">{{val.attrValueName}}</Radio>
                </RadioGroup>
                <CheckboxGroup v-if="items.isEnum && items.isMulti" v-model="goodForm.check[items.id]">
                  <Checkbox v-for="val in items.attrValues" :label="val.id">{{val.attrValueName}}</Checkbox>
                </CheckboxGroup>
                <Input v-if="!items.isEnum" v-model="goodForm.input[items.id]"></Input>
              </FormItem>
            </Card>
            <br>
          </div>
          <FormItem>
            <Button type="primary" @click="submitForm('goodForm')" style="float: right">确定</Button>
            <Button type="text" @click="brandReset('goodForm')" style="float: right">取消</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
    <!--<Modal width="1300"
      :footer-hide="true"
      v-model="modalShow"
      title="添加商品"
      @on-visible-change="modalChange">

    </Modal>-->
    <!--<Modal
      v-model="toPackModal"
      title="提示"
      width="300"
      @on-ok="toPack(sltRow)">
      <p>商品已使用，无法删除</p>
    </Modal>-->
  </div>
</template>

<script>
  import {getRelativeTime,forEach,unique_, getDateToStr} from '@/libs/tools'
  import infoTable from './infoTable'
  import skuTab from './sku'
  import {mapGetters} from 'vuex'
  import { listProductAndOther,listProductBrandByClassId,listProductAttrAndAttrValue,listProductAttrEditByProductId,removeProduct,updateProduct,saveProduct,isCanRemoveSpu } from '@/api/goods'
  import { contextEnumsByApiType } from "@/api/context";
  import { listAppDictValueByCode } from '@/api/application/dictionary'

  export default {
    name: "info",
    components:{
      infoTable,skuTab
    },
    computed:{
      ...mapGetters([
        'userInfo'
      ])
    },
    props:{
      data: Object
    },
    watch:{
      data(n,o){
        if(n != o){
          this.loadTable();
          this.getBrand();
          this.getFormAttr();
          this.row = {};
        }
      }
    },
    data(){
      return {
        dataInfo:[],
        classColumns:[],
        productTypes: [],
        row: {},
        modalShow:false,
        goodForm:{
          brandId: '',
          classId: '',
          price: 0,
          productCode: '',
          productName: '',
          productType: '',
          radio:{},
          check:{},
          input:{},
          workflowDictCode: ''
        },
        goodType:0,
        brand: [],
        formAttr: [],
        validate: {
          productName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          productCode: [
            { required: true, message: '请输入商品编码', trigger: 'blur' },
          ],
          productType: [
            { required: true, message: '请选择商品分类', trigger: 'blur' },
          ]
        },
        page: 1,
        size: 10,
        total: 0,
        sltRow: '',
        toPackModal: false,
        workflowDictList: []
      }
    },
    mounted(){
      this.loadTable(1);
      this.getBrand();
      this.getFormAttr();
      contextEnumsByApiType('product','com.ebs.business.product.core.enumeration.ProductTypeEnum').then( res=> {
        this.productTypes = res;
        this.goodForm.productType = res[0].name;
      });
      listAppDictValueByCode('work.order.type').then( res => {
        this.workflowDictList = res
      })
    },
    methods:{
      paging(page){
        this.loadTable(page)
      },
      loadTable(index){
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
            key: 'productName'
          },
          {
            title: '编码',
            align:'center',
            key: 'productCode'
          },
          {
            title: '建议零售价',
            align:'center',
            key: 'price'
          }
        ];
        let data = {
          condition: this.data.id,
          pageIndex: index,
          pageSize: this.size,
          searchText: ''
        };
        listProductAndOther(data).then(res=>{
          this.total = res.resultCount;
          let infoData = res.respnoseData;
          let classColumns = [];
          if( typeof res !== 'object' ){
            this_.dataInfo = [];
            this_.row = {};
            return ;
          }
          forEach(infoData,function (v,i) {
            forEach(v.productAttrsAndValues,function (value,index) {
              if(value.isColumnShow){
                let item = {
                  title:  value.attributeName,
                  align:'center',
                  key: value.id
                };
                tabClassColumns.push(item);
                let str = [];
                forEach(value.attrValues,function (val,ind) {
                  str.push(val.attrValueName)
                });
                v[value.id] = str.join(",");
              }
            })
          });
          this_.dataInfo = infoData;
          tabClassColumns.push({
            title: '创建日期',
            align:'center',
            key: 'createDate',
            sortable: true,
            sortType: 'desc',
            render:(h,params)=>{
              //let time = getRelativeTime(params.row.createTime);
              let time = getDateToStr( params.row.createdDate);
              return h('div',{}, time)
            }
          });
          this_.classColumns = unique_(tabClassColumns,'title');
        })
      },
      getBrand() {
        listProductBrandByClassId(this.data.id).then(res=>{
          if(!res) return ;
          this.brand = res;
        })
      },
      getFormAttr() {
        listProductAttrAndAttrValue(this.data.id).then(res=>{
          if(!res) return ;
          this.formAttr = res;
        })
      },
      selected(row){
        if(row) this.row = row;
        else this.row = {};
      },
      add(){
        this.modalShow = true;
        this.goodType = 0;
      },
      edi(row){
        this.goodType = 1;
        let this_ = this;
        this.goodForm.brandId = row.brandId;
        this.goodForm.classId = row.classId;
        this.goodForm.id = row.id;
        this.goodForm.picDTOS = row.picDTOS;
        this.goodForm.price = row.price;
        this.goodForm.productCode = row.productCode;
        this.goodForm.productName = row.productName;
        this.goodForm.productType = row.productType;
        this.goodForm.workflowDictCode = row.workflowDictCode || '';
        listProductAttrEditByProductId(row.id).then( res => {
          if(!res) return ;
          let data = res;
          let check = {};
          let radio = {};
          let input = {};
          forEach(data,function (v,i) {
            forEach(v.attributes,function (v_, i_) {
              if(v_.isEnum){
                if(v_.isMulti ){
                  let ii = [];
                  forEach(v_.attrValues,function (item, index) {
                    ii.push(item.id)
                  });
                  check[v_.id] = ii;
                }else{
                  forEach(v_.attrValues,function (item, index) {
                    radio[v_.id] = item.id;
                  })
                }
              }else{
                forEach(v_.attrValues,function (item, index) {
                  input[v_.id] = item.attrValueName;
                })
              }

            })
          });
          this_.goodForm.check = check;
          this_.goodForm.radio = radio;
          this_.goodForm.input = input;
          this_.modalShow = true;
        })
      },
      del(row){
        isCanRemoveSpu(row.id).then( res => {
          if(!res){
            this.sltRow = row;
            return  this.$Message.error('商品已使用，无法删除');//this.toPackModal = true;
          }
          this.$Modal.confirm({
            title: '警告！',
            content: '<p>确认删除该商品？删除后无法恢复！</p>',
            onOk: () => {
              removeProduct(row.id).then(res => {
                if(!res) return ;
                this.$Message.info('删除成功');
                this.row = {};
                this.loadTable(1)
              })
            }
          });
        })

      },
      modalChange(state){
        if(!state){
          this.brandReset('goodForm');
        }
      },
      brandReset(name){
        this.$refs[name].resetFields();
        this.goodForm = {
          brandId: '',
          classId: '',
          price: '',
          productCode: '',
          productName: '',
          workflowDictCode: '',
          radio:{},
          check:{},
          input:{}
        };
        this.modalShow=false;
      },
      submitForm(name){
        let this_ = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {...this_.goodForm};
            data.classId = this_.data.id;
            let check = this_.goodForm.check;
            let radio = this_.goodForm.radio;
            let input = this_.goodForm.input;
            data.productAttrValueDTOS = [];
            data.productCodeDTO = {};
            for(let i in check){
              forEach(check[i],function (v,i_) {
                let item = {
                  attributeId: i,
                  attributeValue: v,
                  tenantId: this_.userInfo.tenantId,
                };
                data.productAttrValueDTOS.push(item);
              });
            }
            for(let i in radio){
              let item = {
                attributeId: i,
                attributeValue: radio[i],
                tenantId: this_.userInfo.tenantId,
              };
              data.productAttrValueDTOS.push(item);
            }
            for(let i in input){
              let item = {
                attributeId: i,
                attributeValue: input[i],
                tenantId: this_.userInfo.tenantId,
              };
              data.productAttrValueDTOS.push(item);
            }
            data.tenantId = this_.userInfo.tenantId;
            delete data.check;
            delete data.radio;
            delete data.input;
            if(this_.goodType){
              // data.productAttrValueUpdateDTOS = data.productAttrValueDTOS;
              // delete data.productAttrValueDTOS;
              data.productPicDTOS = data.picDTOS;
              // delete data.productPicDTOS;
              updateProduct(data).then(res => {
                if(!res) return;
                this_.modalShow=false;
                this_.$Message.success('修改成功!');
                this_.$refs[name].resetFields();
                this_.loadTable(1);
                this.brandReset('goodForm');
              })
            }else{
              data.productPicDTOS = [];
              saveProduct(data).then(res => {
                if(!res) return;
                this_.modalShow=false;
                this_.$Message.success('添加成功');
                this_.$refs[name].resetFields();
                this_.loadTable(1);
                this.brandReset('goodForm');
              })
            }
            this_.row = {};
          }
        })
      },
      toPack(row){
        this.$router.push({
          name: 'package_query',
          query: { spuId: row.id },
        });
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
