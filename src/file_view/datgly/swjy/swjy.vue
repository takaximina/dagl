<template>
  <Row :gutter="20">
    <Col span="12">
      <Card title="查询">
        <Input search enter-button @on-search="search" />
        <Table :columns="column1" :data="searchData"></Table>
      </Card>
    </Col>
    <Col span="12">
      <Card title="创建账号">
        <Table :columns="column2" :data="chooseData"></Table>
        <Row>
          <Col span="24">
            <div style="float:right;margin-top:10px">
              <Button type="primary" :disabled="chooseData.length==0" @click="formModal=true">生成账号</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </Col>
    <Modal
      v-model="fileModal"
      width="70"
      :closable="false"
      @on-ok="onOk"
      @on-cancel="onCancel"
      :mask-closable="false"
    >
      <Row :gutter="20">
        <Col span="8" style="height:600px">
          <Card title="档案分类" style="height:100%;overflow-y:scroll;overflow-x:hidden;">
            <Tree
              :data="treeData"
              :render="renderContent"
              children-key="archiveManItemDTOS"
              show-checkbox
              multiple
              ref="tree"
              @on-check-change="onCheckChange"
            ></Tree>
          </Card>
        </Col>
        <Col span="16">
          <Card title="档案详情" v-if="realFile.length>0">
            <Table :columns="fileColumns" :data="realFile"></Table>
          </Card>
        </Col>
      </Row>
    </Modal>
    <Modal
      v-model="formModal"
      :closable="false"
      @on-cancel="formModel={};formModal=false"
      footer-hide
    >
      <Form
        :model="formModel"
        ref="formModel"
        :rules="formModelRules"
        label-position="left"
        :label-width="150"
      >
        <FormItem label="借阅人：" prop="borrower">
          <Input style="width: 160px" v-model="formModel.borrower" />
        </FormItem>
        <FormItem label="审批单：" prop="approvalFormUrl">
          <!-- <Input v-model="modalForm.headUrl" /> -->
          <Upload
            action="http://120.78.137.30:8190/upload/add"
            :headers="{Authorization:'Bearer '+token}"
            :on-success="uploadFile"
            :on-remove="(file,fileList)=>this.formModel.approvalFormUrl=''"
            :show-upload-list="false"
            style="width: 160px"
          >
            <template>
              <Button icon="ios-cloud-upload-outline" v-if="!formModel.approvalFormUrl">pdf文件</Button>
              <img
                :src="`http://120.78.137.30/res/${formModel.approvalFormUrl}`"
                v-if="!!formModel.approvalFormUrl"
                style="width:162px;height:162px;"
              />
            </template>
          </Upload>
        </FormItem>
        <FormItem label="联系电话：" prop="phone">
          <Input v-model="formModel.phone" style="width: 160px" />
        </FormItem>
        <FormItem label="批准人：" prop="approvalName">
          <Select v-model="formModel.approvalName" style="width:160px">
            <Option v-for="item in admin" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="归还时间：" prop="returnTime">
          <DatePicker
            type="datetime"
            placeholder="选择日期和时间"
            style="width: 160px"
            v-model="formModel.returnTime"
          ></DatePicker>
        </FormItem>

        <FormItem label="备注：">
          <Input v-model="formModel.remark" style="width: 160px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="onFormOk">确定</Button>
          <Button @click="$refs['formModel'].reset()">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </Row>
</template>
<script>
import _ from "lodash";
import { queryPerson, loadTreeData, loadAdmin, borrow } from "./api";
import { getToken } from "@/libs/util";
import { listAppDictValueByCode } from "@/api/application/dictionary";
export default {
  data() {
    return {
      token: getToken(),
      searchData: [],
      chooseData: [],
      fileModal: false,
      realFile: [],
      realId: "",
      realSelectFiles: [],
      treeData: [],
      fileSelected: "",
      column1: [
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "性别",
          key: "sexDesc"
        },
        {
          title: "出生日期",
          key: "birth"
        },
        {
          title: "工作单位",
          key: "unitName"
        },
        {
          render: (h, params) => {
            return (
              <div>
                <Button onClick={() => this.choose(params.row)}>添加</Button>
              </div>
            );
          }
        }
      ],
      column2: [
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "性别",
          key: "sexDesc"
        },
        {
          title: "出生日期",
          key: "birth"
        },
        {
          title: "工作单位",
          key: "unitName"
        },
        {
          render: (h, params) => {
            return (
              <div>
                <Button onClick={() => this.showFileModal(params.row.id)}>
                  选择
                </Button>
                <Button onClick={() => this.cancelChoose(params.row)}>
                  取消
                </Button>
              </div>
            );
          }
        }
      ],
      fileColumns: [
        {
          title: "名称",
          key: "itemName"
        },
        {
          key: "archiveClassNum",
          title: "档案分类"
        },
        {
          title: "年",
          key: "itemYear"
        },
        {
          title: "月",
          key: "itemMonth"
        },
        {
          title: "日",
          key: "itemDay"
        },
        {
          title: "份",
          key: "amount"
        },
        {
          title: "页码",
          key: "itemPages"
        },
        {
          title: "原因",
          render: (h, params) => {
            return (
              <div>
                <Select
                  transfer
                  value={params.row.borrowReason}
                  style="width:160px"
                  on-on-change={e => this.selectReason(e, params.row.id)}
                  style={{ zIndex: "999" }}
                >
                  {this.borrowReasons.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            );
          }
        }
      ],
      formModal: false,
      formModel: {},
      admin: [], //管理人员列表
      formModelRules: {
        borrower: [{ required: true, message: "请输入借阅人" }],
        approvalFormUrl: [{ required: true, message: "请上传审批单" }],
        phone: [{ required: true, message: "请输入电话号码" }],
        approvalName: [
          {
            required: true,
            message: "请选择批准人",
            trigger: "change"
          }
        ],
        returnTime: [
          {
            required: true,
            type: "date",
            message: "请选择归还时间",
            trigger: "change"
          }
        ]
      },
      borrowReasons: []
    };
  },
  async created() {
    let data = await loadAdmin();
    this.admin = data.respnoseData;
    let reasons = await listAppDictValueByCode("see_archive_reason");
    this.borrowReasons = reasons;
  },
  methods: {
    async search(e) {
      if (e) {
        let data = await queryPerson(e);
        this.searchData = data.respnoseData;
      }
    },
    uploadFile(response, file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      if (response.code == 0) {
        this.$Message.success("上传成功");
        this.$set(this.formModel, "approvalFormUrl", response.data);
        //this.modalForm.headUrl = response.data;
        console.log(!!this.formModel.approvalFormUrl);
      } else {
        this.$Message.error(response.message);
      }
    },
    onOk() {
      let index = this.chooseData.findIndex(val => val.id == this.realId);
      let data = { ...this.chooseData[index] };
      if (this.realFile.filter(val => !val.borrowReason).length > 0) {
        this.fileModal = true;
      }
      {
        data.file = this.realFile;
        this.chooseData.splice(index, 1, data);
        this.realFile = [];
        this.realId = "";
      }
    },
    onCancel() {
      this.realFile = [];
      this.realId = "";
    },
    onFormOk() {
      let archiveBorrowItemDTOS = [];
      this.chooseData.map(item => {
        item.file.map(file => {
          archiveBorrowItemDTOS.push({
            archiveManItemId: file.id,
            borrowReason: file.borrowReason
          });
        });
      });
      let data = { ...this.formModel };
      data.borrowType = 1;
      data.archiveBorrowItemDTOS = archiveBorrowItemDTOS;
      this.$refs["formModel"].validate(valid => {
        if (valid) {
          borrow(data).then(res => {
            this.$Modal.confirm({title:'创建成功',content:res});
            this.formModel={};
            this.formModal=false
          }).catch(e=>{
            this.$Message.error(e);
            this.formModel={};
            this.formModal=false;
          });
        }else{
          this.$Message.error('请求改表单错误')
        }
      });
    },
    selectFiles(selection) {
      this.realSelectFiles = selection;
    },
    selectReason(e, id) {
      let index = this.realFile.findIndex(item => item.id == id);
      let data = { ...this.realFile[index] };
      data.borrowReason = e;
      this.realFile.splice(index, 1, data);
    },
    choose(row) {
      this.chooseData.push(row);
      //console.log(this.chooseData);
    },
    cancelChoose(row) {
      let index = this.chooseData.findIndex(val => val.id == row.id);
      this.chooseData.splice(index, 1);
    },
    async showFileModal(id) {
      this.fileModal = true;
      let data = await loadTreeData(id);
      this.realId = id;
      this.treeData = data;
    },
    renderContent(h, { root, node, data }) {
      let aad = (
        <p
          style="display:inline-block;width:100%"
          //  onClick={() => this.clickTree(data)}
        >
          {data.reportName || data.itemName}
          {data.archiveManItemDTOS && data.archiveManItemDTOS.length > 0
            ? "(" + data.archiveManItemDTOS.length + ")份"
            : ""}
        </p>
      );
      return aad;
    },
    clickTree(data) {
      if (data.manId) {
        //console.log(this.fileSelected==data);
        if (this.realFile.filter(val => val.id == data.id).length == 0) {
          this.fileSelected = data.id;
          this.realFile.push(data);
        }
      }
    },
    onCheckChange(...args) {
      this.realFile = args[0].filter(val => !!val.manId);
    }
  }
};
</script>
<style lang="less">
</style>
