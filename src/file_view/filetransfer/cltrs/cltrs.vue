<template>
  <Card>
    <query-page
      ref="queryPage"
      v-show="!modalShow"
      api="FILE"
      pageUrl="/archiveMove/queryArchiveItemByFilter"
      @add="modalShow=true"
      :operation="operation"
    ></query-page>
    <div v-if="modalShow">
      <Row>
        <div style="line-height: 40px;">
          <b>新增材料转递</b>
          <div style="float: right">
            <Button size="large" type="info" @click="addArchive">提交</Button>&nbsp;
            <Button size="large" @click="back">返回</Button>
          </div>
        </div>
        <Divider style="margin: 15px 0;" />
      </Row>
      <div class="brs"></div>
      <Row :gutter="20">
        <Col span="24">
          <Form ref="modalForm" :model="modalForm" :label-width="150">
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="转递时间：">
                  <DatePicker type="date" v-model="modalForm.moveTime"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="来档单位：">
                  <Select v-model="modalForm.unitId" clearable>
                    <OptionGroup
                      :label="item.groupName"
                      v-for="item in unitList"
                      :key="item.groupName"
                    >
                      <Option
                        v-for="item1 in item.data"
                        :value="item1.value"
                        :key="item1.value"
                      >{{ item1.label }}</Option>
                    </OptionGroup>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="承办人：">
                  <Input v-model="modalForm.transactor" />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="转递方向：">
                  <Select v-model="modalForm.moveType">
                    <Option :value="0">转出</Option>
                    <Option :value="1">转入</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="转档方式：">
                  <Select v-model="modalForm.moveWay">
                    <Option
                      :value="item.id"
                      :key="item.id"
                      v-for="item in movewayList"
                    >{{item.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="退回执日期：">
                  <DatePicker type="date" v-model="modalForm.returnReceiptTime"></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10">
              <Col span="12">
                <FormItem label="送档人1：">
                  <Input v-model="modalForm.sendManA" />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="送档人2：">
                  <Input v-model="modalForm.sendManB" />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span="24">
          <Row>
            <b>关联档案</b>
          </Row>
          <div style="position: relative;top: -1px;z-index: 100;">
            <Button long size="large" @click="addFile" icon="md-add">
              <b>添加档案</b>
            </Button>
          </div>
          <div class="brs"></div>
          <page-table
            ref="mxTable"
            :tabData="nptData"
            :columns="nptColumns"
            :noEdit="true"
            :noPage="true"
          ></page-table>
        </Col>
      </Row>
    </div>
    <Modal v-model="showFileModal" @on-ok="onModalOk" @on-cancel="onModalCancel" :closable="false">
      <Form label-position="left" :label-width="100" :model="fileForm">
        <FormItem label="转入人">
          <Select v-model="fileForm.moveMan" filterable>
            <Option :value="item.id" :key="item.id" v-for="item in userList">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="职务">
          <Input v-model="fileForm.the_position"></Input>
        </FormItem>
        <FormItem label="材料名称">
          <Input v-model="fileForm.archiveItemName"></Input>
        </FormItem>
        <FormItem label="材料份数">
          <Input v-model="fileForm.amount"></Input>
        </FormItem>
        <FormItem label="材料页数">
          <Input v-model="fileForm.archiveItemPages"></Input>
        </FormItem>
        <FormItem label="制成日期">
          <DatePicker type="date" v-model="fileForm.date"></DatePicker>
        </FormItem>
        <FormItem label="材料状态">
          <Select v-model="fileForm.archiveItemStatus">
            <Option value="未归档">未归档</Option>
            <Option value="已归档">已归档</Option>
          </Select>
        </FormItem>
        <FormItem label="转递原因">
          <Select v-model="fileForm.reason">
            <Option :value="item.id" :key="item.id" v-for="item in reasonList">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="fileForm.remark"></Input>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>
<script>
import queryPage from "@/apps/components/query_pages";
import pageTable from "@/apps/components/page_table";
import { listAppDictValueByCode } from "@/api/application/dictionary";
import { loadUnitData } from "@/file_view/xtgl/dwgl/api";
import { getUserList, addArchive } from "./api";
export default {
  components: {
    queryPage,
    pageTable
  },
  data() {
    return {
      modalShow: false,
      operation: {
        title: "操作",
        width: 130
      },
      modalForm: {},
      userList: [],
      nptColumns: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "转入人",
          key: "moveMan",
          render: (h, { row, column, index }) => {
            return (
              <p>{this.userList.find(val => (val.id = row.moveMan)).name}</p>
            );
          }
        },
        {
          title: "职务",
          key: "the_position"
        },
        {
          title: "材料名称",
          key: "archiveItemName"
        },
        {
          title: "材料份数",
          key: "amount"
        },
        {
          title: "材料页数",
          key: "archiveItemPages"
        },
        {
          title: "材料状态",
          key: "archiveItemStatus"
        },
        {
          title: "年",
          render: (h, { row, column, index }) => {
            return <p>{row.date.getFullYear()}</p>;
          }
        },
        {
          title: "月",
          render: (h, { row, column, index }) => {
            return <p>{row.date.getMonth() + 1}</p>;
          }
        },
        {
          title: "日",
          render: (h, { row, column, index }) => {
            return <p>{row.date.getDate()}</p>;
          }
        },

        {
          title: "转入原因",
          key: "reason",
          render: (h, { row, column, index }) => {
            return (
              <p>{this.reasonList.find(val => (val.id = row.reason)).name}</p>
            );
          }
        },
        {
          title: "备注",
          key: "remark"
        },
        {
          title: "操作",
          render: (h, { row, column, index }) => {
            return (
              <span style={{ display: "flex", flex: "1 1 100%" }}>
                <Button
                  onClick={() => this.updateFile(row)}
                  type="warning"
                  size="small"
                >
                  修改
                </Button>
                <Button
                  onClick={() => this.deleteFile(row.moveMan)}
                  type="error"
                  size="small"
                >
                  删除
                </Button>
              </span>
            );
          }
        }
      ],
      nptData: [],
      showFileModal: false,
      fileForm: {
        moveMan: "",
        the_position: "",
        archiveItemName: "",
        amount: "",
        archiveItemPages: "",
        archiveItemStatus: "",
        date: "",
        reason: "",
        remark: ""
      },
      unitList: [],
      movewayList: [],
      reasonList: []
    };
  },
  async created() {
    let unitClass_data = await listAppDictValueByCode("unit_class");
    let unit_data = [];
    unitClass_data.map(async val => {
      let unit_class_data = await loadUnitData(val.id);
      let _ = [];
      unit_class_data.map(val1 => {
        _.push({ value: val1.id, label: val1.name });
      });
      unit_data.push({ groupName: val.name, data: _ });
    });
    this.unitList = unit_data;
    let movewayListData = await listAppDictValueByCode("move_archive_way");
    this.movewayList = movewayListData;
    let userListData = await getUserList({
      condition: {
        archiveCabinet: "",
        archiveColumn: "",
        archiveRow: "",
        idCard: "",
        manStatus: "",
        name: "",
        nativePlace: "",
        theNumber: "",
        thePosition: "",
        unitId: ""
      },
      pageIndex: 0,
      pageSize: 1000,
      searchText: ""
    });
    this.userList = userListData.respnoseData;
    let reasonListData = await listAppDictValueByCode("move_archive_reason");
    this.reasonList = reasonListData;
  },
  watch: {
    "fileForm.moveMan": {
      handler(newV, oldV) {
        if (newV) {
          this.fileForm.the_position = this.userList.find(
            val => val.id == newV
          ).thePositionDesc;
        } else {
          this.fileForm.the_position = "";
        }
      }
    }
  },
  methods: {
    async addArchive() {
      let data = { ...this.modalForm };
      data.archiveMoveDTOS = this.nptData.map(val => {
        return Object.assign({}, val, {
          archiveItemYear: val.date.getFullYear(),
          archiveItemMonth: val.date.getMonth() + 1,
          archiveItemDay: val.date.getDate()
        });
      });
      let res = await addArchive(data);
      console.log(data);
      this.modalShow = false;
      this.nptData=[];
      this.fileForm= {
        moveMan: "",
        the_position: "",
        archiveItemName: "",
        amount: "",
        archiveItemPages: "",
        archiveItemStatus: "",
        date: "",
        reason: "",
        remark: ""
      };
      this.$refs["queryPage"].loadData(1);
    },
    back() {
      this.modalShow = false;
      this.modalForm = {};
    },
    addFile() {
      this.showFileModal = true;
    },
    onModalOk() {
      this.nptData.push(this.fileForm);
      this.fileForm = {
        moveMan: "",
        the_position: "",
        archiveItemName: "",
        amount: "",
        archiveItemPages: "",
        archiveItemStatus: "",
        date: "",
        reason: "",
        remark: ""
      };
    },
    onModalCancel() {
      this.fileForm = {
        moveMan: "",
        the_position: "",
        archiveItemName: "",
        amount: "",
        archiveItemPages: "",
        archiveItemStatus: "",
        date: "",
        reason: "",
        remark: ""
      };
    },
    updateFile(row) {
      this.fileForm = {
        moveMan: row.moveMan,
        thePosition: row.thePosition,
        archiveItemName: row.archiveItemName,
        amount: row.amount,
        archiveItemPages: row.archiveItemPages,
        archiveItemStatus: row.archiveItemStatus,
        date: row.date,
        reason: row.reason,
        remark: row.remark
      };
      this.showFileModal = true;
    },
    deleteFile(id) {
      let index = this.nptData.findIndex(val => val.moveMan == id);
      this.nptData.splice(index, 1);
    }
  }
};
</script>
<style lang="less">
</style>
