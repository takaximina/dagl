<template>
  <div>
    <Card style="margin-bottom:5px">
      <Icon type="ios-desktop-outline" size="24"/>
      {{dbEngineModel.name}}
      <span
        style="font-size:12px;color:#aaa;margin-left:5px"
      >{{dbEngineModel.remark}}</span>
      <ButtonGroup style="float:right">
        <Button type="primary" icon="md-checkmark" @click="SaveEngine">保存</Button>
        <Button icon="ios-refresh" @click="EmptyEngine">重置</Button>
        <Button icon="md-close" @click="goBack">关闭</Button>
      </ButtonGroup>
    </Card>
    <Row>
      <Col span="6">
        <Card :bordered="false">
          <p slot="title">
            <Icon></Icon>模型定义
          </p>
          <div slot="extra">
            <Dropdown
              trigger="click"
              @on-click="addNode"
              v-show="SelectedNode && SelectedNode.childs"
            >
              <Button size="small" style="width:40px">+</Button>
              <DropdownMenu slot="list" v-if="SelectedNode && SelectedNode.childs">
                <DropdownItem :name="o" :key="o" v-for="o in SelectedNode.childs">{{o}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button v-if="SelectedNode.canDel" size="small" @click="removeNode" style="width:40px">-</Button>
          </div>
          <p style="height:400px;overflow:auto">
            <Tree :data="treeData" @on-select-change="selectNode" empty-text></Tree>
          </p>
        </Card>
      </Col>
      <Col span="18" style="padding-left:5px">
        <Card :bordered="false">
          <p slot="title">
            <Icon></Icon>
            {{SelectedNode.title}}&nbsp;
            <span
              style="font-size:12px;color:#999"
            >{{SelectedNode.remark}}</span>
          </p>
          <div>
            <Form
              v-if="SelectedNode"
              :label-width="100"
              v-for="o in SelectedNode.props"
              :key="o.key"
            >
              <FormItem v-if="o.type === 'key'" :label="o.remark">
                <Input style="width:180px" v-model="o.value"></Input>
              </FormItem>
              <FormItem v-if="o.type === 'data'" :label="o.remark">
                <Input style="width:240px" disabled v-model="o.value" placeholder="选择数据...">
                  <Button @click="showChooseWin(o)" slot="append" icon="ios-search"></Button>
                  <Button v-if="o.value" @click="clearVal(o)" slot="append" icon="ios-close"></Button>
                </Input>
              </FormItem>
              <FormItem v-if="o.type === 'window'" :label="o.remark">
                <Input style="width:240px" disabled v-model="o.value" placeholder="选择窗口...">
                  <Button @click="showChooseWin(o)" slot="append" icon="ios-search"></Button>
                  <Button v-if="o.value" @click="clearVal(o)" slot="append" icon="ios-close"></Button>
                </Input>
              </FormItem>
              <FormItem v-if="o.type === 'action'" :label="o.remark">
                <Input style="width:240px" disabled v-model="o.value" placeholder="选择动作...">
                  <Button @click="showChooseWin(o)" slot="append" icon="ios-search"></Button>
                  <Button v-if="o.value" @click="clearVal(o)" slot="append" icon="ios-close"></Button>
                </Input>
              </FormItem>
              <FormItem v-if="o.type === 'form'" :label="o.remark">
                <Input style="width:240px" disabled v-model="o.value" placeholder="选择标单...">
                  <Button @click="showChooseWin(o)" slot="append" icon="ios-search"></Button>
                  <Button v-if="o.value" @click="clearVal(o)" slot="append" icon="ios-close"></Button>
                </Input>
              </FormItem>
              <FormItem v-if="o.type === 'datacolumn'" :label="o.remark">
                <Input style="width:240px" v-model="o.value" placeholder="选择数据字段...">
                  <Button @click="showChooseWin(o)" slot="append" icon="ios-search"></Button>
                  <Button v-if="o.value" @click="clearVal(o)" slot="append" icon="ios-close"></Button>
                </Input>
              </FormItem>
              <FormItem v-if="o.type === 'select'" :label="o.remark">
                <Select style="width:240px" v-model="o.value">
                  <Option v-for="item in o.options" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </FormItem>
              <FormItem v-if="o.type === 'text'" :label="o.remark">
                <Input v-model="o.value" placeholder="输入文本..."></Input>
              </FormItem>
              <FormItem v-if="o.type === 'number'" :label="o.remark">
                <InputNumber
                  :min="0"
                  :max="9999999"
                  style="width:180px"
                  v-model="o.value"
                  placeholder="输入数值..."
                ></InputNumber>
              </FormItem>
              <FormItem v-if="o.type === 'checkbox'" :label="o.remark">
                <i-switch size="large" v-model="o.value">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
              <FormItem :label="o.remark" v-if="o.type === 'textarea'">
                <Input
                  v-model="o.value"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  placeholder="输入文本内容..."
                ></Input>
              </FormItem>
              <FormItem :label="o.remark" v-if="o.type === 'json'">
                <Input
                  v-model="o.value"
                  type="textarea"
                  :autosize="{minRows: 8,maxRows: 20}"
                  placeholder="输入json对象数组内容,注意json格式要求所有属性必须用单/双引号包括..."
                ></Input>
                <Button
                  :disabled="!o.value || o.value == ''"
                  type="primary"
                  style="margin-top:5px"
                  icon="ios-search"
                  @click="testJson(o)"
                >验证格式</Button>
                <Alert style="margin-top:5px" show-icon>在线编辑Json
                  <template slot="desc">
                    可以在
                    <a
                      href="http://www.bejson.com/jsonviewernew/"
                      target="_blank"
                    >http://www.bejson.com/jsonviewernew/</a> 中编辑结果拷贝过来.
                  </template>
                </Alert>
              </FormItem>
              <FormItem :label="o.remark" v-if="o.type === 'tsql'">
                <Input
                  v-model="o.value"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  placeholder="输入标准的tsql查询语句..."
                ></Input>
                <Button
                  :disabled="!o.value || o.value == ''"
                  type="primary"
                  style="margin-top:5px"
                  icon="ios-search"
                  @click="testSql(o)"
                >测试查询</Button>
                <Collapse style="margin-top:5px">
                  <Panel name="1">上下文参数
                    <div slot="content">
                      <h4>上下文参数为字符串匹配解析，参数值均为字符类型，请不要忽略单引号。</h4>
                      <h5>示例： where user_id = '@userId'</h5>
                      <h5 class="paramRow">@userId,用户唯一标识</h5>
                      <h5 class="paramRow">@userName,登录账号</h5>
                      <h5 class="paramRow">@userType,用户类型</h5>
                      <h5 class="paramRow">@tenantId,的租赁标识</h5>
                      <h5 class="paramRow">@entId,企业标识</h5>
                      <h5 class="paramRow">@deptId,部门标识</h5>
                      <h5 class="paramRow">@personnelId,人员标识</h5>
                      <h5 class="paramRow">@appId,应用标识</h5>
                    </div>
                  </Panel>
                  <Panel name="2">Url参数
                    <div slot="content">
                      <h4>Url参数，如当前url有如下参数：?abc=123</h4>
                      <h5 class="paramRow">@@abc,代表获取url参数</h5>
                    </div>
                  </Panel>
                </Collapse>
              </FormItem>
            </Form>
            <Spin size="large" fix v-if="spinShow"></Spin>
          </div>
        </Card>
      </Col>
    </Row>
    <!-- Choose Win -->
    <Modal v-model="chooseWin" title="选择" footer-hide>
      <CellGroup @on-click="chooseItemOk">
        <Cell
          v-for="o in ChooseList"
          :key="o.name"
          :name="o.name"
          :title="o.name"
          :extra="o.remark"
        />
      </CellGroup>
      <h5 v-if="ChooseList.length==0" style="color:#f00;text-align:center">暂无数据...</h5>
    </Modal>
    <!-- DataSource Test Wind -->
    <Modal v-model="sqlResultWin" title="查询结果" footer-hide fullscreen>
      <div style="height:400px;overflow:auto">
        <Table :columns="TempDataSource.columns" :data="TempDataSource.rows" stripe></Table>
      </div>
    </Modal>
    <!-- Json Test Wind -->
    <Modal v-model="jsonResultWin" title="json结果" footer-hide>
      <div>
        <Table :columns="JsonDataSource.columns" :data="JsonDataSource.rows" stripe></Table>
      </div>
    </Modal>
    <!-- Remove Confirm -->
    <Modal title="提示" v-model="confirmClear" width="340">
      <h3>确认重置吗？</h3>
      <p>重置后不会改变数据库已经存储的结构，只会将当前编辑的模型恢复到初始状态。</p>
      <!--重点就是下面的代码了-->
      <div slot="footer">
        <Button type="text" size="large" @click="confirmClear=false">取消</Button>
        <Button type="primary" size="large" @click="clearOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { EngineElements } from "@/apps/engine/libs/components";
import { definitionTree } from "@/apps/engine/libs/definitionTree";
import {
  loadEngineById,
  saveEngine,
  loadSqlResult,
  cloneObject
} from "@/apps/engine/libs/engineUtil";

export default {
  name: "engineEdit",

  data() {
    return {
      confirmClear: false,
      dbEngineModel: {},
      sqlResultWin: false,
      jsonResultWin: false,
      TempDataSource: {},
      JsonDataSource: {},
      CurrentEditProp: null,
      ChooseList: [],
      chooseWin: false,
      spinShow: false,
      SelectedNode: {},
      treeData: []
    };
  },

  mounted: function() {
    this.loadEngine();
  },

  methods: {
    ...mapMutations(["closeTag"]),
    clearVal(o) {
      let that = this;
      setTimeout(() => {
        o.value = null;
        that.$forceUpdate();
      });
    },
    alertMsg(message) {
      this.$Modal.info({
        title: "提示",
        content: message
      });
    },
    goBack() {
      this.closeTag(this.$route);
    },
    testJson(o) {
      let that = this;
      if (!o.value) {
        that.alertMsg("请输入标准的Json数组内容");
      } else {
        try {
          let res = JSON.parse(o.value);
          if (res && res.length > 0) {
            let rowStart = res[0];
            that.JsonDataSource.columns = [];
            for (var item in rowStart) {
              that.JsonDataSource.columns.push({
                title: item,
                key: item
              });
            }
            that.JsonDataSource.rows = res;
            that.jsonResultWin = true;
          } else {
            that.alertMsg("暂时只支持Json数组");
          }
        } catch (ex) {
          that.alertMsg("Json格式不正确");
        }
      }
    },
    testSql(o) {
      let that = this;
      if (!o.value) {
        that.alertMsg("请输入标准的TSql查询语句");
      } else {
        loadSqlResult(o.value).then(res => {
          if (res) {
            let rowStart = res[0];
            that.TempDataSource.columns = [];
            for (var item in rowStart) {
              that.TempDataSource.columns.push({
                title: item,
                key: item
              });
            }
            that.TempDataSource.rows = res;
            that.sqlResultWin = true;
          }
        });
      }
    },
    loadEngine() {
      let that = this;
      loadEngineById(that.$route.params.id).then(res => {
        that.dbEngineModel = res;
        if (
          that.dbEngineModel.content &&
          that.dbEngineModel.content.length > 0
        ) {
          let Base64 = require("js-base64").Base64;
          let jsonTreeStr = Base64.decode(that.dbEngineModel.content);
          that.treeData = JSON.parse(jsonTreeStr);
        } else {
          that.treeData = cloneObject(definitionTree);
        }
      });
    },
    queryNodeByKey(nodes, key, results) {
      for (let node of nodes) {
        if (key == node.key) {
          results.push(node);
        }
        this.queryNodeByKey(node.children, key, results);
      }
    },
    showChooseWin(o) {
      let that = this;
      that.ChooseList = [];
      that.CurrentEditProp = o;
      if (o.type === "data") {
        let dataNode = that.findRootNodeByTitle("DataSource");
        if (dataNode && dataNode.children) {
          for (let item of dataNode.children) {
            let temp = {
              name: item.props.find(p => p.key === "Id").value,
              remark: item.remark
            };
            that.ChooseList.push(temp);
          }
        }
      } else if (o.type === "datacolumn") {
        //TO:DO ...
      } else if (o.type === "action") {
        let dataNode = that.findRootNodeByTitle("Action");
        if (dataNode && dataNode.children) {
          for (let item of dataNode.children) {
            let temp = {
              name: item.props.find(p => p.key === "Id").value,
              remark: item.remark
            };
            that.ChooseList.push(temp);
          }
        }
      } else if (o.type === "form") {
        let resultList = [];
        that.queryNodeByKey(that.treeData, "V5.View.Form", resultList);
        for (let item of resultList) {
          let temp = {
            name: item.props.find(p => p.key === "Id").value,
            remark: item.remark
          };
          that.ChooseList.push(temp);
        }
      } else if (o.type === "window") {
        let dataNode = that.findRootNodeByTitle("Window");
        if (dataNode && dataNode.children) {
          for (let item of dataNode.children) {
            let temp = {
              name: item.props.find(p => p.key === "Id").value,
              remark: item.remark
            };
            that.ChooseList.push(temp);
          }
        }
      }
      that.chooseWin = true;
    },
    findRootNodeByTitle(title) {
      return this.treeData.find(p => p.title == title);
    },
    chooseItemOk(name) {
      this.CurrentEditProp.value = name;
      this.chooseWin = false;
    },
    selectNode(node) {
      let that = this;
      if (node.length > 0) {
        that.spinShow = true;
        setTimeout(() => {
          that.SelectedNode = node[0];
          that.spinShow = false;
        }, 100);
      } else {
        that.SelectedNode = {};
      }
    },
    removeSelectedNode(nodes) {
      let that = this;
      for (let root of nodes) {
        if (root === that.SelectedNode) {
          nodes.splice(nodes.indexOf(root), 1);
        } else {
          that.removeSelectedNode(root.children);
        }
      }
    },
    removeNode() {
      this.removeSelectedNode(this.treeData);
      this.SelectedNode = {};
    },
    addNode(key) {
      let that = this;
      let node = EngineElements.find(p => p.key === key);
      node = cloneObject(node);
      let idProp = node.props.find(p => p.key === "Id");
      let names = node.key.split(".");
      if (idProp) {
        idProp.value =
          names[names.length - 1] +
          "_" +
          (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1)
            .toUpperCase();
      }
      that.SelectedNode.children.push({
        title: names[names.length - 1],
        key: key,
        expand: true,
        props: node.props,
        childs: node.childs,
        remark: node.remark,
        canDel: true,
        children: []
      });
    },
    SaveEngine() {
      let that = this;
      that.SelectedNode.selected = false;
      let content = JSON.stringify(this.treeData);
      let Base64 = require("js-base64").Base64;
      that.dbEngineModel.content = Base64.encode(content);
      let data = that.dbEngineModel;
      saveEngine(data).then(res => {
        this.$Notice.success({
          title: "保存成功"
        });
        this.closeTag(that.$route);
      });
    },
    EmptyEngine() {
      this.confirmClear = true;
    },
    clearOk() {
      let that = this;
      that.treeData = cloneObject(definitionTree);
      that.$Notice.success({
        title: "重置成功"
      });
      this.confirmClear = false;
    }
  }
};
</script>

<style>
.paramRow {
  line-height: 14px;
  color: #3399ff;
}
</style>