<template>
  <Row :gutter="20">
    <Col span="6">
      <Card>
        <p slot="title">模块</p>
        <p slot="extra">
          <Button size="small" icon="md-add" @click="add"></Button>
          <Button v-if="selected" size="small" icon="md-close" @click="delClass"></Button>
          <Button size="small" icon="md-list-box" @click="sortShow"></Button>
        </p>
        <div style="overflow: hidden">
          <Tree :render="renderContent" :data="data" @on-select-change="select"></Tree>
        </div>
      </Card>
    </Col>
    <Col span="18">
      <Card v-if="addModal">
        <Form :label-width="60" label-position="left" :model="formData">
          <FormItem label="名称：">
            <Input v-model="formData.name"></Input>
          </FormItem>
          <FormItem label="编码：">
            <Input v-model="formData.code"></Input>
          </FormItem>
          <FormItem label="URL：">
            <Input v-model="formData.url"></Input>
          </FormItem>
          <FormItem label="类型：">
            <RadioGroup v-model="formData.powerType">
              <Radio  v-for="item in power_type" :label="item.name">{{item.label}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="父级：">
            <Cascader v-model="thisParentId" :data="data" change-on-select></Cascader>
          </FormItem>
          <FormItem label="备注：" prop="remark">
            <Input type="textarea" :autosize="{minRows: 1,maxRows: 3}" v-model="formData.remark"></Input>
          </FormItem>
          <Row>
            <div class="brs"></div>
            <div style="text-align: center">
              <Button type="primary" @click="handleSubmit('moduleForm')">提交</Button>
            </div>
          </Row>
        </Form>
      </Card>
    </Col>
    <Modal
      v-model="sortModal"
      title="排序"
      @on-ok="saveSort">
      <draggable v-model="sortList" @update="sortEnd">
        <div class="sorts" v-for="item in sortList" :key="item.id">
          <Icon :type="item.icon || 'ios-paper-outline'" />
          {{item.name}}
        </div>
      </draggable>
    </Modal>
  </Row>
</template>

<script>
  import wTree from '@/apps/components/tree_';
  import draggable from 'vuedraggable'
  import { forEach } from '@/libs/tools';
  import { toTree } from "@/libs/util";
  import Vue from 'vue';
  import { listAppPower, saveAppPower, deleteAppPower, powerSort } from '@/api/application/module'
  import { contextMenu } from '@/api/context'

  export default {
    name: "module",
    components: {
      wTree,draggable
    },
    data() {
      return {
        data: [],
        thisParentId: [],
        userInfo: '',
        selected: '',
        addModal: false,
        formData: {},
        power_loadData:[],
        selectId: null,
        sortModal: false,
        sortData: [],
        sortList: [],
      }
    },
    mounted() {
      this.userInfo = this.$store.getters.userInfo;
      this.loadTree();
      contextMenu('com.ebs.platform.core.enums.PowerTypeEnum').then(res => {
        let data = res ;
        forEach(data, (v ) => {
          switch ( v.name ){
            case 'Default':
              v.icon = 'md-albums';
              break;
            case 'Menu':
              v.icon = 'md-menu';
              break;
            case 'Button':
              v.icon = 'md-switch';
              break;
            case 'Data':
              v.icon = 'md-cube';
              break;
            case 'Org':
              v.icon = 'md-contact';
              break;
            case 'Api':
              v.icon = 'md-link';
              break;
            default:
              v.icon = '';
              break;
          }
        });
        this.power_type = [...data];
      })
    },
    methods: {
      loadTree() {
        let this_ = this;
        listAppPower(this.userInfo.appId).then(res => {
          this.sortData = res;
          this.data = [];
          let treeData = toTree(res);
          function f(data) {
            forEach(data, ( v ) => {
              v.title = v.name;
              v.label = v.name;
              v.value = v.id;
              Vue.set( v ,'expand',true);
              if(v.children && v.children.length){
                f(v.children)
              }
            })
          }
          f( treeData );
          this.data = treeData;
        })
      },
      select(data) {
        if(!data){
          this.addModal = false;
          this.selected = null;
          return
        }
        this.selected = data;
        this.formData = {...data};
        this.addModal = true;

        let this_ = this;
        this.thisParentId = [];
        function f(id, data, arr) {
          forEach(data, (v)=>{
            if(v.id == id){
              arr.push( id )
              if(v.parentId) {
                f( v.parentId,  this_.data, arr );
              }
              return ;
            }
            if(v.children){
              f( id, v.children, arr )
            }
          });
        }
        f( data.parentId, this.data, this.thisParentId );
        this.thisParentId = this.thisParentId.reverse();
      },
      add(name) {
        this.formData = {};
        this.addModal = true;
      },
      validForm(){
        if(!this.formData.name){
          this.$Message.error('请填写名称!');
          return false;
        }
        if(!this.formData.code){
          this.$Message.error('请填写编码!');
          return false;
        }
        if(!this.formData.url){
          this.$Message.error('请填写URL!');
          return false;
        }
        if(!this.formData.powerType){
          this.$Message.error('请选择类型!');
          return false;
        }
        return true;
      },
      handleSubmit(name) {
        let this_ = this;
        let valid = this.validForm();
        if (valid) {
          let data = {
            ...this_.formData,
          };
          data.appId = data.appId ||  this_.userInfo.appId;
          data.parentId = this_.thisParentId[this_.thisParentId.length-1];
          delete data.expand;
          delete data.nodeKey;
          delete data.title;
          saveAppPower(data).then(res => {
            if (!res) return;
            this_.addModal = false;
            this_.$Message.success('操作成功!');
            this_.loadTree();
          })
        }
      },
      handleReset(name) {
        this.$refs[name].resetFields();
        this.addModal = false;
      },
      delClass() {
        let id = this.selected.id;
        let this_ = this;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该模块？删除后无法恢复！</p>',
          onOk: () => {
            deleteAppPower(id).then(res => {
              if (!res) return;
              this_.$Message.info('删除成功');
              this_.loadTree();
              this.formData = {};
            })
          },
          onCancel: () => {
          }
        });
      },
      renderContent (h, { root, node, data }) {
        let icon = '';
        forEach(this.power_type,function (v, i) {
          if( data.powerType == v.name ){
            icon = v.icon;
          }
        });
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          },
          class: ["ivu-tree-title", {"ivu-tree-title-selected": this.selectId == data.id}],
          on: {
            click: () => {
              this.selectId = data.id;
              this.select(data);
            }
          }
        }, [
          h('span', {}, [
            h('Icon', {
              props: {
                type: icon || 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ])
        ]);
      },
      sortShow(){
        this.sortModal = true;
        let list = [];
        let this_ = this;
        forEach(this_.sortData,function (v) {
          if(v.parentId == this_.selected.parentId ){
            forEach(this_.power_type, (i) => {
              if(v.powerType == i.value){
                v.icon = i.icon
              }
            })
            list.push(v)
          }
        });

        this.sortList = list
      },
      saveSort(){
        powerSort( this.sortList ).then( res => {
          if( !res ) return;
          this.$Message.info('操作成功');
          this.loadTree();
        })
      },
      sortEnd(evt){
        forEach( this.sortList, (v, i) => {
          v.sort = i
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.sorts{
  padding: 5px 15px;
  background: rgba(213, 232, 252, 0.48);
  margin-bottom: 10px;
  cursor: pointer;
  i{
    margin-right: 5px;
  }
}
</style>
