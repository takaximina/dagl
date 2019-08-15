<template>
  <div>
    <Card :bordered="false" style="float:left;width:100%">
      <p slot="title">系统用户管理</p>
      <Card :bordered="false" style="width:250px;float:left">
        <!-- :render="renderContent" show-checkbox  display="none"  position: relative;left:300px;bottom:100px-->
        <p slot="title">企业列表</p>
        <p slot="extra">
          <Button type="primary" size="small" v-if="selectData.length>0" @click="modal2 = true">添加</Button>
          <Button type="primary" size="small" v-if="selectData.length>0&&selectData[0].parentid!='-1'"
                  @click="modal3 = true">修改
          </Button>
          <Button type="primary" size="small" v-if="selectData.length>0&&selectData[0].parentid!='-1'"
                  @click="RemoveDept">删除
          </Button>
        </p>
        <p>
          <Tree :data="treeData" @on-select-change="select" ref="tree"></Tree>
        </p>
      </Card>
      <Card :bordered="false" style="width:300px;float:left;position: relative;left:25px;">
        <p slot="title">人员列表</p>
        <p slot="extra">
          <Button type="primary" size="small" @click="modal1 = true">添加</Button>
        </p>
        <p>
        <Table highlight-row :data="personnel" :columns="columns7" @on-current-change="rule">
        </Table>
        </p>
      </Card>
      <Card :bordered="false" style="width:350px;float:left;position: relative;left:50px;">
        <p slot="title">人员信息</p>
        <p>
          <!-- @on-current-change="rule" -->
        <Table highlight-row :data="info" size=small :border="true" :stripe="true" :columns="columns8"></Table>
        </p>
        <Card v-if="personnel.length>0">
          <p slot="title">设置权限</p>
          <p slot="extra">
            <Button type="primary" size="small" @click="setUseRole">保存</Button>
          </p>
          <p>
            <CheckboxGroup>
              <Checkbox
                v-for="role in UserRole"
                v-model="role.checked"
                :label="role.id"
                :true-value=1
                :false-value=0>
                {{role.name}}
              </Checkbox>
            </CheckboxGroup>
          </p>
        </Card>
      </Card>
      <Modal
        v-model="modal1"
        width="680"
        title="添加人员"
        @on-ok="Add"
        draggable
        :mask-closable="true">

        姓名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Input v-model="name" placeholder="请输入姓名" style="width: 300px" size="large"/>

        性别：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Select v-model="modelMale" style="width:200px">
          <Option v-for="item in sex" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select><br/>

        手机(必填)：<Input v-model="tel" placeholder="请输入手机" style="width: 300px" size="large"/><br/>

        邮箱：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Input v-model="email" placeholder="请输入邮箱" style="width: 300px" size="large"/>

        生日：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <DatePicker v-model="birthDay" type="date" @on-change="birthDay=$event" ref="birth" placeholder="请选择日期"
                    style="width: 200px"></DatePicker>
      </Modal>
      <Modal
        v-model="modal2"
        width="380"
        title="编辑"
        @on-ok="AddDept"
        draggable
        :mask-closable="true">

        名称：
        <Input v-model="deptName" placeholder="请输入名称" style="width: 300px"/><br/>
        <br/>

        编码：
        <Input v-model="deptCode" placeholder="请输入名称" style="width: 300px"/>
      </Modal>
      <Modal
        v-model="modal3"
        width="380"
        title="编辑"
        @on-ok="amend"
        draggable
        :mask-closable="true">

        名称：
        <Input v-model="deptName" placeholder="请输入名称" style="width: 300px"/><br/>
        <br/>

        编码：
        <Input v-model="deptCode" placeholder="请输入名称" style="width: 300px"/>
      </Modal>
    </Card>
  </div>
</template>
<script>

  export default {
    name: "person",
    data() {
      return {
        //checked:0,
        treeData: [],
        check: false,
        UserRole: [],
        Role: {
          roleIds: [],
          tenantId: '',
          userId: ''
        },
        modal2: false,
        modal3: false,
        userol: [],
        info: [],
        columns8: [
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '电话',
            key: 'tel'
          },
          {
            title: '邮箱',
            key: 'mail'
          },
          {
            title: '生日',
            key: 'birthDay'
          },
        ],
        sex: [
          {
            value: 'Male',
            label: '男'
          },
          {
            value: 'Female',
            label: '女'
          },
        ],
        data1: [
          {
            title: '网鑫高科',
            expand: false,
            loading: false,
            id: -1,
            parentid: -1,
            children: []
          }
        ],
        columns7: [
          {
            title: '名字',
            key: 'name',
          },
          {
            title: '电话',
            key: 'tel'
          },
          {
            title: '操作',
            key: 'action',
            width: 'auto',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',

                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                }, '删除'),
              ]);
            }
          }
        ],
        modal1: false,
        modelMale: '',
        tel: '',
        name: '',
        email: '',
        birthDay: '',
        deptName: '',
        deptCode: '',
        EntList: [],
        DeptList: [],
        PersonnelList: {
          name: '',
          tel: '',
          mail: '',
          birthDay: '',
          sex: '',
          entDeptId: '',
          entId: '',
          tenantId: ''
        },
        personnel: [],
        selectData: []
      }
    },
    mounted: function () {
      this.init();
    },
    methods: {
      //加载列表
      init() {
        let that = this;
        this.$http.post('ent/listAllEntAndDept').then(res => {
          let data = res.data.data
          //console.log("  data："+JSON.stringify(data));
          let tree = function (data, parentId) {
            let itemArr = []
            for (var i = 0; i < data.length; i++) {
              let node = data[i]
              //console.log("NODE："+JSON.stringify(node))
              if (node.parent_id == parentId) {
                let newNode = {}
                newNode.id = node.id
                newNode.title = node.name
                newNode.parentid = node.parent_id
                newNode.children = tree(data, node.id)
                itemArr.push(newNode)
              }
            }
            return itemArr
          }
          this.treeData = tree(data, '-1')
        })
      },
      select(data) {
        let that = this
        that.selectData = data;
        console.log("SELECT：" + JSON.stringify(that.selectData))
        this.$http.post('/ent/listPersonnelByDeptId', data[0].id).then(res => {
          that.personnel = res.data.data
        })
      },
      rule(currentRow) {
        let that = this
        this.info = [currentRow]
        this.$http.post('/tenant/queryUserRoleList', this.info[0].userId).then(res => {
          this.UserRole = res.data.data
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].checked > 0) {
              this.checked = res.data.data[i].checked
            }
          }
        })
      },
      checkRole(data) {
        this.userol = data
      },
      setUseRole() {
        let that = this
        let param = {
          "roleIds": [],
          "tenantId": that.$store.getters.userInfo.tenantId,
          "userId": that.info[0].userId
        }
        for (let o of that.UserRole) {
          if (o.checked > 0) {
            param.roleIds.push(o.id)
          }
        }
        this.$http.post('http://39.108.146.55/tenant/setUserRole', param).then(res => {
          if (res.data.message == 'OK') {
            this.$Message.success('保存成功！');
            this.$http.post('/tenant/queryUserRoleList', this.info[0].userId).then(res => {
              this.UserRole = res.data.data
              for (let i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].checked > 0) {
                  this.checked = res.data.data[i].checked
                }
              }
            })
          }
        })
      },
      Add() {
        let that = this;
        this.PersonnelList.name = that.name
        this.PersonnelList.tel = that.tel
        this.PersonnelList.mail = that.email
        this.PersonnelList.birthDay = this.$refs.birth.value
        this.PersonnelList.sex = that.modelMale
        this.PersonnelList.entDeptId = that.selectData[0].id
        this.PersonnelList.entId = '8df04a97-e549-4d16-9249-b0e52ca465bd'
        this.PersonnelList.tenantId = that.$store.getters.userInfo.tenantId
        this.$http.post('/ent/savePersonnelUser', this.PersonnelList).then(res => {
          if (res.data.message == 'OK') {
            this.$Message.success('添加成功');
            this.$http.post('/ent/listPersonnelByDeptId', that.selectData[0].id).then(res => {
              that.personnel = res.data.data
            })
          }
        })
      },
      AddDept() {
        let that = this
        let params = {
          entId: that.selectData[0].id,
          name: that.deptName,
          parentId: that.selectData[0].parentid
        }
        that.$http.post('/ent/saveDept', params).then(res => {
          if (res.data.message == 'OK') {
            this.$Message.success('添加成功');
            this.init();
          }
        })
      },
      amend() {
        let that = this
        //console.log(JSON.stringify(that.selectData[0]))
        let params = {
          id: that.selectData[0].id,
          entId: that.selectData[0].parentid,
          name: that.deptName,
          parentId: that.selectData[0].parentid
        }
        console.log("PARAMS：" + JSON.stringify(params))
        that.$http.post('/ent/saveDept', params).then(res => {
          if (res.data.message == 'OK') {
            this.$Message.success('修改成功');
            this.init();
          }
        })
      },
      RemoveDept() {
        let that = this
        let id = that.selectData[0].id
        that.$Modal.confirm({
          title: "确认删除吗?",
          onOk: () => {
            that.$http.post('/ent/removeDept', id).then(res => {
              if (res.data.message == 'OK') {
                this.$Message.success('删除成功');
                this.init();
              }
            })
          }
        });

      },
      remove(params) {
        let that = this
        that.$Modal.confirm({
          title: "确认删除吗?",
          onOk: () => {
            that.$http.post('/ent/removePersonnel', params.row.id).then(res => {
              that.$Message.info("删除成功");
              this.$http.post('/ent/listPersonnelByDeptId', that.selectData[0].id).then(res => {
                that.personnel = res.data.data
              })
            });
          }
        });
      },
    }
  }
</script>
