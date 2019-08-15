<template>
  <div>
    <Card :bordered="false" dis-hover shadow>
      <div style="text-align:left">
        <Form :label-width="60" inline>
          <FormItem label="名称">
            <Input v-model="queryObj.name" type="text" placeholder="输入名称..."></Input>
          </FormItem>
          <FormItem label="唯一编码">
            <Input v-model="queryObj.code" type="text" placeholder="输入编码..."></Input>
          </FormItem>
          <FormItem label="所属应用">
            <Select v-model="queryObj.appId" :filterable="true" :clearable="true">
              <Option v-for="o in appList" :value="o.id" :key="o.id">{{o.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" icon="md-search" @click="loadEngineList">搜索</Button>
          </FormItem>
          <FormItem :label-width="0">
            <Button icon="md-add" @click="addEngine">新增</Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <Table stripe :columns="engineColumns" :data="engineList"></Table>
      </div>
    </Card>
    <!-- Remove Confirm -->
    <Modal title="提示" v-model="confirmRemove" width="300">
      <p>确认删除吗？</p>
      <!--重点就是下面的代码了-->
      <div slot="footer">
        <Button type="text" size="large" @click="confirmRemove=false">取消</Button>
        <Button type="primary" size="large" @click="removeOk">确定</Button>
      </div>
    </Modal>
    <!-- Modifi Window -->
    <Modal :title="winTitle" v-model="modifyWin" class-name="vertical-center-modal" footer-hide>
      <Form :model="editObj" :label-width="80">
        <FormItem label="所属应用">
          <Select v-model="editObj.appId" :filterable="true">
            <Option v-for="o in appList" :value="o.id" :key="o.id">{{o.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="名称">
          <Input type="text" v-model="editObj.name" placeholder="请输入名称..."></Input>
        </FormItem>
        <FormItem label="唯一编码">
          <Input type="text" v-model="editObj.code" placeholder="请输入编码..."></Input>
        </FormItem>
        <FormItem label="备注">
          <Input
            v-model="editObj.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder
          ></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveEngine">保存</Button>
          <Button @click="cancelSave" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="选择打开方式" v-model="showOpenWin" class-name="vertical-center-modal" footer-hide>
      <Alert show-icon>提示
        <Icon type="ios-bulb-outline" slot="icon"></Icon>
        <template slot="desc">最终页面的使用地址，请以浏览器中显示的地址为准.</template>
      </Alert>
      <CellGroup @on-click="openView">
        <Cell v-for="o in OpenList" :key="o.name" :name="o.name" :title="o.name">
          <Icon v-if="o.otype=='tab'" slot="extra" type="ios-browsers-outline"/>
          <Icon v-if="o.otype=='full'" slot="extra" type="ios-expand"/>
        </Cell>
      </CellGroup>
    </Modal>
  </div>
</template>
<script>
import $http from "@/libs/axios";
import { mapMutations } from "vuex";

export default {
  name: "engineList",

  data() {
    return {
      confirmRemove: false,
      winTitle: "",
      editObj: {},
      OpenList: [],
      modifyWin: false,
      showOpenWin: false,
      queryObj: {
        appId: "",
        code: "",
        name: ""
      },
      appList: [],
      engineList: [],
      engineColumns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "唯一编码",
          key: "code"
        },
        {
          title: "所属应用",
          key: "appName"
        },
        {
          title: "备注",
          key: "remark"
        },
        {
          title: "创建者",
          key: "userName"
        },
        {
          title: "创建于",
          key: "createDate",
          render: (h, params) => {
            return h("Time", {
              props: {
                time: params.row.createDate
              }
            });
          }
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.toView(params.row);
                    }
                  }
                },
                "预览"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.editEngine(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.toEdit(params.row);
                    }
                  }
                },
                "定义"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.removeEngine(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },

  mounted: function() {
    this.loadAppList();
    this.loadEngineList();
  },

  methods: {
    ...mapMutations(["addTag", "closeTag"]),

    saveEngine() {
      let that = this;
      if (!that.editObj.appId) {
        that.$Message.warning("请选择所属应用");
      } else if (!that.editObj.name) {
        that.$Message.warning("请填写名称");
      } else if (!that.editObj.code) {
        that.$Message.warning("请填写唯一编码");
      } else {
        let data = that.editObj;
        $http
          .request({
            api: "user",
            url: "/engine/saveEngine",
            data,
            method: "post"
          })
          .then(res => {
            that.modifyWin = false;
            that.loadEngineList();
          });
      }
    },
    cancelSave() {
      this.modifyWin = false;
    },
    addEngine() {
      this.winTitle = "新增";
      this.editObj = {};
      this.modifyWin = true;
    },
    editEngine(o) {
      this.winTitle = "修改 " + o.name;
      this.editObj = JSON.parse(JSON.stringify(o));
      this.modifyWin = true;
    },
    toEdit(o) {
      this.$router.push({
        path: `engineEdit/` + o.id
      });
    },
    toView(o) {
      this.editObj = o;
      this.OpenList = [];
      this.OpenList.push({
        id: o.id,
        name: "全屏幕",
        otype: "full",
        remark: o.remark,
        url: "/engineViewFull/" + o.id
      });
      this.OpenList.push({
        id: o.id,
        name: "标签页",
        otype: "tab",
        remark: o.remark,
        url: "engineView/" + o.id
      });
      this.showOpenWin = true;
    },
    openView(name) {
      let that = this;
      let row = that.OpenList.find(p => p.name == name);
      if (row.otype == "full") {
        let routeData = that.$router.resolve({
          path: `/engineViewFull/` + row.id
        });
        window.open(routeData.href, "_blank");
      } else {
        that.$router.push({
          path: `engineView/` + row.id
        });
      }
      this.showOpenWin = false;
    },
    removeEngine(o) {
      this.removeObj = o;
      this.confirmRemove = true;
    },
    removeOk() {
      let that = this;
      let data = this.removeObj.id;
      $http
        .request({
          api: "user",
          url: "/engine/removeEngine",
          data,
          method: "post"
        })
        .then(res => {
          that.confirmRemove = false;
          that.loadEngineList();
        });
    },
    loadEngineList() {
      let that = this;
      if (!that.queryObj.appId) that.queryObj.appId = "";
      let data = that.queryObj;
      $http
        .request({
          api: "user",
          url: "/engine/listAllEngines",
          data,
          method: "post"
        })
        .then(res => {
          that.engineList = res;
        });
    },
    loadAppList() {
      let that = this;
      $http
        .request({
          api: "user",
          url: "/app/listApp",
          method: "get"
        })
        .then(res => {
          if (res) {
            that.appList = res;
          }
        });
    }
  }
};
</script>

<style>
</style>