<template>
  <div>
    <Row :gutter="10">
      <Col span="4">
        <good-types
          :data="treeData"
          :typeEdit="true"
          @selected="selectClass"
          @update="loadTree"
        ></good-types>
      </Col>
      <Col span="20" v-if="selectedClass.title">
        <Tabs :animated="false">
          <TabPane label="属性">
            <Row :gutter="10">
              <Col span="20">
                <info-table
                  :title="selectedClass.title"
                  :data="selectedClass.attributes"
                  :columns="classColumns"
                  :id="selectedClass.id"
                  @add-btn="addAttr"
                  @edi-btn="ediAttr"
                  @del-btn="delAttr"
                  @table-selected="selectAttr"
                ></info-table>
              </Col>
              <Col span="4" v-if="attrData.title">
                <info-table
                  :title="attrData.title"
                  :data="attrData.data"
                  :columns="attrColumns"
                  :id="attrData.id"
                  @add-btn="addAttrVal"
                  @edi-btn="ediAttrVal"
                  @del-btn="delAttrVal"
                ></info-table>
              </Col>
            </Row>
          </TabPane>
          <TabPane label="品牌">
            <info-table
              :title="brandData.title"
              :data="brandData.data"
              :columns="brandColumns"
              :id="brandData.id"
              @add-btn="addAttrBrand"
              @edi-btn="ediAttrBrand"
              @del-btn="delAttrBrand"
              @table-selected="selectBrand"
            ></info-table>
          </TabPane>
          <TabPane label="详情">
            <Card style="min-height: 300px;">
              <Form ref="attrForm" :model="selectedClass" :rules="ruleAttrForm" :label-width="100">
                <Row :gutter="20">
                  <Col span="8">
                    <FormItem label="父级：" prop="classCode">
                      <Cascader v-model="selDef" :data="treeSelData" change-on-select></Cascader>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="名称："  prop="title">
                      <Input type="text" disabled v-model="selectedClass.title"></Input>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="编码：" prop="classCode">
                      <Input type="text" disabled v-model="selectedClass.classCode"></Input>
                    </FormItem>
                  </Col>
                </Row>
                <FormItem>
                  <Button type="primary" @click="updataAttr('attrForm')">修改</Button>
                </FormItem>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
    <Modal
      width="1300"
      v-model="showAttrModal"
      title="添加属性"
      :footer-hide="true"
      @on-visible-change="modalChange"
    >
      <Form ref="attrModal" :model="attrModal" :rules="attrValidate">
        <FormItem label="" prop="attributeName">
          <Input v-model="attrModal.attributeName" placeholder="属性名称"></Input>
        </FormItem>
        <Row :gutter="30">
          <Col span="4"><FormItem label="别名">
              <i-switch v-model="attrModal.isAlias">
              </i-switch>
            </FormItem></Col>
          <Col span="4"><FormItem label="颜色">
            <i-switch v-model="attrModal.isColor">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="枚举">
            <i-switch v-model="attrModal.isEnum">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <!--<Col span="4"><FormItem label="输入">
            <i-switch v-model="attrModal.isInput">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>-->
          <Col span="4"><FormItem label="关键">
            <i-switch v-model="attrModal.isKey">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="销售">
            <i-switch v-model="attrModal.isSale">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="检索">
            <i-switch v-model="attrModal.isSearch">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="必须">
            <i-switch v-model="attrModal.isMust">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="多选">
            <i-switch v-model="attrModal.isMulti">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="单位">
            <i-switch v-model="attrModal.isUnit">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="销售价格">
            <i-switch v-model="attrModal.isSalePrice">
              <span></span>
              <span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="是否表头显示">
            <i-switch v-model="attrModal.isColumnShow">
              <span></span><span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="是否订单属性">
            <i-switch v-model="attrModal.isOrder">
              <span></span><span></span>
            </i-switch>
          </FormItem></Col>
          <Col span="4"><FormItem label="是否工单属性">
            <i-switch v-model="attrModal.isWorkOrder">
              <span></span><span></span>
            </i-switch>
          </FormItem></Col>
        </Row>
        <FormItem>
          <Button type="primary" @click="attrSubmit('attrModal')" style="float: right">确定</Button>
          <Button type="text" @click="brandReset('attrModal')" style="float: right">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      width="360"
      v-model="showAttrValModal"
      title="添加属性值"
      :footer-hide="true"
      @on-visible-change="modalChange"
    >
      <Form ref="attrValModal" :model="attrValModal" :rules="attrValValidate" label-position="top">
        <FormItem label="名称" prop="attrValueName">
          <Input v-model="attrValModal.attrValueName" placeholder="名称..."></Input>
        </FormItem>
        <FormItem label="编码" prop="attrCode">
          <Input v-model="attrValModal.attrCode" placeholder="编码..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="attrValSubmit('attrValModal')" style="float: right">确定</Button>
          <Button type="text" @click="brandReset('attrValModal')" style="float: right">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      width="360"
      v-model="showBrandModal"
      title="增加品牌"
      :footer-hide="true"
      @on-visible-change="modalChange"
    >
      <Form ref="brandModal" :model="brandModal" :rules="brandValidate" label-position="top">
        <FormItem label="名称" prop="brandName">
          <Input v-model="brandModal.brandName" placeholder="品牌名称..."></Input>
        </FormItem>
        <FormItem label="品牌网站" prop="brandURL">
          <Input v-model="brandModal.brandURL" placeholder="品牌网站..."></Input>
        </FormItem>
        <FormItem label="Logo地址" prop="brandLogoURL">
          <Input v-model="brandModal.brandLogoURL" placeholder="Logo地址..."></Input>
        </FormItem>
        <FormItem label="描述" prop="brandDescribe">
          <Input v-model="brandModal.brandDescribe" placeholder="品牌描述..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="brandSubmit('brandModal')" style="float: right">确定</Button>
          <Button type="text" @click="brandReset('brandModal')" style="float: right">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import goodTypes from '../tpls/goodTypes'
  import infoTable from '../tpls/infoTable'
  import {forEach} from "@/libs/tools";
  import {mapGetters,mapActions} from 'vuex'
  import {listProductClassTree,listProductClassAttrByClassId,listProductClassAttrValueByAttributeId,listProductBrandByClassId,getProductClassAttrByAttributeId,removeProductClassAttr,saveProductClassAttr,getProductClassAttrValueById,removeProductClassAttrValue,saveProductClassAttrValue,getProductBrandByBrandId,removeProductBrand,saveProductBrand,updateParent} from '@/api/goods'
  export default {
    name: 'goodType',
    components:{
      goodTypes,infoTable
    },
    data(){
      return {
        treeData: [],
        treeSelData: [],
        selDef: [],
        selectedClass: {},
        attrData:{},
        brandData:{},
        classColumns:[
          {
            title: '序号',
            width: 60,
            align:'center',
            type: 'index'
          },
          {
            title: '名称',
            align:'center',
            key: 'attributeName',
            width: 100
          },
          {
            title: '别名',
            align:'center',
            key: 'isAlias',
            render:(h,params)=>{
              if(params.row.isAlias == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '颜色',
            align:'center',
            key: 'isColor',
            render:(h,params)=>{
              if(params.row.isColor == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '枚举',
            align:'center',
            key: 'isEnum',
            render:(h,params)=>{
              if(params.row.isEnum == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          /*{
            title: '输入',
            align:'center',
            key: 'isInput',
            render:(h,params)=>{
              if(params.row.isInput == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },*/
          {
            title: '关键',
            align:'center',
            key: 'isKey',
            render:(h,params)=>{
              if(params.row.isKey == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '销售',
            align:'center',
            key: 'isSale',
            render:(h,params)=>{
              if(params.row.isSale == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '检索',
            align:'center',
            key: 'isSearch',
            render:(h,params)=>{
              if(params.row.isSearch == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '必须',
            align:'center',
            key: 'isMust',
            render:(h,params)=>{
              if(params.row.isMust == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '多选',
            align:'center',
            key: 'isMulti',
            render:(h,params)=>{
              if(params.row.isMulti == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '单位',
            align:'center',
            key: 'isUnit',
            render:(h,params)=>{
              if(params.row.isUnit == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '销售价格',
            align:'center',
            key: 'isSalePrice',
            render:(h,params)=>{
              if(params.row.isSalePrice == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '是否订单属性',
            align:'center',
            key: 'isOrder',
            render:(h,params)=>{
              if(params.row.isOrder == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '是否工单属性',
            align:'center',
            key: 'isWorkOrder',
            render:(h,params)=>{
              if(params.row.isWorkOrder == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
          {
            title: '是否表头显示',
            align:'center',
            key: 'isColumnShow',
            render:(h,params)=>{
              if(params.row.isColumnShow == 1){
                return h('Icon',{props:{
                    type:'md-checkmark'
                  }})
              }
            }
          },
        ],
        attrColumns:[
          {
            title: '序号',
            width: 60,
            align:'center',
            type: 'index'
          },
          {
            title: '名称',
            align:'center',
            key: 'attrValueName'
          },
          {
            title: '编码',
            align:'center',
            key: 'attrCode'
          }
        ],
        brandColumns:[
          {
            title: '序号',
            width: 60,
            align:'center',
            type: 'index'
          },
          {
            title: '名称',
            align:'center',
            key: 'brandName'
          },
          {
            title: '品牌网站',
            align:'center',
            key: 'brandURL'
          },
          {
            title: 'Logo地址',
            align:'center',
            key: 'brandLogoURL'
          },
          {
            title: '描述',
            align:'center',
            key: 'brandDescribe'
          }
        ],
        showAttrModal: false,
        attrType: 0,
        attrModal: {
          attributeName:'',
          isAlias: false,
          isColor: false,
          isEnum: false,
          isInput: false,
          isKey: false,
          isSale: false,
          isSearch: false,
          isMust: false,
          isMulti: false,
          isUnit: false,
          isSalePrice: false,
          isWorkOrder: false,
          isOrder: false,
          isColumnShow: false,
        },
        attrValidate:{
          attributeName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        showAttrValModal: false,
        attrValType: 0,
        attrValModal:{
          attrCode: '',
          attrValueName: ''
        },
        attrValValidate:{
          attrCode: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          attrValueName: [
            { required: true, message: '请输入编码', trigger: 'blur' },
          ]
        },
        showBrandModal:false,
        brandType: 0,
        brandModal:{
          brandName:'',
          brandURL:'',
          brandLogoURL:'',
          brandDescribe:''
        },
        brandValidate: {
          brandName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          brandURL: [
            { required: true, message: '请输入品牌网站', trigger: 'blur' },
          ],
          brandLogoURL: [
            { required: true, message: '请输入Logo地址', trigger: 'blur' },
          ]
        },
        // attrForm: {},
        ruleAttrForm:{
          title: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          classCode: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
        }
      }
    },
    computed:{
      ...mapGetters([
        'userInfo'
      ])
    },
    mounted:function(){
      this.loadTree();
    },
    methods:{
      // 加载品类树数据
      loadTree(){
        listProductClassTree().then(res=>{
          if(!res) return ;
          this.treeData = [];
          this.treeSelData = [];
          let menu = res.menu;
          if(!menu || !menu.length) return ;
          let this_ = this;
          function f(data,parent,id) {
            forEach(data,(v,i)=>{
              let item = {};
              item.value = v.id;
              item.label = v.title;
              if( v.id == this_.selectedClass.id ){
                v.selected = true;
              }
              if( v.id == id ){
                v.expand = true;
                if(v.parentClassId) f(menu,null,v.parentClassId)
              }
              if(v.children){
                item.children = [];
                f(v.children,item.children,id)
              }
              if( parent )parent.push(item)
            })
          }
          f(menu,this.treeSelData,this.selectedClass.id);
          this.treeData = menu;
        })
      },
      // 选择品类
      selectClass(row){
        if(!row) {
          this.selectedClass = {};
          this.attrData = {};
          this.brandData = {};
          return
        }
        if(row.parentClassId) {
          let this_ = this;
          this.selDef = [];
          function f(id, data, arr) {
            forEach(data, (v)=>{
              if(v.id == id){
                arr.push( id )
                if(v.parentClassId) {
                  f( v.parentClassId,  this_.treeData, arr );
                }
                return ;
              }
              if(v.children){
                f( id, v.children, arr )
              }
            });
          }
          f(row.parentClassId, this.treeData, this.selDef);
          this.selDef = this.selDef.reverse();
        }
        this.attrData = {};
        this.selectedClass = row;
        // this.attrForm = row;
        this.loadAttrTable(row.id);
        this.loadBrandTable(row.id)
      },
      // 选择属性
      selectAttr(row){
        if(row.isEnum){
          this.loadAttrVal(row.id,row.attributeName)
        }
      },
      // 加载属性table
      loadAttrTable(id){
        listProductClassAttrByClassId(id).then(res=>{
          if(!res) return ;
          this.selectedClass.attributes = res;
        })
      },
      // 加载属性值
      loadAttrVal(id,name){
        listProductClassAttrValueByAttributeId(id).then(res=>{
          if(!res) return ;
          this.attrData = {
            title: name,
            id: id,
            data : res
          };
        })
      },
      // 加载品牌table
      loadBrandTable(id){
        let this_ = this;
        listProductBrandByClassId(id).then(res=>{
          if(!res) return ;
          this.brandData = {
            title: this_.selectedClass.title,
            id: id,
            data : res
          };
        })
      },
      // 属性增删改查
      addAttr(){
        this.showAttrModal = true;
        this.attrModal = {
          attributeName:'',
          isAlias: false,
          isColor: false,
          isEnum: false,
          isInput: false,
          isKey: false,
          isSale: false,
          isSearch: false,
          isMust: false,
          isMulti: false,
          isUnit: false,
          isSalePrice: false,
          isWorkOrder: false,
          isOrder: false,
          isColumnShow: false,
        };
        this.attrType = 0
      },
      ediAttr(row){
        this.attrType = 1;
        let this_ = this;
        getProductClassAttrByAttributeId(row.id).then(res=>{
          if(!res) return ;
          let data = res;
          for(let v in data){
            if(data[v] == '0' || data[v] == 'null' || data[v] == 'undefined'){
              data[v]= false
            }
            if(data[v] == '1'){
              data[v]= true
            }
          }
          this_.attrModal = data;
          this_.showAttrModal = true;
        })
      },
      delAttr(row){
        let this_ = this;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该属性？删除后无法恢复！</p>',
          onOk: () => {
            removeProductClassAttr(row.id).then(res=>{
              if(!res) return ;
              this_.$Message.info('删除成功');
              this_.loadAttrTable(this_.selectedClass.id)
            })
          },
          onCancel: () => {
          }
        });
      },
      attrSubmit(name){
        let this_ = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {};
            if( this_.attrType ){
              data = {
                ...this_.attrModal
              }
            }else{
              data = {
                ...this_.attrModal,
                appId:this_.userInfo.appId,
                tenantId:this_.userInfo.tenantId,
                classId:this_.selectedClass.id
              }
            }
            data.isInput = !data.isEnum;
            for(let v in data){
              if(data[v] === false){
                data[v] = 0
              }
              if(data[v]===true){
                data[v] = 1
              }
            }
            saveProductClassAttr(data).then(res=>{
              if(!res) return ;
              this_.showAttrModal=false;
              this_.$Message.success(this_.attrType ? '修改成功!' : '添加成功');
              this_.$refs[name].resetFields();
              this_.loadAttrTable(this_.selectedClass.id)
            })
          }
        })
      },
      // 属性值增删改查
      addAttrVal(){
        this.showAttrValModal = true ;
        this.attrValType = 0 ;
        this.attrValModal = {
          attrCode: '',
          attrValueName: ''
        };
      },
      ediAttrVal(row){
        this.attrValType = 1;
        let this_ = this;
        getProductClassAttrValueById(row.id).then(res=>{
          if(!res) return ;
          this_.attrValModal = res;
          this_.showAttrValModal = true;
        })
      },
      delAttrVal(row){
        let this_ = this;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该属性？删除后无法恢复！</p>',
          onOk: () => {
            removeProductClassAttrValue(row.id).then(res=>{
              if(!res) return ;
              this_.$Message.info('删除成功');
              this_.loadAttrVal(this_.attrData.id,this_.attrData.title)
            })
          },
          onCancel: () => {
          }
        });
      },
      attrValSubmit(name){
        let this_ = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {};
            if( this_.attrValType ){
              data = {
                ...this_.attrValModal
              }
            }else{
              data = {
                ...this_.attrValModal,
                attributeId:this_.attrData.id
              }
            }
            saveProductClassAttrValue(data).then(res=>{
              if(!res) return ;
              this_.showAttrValModal=false;
              this_.$Message.success(this_.attrValType ? '修改成功!' : '添加成功');
              this_.$refs[name].resetFields();
              this_.loadAttrVal(this_.attrData.id,this_.attrData.title)
            })
          }
        })
      },
      // 品牌增删改查
      selectBrand(row){},
      modalChange(state){
        if(!state){
          this.brandReset('attrModal');
          this.brandReset('attrValModal');
          this.brandReset('brandModal');
        }
      },
      addAttrBrand(){
        this.showBrandModal = true;
        this.brandModal = {
          brandName:'',
          brandURL:'',
          brandLogoURL:'',
          brandDescribe:''
        };
        this.brandType = 0
      },
      ediAttrBrand(row){
        this.brandType = 1;
        let this_ = this;
        getProductBrandByBrandId(row.id).then(res=>{
          if(!res) return ;
          this_.brandModal = res;
          this_.showBrandModal = true;
        })
      },
      delAttrBrand(row){
        let this_ = this;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该品牌？删除后无法恢复！</p>',
          onOk: () => {
            removeProductBrand(row.id).then(res=>{
              if(!res) return ;
              this_.$Message.info('删除成功');
              this_.loadBrandTable(this_.selectedClass.id)
            })
          },
          onCancel: () => {
          }
        });
      },
      brandSubmit(name){
        let this_ = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {};
            if( this_.brandType ){
              data = {
                ...this_.brandModal
              }
            }else{
              data = {
                ...this_.brandModal,
                appId:this_.userInfo.appId,
                tenantId:this_.userInfo.tenantId,
                classId:this_.selectedClass.id
              }
            }
            saveProductBrand(data).then(res=>{
              if(!res) return ;
              this_.showBrandModal=false;
              this_.$Message.success(this_.brandType ? '修改成功!' : '添加成功');
              this_.$refs[name].resetFields();
              this_.loadBrandTable(this_.selectedClass.id)
            })
          }
        })
      },
      brandReset(name){
        this.$refs[name].resetFields();
        this.showAttrModal=false;
        this.showBrandModal=false;
        this.showAttrValModal=false;
      },
      // 修改品类
      updataAttr(name){
        let this_ = this;
        this.$Modal.confirm({
          title: '提示！',
          content: '<p>确认修改该类别？</p>',
          onOk: () => {
            let data = {};
            data.id = this_.selectedClass.id;
            data.parentId = this_.selDef[this_.selDef.length-1];
            updateParent(data).then(res=>{
              this_.$Message.info('修改成功');
              this_.loadTree()
            })
          },
          onCancel: () => {
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
