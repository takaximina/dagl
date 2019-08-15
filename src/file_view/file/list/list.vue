<template>
  <Card>
    <!-- 管理档案 -->
    <Modal footer-hide v-model="showAddOrUpdate" :closable="false">
      <Card>
        <p slot="title">{{!fileForm.id?"新增":"修改"}}</p>
        <p slot="extra" @click="showAddOrUpdate=false">取消</p>
        <Row>
          <Col span="24">
            <Form ref="fileForm" :model="fileForm" :label-width="150" :rules="fileFormRules">
              <Row :gutter="10">
                <Col span="24">
                  <FormItem label="材料名称：" prop="itemName">
                    <Input v-model="fileForm.itemName" />
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="份数：" prop="amount">
                    <Input v-model="fileForm.amount" />
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="材料页数：" prop="itemPages">
                    <Input v-model="fileForm.itemPages" />
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="材料分类：">
                    <Input v-model="fileForm.archiveClassNum" disabled />
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="材料日期：" prop="itemDate">
                    <DatePicker
                      v-model="fileForm.itemDate"
                      format="yyyy年MM月dd日"
                      type="date"
                      placeholder="选择日期"
                      style="width: 200px"
                    ></DatePicker>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="材料上传：">
                    <Upload
                      action="http://120.78.137.30:8190/upload/add"
                      :headers="{Authorization:'Bearer '+token}"
                      :on-success="uploadFile"
                      :on-remove="(file,fileList)=>this.fileForm.originalUrl=''"
                    >
                      <Button icon="ios-cloud-upload-outline">pdf文件</Button>
                    </Upload>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="备注：" prop="remark">
                    <Input v-model="fileForm.remark" />
                  </FormItem>
                </Col>
                <input type="hidden" v-model="fileForm.manId" />
                <input type="hidden" v-model="fileForm.id" />
                <Col span="24">
                  <FormItem>
                    <Button type="primary" @click="handleSubmit('fileForm')">提交</Button>
                    <Button @click="handleReset('fileForm')" style="margin-left:8px">重置</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </Modal>
    <!-- 显示档案详情 -->
    <Modal
      footer-hide
      v-model="showInfoModal"
      width="100"
      :closable="false"
      class-name="vertical-center-modal"
    >
      <Row :gutter="20">
        <Col span="8" style="height:600px">
          <Card title="档案分类" style="height:100%">
            <Tree :data="treeData" :render="renderContent" children-key="archiveManItemDTOS"></Tree>
          </Card>
        </Col>
        <Col span="16">
          <Card title="档案详情" v-if="fileSelected">
            <Table :columns="fileColumns" :data="realFile"></Table>
          </Card>
        </Col>
      </Row>
    </Modal>
    <query-page
      ref="queryPage"
      pageUrl="/archiveman/queryByFilter"
      api="FILE"
      :operation="operation"
      @add="addPerson"
      v-show="!showActionModal"
    ></query-page>
    <!-- 显示新增或修改人员基本信息 -->
    <Modal
      footer-hide
      v-model="showActionModal"
      :closable="false"
      width="800"
      label-position="left"
    >
      <Card>
        <p slot="title">{{!rowData?"新增":"修改"}}</p>
        <p slot="extra" @click="showActionModal=false;modalForm={}">取消</p>
        <Form
          ref="modalForm"
          :model="modalForm"
          :label-width="150"
          :rules="modalFormRules"
          inline
          label-position="left"
        >
          <FormItem label="姓名：" prop="name">
            <Input v-model="modalForm.name" />
          </FormItem>
          <FormItem label="头像：">
            <!-- <Input v-model="modalForm.headUrl" /> -->
            <Upload
              action="http://120.78.137.30:8190/upload/add"
              :headers="{Authorization:'Bearer '+token}"
              :on-success="uploadFile"
              :on-remove="(file,fileList)=>this.modalForm.headUrl=''"
              :show-upload-list="false"
            >
              <template>
                <Button icon="ios-cloud-upload-outline" v-if="!modalForm.headUrl">pdf文件</Button>
                <img
                  :src="`http://120.78.137.30/res/${modalForm.headUrl}`"
                  v-if="!!modalForm.headUrl"
                  style="width:162px;height:162px;"
                />
              </template>
            </Upload>
          </FormItem>
          <FormItem label="姓别：" prop="sex">
            <Select v-model="modalForm.sex" style="width:162px">
              <Option v-for="item in dict.sex" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="民族：" prop="nation">
            <Select v-model="modalForm.nation" style="width:162px">
              <Option v-for="item in dict.nation" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="政治面貌：" prop="politicalStatus">
            <Select v-model="modalForm.politicalStatus" style="width:162px">
              <Option
                v-for="item in dict.politicalStatus"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="出生日期：" prop="birth">
            <DatePicker
              v-model="modalForm.birth"
              format="yyyy年MM月dd日"
              type="date"
              placeholder="选择日期"
              style="width:162px"
            ></DatePicker>
          </FormItem>
          <FormItem label="身份证：" prop="idCard">
            <Input v-model="modalForm.idCard" style="width:162px" />
          </FormItem>
          <FormItem label="内设机构：">
            <Select v-model="modalForm.internalOrganization" style="width:162px">
              <Option
                v-for="item in dict.internalOrganization"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="人员状态：">
            <Select v-model="modalForm.manStatus" style="width:162px">
              <Option v-for="item in dict.manStatus" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="管理类别：">
            <Select v-model="modalForm.manageClass" style="width:162px">
              <Option
                v-for="item in dict.manageClass"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="籍贯" prop="nativePlaceIdList">
            <Cascader
              v-model="modalForm.nativePlaceIdList"
              :data="dict.nativePlace"
              style="width:162px;"
            />
          </FormItem>
          <FormItem label="档案柜" >
            <Cascader v-model="modalForm.archiveCabinetIdList" :data="dict.archive" style="width:162px;" @on-change="roomOnChange"/>
          </FormItem>
          <FormItem label="档案行：">
            <Select v-model="modalForm.archiveRow" style="width:162px">
              <Option
                v-for="item in dict.archiveRow"
                :value="item"
                :key="item"
              >{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="档案列：" >
            <Select v-model="modalForm.archiveColumn" style="width:162px">
              <Option
                v-for="item in dict.archiveColumn"
                :value="item"
                :key="item"
              >{{ item}}</Option>
            </Select>
          </FormItem>
          <FormItem label=" 职务：" prop="thePositionIdList">
            <Cascader
              v-model="modalForm.thePositionIdList"
              :data="dict.position"
              style="width:162px;"
            />
          </FormItem>
          <FormItem label=" 备注：">
            <Input v-model="modalForm.remark" />
          </FormItem>
          <FormItem label="单位：" prop="unitIdList">
            <Cascader v-model="modalForm.unitIdList" :data="dict.unit_data" style="width:162px;" />
          </FormItem>
          <input type="hidden" v-model="modalForm.id" />
          <FormItem>
            <Button type="primary" @click="handleSubmit('modalForm')">提交</Button>
            <Button @click="handleReset('modalForm')" style="margin-left:8px">重置</Button>
          </FormItem>
        </Form>
      </Card>
    </Modal>
  </Card>
</template>
<script>
import queryPage from "@/apps/components/query_pages";
import {
  addPerson,
  deletePerson,
  updatePerson,
  loadTreeData,
  saveFile,
  deleteFile,
  loadPersonData
} from "./api";
import { listAppDictValueByCode } from "@/api/application/dictionary";
import { loadUnitData } from "@/file_view/xtgl/dwgl/api";
import { loadAllRoom } from "@/file_view/xtgl/kfgl/api";
import { getToken } from "@/libs/util";
import moment from "moment";
export default {
  components: {
    queryPage
  },
  data() {
    return {
      dict: {},
      token: getToken(),
      showAddOrUpdate: false,
      fileData: {},
      treeData: [],
      rowData: {},
      showInfoModal: false,
      showActionModal: false,
      fileSelected: false,
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
        }
      ],
      realFile: [],
      operation: {
        title: "操作",
        width: 160,
        render: (h, params) => {
          return (
            <span style={{ display: "flex", flex: "1 1 100%" }}>
              <Button
                onClick={() => this.showInfo(params.row)}
                type="primary"
                size="small"
              >
                详细档案
              </Button>
              <Button
                onClick={() => this.updatePerson(params.row)}
                type="warning"
                size="small"
              >
                修改
              </Button>
              <Button
                onClick={() => this.deletePerson(params.row.id)}
                type="error"
                size="small"
              >
                删除
              </Button>
            </span>
          );
        }
      },
      modalForm: {},
      fileForm: {},
      fileFormRules: {
        itemName: [
          { required: true, message: "请输入材料名称", trigger: "change" }
        ],
        amount: [
          { required: true, message: "请输入材料份数", trigger: "change" }
        ],
        itemPages: [
          { required: true, message: "请输入材料页数", trigger: "change" }
        ],
        itemDate: [
          {
            required: true,
            type: "date",
            message: "请选择材料日期",
            trigger: "change"
          }
        ]
      },
      modalFormRules: {
        name: [{ required: true, message: "姓名不能为空" }],
        sex: [{ required: true, message: "性别不能为空" }],
        birth: [{ required: true, type: "date", message: "民族不能为空" }],
        nation: [{ required: true, message: "出生日期不能为空" }],
        idCard: [{ required: true, message: "身份证不能为空" }],
        unitIdList: [{ required: true, message: "单位不能为空" }],
        nativePlaceIdList:[{required:true,message:'籍贯不能为空'}],
        thePositionIdList:[{required:true,message:'职务不能为空'}]
      }
    };
  },
  async created() {
    console.time("dict");
    await this.loadAllDict();
    console.timeEnd("dict");
  },
  methods: {
    //
    async loadAllDict() {
      Promise.all([
        listAppDictValueByCode("sex_dict"),
        listAppDictValueByCode("nation_dict"),
        listAppDictValueByCode("internal_organization"),
        listAppDictValueByCode("man_status"),
        listAppDictValueByCode("manage_class"),
        listAppDictValueByCode(
        "political_status_dict"
      )
      ]).then(res => {
        this.dict.sex=res[0];
        this.dict.nation=res[1];
        this.dict.internalOrganization=res[2];
        this.dict.manStatus=res[3];
        this.dict.manageClass=res[4];
        this.dict.politicalStatus=res[5];
      });
      // let sex_data = await listAppDictValueByCode("sex");
      // this.dict.sex = sex_data;
      // let nation_data = await listAppDictValueByCode("sex");
      // this.dict.nation = nation_data;
      // let internalOrganization_data = await listAppDictValueByCode(
      //   "internal_organization"
      // );
      // this.dict.internalOrganization = internalOrganization_data;
      // let manStatus_data = await listAppDictValueByCode("man_status");
      // this.dict.manStatus = manStatus_data;
      // let manageClass_data = await listAppDictValueByCode("manage_class");
      // this.dict.manageClass = manageClass_data;
      let unitClass_data = await listAppDictValueByCode("unit_class");
      let unit_data = [];
      unitClass_data.map(async val => {
        let unit_class_data = await loadUnitData(val.id);
        let _ = [];
        unit_class_data.map(val1 => {
          _.push({ value: val1.id, label: val1.name });
        });
        unit_data.push({ value: val.id, label: val.name, children: _ });
      });
      this.dict.unit_data = unit_data;
      let position_data = await listAppDictValueByCode("the_position_dict");
      let position = this.parseData(position_data);
      this.dict.position = position;
      let area_data = await listAppDictValueByCode("area_dict");
      this.dict.nativePlace = this.parseData(area_data, 3);
      // let politicalStatus_data = await listAppDictValueByCode(
      //   "political_status_dict"
      // );
      // this.dict.politicalStatus = politicalStatus_data;
      let room = await loadAllRoom();
      this.dict.archive = this.parseRoom(room);
    },
    roomOnChange(value,selectData){
      console.log(value,selectData);
      this.$set(this.dict,'archiveRow',Number(selectData[2].theRow))
     this.$set(this.dict,'archiveColumn',Number(selectData[2].theColumn))
    },
    parseRoom(room) {
      let rooms = room.filter(item => item.children);
      console.log(rooms);
      let room_areas = rooms.map(item => {
        return Object.assign({}, item, {
          children: item.children.filter(area => area.children)
        });
      });
      console.log(room_areas);
      return room_areas.map(item => this.parseGui(item));
    },
    parseGui(dict) {
      if (dict.theRank != "3") {
        console.log(dict);
        return {
          value: dict.id,
          label: dict.name,
          children: dict.children.map(item => this.parseGui(item))
        };
      } else {
        return { value: dict.id, label: dict.name ,theRow:dict.theRow,theColumn:dict.theColumn};
      }
    },
    //把数据做解析
    parseData(data, level = 2) {
      let _ = [];
      data
        .filter(val => !val.parentId)
        .map(val => {
          _.push({ value: val.id, label: val.name, children: [] });
        });
      if (level == 2) {
        _.map(val => {
          data.map(val1 => {
            if (val.value == val1.parentId) {
              val.children.push({ value: val1.id, label: val1.name });
            }
          });
        });
      } else {
        _.map(val => {
          data.map(val1 => {
            if (val.value == val1.parentId) {
              val.children.push({
                value: val1.id,
                label: val1.name,
                children: []
              });
            }
          });
        });
        _.map(val => {
          val.children.map(val1 => {
            data.map(val2 => {
              if (val1.value == val2.parentId) {
                val1.children.push({ value: val2.id, label: val2.name });
              }
            });
          });
        });
      }
      return _;
    },
    //展示人员十大类档案
    async showInfo(row) {
      this.rowData = row;
      // console.log(row);
      // await this.loadTreeData(row.id);
      // this.showInfoModal = true;
      this.$router.push({
        name: "fileCheck",
        query: { id: row.id, name: row.name }
      });
    },
    //加载10大类档案类别
    async loadTreeData(id) {
      let data = await loadTreeData(id);
      this.treeData = data;
    },
    //新增人员
    addPerson() {
      this.rowData = false;
      this.showActionModal = true;
      this.modalForm = {};
    },
    //修改人员信息
    async updatePerson(row) {
      this.rowData = row;
      this.showActionModal = true;
      let data = await loadPersonData(row.id);
      console.log(data);
      this.modalForm = Object.assign({},this.modalForm,{
        id: data.id,
        name: data.name,
        sex: data.sex,
        birth: moment(data.birth, "YYYYMMDD").format(),
        nation: data.nation,
        idCard: data.idCard,
        archiveCabinetIdList: data.archiveCabinetIdList,
        archiveRow:data.archiveRow,
        archiveColumn:data.archiveColumn,
        headUrl: data.headUrl,
        internalOrganization: data.internalOrganization,
        manStatus: data.manStatus,
        manageClass: data.manageClass,
        nativePlaceIdList: data.nativePlaceIdList,
        thePositionIdList: data.thePositionIdList,
        remark: data.remark,
        politicalStatus: data.politicalStatus,
        unitIdList: data.unitIdList
      });
      console.log(this.modalForm.birth);
    },
    //删除人员信息
    deletePerson(id /** 人员的唯一id*/) {
      this.$Modal.confirm({
        title: "删除",
        content: "确定删除此人员么？",
        loading: true,
        onOk: async () => {
          let res = await deletePerson(id);
          this.$Modal.info({ content: "删除成功" });
          this.$refs["queryPage"].loadData(1);
          setTimeout(() => {
            this.$Modal.remove();
          }, 2000);
        },
        onCancel: () => {
          this.$Modal.remove();
        }
      });
    },
    deleteFile(id /**档案唯一id */) {
      this.$Modal.confirm({
        title: "删除",
        content: "确定删除此档案么？",
        loading: true,
        onOk: async () => {
          let res = await deleteFile(id);
          this.$Modal.info({ content: "删除成功" });
          //this.$refs["queryPage"].loadData(1);
          await this.showInfo(this.rowData);
          this.realFile = [];
          setTimeout(() => {
            this.$Modal.remove();
          }, 2000);
        },
        onCancel: () => {
          this.$Modal.remove();
        }
      });
    },
    //表单提交+验证
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (name == "modalForm") {
            this.saveData()
              .then(res => {
                this.$refs["queryPage"].loadData(1);
                this.$Message.success({ content: "提交成功" });
                this.showActionModal = false;
              })
              .catch(e => {
                console.log(e);
                this.$Message.error(e);
              });
          } else {
            this.saveFile()
              .then(res => {
                this.$Message.success({ content: "提交成功" });
                this.showInfo(this.rowData);
                this.realFile = [];
              })
              .then(() => {
                this.showAddOrUpdate = false;
              })
              .catch(e => {
                console.log(e);
                this.realFile = [];
                this.$Message.error(e);
              });
          }
        } else {
          this.$Message.error("请修改表单错误");
        }
      });
    },
    //表单验证之后提供给服务器
    saveData() {
      let res;
      let data = { ...this.modalForm };
      console.log(data)
      data.nativePlaceId =
        data.nativePlaceIdList[data.nativePlaceIdList.length - 1];
      data.thePosition =
        data.thePositionIdList[data.thePositionIdList.length - 1];
      data.unitId = data.unitIdList[data.unitIdList.length - 1];
      let date = moment(data.birth);
      console.log(date);
      data.birth = `${date.get("Y")}${
        date.get("M") + 1 >= 10 ? date.get("M") + 1 : "0" + (date.get("M") + 1)
      }${
        date.get("D") + 1 >= 10 ? date.get("D") + 1 : "0" + (date.get("D") + 1)
      }`;
      delete data.nativePlaceIdList;
      delete data.thePositionIdList;
      delete data.unitIdList;
      console.log(data);
      if (data.id) {
        res = updatePerson(data);
      } else {
        res = addPerson(data);
      }
      return res;
    },
    //保存file档案信息到服务器
    saveFile() {
      let date = new Date(this.fileForm.itemDate);
      let data = { ...this.fileForm };
      data.itemYear = date.getFullYear();
      data.itemMonth = date.getMonth() + 1;
      data.itemDay = date.getDate();
      delete data.itemDate;
      return saveFile(data);
    },
    //表单重置
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //自定义渲染档案材料树
    renderContent(h, { root, node, data }) {
      let aad = (
        <p
          style="display:inline-block;width:100%"
          onClick={() => this.clickTree(data)}
        >
          {data.reportName || data.itemName}
          {data.archiveManItemDTOS && data.archiveManItemDTOS.length > 0
            ? "(" + data.archiveManItemDTOS.length + ")份"
            : ""}
          {data.manId == undefined ? (
            <span style="float:right;margin-right:32px">
              <Button
                type="default"
                size="small"
                icon="ios-add"
                onClick={e => {
                  e.stopPropagation();
                  this.handleAdd(root, node, data);
                }}
              >
                添加
              </Button>
            </span>
          ) : (
            <span style="float:right;margin-right:32px">
              <Button
                type="default"
                size="small"
                icon="ios-repeat"
                onClick={e => {
                  e.stopPropagation();
                  this.handleUpdate(root, node, data);
                }}
              >
                修改
              </Button>
              <Button
                type="default"
                size="small"
                icon="ios-remove"
                onClick={e => {
                  e.stopPropagation();
                  this.deleteFile(data.id);
                }}
              >
                删除
              </Button>
            </span>
          )}
        </p>
      );
      return aad;
    },
    handleAdd(root, node, data) {
      this.fileForm = {
        manId: this.rowData.id,
        archiveClassId: data.id,
        archiveClassNum: data.archiveClassNum
      };
      this.showAddOrUpdate = true;
    },
    handleUpdate(root, node, data) {
      console.log(root, node, data);
      let formdata = { ...data };
      formdata.itemDate = new Date(
        `${data.itemYear} ${data.itemMonth} ${data.itemDay}`
      );
      delete formdata.itemDay;
      delete formdata.itemYear;
      delete formdata.itemMonth;
      this.fileForm = formdata;
      this.showAddOrUpdate = true;
    },
    //点击档案数
    clickTree(data) {
      if (data.manId) {
        this.fileSelected = data.id;
        this.realFile = [];
        this.realFile.push(data);
      }
    },
    //上传材料
    uploadFile(response, file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      if (response.code == 0) {
        this.$Message.success("上传成功");
        this.$set(this.modalForm, "headUrl", response.data);
        //this.modalForm.headUrl = response.data;
        console.log(!!this.modalForm.headUrl);
      } else {
        this.$Message.error(response.message);
      }
    }
  }
};
</script>
<style lang="less" >
.vertical-center-modal {
  overflow: hidden;
  .ivu-modal {
    top: 64px;
    left: 256px;
    margin: 0;
    width: calc(~"100% - 256px") !important;
  }
}
</style>
