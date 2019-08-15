<template>
  <div style="background:#eee;padding: 5px">
    <Card :bordered="false" v-if="editAppObj === null">
      <p slot="title">应用列表</p>
      <p slot="extra">
        <Button type="primary" size="small" @click="showAdd">添加</Button>
      </p>
      <p>
      <Table size="small" stripe :columns="appCols" :data="appList">
      </Table>
      </p>
    </Card>
    <Card :bordered="false" v-if="editAppObj != null">
      <p slot="title">编辑 {{editAppObj.name}}</p>
      <p slot="extra">
        <Button type="primary" size="small" @click="backToList">返回</Button>
      </p>
      <p>
        <Tabs value="infoSet" @on-click="changeTab" :animated="false">
          <TabPane label="基本信息" name="infoSet">
            <div style="min-height:400px;background:#eee;padding: 5px">
              <Card>
                <Form :label-width="80">
                  <FormItem label="名称">
                    <Input v-model="appObj.name" placeholder="输入应用名称..."></Input>
                  </FormItem>
                  <FormItem label="描述">
                    <Input v-model="appObj.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                           placeholder="输入应用描述..."></Input>
                  </FormItem>
                  <FormItem>
                    <Button type="primary" @click="doSaveApp">保存设置</Button>
                  </FormItem>
                </Form>
              </Card>

            </div>
          </TabPane>
          <TabPane label="权限设置" name="powerSet">
            <Row>
              <Col span="10">
                <div style="min-height:400px;background:#eee;padding: 5px">
                  <Card>
      <p slot="title">前台三级权限</p>
      <p slot="extra">
        <Button size="small" @click="addPowerWin" icon="md-add"></Button>
        <Button v-if="selectedPower" size="small" @click="editPowerWindow" icon="md-create"></Button>
        <Button v-if="selectedPower" size="small" @click="removePowerWin" icon="md-close"></Button>
      </p>
      <p>
        <Tree @on-select-change="selectPower" :data="appObj.powers"></Tree>
      </p>
    </Card>
  </div>
  </Col>
  <Col span="14">
    <div style="min-height:400px;background:#eee;padding: 5px">
      <Card>
        <p slot="title">后台请求规则</p>
        <p slot="extra">
          <Button size="small" @click="addApiWin" icon="md-add"></Button>
          <Button v-if="selectedApi" size="small" @click="editApiWin" icon="md-create"></Button>
          <Button v-if="selectedApi" size="small" @click="removeApiWin" icon="md-close"></Button>
        </p>
        <p>
        <Table :disabled-hover="true" @on-current-change="selectApi" highlight-row size="small" :columns="powerCol"
               :data="appObj.apis"></Table>
        </p>
      </Card>
    </div>
  </Col>
  </Row>
  </TabPane>
  <TabPane label="角色设置" name="roleSet">
    <Row>
      <Col span="6">
        <div style="min-height:400px;background:#eee;padding: 5px">
          <Card>
            <p slot="title">角色</p>
            <p slot="extra">
              <Button size="small" @click="addRoleWin" icon="md-add"></Button>
              <Button v-if="selectedRole" size="small" @click="editRoleWin" icon="md-create"></Button>
              <Button v-if="selectedRole" size="small" @click="removeRoleWin" icon="md-close"></Button>
            </p>
            <p>
              <Tree @on-select-change="selectRole" :data="appObj.roles"></Tree>
            </p>
          </Card>
        </div>
      </Col>
      <Col span="9">
        <div style="min-height:400px;background:#eee;padding: 5px">
          <Card v-if="selectedRole">
            <p slot="title">Web权限</p>
            <p slot="extra">
              <Button size="small" @click="saveAllRolePower()">保存</Button>
            </p>
            <p>
              <Tree :data="appObj.rolePowers" ref="rolwPowerTree" show-checkbox></Tree>
            </p>
          </Card>
        </div>
      </Col>
      <Col span="9">
        <div style="min-height:400px;background:#eee;padding: 5px">
          <Card v-if="selectedRole">
            <p slot="title">Api权限</p>
            <p slot="extra">
              <Button size="small" @click="saveAllRoleApiRule()">保存</Button>
            </p>
            <p>
              <CellGroup>
                <Cell v-for="o in appObj.roleApiRules" :key="o.id">
                  <Checkbox v-model="o.checked" size="large" slot="icon">{{o.name}}</Checkbox>
                </Cell>
              </CellGroup>
            </p>
          </Card>
        </div>
      </Col>
    </Row>
  </TabPane>
  <TabPane label="字典设置" name="dictSet">
    <Row>
      <Col span="10">
        <div style="min-height:400px;background:#eee;padding: 5px">
          <Card>
            <p slot="title">字典</p>
            <p slot="extra">
              <Button size="small" @click="addDictWin" icon="md-add"></Button>
              <Button v-if="selectedDict" size="small" @click="editDictWin" icon="md-create"></Button>
              <Button v-if="selectedDict" size="small" @click="removeDictWin" icon="md-close"></Button>
            </p>
            <p>
            <Table :disabled-hover="true" @on-current-change="selectDict" size="small" :data="appObj.dicts"
                   :columns="dictCol" highlight-row></Table>
            </p>
          </Card>
        </div>
      </Col>
      <Col span="14">
        <div v-if="selectedDict" style="min-height:400px;background:#eee;padding: 5px">
          <Card>
            <p slot="title">字典项</p>
            <p slot="extra">
              <Button size="small" @click="addDictValueWin" icon="md-add"></Button>
              <Button v-if="selectedDict" size="small" @click="editDictValueWin" icon="md-create"></Button>
              <Button v-if="selectedDict" size="small" @click="removeDictValueWin" icon="md-close"></Button>
            </p>
            <p>
            <Table :disabled-hover="true" @on-current-change="selectDictValue" size="small" :data="dictValueList"
                   :columns="dictCol" highlight-row></Table>
            </p>
          </Card>
        </div>
      </Col>
    </Row>
  </TabPane>
  <TabPane label="租户列表" name="tenantSet">

    <div style="min-height:400px;background:#eee;padding: 5px">
      <Card>
        <p slot="title">租户列表</p>
        <p slot="extra">
          <Button size="small" @click="addTenantWin" icon="md-add"></Button>
          <Button v-if="selectedTenant" size="small" @click="editTenantWin" icon="md-create"></Button>
          <Button v-if="selectedTenant" size="small" @click="removeTenantWin" icon="md-close"></Button>
        </p>
        <p>
        <Table size="small" stripe :columns="tenantCol" :data="appObj.tenants"></Table>
        </p>
      </Card>
    </div>
  </TabPane>
  </Tabs>
  </p>
  </Card>
  <!-- Modals -->
  <Modal v-model="showAddWin" scrollable title="添加应用" @on-ok="doSaveApp">
    <div>
      <Form :label-width="80">
        <FormItem label="名称">
          <Input v-model="appObj.name" placeholder="输入应用名称..."></Input>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="appObj.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="输入应用描述..."></Input>
        </FormItem>
      </Form>
    </div>
  </Modal>
  <Modal v-model="showAddPower" scrollable title="前台权限" :footer-hide="true">
    <div>
      <Form :label-width="80">
        <FormItem v-if="selectedPower" label="上级权限">
          <Input disabled v-model="selectedPower.title" placeholder="输入名称..."></Input>
        </FormItem>
        <FormItem label="名称">
          <Input v-model="powerObj.name" placeholder="输入名称..."></Input>
        </FormItem>
        <FormItem label="编码">
          <Input v-model="powerObj.code" placeholder="输入编码..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="savePower">保存</Button>
          <Button style="margin-left: 8px" @click="cancelPower">取消</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
  <Modal v-model="showAddApi" scrollable title="Api权限" :footer-hide="true">
    <div>
      <Form :label-width="80">
        <FormItem label="名称">
          <Input v-model="apiObj.name" placeholder="输入名称..."></Input>
        </FormItem>
        <FormItem label="路径规则">
          <Input v-model="apiObj.mapping" placeholder="输入路径规则，如/api/**..."></Input>
        </FormItem>
        <FormItem label="允许方式">
          <Input v-model="apiObj.methods" placeholder="用逗号隔开，如get,post..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveApi">保存</Button>
          <Button style="margin-left: 8px" @click="cancelApi">取消</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
  <Modal v-model="showAddRole" scrollable title="角色" :footer-hide="true">
    <div>
      <Form :label-width="80">
        <FormItem label="名称">
          <Input v-model="appRole.name" placeholder="输入名称..."></Input>
        </FormItem>
        <FormItem label="编码">
          <Input v-model="appRole.code" placeholder="输入编码"></Input>
        </FormItem>
        <FormItem label="Api规则">
          <i-switch v-model="appRole.useRule" size="large">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
        <Divider/>
        <FormItem label="特定租户">
          <Select v-model="appRole.tenantId">
            <Option value="-1">不指定</Option>
            <Option v-for="o in appObj.tenants" :key="o.id" :value="o.id">{{o.rentName}}</Option>
          </Select>
          <Alert show-icon style="margin-top:5px" type="warning">如果指定了租户，则该角色就为该租户私有</Alert>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveRole">保存</Button>
          <Button style="margin-left: 8px" @click="cancelRole">取消</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
  <Modal v-model="showAddDict" scrollable title="字典" :footer-hide="true">
    <div>
      <Form :label-width="80">
        <FormItem label="名称">
          <Input v-model="dictObj.name" placeholder="输入名称..."></Input>
        </FormItem>
        <FormItem label="编码">
          <Input v-model="dictObj.code" placeholder="输入编码..."></Input>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="dictObj.remark" placeholder="输入描述..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveDict">保存</Button>
          <Button style="margin-left: 8px" @click="cancelDict">取消</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
  <Modal v-model="showAddDictValue" scrollable title="字典项" :footer-hide="true">
    <div>
      <Form :label-width="80">
        <FormItem label="名称">
          <Input v-model="dictValueObj.name" placeholder="输入名称..."></Input>
        </FormItem>
        <FormItem label="编码">
          <Input v-model="dictValueObj.code" placeholder="输入编码..."></Input>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="dictValueObj.remark" placeholder="输入描述..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveDictValue">保存</Button>
          <Button style="margin-left: 8px" @click="cancelDictValue">取消</Button>
        </FormItem>
      </Form>
    </div>
  </Modal>
  </div>
</template>

<script>
  export default {
    name: 'app_manage',
    data() {
      return {
        editAppObj: null,
        powerObj: {},
        apiObj: {},
        appRole: {},
        dictObj: {},
        dictValueObj: {},
        selectedPower: null,
        selectedApi: null,
        selectedRole: null,
        selectedDict: null,
        selectedDictValue: null,
        //存储查询信息
        appObj: {
          appType: 'All',
          name: '',
          remark: '',
          powers: [],
          apis: [],
          roles: [],
          dicts: [],
          tenants: [],
          rolePowers: [],
          roleApiRules: []
        },
        dictValueList: [],
        showAddWin: false,
        showAddApi: false,
        showAddPower: false,
        showAddRole: false,
        showAddDict: false,
        showAddDictValue: false,
        loading: false,
        powerCol: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'name',
            sortable: true
          },
          {
            title: '映射',
            key: 'mapping',
            sortable: true
          },
          {
            title: '类型',
            key: 'methods',
            sortable: true
          },

        ],
        dictCol: [
          {
            title: '名称',
            key: 'name',
            sortable: true
          },
          {
            title: '编码',
            key: 'code',
            sortable: true
          }
        ],
        tenantCol: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'rentName',
            sortable: true
          },
          {
            title: '租赁类型',
            key: 'rent_type',
            sortable: true,
            render: function (createElement) {
              if (this.row.rent_type === 0) {
                return createElement(
                  'div',
                  '企业'
                )
              } else {
                return createElement(
                  'div',
                  '个人'
                )
              }
            }
          },
          {
            title: '起始日期',
            key: 'start_date',
            sortable: true,
            render: function (h, params) {
              return h('div',
                new Date(this.row.start_date).Format('yyyy-MM-dd')
              )
            }
          },
          {
            title: '结束日期',
            key: 'end_date',
            sortable: true,
            render: function (h, params) {
              return h('div',
                new Date(this.row.end_date).Format('yyyy-MM-dd')
              )
            }
          },
          {
            title: '创建人',
            key: 'create_username',
            sortable: true
          }
        ],
        appCols: [
          {
            title: '序号',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            key: 'name',
            sortable: true
          },
          {
            title: '描述',
            key: 'remark'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
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
                      this.edit(params.index)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        appList: []
      }
    },
    mounted: function () {
      this.initLoad()
    },
    methods: {
      saveDictValue() {
        let that = this
        if (that.dictValueObj.name === '') {
          that.$Message.error('名称必须填写')
        } else if (that.dictValueObj.code === '') {
          that.$Message.error('编码必须填写')
        } else {
          that.dictValueObj.appDictId = that.selectedDict.id
          that.$http.post('/app/saveDictValue', that.dictValueObj).then(res => {
            that.showAddDictValue = false
            that.loadDictValues()
          })
        }
      },
      loadDictValues() {
        let that = this
        that.selectedDictValue = null
        if (that.selectedDict) {
          that.$http.post('/app/listValueByDictId', that.selectedDict.id).then(res => {
            that.dictValueList = res.data.data
          })
        }
      },
      cancelDictValue() {
        this.showAddDictValue = false
      },
      addDictValueWin() {
        delete this.dictValueObj.id
        this.dictValueObj.name = ''
        this.dictValueObj.code = ''
        this.dictValueObj.remark = ''
        this.showAddDictValue = true
      },
      editDictValueWin() {
        this.dictValueObj = this.selectedDictValue
        this.showAddDictValue = true
      },
      removeDictValueWin() {
        let that = this
        that.$Modal.confirm({
          title: '确认删除吗', onOk: function () {
            that.$http.post('/app/removeDictValue', that.selectedDictValue.id).then(res => {
              setTimeout(() => {
                if (res.data.code === 0) {
                  that.loadDictValues()
                } else {
                  that.$Message.error(res.data.message)
                }
              })
            })
          }
        })
      },
      selectDictValue(o) {
        this.selectedDictValue = o
      },
      selectDict(o) {
        let that = this
        that.selectedDict = o
        that.loadDictValues()
      },
      addDictWin() {
        delete this.dictObj.id
        this.dictObj.name = ''
        this.dictObj.code = ''
        this.dictObj.remark = ''
        this.showAddDict = true
      },
      cancelDict() {
        this.showAddDict = false
      },
      editDictWin() {
        this.dictObj = this.selectedDict
        this.showAddDict = true
      },
      saveDict() {
        let that = this
        if (that.dictObj.name === '') {
          that.$Message.error('名称必须填写')
        } else if (that.dictObj.code === '') {
          that.$Message.error('编码必须填写')
        } else {
          that.dictObj.appId = that.appObj.id
          that.dictObj.parentId = -1
          that.$http.post('/app/saveDict', that.dictObj).then(res => {
            that.showAddDict = false
            that.getAppDicts()
          })
        }

      },
      removeDictWin() {
        let that = this
        that.$Modal.confirm({
          title: '确认删除吗', onOk: function () {
            that.$http.post('/app/removeDict', that.selectedDict.id).then(res => {
              setTimeout(() => {
                if (res.data.code === 0) {
                  that.getAppDicts()
                } else {
                  that.$Message.error(res.data.message)
                }
              })
            })
          }
        })
      },
      initLoad() {
        let that = this
        that.loading = true
        that.$http.post('/app/listApp', null).then(res => {
          setTimeout(() => {
            if (res.data.code === 0) {
              that.appList = res.data.data
              that.loading = false
            } else {
              that.$Message.error(res.data.message);
              that.loading = false
            }
          }, 500)
        })
      },
      showAdd() {
        this.appObj = {
          appType: 'All',
          name: '',
          remark: ''
        }
        this.showAddWin = true
      },
      edit(idx) {
        let that = this
        //that.appObj = that.appList[idx]
        that.editAppObj = that.appList[idx]
        that.appObj.id = that.editAppObj.id
        that.appObj.remark = that.editAppObj.remark
        that.appObj.name = that.editAppObj.name
        that.appObj.powers = []
        that.appObj.apis = []
        that.appObj.roles = []
        that.appObj.dicts = []
        that.appObj.tenants = []

      },
      backToList() {
        this.editAppObj = null
      },
      remove(idx) {
        let that = this
        that.$Modal.confirm({
          title: '确认删除吗', onOk: function () {
            that.$http.post('/app/removeApp', that.appList[idx].id).then(res => {
              setTimeout(() => {
                if (res.data.code === 0) {
                  that.initLoad()
                } else {
                  that.$Message.error(res.data.message)
                }
              })
            })
          }
        })
      },
      doSaveApp() {
        let that = this
        let par = {
          id: that.appObj.id,
          name: that.appObj.name,
          remark: that.appObj.remark,
          appType: 'All'
        }
        that.$http.post('/app/saveApp', par).then(res => {
          setTimeout(() => {
            if (res.data.code === 0) {
              that.initLoad()
              that.$Message.success('保存成功')
            } else {
              this.$Notice.warning({
                desc: res.data.message,
                duration: 0
              });
            }
          })
        })
      },
      changeTab(name) {
        let that = this
        setTimeout(() => {
          if (name === 'infoSet') {
          } else if (name === 'powerSet') {
            that.getAppPowers()
            that.getAppApis()
          } else if (name === 'roleSet') {
            that.getAppRoles()
          } else if (name === 'dictSet') {
            that.getAppDicts()
          } else if (name === 'tenantSet') {
            that.getAppTenants()
          }
        })
      },
      /**
       * 获取数据相关的方法
       */
      getAppPowers() {
        let that = this
        that.selectedPower = null
        that.appObj.powers = []
        that.$http.post('/app/listAppPowerByAppId', that.editAppObj.id).then(res => {
          setTimeout(() => {
            let tree = []
            let tempTree = []
            for (let o of res.data.data) {
              if (o.parentId === null || o.parentId === '' || o.parentId === '-1') {
                let root = {
                  id: o.id,
                  pid: o.parentId,
                  code: o.code,
                  title: o.name + ' - ' + o.code,
                  name: o.name,
                  expand: true,
                  levelNum: 0,
                  children: []
                }
                for (let a of res.data.data) {
                  if (a.parentId === o.id) {
                    let level2 = {
                      id: a.id,
                      pid: a.parentId,
                      code: a.code,
                      title: a.name + ' - ' + a.code,
                      name: a.name,
                      expand: true,
                      levelNum: 1,
                      children: []
                    }
                    for (let b of res.data.data) {
                      if (b.parentId === a.id) {
                        let level3 = {
                          id: b.id,
                          pid: b.parentId,
                          code: b.code,
                          title: b.name + ' - ' + b.code,
                          name: b.name,
                          expand: true,
                          levelNum: 2,
                          children: []
                        }
                        level2.children.push(level3)
                      }
                    }
                    root.children.push(level2)
                  }
                }
                tree.push(root)
              }
            }
            that.appObj.powers = tree
          })
        })
      },
      getAppApis() {
        let that = this
        that.appObj.apis = []
        that.selectedApi = null
        that.$http.post('/app/listAppApiRuleByAppId', that.editAppObj.id).then(res => {
          setTimeout(() => {
            that.appObj.apis = res.data.data
          })
        })
      },
      getAppRoles() {
        let that = this
        that.selectedRole = null
        that.appObj.roles = []
        that.$http.post('/app/listRoleByAppId', that.editAppObj.id).then(res => {
          setTimeout(() => {
            let root = []
            for (let item of res.data.data) {
              root.push({
                title: item.name,
                nodeRef: item
              })
            }
            that.appObj.roles = root
          })
        })
      },
      getAppDicts() {
        let that = this
        that.selectedDict = null
        that.appObj.dicts = []
        that.$http.post('/app/listDictByAppId', that.editAppObj.id).then(res => {
          setTimeout(() => {
            that.appObj.dicts = res.data.data
          })
        })
      },
      getAppTenants() {
        let that = this
        that.appObj.tenants = []
        that.$http.post('/tenant/listTenantByAppId', that.editAppObj.id).then(res => {
          setTimeout(() => {
            that.appObj.tenants = res.data.data
          })
        })
      },
      saveAllRolePower() {
        let that = this
        let pars = {
          roleId: that.selectedRole.nodeRef.id,
          powerIds: []
        }
        for (let o of this.$refs.rolwPowerTree.getCheckedNodes()) {
          pars.powerIds.push(o.refNode.id)
        }
        //保存
        that.$http.post('/app/saveAllRolePower', pars).then(res => {
          if (res.data.code == 0) {
            that.$Message.success('保存成功')
          }
        })

      },
      saveAllRoleApiRule() {
        let that = this
        let pars = {
          roleId: that.selectedRole.nodeRef.id,
          ruleIds: []
        }
        for (let o of that.appObj.roleApiRules) {
          if (o.checked) {
            pars.ruleIds.push(o.id)
          }
        }
        //保存
        that.$http.post('/app/saveAllRoleApiRule', pars).then(res => {
          if (res.data.code == 0) {
            that.$Message.success('保存成功')
          }
        })
      },
      addRoleWin() {
        let that = this
        that.getAppTenants()
        that.appRole = {
          appId: that.appObj.id,
          name: '',
          code: '',
          useRule: true,
          tenantId: '-1'
        }
        that.showAddRole = true
      },
      selectRole(node) {
        let that = this
        if (node.length > 0) {
          that.selectedRole = node[0]
          //POST /app/queryRolePowerByRoleId
          //POST /app/queryRoleApiRuleByRoleId
          that.appObj.rolePowers = []
          let trees = []
          that.$http.post('/app/queryRolePowerByRoleId', that.selectedRole.nodeRef.id).then(res => {
            //填充角色前台权限树
            for (let o of res.data.data) {
              if (o.parent_id == null || o.parent_id == '' || o.parent_id == '-1') {
                let root = {
                  title: o.name,
                  refNode: o,
                  checked: o.powerCount > 0,
                  expand: true,
                  children: []
                }
                for (let lv2 of res.data.data) {
                  if (lv2.parent_id == o.id) {
                    let lv2Node = {
                      title: lv2.name,
                      refNode: lv2,
                      checked: lv2.powerCount > 0,
                      expand: true,
                      children: []
                    }
                    for (let lv3 of res.data.data) {
                      if (lv3.parent_id == lv2.id) {
                        let lv3Node = {
                          title: lv3.name,
                          refNode: lv3,
                          checked: lv3.powerCount > 0,
                          expand: true,
                          children: []
                        }
                        lv2Node.children.push(lv3Node)
                      }
                    }
                    root.children.push(lv2Node)
                  }
                }
                trees.push(root)
              }
              that.appObj.rolePowers = trees
            }
            that.appObj.roleApiRules = []
            that.$http.post('/app/queryRoleApiRuleByRoleId', that.selectedRole.nodeRef.id).then(res2 => {
              for (let z of res2.data.data) {
                if (z.powerCount > 0) {
                  z.checked = true
                }
              }
              that.appObj.roleApiRules = res2.data.data
            })
          })


        } else {
          that.selectedRole = null
        }
      },
      editRoleWin() {
        let that = this
        that.getAppTenants()
        that.appRole = {
          appId: that.appObj.id,
          id: that.selectedRole.nodeRef.id,
          name: that.selectedRole.nodeRef.name,
          code: that.selectedRole.nodeRef.code,
          useRule: that.selectedRole.nodeRef.useRule,
          tenantId: that.selectedRole.nodeRef.tenantId
        }
        that.showAddRole = true
      },
      removeRoleWin() {
        let that = this
        that.$Modal.confirm({
          title: '确认删除吗', onOk: function () {
            that.$http.post('/app/removeRole', that.selectedRole.nodeRef.id).then(res => {
              setTimeout(() => {
                if (res.data.code === 0) {
                  that.getAppRoles()
                } else {
                  that.$Message.error(res.data.message)
                }
              })
            })
          }
        })
      },
      saveRole() {
        let that = this
        if (that.appRole.name === '') {
          that.$Message.error('名称必须填写')
        } else if (that.appRole.code === '') {
          that.$Message.error('编码必须填写')
        } else {
          that.$http.post('/app/saveRole', that.appRole).then(res => {
            if (res.data.code === 0) {
              that.getAppRoles()
              that.showAddRole = false
            }
          })
        }
      },
      cancelRole() {
        this.showAddRole = false
      },
      selectApi(n, o) {
        this.selectedApi = n
      },
      addApiWin() {
        let that = this
        that.apiObj = {
          appId: that.appObj.id,
          name: '',
          mapping: '',
          methods: ''
        }
        that.showAddApi = true
      },
      editApiWin() {
        let that = this
        that.apiObj = {
          id: that.selectedApi.id,
          appId: that.appObj.id,
          name: that.selectedApi.name,
          mapping: that.selectedApi.mapping,
          methods: that.selectedApi.methods
        }
        that.showAddApi = true
      },
      removeApiWin() {
        let that = this
        that.$Modal.confirm({
          title: '确认删除吗', onOk: function () {
            that.$http.post('/app/removeAppApiRule', that.selectedApi.id).then(res => {
              setTimeout(() => {
                if (res.data.code === 0) {
                  that.getAppApis()
                } else {
                  that.$Message.error(res.data.message)
                }
              })
            })
          }
        })
      },
      saveApi() {
        let that = this
        if (!that.apiObj.name) {
          that.$Message.error('名称必须填写')
        } else if (!that.apiObj.mapping) {
          that.$Message.error('规则必须填写')
        } else {
          that.$http.post('/app/saveAppApiRule', that.apiObj).then(res => {
            if (res.data.code === 0) {
              that.getAppApis()
              that.showAddApi = false
            }
          })
        }
      },
      cancelApi() {
        let that = this
        that.showAddApi = false
      },
      selectPower(node) {
        let that = this
        if (node.length > 0) {
          that.selectedPower = node[0]
        } else {
          that.selectedPower = null
        }
      },
      addPowerWin() {
        let that = this
        if (that.selectedPower && that.selectedPower.levelNum == 2) {
          that.$Message.error('只支持3级权限')
          return
        }
        that.powerObj.appId = that.appObj.id
        that.powerObj.name = ''
        delete that.powerObj['id']
        that.powerObj.code = ''
        that.powerObj.parentId = that.selectedPower ? that.selectedPower.id : null
        that.showAddPower = true
      },
      editPowerWindow() {
        let that = this
        that.powerObj.appId = that.appObj.id
        that.powerObj.name = that.selectedPower.name
        that.powerObj.id = that.selectedPower.id
        that.powerObj.code = that.selectedPower.code
        that.powerObj.parentId = that.selectedPower.pid
        that.showAddPower = true
      },
      savePower() {
        let that = this
        if (!that.powerObj.name) {
          that.$Message.error('名称必须填写')
        } else if (!that.powerObj.code) {
          that.$Message.error('编码必须填写')
        } else {
          that.$http.post('/app/saveAppPower', that.powerObj).then(res => {
            if (res.data.code === 0) {
              that.getAppPowers()
              that.showAddPower = false
            }
          })
        }
      },
      cancelPower() {
        this.showAddPower = false
      },
      removePowerWin() {
        let that = this
        that.$Modal.confirm({
          title: '确认删除吗', onOk: function () {
            that.$http.post('/app/removeAppPower', that.selectedPower.id).then(res => {
              setTimeout(() => {
                if (res.data.code === 0) {
                  that.getAppPowers()
                } else {
                  that.$Message.error(res.data.message)
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style>
</style>
