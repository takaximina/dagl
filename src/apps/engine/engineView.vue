<template>
  <div>
    <BackTop></BackTop>
    <template v-for="control in views">
      <!-- Form -->
      <Form
        :inline="propVal(control,'Inline')"
        :key="control.nodeKey"
        :label-position="propVal(control,'LabelPosition')"
        :label-width="propVal(control,'LabelWidth')"
        v-if="control.key=='V5.View.Form'"
      >
        <FormItem
          :label-width="propVal(FormItem,'LabelWidth')"
          :key="FormItem.nodeKey"
          :label="propVal(FormItem,'Label')"
          v-for="FormItem in control.children"
        >
          <Input
            v-model="FormItem.Value"
            :placeholder="propVal(FormItem,'Placeholder')"
            v-if="FormItem.key=='V5.View.Form.Input'"
          ></Input>
          <InputNumber
            v-model="FormItem.Value"
            :placeholder="propVal(FormItem,'Placeholder')"
            v-if="FormItem.key=='V5.View.Form.Number'"
          ></InputNumber>
          <DatePicker
            type="date"
            :placeholder="propVal(FormItem,'Placeholder')"
            v-if="FormItem.key=='V5.View.Form.Date'"
          ></DatePicker>
          <TimePicker
            type="time"
            :placeholder="propVal(FormItem,'Placeholder')"
            v-if="FormItem.key=='V5.View.Form.Time'"
          ></TimePicker>
          <Input
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            v-model="FormItem.Value"
            :placeholder="propVal(FormItem,'Placeholder')"
            v-if="FormItem.key=='V5.View.Form.TextArea'"
          ></Input>
          <i-switch v-model="FormItem.Value" size="large" v-if="FormItem.key=='V5.View.Form.Check'"></i-switch>
          <Select
            v-model="FormItem.select"
            v-if="FormItem.key=='V5.View.Form.Select'"
            :placeholder="propVal(FormItem,'Placeholder')"
          ></Select>
          <Button
            @click="doAction(FormItem,propVal(FormItem,'ActionId'))"
            :long="propVal(FormItem,'Full')"
            :type="propVal(FormItem,'Type')"
            :size="propVal(FormItem,'Size')"
            :key="FormItem.nodeKey"
            v-if="FormItem.key=='V5.View.Form.Button'"
          >{{propVal(FormItem,'Name')}}</Button>
        </FormItem>
      </Form>
      <!-- Divider -->
      <Divider v-if="control.key=='V5.View.Divider'" :dashed="propVal(control,'Dashed')" :orientation="propVal(control,'Orientation')" :type="propVal(control,'Type')">
        <template v-if="propVal(control,'Text')">{{propVal(control,'Text')}}</template>
      </Divider>
      <!-- Button -->
      <Button
        @click="doAction(control,propVal(control,'ActionId'))"
        :long="propVal(control,'Full')"
        :type="propVal(control,'Type')"
        :size="propVal(control,'Size')"
        :key="control.nodeKey"
        v-if="control.key=='V5.View.Button'"
      >{{propVal(control,'Name')}}</Button>
      <!-- TableChart -->
      <Table
        :columns="getTableCoulmn(control)"
        :data="sourceData[propVal(control,'DataSourceId')]"
        v-if="control.key=='V5.View.TableChart'"
        :style="propVal(control,'CssStyle')"
      ></Table>
      <!-- NormalChart -->
      <div
        ref="chartList"
        :Id="propVal(control,'Id')"
        v-if="control.key=='V5.View.NormalChart'"
        style="height:300px;width:100%"
        :style="propVal(control,'CssStyle')"
      ></div>
      <!-- PieChart -->
      <div
        ref="chartList"
        :Id="propVal(control,'Id')"
        v-if="control.key=='V5.View.PieChart'"
        style="height:300px;width:100%"
        :style="propVal(control,'CssStyle')"
      ></div>
      <!-- Panel -->
      <Card v-if="control.key=='V5.View.Panel'">
        <p slot="title">{{propVal(control,'Title')}}</p>
        <p>
          <template v-for="panelControl in control.children">
            <Button
              @click="doAction(panelControl,propVal(panelControl,'ActionId'))"
              :long="propVal(panelControl,'Full')"
              :type="propVal(panelControl,'Type')"
              :size="propVal(panelControl,'Size')"
              :key="panelControl.nodeKey"
              v-if="panelControl.key=='V5.View.Button'"
            >{{propVal(panelControl,'Name')}}</Button>
            <Table
              :columns="getTableCoulmn(panelControl)"
              :data="sourceData[propVal(panelControl,'DataSourceId')]"
              v-if="panelControl.key=='V5.View.TableChart'"
              :style="propVal(panelControl,'CssStyle')"
            ></Table>
            <div
              ref="chartList"
              :Id="propVal(panelControl,'Id')"
              v-if="panelControl.key=='V5.View.NormalChart'"
              style="height:300px;width:100%"
              :style="propVal(panelControl,'CssStyle')"
            ></div>
            <div
              ref="chartList"
              :Id="propVal(panelControl,'Id')"
              v-if="panelControl.key=='V5.View.PieChart'"
              style="height:300px;width:100%"
              :style="propVal(panelControl,'CssStyle')"
            ></div>

            <Row v-if="panelControl.key=='V5.View.Row'" :style="propVal(panelControl,'CssStyle')">
              <Col
                v-for="panelCol in panelControl.children"
                :key="panelCol.nodeKey"
                v-if="panelCol.key=='V5.View.Col'"
                :span="propVal(panelCol,'Span')"
                :style="propVal(panelCol,'CssStyle')"
              >
                <template v-for="panelColContol in panelCol.children">
                  <Button
                    @click="doAction(panelColContol,propVal(panelColContol,'ActionId'))"
                    :long="propVal(panelColContol,'Full')"
                    :type="propVal(panelColContol,'Type')"
                    :size="propVal(panelColContol,'Size')"
                    :key="panelColContol.nodeKey"
                    v-if="panelColContol.key=='V5.View.Button'"
                  >{{propVal(panelColContol,'Name')}}</Button>
                  <Table
                    :columns="getTableCoulmn(panelColContol)"
                    :data="sourceData[propVal(panelColContol,'DataSourceId')]"
                    v-if="panelColContol.key=='V5.View.TableChart'"
                    :style="propVal(panelColContol,'CssStyle')"
                  ></Table>
                  <div
                    ref="chartList"
                    :Id="propVal(panelColContol,'Id')"
                    v-if="panelColContol.key=='V5.View.NormalChart'"
                    :key="propVal(panelColContol,'Id')"
                    style="height:300px;width:100%"
                    :style="propVal(panelColContol,'CssStyle')"
                  ></div>
                  <div
                    ref="chartList"
                    :Id="propVal(panelColContol,'Id')"
                    v-if="panelColContol.key=='V5.View.PieChart'"
                    :key="propVal(panelColContol,'Id')"
                    style="height:300px;width:100%"
                    :style="propVal(panelColContol,'CssStyle')"
                  ></div>
                </template>
              </Col>
            </Row>
          </template>
        </p>
      </Card>
      <!-- Row -->
      <Row v-if="control.key=='V5.View.Row'" :style="propVal(control,'CssStyle')">
        <Col
          v-for="col in control.children"
          :key="col.nodeKey"
          v-if="col.key=='V5.View.Col'"
          :span="propVal(col,'Span')"
          :style="propVal(col,'CssStyle')"
        >
          <template v-for="colControl in col.children">
            <!-- V5.View.Button -->
            <Button
              @click="doAction(colControl,propVal(colControl,'ActionId'))"
              :long="propVal(colControl,'Full')"
              :type="propVal(colControl,'Type')"
              :size="propVal(colControl,'Size')"
              :key="colControl.nodeKey"
              v-if="colControl.key=='V5.View.Button'"
            >{{propVal(colControl,'Name')}}</Button>
            <!-- V5.View.TableChart -->
            <Table
              :columns="getTableCoulmn(colControl)"
              :data="sourceData[propVal(colControl,'DataSourceId')]"
              v-if="colControl.key=='V5.View.TableChart'"
              :style="propVal(colControl,'CssStyle')"
            ></Table>
            <div
              ref="chartList"
              :Id="propVal(colControl,'Id')"
              v-if="colControl.key=='V5.View.NormalChart'"
              style="height:300px;width:100%"
              :style="propVal(colControl,'CssStyle')"
            ></div>
            <div
              ref="chartList"
              :Id="propVal(colControl,'Id')"
              v-if="colControl.key=='V5.View.PieChart'"
              style="height:300px;width:100%"
              :style="propVal(colControl,'CssStyle')"
            ></div>
            <!-- Panel -->
            <Card v-if="colControl.key=='V5.View.Panel'">
              <p slot="title">{{propVal(colControl,'Title')}}</p>
              <p>
                <template v-for="panelControl in colControl.children">
                  <Button
                    @click="doAction(panelControl,propVal(panelControl,'ActionId'))"
                    :long="propVal(panelControl,'Full')"
                    :type="propVal(panelControl,'Type')"
                    :size="propVal(panelControl,'Size')"
                    :key="panelControl.nodeKey"
                    v-if="panelControl.key=='V5.View.Button'"
                  >{{propVal(panelControl,'Name')}}</Button>
                  <Table
                    :columns="getTableCoulmn(panelControl)"
                    :data="sourceData[propVal(panelControl,'DataSourceId')]"
                    v-if="panelControl.key=='V5.View.TableChart'"
                    :style="propVal(panelControl,'CssStyle')"
                  ></Table>
                  <div
                    ref="chartList"
                    v-if="panelControl.key=='V5.View.NormalChart'"
                    :Id="propVal(panelControl,'Id')"
                    style="height:300px;width:100%"
                    :style="propVal(panelControl,'CssStyle')"
                  ></div>
                  <div
                    ref="chartList"
                    v-if="panelControl.key=='V5.View.PieChart'"
                    :Id="propVal(panelControl,'Id')"
                    style="height:300px;width:100%"
                    :style="propVal(panelControl,'CssStyle')"
                  ></div>

                  <Row
                    v-if="panelControl.key=='V5.View.Row'"
                    :style="propVal(panelControl,'CssStyle')"
                  >
                    <Col
                      v-for="panelCol in panelControl.children"
                      :key="panelCol.nodeKey"
                      v-if="panelCol.key=='V5.View.Col'"
                      :span="propVal(panelCol,'Span')"
                      :style="propVal(panelCol,'CssStyle')"
                    >
                      <template v-for="panelColContol in panelCol.children">
                        <Button
                          @click="doAction(panelColContol,propVal(panelColContol,'ActionId'))"
                          :long="propVal(panelColContol,'Full')"
                          :type="propVal(panelColContol,'Type')"
                          :size="propVal(panelColContol,'Size')"
                          :key="panelColContol.nodeKey"
                          v-if="panelColContol.key=='V5.View.Button'"
                        >{{propVal(panelColContol,'Name')}}</Button>
                        <Table
                          :columns="getTableCoulmn(panelColContol)"
                          :data="sourceData[propVal(panelColContol,'DataSourceId')]"
                          v-if="panelColContol.key=='V5.View.TableChart'"
                          :style="propVal(panelColContol,'CssStyle')"
                        ></Table>
                        <div
                          ref="chartList"
                          v-if="panelColContol.key=='V5.View.NormalChart'"
                          :key="propVal(panelColContol,'Id')"
                          style="height:300px;width:100%"
                          :style="propVal(panelColContol,'CssStyle')"
                        ></div>
                        <div
                          ref="chartList"
                          v-if="panelColContol.key=='V5.View.PieChart'"
                          :key="propVal(panelColContol,'Id')"
                          style="height:300px;width:100%"
                          :style="propVal(panelColContol,'CssStyle')"
                        ></div>
                      </template>
                    </Col>
                  </Row>
                </template>
              </p>
            </Card>
          </template>
        </Col>
      </Row>
    </template>
    <!--<div class="engine-logo">Engine V5</div>-->
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import {
  loadEngineById,
  saveEngine,
  loadSqlResult,
  cloneObject
} from "@/apps/engine/libs/engineUtil";
import echarts from "echarts";
export default {
  name: "engineView",
  props: {
    id: String
  },
  data() {
    return {
      eventInterval: 500,
      events: [],
      dataSources: [],
      actions: [],
      windows: [],
      views: [],
      sourceData: [],
      times: []
    };
  },
  beforeMount: function() {},
  mounted: function() {
    this.init();
  },
  beforeDestroy() {
    for (let time of this.times) {
      clearInterval(time);
    }
    this.times = [];
  },
  methods: {
    ...mapMutations(["closeTag"]),
    //根据Key递归查找控件，结果存放在results参数中
    queryNodeByKey(nodes, key, results) {
      for (let node of nodes) {
        if (key == node.key) {
          results.push(node);
        }
        this.queryNodeByKey(node.children, key, results);
      }
    },
    init() {
      let that = this;
      loadEngineById(that.$route.params.id || this.id).then(res => {
        that.dbEngineModel = res;
        //document.title = that.dbEngineModel.name;
        if (
          that.dbEngineModel.content &&
          that.dbEngineModel.content.length > 0
        ) {
          let Base64 = require("js-base64").Base64;
          try {
            let jsonTreeStr = Base64.decode(that.dbEngineModel.content);
            let treeData = JSON.parse(jsonTreeStr);
            that.initNode(treeData);
          } catch (ex) {
            console.log(ex);
          }
        } else {
          console.log("定义为空");
        }
      });
    },
    initNode(data) {
      let that = this;
      that.events = data.find(p => p.title === "Event").children;
      that.dataSources = data.find(p => p.title === "DataSource").children;
      that.actions = data.find(p => p.title === "Action").children;
      //that.windows = data.find(p => p.title === "Window").children;
      that.views = data.find(p => p.title === "View").children;
      /**
       * loadJsonDataSource
       * 加载所有Json数据源，存放到本地
       */
      let jsonSource = that.dataSources.filter(
        p => p.key == "V5.DataSource.Json"
      );
      for (let json of jsonSource) {
        try {
          that.sourceData[that.propVal(json, "Id")] = JSON.parse(
            json.props.find(p => p.key == "Content").value
          );
        } catch (ex) {
          console.log(ex);
        }
      }
      /**
       * loadSqlDataSource
       * 加载InitLoad的所有Sql数据源，存放到本地数组
       */
      let sqlSource = that.dataSources.filter(
        p => p.key == "V5.DataSource.Sql"
      );
      let requests = [];
      let idx = 0;
      for (let sqlItem of sqlSource) {
        if (that.propVal(sqlItem, "InitLoad")) {
          let req = loadSqlResult(
            sqlItem.props.find(p => p.key == "Content").value
          );
          requests.push({ r: req, item: sqlItem });
        }
      }
      let initContext = (requests, idx) => {
        if (requests.length > 0) {
          requests[idx].r.then(res => {
            that.sourceData[that.propVal(requests[idx].item, "Id")] = res;
            idx++;
            if (requests[idx]) {
              initContext(requests, idx);
            } else {
              //首次所有数据源加载完后执行一次界面更新
              that.initEvent();
              that.initCharts();
              that.$forceUpdate();
            }
          });
        }
      };
      /**没有需要请求的时候，执行绑定数据与渲染,否则去请求 */
      if (requests.length == 0) {
        that.initEvent();
        that.initCharts();
        that.$forceUpdate();
      } else {
        initContext(requests, 0);
      }
    },
    initCharts() {
      //渲染所有的Echart
      let that = this;
      let normals = [];
      let pies = [];
      that.queryNodeByKey(that.views, "V5.View.NormalChart", normals);
      that.queryNodeByKey(that.views, "V5.View.PieChart", pies);
      for (let normal of normals) {
        that.randerNormal(normal);
      }
      for (let pie of pies) {
        that.randerPie(pie);
      }
    },
    /**
     * 渲染直角坐标系图
     */
    randerNormal(control) {
      let that = this;
      let option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: [],
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          /*axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },*/
          data: []
        },
        grid: {
          top: 30,
          left: 30,
          right: 30,
          bottom: 30
        },
        yAxis: {
          //type: "value",
          // show: false
        },
        series: []
      };

      let DataSourceId = that.propVal(control, "DataSourceId");
      let xAxisBind = that.propVal(control, "xAxisBind");
      let boundaryGap = that.propVal(control, "boundaryGap");
      let ShowZoom = that.propVal(control, "ShowZoom");
      let ZoomStart = that.propVal(control, "ZoomStart");
      let ZoomEnd = that.propVal(control, "ZoomEnd");

      /**x坐标数据 */
      for (let row of that.sourceData[DataSourceId]) {
        option.xAxis.data.push(row[xAxisBind]);
      }
      /**是否启用区间 */
      if (ShowZoom) {
        option.dataZoom = [
          {
            show: true,
            realtime: true,
            start: ZoomStart,
            end: ZoomEnd
          },
          {
            type: "inside",
            realtime: true,
            start: ZoomStart,
            end: ZoomEnd
          }
        ];
        option.grid.bottom = 60;
      }
      option.xAxis.boundaryGap = boundaryGap;

      for (let item of control.children) {
        let itemName = that.propVal(item, "Name");
        let itemBind = that.propVal(item, "Bind");
        let itemType = that.propVal(item, "Type");
        let itemStack = that.propVal(item, "Stack");
        let serial = {
          name: itemName,
          type: "bar",
          stack: itemStack,
          data: []
        };
        /**堆叠名 */
        if (itemStack && itemStack != "") {
          serial.stack = itemStack;
        }
        /**系列类型 */
        if (itemType == "bar") {
          serial.type = "bar";
        } else if (itemType == "Line") {
          serial.type = "line";
        } else if (itemType == "Dot") {
          serial.type = "scatter";
        } else if (itemType == "Area") {
          serial.type = "line";
          serial.areaStyle = {};
        }
        /**填充数据 */
        for (let row of that.sourceData[DataSourceId]) {
          serial.data.push(row[itemBind]);
        }
        option.series.push(serial);
        option.legend.data.push(serial.name);
        // console.log( serial )
      }

      /**渲染 */
      let refId = that.propVal(control, "Id");
      setTimeout(() => {
        if (that.$refs.chartList) {
          let refObj = that.$refs.chartList.find(p => p.id == refId);
          if (refObj) {
            let dom = echarts.init(refObj);
            dom.setOption(option);
          }
        }
      });
    },
    /**
     * 渲染饼图
     */
    randerPie(control) {
      let that = this;
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: []
      };
      let DataSourceId = that.propVal(control, "DataSourceId");
      let Bind = that.propVal(control, "Bind");
      for (let item of control.children) {
        let itemName = that.propVal(item, "Name");
        let itemBind = that.propVal(item, "Bind");
        let itemInnerRadius = that.propVal(item, "InnerRadius");
        let itemOuterRadius = that.propVal(item, "OuterRadius");
        let serial = {
          name: itemName,
          type: "pie",
          radius: [],
          data: []
        };
        /**半径 */
        serial.radius.push(itemInnerRadius + "%");
        serial.radius.push(itemOuterRadius + "%");
        /**填充系列数据 */
        for (let row of that.sourceData[DataSourceId]) {
          let data = {
            name: row[Bind],
            value: row[itemBind]
          };
          serial.data.push(data);
        }
        option.series.push(serial);
      }

      /**渲染 */
      let refId = that.propVal(control, "Id");
      setTimeout(() => {
        if (that.$refs.chartList) {
          let refObj = that.$refs.chartList.find(p => p.id == refId);
          if (refObj) {
            let dom = echarts.init(refObj);
            dom.setOption(option);
          }
        }
      });
    },
    /**
     * 页面初始化时的事件执行，如Onload和OnInterval等
     */
    initEvent() {
      let that = this;
      for (let ev of that.events) {
        if (ev.key == "V5.Event.OnLoad") {
          let actId = that.propVal(ev, "ActionId");
          if (actId) {
            setTimeout(() => {
              that.doAction(ev, actId);
            }, 500);
          }
        } else if (ev.key == "V5.Event.OnInterval") {
          let actId = that.propVal(ev, "ActionId");
          let interval = that.propVal(ev, "Interval");
          if (actId && interval > 0) {
            that.times.push(
              setInterval(() => {
                that.doAction(ev, actId);
              }, parseInt(interval))
            );
          }
        }
      }
    },
    propVal(node, key) {
      let prop = node.props.find(p => p.key == key);
      if (prop) return prop.value;
      return "";
    },
    getTableCoulmn(control) {
      let that = this;
      let columns = [];
      if (this.propVal(control, "ShowRowNumber")) {
        columns.push({
          type: "index",
          width: 60,
          align: "center"
        });
      }
      if (control.children) {
        for (let sourceCol of control.children) {
          columns.push({
            title: sourceCol.props.find(o => o.key == "Name").value,
            key: sourceCol.props.find(o => o.key == "Bind").value
          });
        }
      }
      return columns;
    },
    doAction(sender, actionId) {
      let that = this;
      // console.log("DoAction:" + actionId);
      let act = that.actions.find(
        p => p.props.find(o => o.key == "Id").value == actionId
      );
      if (act) {
        if (act.key == "V5.Action.AlertAction") {
          that.$Modal.info({
            title: that.propVal(act, "Title"),
            content: that.propVal(act, "Message"),
            onOk: () => {
              setTimeout(() => {
                that.doAction(sender, that.propVal(act, "OnOk"));
              }, that.eventInterval);
            }
          });
        } else if (act.key == "V5.Action.ConfirmAction") {
          that.$Modal.confirm({
            title: that.propVal(act, "Title"),
            content: that.propVal(act, "Message"),
            onOk: () => {
              setTimeout(() => {
                that.doAction(sender, that.propVal(act, "OnOk"));
              }, that.eventInterval);
            },
            onCancel: () => {
              setTimeout(() => {
                that.doAction(sender, that.propVal(act, "OnCancel"));
              }, that.eventInterval);
            }
          });
        } else if (act.key == "V5.Action.OpenAction") {
          let url = that.propVal(act, "Url");
          if (url) window.open(url);
          setTimeout(() => {
            that.doAction(sender, that.propVal(act, "NextActionId"));
          }, that.eventInterval);
        } else if (act.key == "V5.Action.RedirectAction") {
          let url = that.propVal(act, "Url");
          if (url) location.href = url;
          setTimeout(() => {
            that.doAction(sender, that.propVal(act, "NextActionId"));
          }, that.eventInterval);
        } else if (act.key == "V5.Action.LoadDataAction") {
          let sourceId = that.propVal(act, "DataSourceId");
          let ds = that.dataSources.find(
            p => p.props.find(o => o.key == "Id").value == sourceId
          );
          if (ds && ds.key == "V5.DataSource.Sql") {
            loadSqlResult(ds.props.find(p => p.key == "Content").value).then(
              res => {
                that.sourceData[sourceId] = res;
                that.$forceUpdate();
                that.initCharts();
              }
            );
          }
        }
      }
    }
  }
};
</script>

<style>
.engine-logo {
  position: fixed;
  width: 100px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  right: 0;
  bottom: 0;
  color: #ddd;
}
</style>
