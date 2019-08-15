<template>
  <Row :gutter="20">
    <Col span="6">
      <Card>
        <p slot="title">字典</p>
        <p slot="extra">
          <Button size="small" icon="md-add" @click="addDict"></Button>
          <Button v-if="selected" size="small" icon="md-close" @click="delDict"></Button>
          <Button v-if="selected" size="small" icon="md-list-box" @click="ediDict"></Button>
        </p>
        <CellGroup @on-click="sltDict">
          <Cell v-for="item in dictData" :key="item.id" :selected="selected == item.id" :name="item.id" :title="item.name" :label="item.code" :extra="item.scope"/>
        </CellGroup>
      </Card>
    </Col>
    <Col span="18">
      <Card v-if="selected">
        <p slot="title">字典值</p>
        <p slot="extra">
          <Button size="small" @click="addDictVal">新增</Button>
        </p>
        <page-table
          ref="pageTable"
          :tabData="dictTable"
          :columns="dictColumns"
          :noPage="true"
          :noEdit="true">
        </page-table>
      </Card>
    </Col>
    <Modal
      v-model="dictModal"
      :title=" dictFlag ? '修改' : '新增字典' ">
      <Form ref="dictForm" :model="dictForm" label-position="left" :label-width="60">
        <FormItem label="名称：" prop="name">
          <Input v-model="dictForm.name"></Input>
        </FormItem>
        <FormItem label="编码：" prop="code">
          <Input v-model="dictForm.code"></Input>
        </FormItem>
        <FormItem label="范围：" prop="scope">
          <Select v-model="dictForm.scope" placeholder="选择范围">
            <Option v-for="item in scopeList" :value="item.name" :key="item.id">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注：" prop="remark" style="margin-bottom: 0">
          <Input type="textarea" v-model="dictForm.remark" :autosize="{minRows: 2,maxRows: 3}"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveDict">确定</Button>
        <Button type="text" @click="resetDictForm">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="dictValModal"
      :title=" dictValFlag ? '修改' : '新增字典' ">
      <Form ref="dictValForm" :model="dictValForm" label-position="left" :label-width="60">
        <FormItem label="名称：" prop="name">
          <Input v-model="dictValForm.name"></Input>
        </FormItem>
        <FormItem label="值：" prop="value">
          <Input v-model="dictValForm.value"></Input>
        </FormItem>
        <FormItem label="父级：">
          <Cascader v-model="dictValParentId" :data="dictValData" change-on-select></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveDictVal">确定</Button>
        <Button type="text" @click="resetDictValForm">取消</Button>
      </div>
    </Modal>
  </Row>
</template>

<script>
  import wTree from '@/apps/components/tree_';
  import draggable from 'vuedraggable'
  import pageTable from '@/apps/components/page_table';
  import tbExpand from './expend'
  import { forEach } from '@/libs/tools';
  import { listAppDict, saveDict, deleteDict, listAppDictValue, saveDictValue, deleteDictValue  } from '@/api/application/dictionary';
  import { contextMenu } from '@/api/context';
  import { toTree } from "@/libs/util";

  export default {
    name: "sysDict",
    components: {
      wTree,draggable,pageTable,tbExpand
    },
    data() {
      let this_ = this;
      return {
        dictData: [],
        userInfo: '',
        dictModal: false,
        selected: '',
        dictFlag: 0,
        dictForm: {},
        scopeList: [],

        dictTable: [],
        dictColumns: [
          {
            type: 'expand',
            width: 26,
            render: (h, params) => {
              if(params.row.children){
                return h( tbExpand , {
                  props:{
                    list: params.row.children,
                    columns: this_.dictColumns,
                    delDictVal: this_.delDictVal,
                    ediDictVal: this_.ediDictVal
                  }
                })
              }
            }
          },
          {
            title: '#',
            type: 'index',
            width: 30
          },
          {
            title: '名称',
            key: 'name',
            render: (h, params) => {
              let left = params.row.left * 26;
              return h( 'div' , {
                style: {
                  paddingLeft: left+ 'px'
                }
              }, params.row.name)
            }
          },
          {
            title: '值',
            key: 'value',
            width: 200,
          },
          {
            title: '操作',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this_.ediDictVal( params.row )
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this_.delDictVal( params.row )
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        pagesize: 10,
        page: 1,
        total: 0,

        dictValData: [],
        dictValModal: false,
        dictValFlag: 0,
        dictValForm: {},
        dictValParentId: [],
      }
    },
    mounted() {
      this.userInfo = this.$store.getters.userInfo;
      /*let appId = this.userInfo.appId;
      let this_ = this;
      if(!appId){
        this.$Message.error({
          content:'请填选择或创建应用!',
          onClose(){
            this_.$router.push('../app/application');
          }
        });
        return false;
      }*/
      this.loadDict();
      contextMenu('com.ebs.platform.core.enums.ScopeEnum').then( res => {
        this.scopeList = res;
      })
    },
    methods: {
      loadDict(){
        this.selected = '';
        this.resetDictForm();
        listAppDict( this.userInfo.appId ).then( res => {
          this.dictData = res;
        })
      },
      sltDict(id){
        if( !id ){
          this.selected = ''; return
        }
        this.selected = id;
        listAppDictValue(id).then(res => {
          let dict = [...toTree(res)];
          let dictValeData = [];
          function f(tree, num,arr){
            let left = num + 1;
            forEach( tree, function (v, i) {
              let item = {
                label: v.name,
                value: v.id,
                parentId: v.parentId
              };
              arr.push(item);
              v.left = left;
              if(!v.children){
                v._disableExpand = true;
              }else{
                item.children = [];
                f(v.children, left, item.children)
              }
            });
          }
          f(dict, -1 ,dictValeData);
          this.dictTable = dict;
          this.dictValData = dictValeData;
        })
      },
      addDict(){
        this.dictModal = true;
        this.dictFlag = 0;
      },
      validateDict(){
        if( !this.dictForm.name ){
          this.$Message.error('请输入名称');
          return false;
        }
        if( !this.dictForm.code ){
          this.$Message.error('请输入编码');
          return false;
        }
        if( !this.dictForm.scope ){
          this.$Message.error('请选择范围');
          return false;
        }
        return true
      },
      resetDictForm(){
        this.dictForm = {};
        this.dictModal = false;
        this.$refs.dictForm.resetFields();
      },
      saveDict(){
        let validate = this.validateDict();
        if(validate){
          saveDict(this.dictForm).then( res => {
            if(!res) return;
            this.dictModal = false;
            this.$Message.success('操作成功!');
            this.loadDict();
            this.resetDictForm()
          })
        }
      },
      delDict(){
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该字典？删除后无法恢复！</p>',
          onOk: () => {
            deleteDict( this.selected ).then(res => {
              if (!res) return;
              this.$Message.info('删除成功');
              this.loadDict();
            })
          }
        });
      },
      ediDict(){
        let this_ = this;
        forEach(this.dictData,(v) =>{
          if(v.id == this_.selected){
            this_.dictForm = {...v};
          }
        });
        this.dictFlag = 1;
        this.dictModal = true;
      },
      addDictVal(){
        this.dictValModal = true;
        this.dictValFlag = 0;
      },
      validateDictVal(){
        if( !this.dictValForm.name ){
          this.$Message.error('请输入名称');
          return false;
        }
        if( !this.dictValForm.value ){
          this.$Message.error('请输入值');
          return false;
        }
        return true
      },
      resetDictValForm(){
        this.dictValForm = {};
        this.dictValModal = false;
        this.$refs.dictValForm.resetFields();
      },
      saveDictVal(){
        let validate = this.validateDictVal();
        if(validate){
          let data = {...this.dictValForm};
          data.dictId = this.selected;
          data.parentId = this.dictValParentId[this.dictValParentId.length-1] || '';
          saveDictValue( data ).then( res => {
            if(!res) return;
            this.dictValModal = false;
            this.$Message.success('操作成功!');
            this.sltDict( this.selected );
            this.resetDictValForm()
          })
        }
      },
      delDictVal(row){
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除？删除后无法恢复！</p>',
          onOk: () => {
            deleteDictValue( row.id ).then(res => {
              if (!res) return;
              this.$Message.info('删除成功');
              this.sltDict( this.selected );
            })
          }
        });
      },
      ediDictVal(row){
        this.dictValForm = {...row};
        this.dictValModal = true;
        this.dictValFlag = 1;
        console.log(this.dictValData);
        let this_ = this;
        this.dictValParentId = [];
        function f(id, data, arr) {
          forEach(data, (v)=>{
            if(v.value == id){
              arr.push( id );
              if(v.parentId) {
                f( v.parentId,  this_.dictValData, arr );
              }
              return ;
            }
            if(v.children){
              f( id, v.children, arr )
            }
          });
        }
        f( row.parentId, this.dictValData, this.dictValParentId );
        this.dictValParentId = this.dictValParentId.reverse();
        console.log(this.dictValParentId)
      },
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
</style>
