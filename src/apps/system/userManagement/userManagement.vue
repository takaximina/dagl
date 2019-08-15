<template>
  <div>
    <Row :gutter="20">
      <Col span="6">
        <Card>
          <p slot="title">企业/部门</p>
          <p slot="extra">
            <Button size="small" icon="md-add" @click="add"></Button>
            <Button v-if="selected" size="small" icon="md-close" @click="del"></Button>
            <Button size="small" icon="md-list-box" @click="edi"></Button>
          </p>
          <div style="overflow: hidden">
            <Tree :render="renderContent" :data="data" @on-select-change="select"></Tree>
          </div>
        </Card>
      </Col>
      <Col span="18" v-if="selected">
        <Card>
          <p slot="title">人员</p>
          <p slot="extra">
            <Button size="small" @click="addPsl">新增</Button>
          </p>
          <page-table
            ref="pageTable"
            :tabData="pslData"
            :columns="columns"
            :pagesize="pageSize"
            :page="page"
            :total="total"
            :noEdit="true"
            @page-change="loadPsl">
          </page-table>
        </Card>
      </Col>
    </Row>
    <Modal
      v-model="modal"
      :title="flag ? '修改' : '新增'"
      @on-cancel="resetForm">
      <Form ref="deptForm" :model="deptForm" label-position="left" :label-width="110">
        <FormItem label="部门/企业名称：" prop="name">
          <Input v-model="deptForm.name"></Input>
        </FormItem>
        <FormItem label="上级部门/企业：">
          <Cascader v-model="parentList" :data="data" change-on-select></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveData">确定</Button>
        <Button type="text" @click="resetForm">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="pslModal"
      :title="pslFlag ? '修改' : '新增'"
      @on-cancel="resetForm">
      <Form ref="pslForm" :model="pslForm" label-position="left" :label-width="60">
        <FormItem label="姓名：">
          <Input v-model="pslForm.name"></Input>
        </FormItem>
        <FormItem label="性别：">
          <RadioGroup v-model="pslForm.sex">
            <Radio v-for="item in SexEnum" :label="item.name">{{item.label}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="电话：">
          <Input v-model="pslForm.tel"></Input>
        </FormItem>
        <FormItem label="邮箱：">
          <Input type="email" v-model="pslForm.email"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="savePsl">确定</Button>
        <Button type="text" @click="resetPsl">取消</Button>
      </div>
    </Modal>

    <Modal
      v-model="pslUserModal"
      title="设置账号">
      <Form label-position="left" :label-width="80">
        <FormItem label="账号名：">
          <Input v-model="pslUser.tel"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="setUser">确定</Button>
        <Button type="text" @click="pslUserModal = false">取消</Button>
      </div>
    </Modal>

    <Modal
      v-model="setRoleModal"
      title="设置角色">
      <Table ref="selection" :columns="roleColumns" :data="roleData"></Table>
      <div slot="footer">
        <Button type="primary" @click="saveUserRole">确定</Button>
        <Button type="text" @click="setRoleModal = false">取消</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import Vue from 'vue';
  import pageTable from '@/apps/components/page_table';
  import { toTree } from "@/libs/util";
  import { forEach } from '@/libs/tools';

  import { contextMenu } from "@/api/context";
  import { listAppRole } from "@/api/application/role";
  import { addUser, delUser } from "@/api/platform/account";
  import { setUsersToRole, setRolesToUser, listRoleByUser } from "@/api/application/tenant";
  import { dept, saveEntDept, listByDept, savePersonnel, personnelDel, deptDel } from "@/api/system/userManagement";

  //打印控件//
  import { getLodop } from "@/libs/lodopFuncs";

  export default {
    name: "userManagement",
    components: {
      pageTable
    },
    data(){
      let this_ = this;
      return {
        selected: '',
        data: [],
        selectId:'',
        flag: 0,

        modal: false,
        deptForm: {},
        parentList: [],

        SexEnum: [],
        defSex: {},
        pslData:[],
        columns:[
          {
            title: '#',
            type: 'index',
            width: 20
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '性别',
            key: 'sex',
            render: ( h, pms) => {
              let sex = '';
              forEach(this.SexEnum, (v) => {
                if(v.name == pms.row.sex){
                  sex = v.label ;
                  return false;
                }
              });
              return h('div', {}, sex)
            }
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '电话',
            key: 'tel'
          },
          {
            title: '操作',
            width: 330,
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
                      this_.ediPsl( params.row )
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: params.row.accountId ? 'none': 'inline-block'
                  },
                  on: {
                    click: () => {
                      this_.setAccount( params.row )
                    }
                  }
                }, '设置账号'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: params.row.accountId ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this_.delAccount( params.row )
                    }
                  }
                }, '删除账号'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    display: params.row.accountId ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this_.setRole( params.row )
                    }
                  }
                }, '设置角色'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this_.delPsl( params.row )
                    }
                  }
                }, '删除人员'),
                // h('Button', {
                //   props: {
                //     type: 'info',
                //     size: 'small'
                //   },
                //   style: {
                //     marginRight: '5px'
                //   },
                //   on: {
                //     click: () => {
                //       let LODOP = getLodop();
                //       LODOP.NewPage();
                //       LODOP.ADD_PRINT_BARCODE('5mm', '5mm', '50mm', '50mm' ,'QRCode', params.row.accountId );
                //       LODOP.PREVIEW();
                //     }
                //   }
                // }, '打印二维码'),
              ]);
            }
          }
        ],
        pageSize: 10,
        page: 0,
        total: 0,
        pslModal: false,
        pslFlag: 0,
        pslForm: {},

        pslUserModal: false,
        pslUser: {},

        setRoleModal: false,
        roleData: [],
        roleColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '#',
            type: 'index',
            width: 20
          },
          {
            title: '角色名称',
            key: 'name'
          },
          {
            title: '编码',
            key: 'code'
          }
        ],
        sltUser: {}
      }
    },
    computed:{
      userInfo(){
        return this.$store.getters.userInfo
      }
    },
    async created(){
      await contextMenu('com.ebs.platform.core.enums.SexEnum').then(res => {
        this.SexEnum = res;
        this.defSex = res[0];
        this.resetPsl();
      })
    },
    mounted(){
      this.loadData();
      this.resetForm();
      /*contextMenu('com.ebs.platform.core.enums.SexEnum').then( res => {
        this.SexEnum = res;
        this.defSex = res[0];
        this.resetPsl();
      })*/
      listAppRole(this.userInfo.appId).then(res => {
        this.roleData = res;
      })
    },
    methods:{
      loadData(){
        this.data = [];
        dept( this.userInfo.entId).then(res => {
          let treeData = toTree(res);
          function f(data) {
            forEach(data, ( v ) => {
              v.title = v.name;
              v.label = v.name;
              v.value = v.id;
              if(v.children && v.children.length){
                Vue.set( v ,'expand',true);
                f(v.children)
              }
            })
          }
          f( treeData );
          this.data = [{
            title: this.userInfo.entName,
            label: this.userInfo.entName,
            id: this.userInfo.entId,
            value: this.userInfo.entId,
            expand: true,
            children: treeData
          }];
        })
      },
      add(){
        this.flag = 0;
        this.modal = true;
      },
      del(){
        this.$Modal.confirm({
          title: '提示！',
          content: '<p>确认删除 "'+ this.selected.name +'"？</p>',
          onOk: () => {
            deptDel( this.selected.id ).then(res => {
              if (!res) return;
              this.$Message.info('删除成功');
              this.loadData();
              this.selected = ''
            })
          }
        });
      },
      edi(){
        this.flag = 1;
        this.modal = true;
        this.deptForm = this.selected;

        this.parentList = [];
        function f(id, data, arr) {
          if(!id) return ;
          forEach(data, (v)=>{
            if(v.id == id){
              arr.push( id )
              if(v.parentId) {
                f( v.parentId,  data, arr);
              }
              return ;
            }
            if(v.children){
              f( id, v.children, arr )
            }
          });
        }
        f( this.selected.parentId, this.data, this.parentList );
        this.parentList = this.parentList.reverse();
        this.parentList.unshift(this.data[0].id);
      },
      select(row){
        if( row.id == this.userInfo.entId ){
          this.selected = ''
          return ;
        }
        this.selected = row;
        this.loadPsl(0);
      },
      renderContent (h, { root, node, data }) {
        let icon = '';
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          },
          class: ["ivu-tree-title", {"ivu-tree-title-selected":this.selectId == data.id}],
          on:{
            click: () => {
              this.selectId = data.id;
              this.select(data);
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
      validate(){
        if( !this.deptForm.name ){
          this.$Message.error('请输入部门/企业名称');
          return false;
        }
        return true
      },
      resetForm(){
        this.modal = false;
        this.deptForm = {};
      },
      saveData(){
        let valid = this.validate();
        if( valid ){
          let data = { ...this.deptForm };
          data.parentId = this.parentList[ this.parentList.length-1 ];
          saveEntDept( data ).then(res => {
            if (!res) return;
            this.loadData();
            this.resetForm();
            this.$Message.success('操作成功!');
          })
        }
      },

      loadPsl(index){
        let data = {
          condition: this.selected.id,
          pageIndex: index,
          pageSize: this.pageSize
        };
        listByDept( data ).then( res => {
          this.total = res.resultCount;
          this.pslData = res.respnoseData;
        })
      },
      addPsl(){
        this.pslModal = true;
        this.pslFlag = 0;
      },
      validatePsl(){
        if( !this.pslForm.name ){
          this.$Message.error('请输入姓名');
          return false;
        }
        if( !this.pslForm.tel ){
          this.$Message.error('请输入电话');
          return false;
        }
        return true
      },
      resetPsl(){
        this.pslModal = false;
        this.pslForm = {
          sex: this.defSex.name
        };
      },
      savePsl(){
        let valid = this.validatePsl();
        if( valid ){
          let data = { ...this.pslForm };
          data.deptId = this.selected.id;
          savePersonnel( data ).then(res => {
            if (!res) return;
            this.loadPsl();
            this.resetPsl();
            this.$Message.success('操作成功!');
          })
        }
      },
      delPsl(row){
        this.$Modal.confirm({
          title: '提示！',
          content: '<p>确认删除 "'+ row.name +'"？</p>',
          onOk: () => {
            personnelDel( row.id ).then(res => {
              if (!res) return;
              this.$Message.info('删除成功');
              this.loadPsl();
            })
          }
        });
      },
      ediPsl(row){
        this.pslFlag = 1;
        this.pslForm = row;
        this.pslModal = true;
      },
      setAccount(row){
        this.pslUserModal = true;
        this.pslUser = { ...row };
      },
      setUser(){
        let data = {
          userName: this.pslUser.tel,
          password: '123456',
          personnelId: this.pslUser.id
        };
        addUser( data ).then( res=> {
          if(!res) return;
          this.$Message.info('设置成功！');
          this.pslUserModal = false;
          this.loadPsl();
        })
      },
      delAccount(row){
        this.$Modal.confirm({
          title: '提示！',
          content: '<p>确认删除 "'+ row.name +'" 的用户名?</p>',
          onOk: () => {
            delUser( row.accountId ).then(res => {
              if (!res) return;
              this.$Message.info('删除成功！');
              this.loadPsl();
            })
          }
        });
      },
      setRole(row){
        this.sltUser = { ...row };
        let this_ = this;
        listRoleByUser(row.accountId).then( res => {
          if(!res) return ;
          forEach( this_.roleData ,(k) => {
            Vue.set( k ,'_checked',false);
            forEach(res ,(v) => {
              if(v.id == k.id){
                Vue.set( k ,'_checked',true);
              }
            });
          });
          this.setRoleModal = true;
        })
      },
      saveUserRole(){
        let data = {
          userId: this.sltUser.accountId,
          roels: this.$refs.selection.getSelection().map(item => item.id)
        };
        setRolesToUser(data).then( res => {
          if(!res) return ;
          this.loadPsl();
          this.setRoleModal = false;
          this.$Message.info('设置成功');
        })
      }
    }
  }
</script>

<style scoped>

</style>
