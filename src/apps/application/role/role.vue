<template>
  <div>
    <Row :gutter="20">
      <Col span="6">
        <Card>
          <p slot="title">角色</p>
          <p slot="extra">
            <Button size="small" icon="md-add" @click="addData"></Button>
            <Button v-if="selected" size="small" icon="md-close" @click="delData"></Button>
            <Button v-if="selected" size="small" icon="md-list-box" @click="ediData"></Button>
          </p>
          <CellGroup @on-click="sltData">
            <Cell v-for="item in tableData" :selected="selected == item.id" :name="item.id" :title="item.name" :extra="item.code"/>
          </CellGroup>
        </Card>
      </Col>
      <Col span="6" v-if="selected">
        <Card>
          <p slot="title">绑定模块</p>
          <div style="overflow: hidden">
            <Tree
              ref="powerTree"
              show-checkbox multiple
              :render="renderContent"
              :data="moduleData"></Tree>
            <div class="brs"></div>
            <div style="text-align: right">
              <Button size="small" type="primary" @click="saveRolePower">确定</Button>
              &nbsp;
              <!--<Button size="small" @click="resetPower">取消</Button>-->
            </div>
          </div>
        </Card>
      </Col>
    </Row>
    <!--<Card>
      <page-table
        ref="pageTable"
        :tabData="tableData"
        :columns="columns"
        :pagesize="pagesize"
        :page="page"
        :total="total"
        @add-page="addData"
        @del-page="delData">
      </page-table>
    </Card>-->
    <Modal
      v-model="modal"
      :title=" flag ? '修改' : '新增用户' ">
      <Form ref="formData" :model="formData" label-position="left" :label-width="100">
        <FormItem label="角色名称：" prop="name">
          <Input v-model="formData.name"></Input>
        </FormItem>
        <FormItem label="编码：" prop="code">
          <Input v-model="formData.code"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveData">确定</Button>
        <Button type="text" @click="resetForm">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import pageTable from '@/apps/components/page_table';
  import { forEach } from '@/libs/tools';
  import { toTree } from "@/libs/util";
  import Vue from 'vue';

  import { listAppRole, saveAppRole, deleteAppRole, setRolePowers, listAppPowerByRoleId } from "@/api/application/role";
  import { listAppPower } from "@/api/application/module";
  import { contextMenu } from "@/api/context";

  export default {
    name: "role",
    components:{
      pageTable
    },
    mounted(){
      this.loadData();
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
      });
      listAppPower(this.appId).then(res => {
        let data = toTree(res);
        function f(data) {
          forEach(data, ( v ) => {
            v.title = v.name;
            v.label = v.name;
            v.value = v.id;
            if(v.children && v.children.length){
              f(v.children)
            }
          })
        }
        f( data );
        this.moduleData = data
      })
    },
    data(){
      return {
        appId: this.$store.getters.userInfo.appId || '',
        tenantId: this.$store.getters.userInfo.tenantId || '',
        tableData:[],
        selected: '',
        columns: [
          {
            title: '#',
            type: 'index',
            width: 30
          },
          {
            title: '角色名',
            key: 'name',
          },
          {
            title: '编码',
            key: 'code',
          }
        ],
        pagesize: 10,
        page: 0,
        total: 0,

        modal: false,
        flag: 0,
        formData: {},

        moduleData: [],
        power_type: [],
        selectId: '',
      }
    },
    methods:{
      loadData(){
        listAppRole(this.appId).then(res => {
          this.tableData = res ;
        });
      },
      sltData(id){
        if( !id ){
          this.selected = ''; return
        }
        this.selected = id;
        listAppPowerByRoleId(id).then(res => {
          let fun = function (tree, data){
            forEach( tree, ( v ) => {
              Vue.set( v ,'checked',false);
              Vue.set( v ,'expand',true);
              forEach(data, ( k ) => {
                if( v.id == k.id ){
                  Vue.set( v ,'checked',true);
                  return false;
                }
              });
              if( v.children ){
                fun(v.children ,data)
              }
            })
          };
          fun( this.moduleData , res );
        })
      },
      addData(){
        this.flag = 0;
        this.modal = true;
      },
      validate(){
        if( !this.formData.name ){
          this.$Message.error('请输入角色名称');
          return false;
        }
        if( !this.formData.code ){
          this.$Message.error('请输入编码');
          return false;
        }
        return true
      },
      saveData(){
        let validate = this.validate();
        if(!validate) return ;
        let data = {...this.formData};
        // data.appId = this.appId;
        // data.tenantId = this.tenantId;
        saveAppRole( data ).then(res => {
          if(!res) return ;
          this.$Message.success('操作成功!');
          this.resetForm();
          this.loadData();
        })
      },
      resetForm(){
        this.modal = false;
        this.$refs.formData.resetFields();
      },
      ediData(){
        let id = this.selected;
        let select = '';
        forEach(this.tableData,(v) =>{
          if(v.id == id){
            select = {...v};
          }
        });
        this.formData = select;
        this.flag = 1;
        this.modal = true;
      },
      delData(){
        let id = this.selected;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该角色？删除后无法恢复！</p>',
          onOk: () => {
            deleteAppRole( id ).then(res => {
              if (!res) return;
              this.$Message.info('删除成功');
              this.loadData();
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
          class: ["ivu-tree-title", {"ivu-tree-title-selected":this.selectId == data.id}],
          on:{
            click: () => {
              this.selectId = data.id;
              // this.select(data);
            }
          }
        }, [
          h('span', {} ,[
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
      saveRolePower(){
        let power = this.$refs.powerTree.getCheckedNodes();
        let powerList = [];
        forEach(power, (v) => {
          powerList.push(v.id);
        });
        let data = {
          codes: powerList,
          roleId: this.selected
        };
        setRolePowers(data).then( res => {
          if(!res ) return ;
          this.sltData( this.selected );
          this.$Message.info('操作成功');
        })
      },
      resetPower(){},
    }
  }
</script>

<style scoped>

</style>
