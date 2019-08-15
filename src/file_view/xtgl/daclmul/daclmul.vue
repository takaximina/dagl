<template>
  <Row :gutter="20">
    <Col span="6">
      <Card title="材料目录" icon="ios-options" shadow>
        <p slot="extra">
          <Button size="small" icon="md-add" @click="addMl"></Button>
          <Button v-if="selected" size="small" icon="md-list-box" @click="ediMl"></Button>
        </p>
        <CellGroup @on-click="slMl">
          <Cell
            v-for="item in mlData"
            :name="item.id"
            :key="item.id"
            :title="item.name"
            :label="item.theArchiveClass"
            :selected="selected==item.id"
          ></Cell>
        </CellGroup>
      </Card>
    </Col>
    <Col span="18">
      <Card v-if="selected" title="详细信息">
        <Table :columns="columns" :data="[realMlData]"></Table>
      </Card>
    </Col>
    <Modal v-model="mlModal" :closable="false">
      <Form ref="mlForm" :model="mlForm" label-position="left" :label-width="100" :rules="rules">
        <FormItem label="名称：" prop="name">
          <Input v-model="mlForm.name"></Input>
        </FormItem>
        <FormItem label="类编码：" prop="code">
          <Input v-model="mlForm.code"></Input>
        </FormItem>
        <FormItem label="上报代码：" prop="reportCode">
          <Input v-model="mlForm.reportCode"></Input>
        </FormItem>
        <FormItem label="上报名称：" prop="reportName">
          <Input v-model="mlForm.reportName"></Input>
        </FormItem>
        <FormItem label="简称：" prop="simpleName">
          <Input v-model="mlForm.simpleName"></Input>
        </FormItem>
        <FormItem label="类号：" prop="archiveClassNum">
          <Input v-model="mlForm.archiveClassNum"></Input>
        </FormItem>
        <FormItem label="类名称：" prop="theArchiveClass">
          <Input v-model="mlForm.theArchiveClass"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveMl">确定</Button>
        <Button type="text" @click="mlModal=false">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script>
import { loadAllData, addMlData, ediMlData } from "./api";
export default {
  data() {
    return {
      //档案目录数据
      mlData: [],
      selected: "",
      mlModal: false,
      flag: 0, //0为新增，1为更新
      mlForm: {},
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "change"
          }
        ],
        code: [
          {
            required: true,
            message: "类编码不能为空",
            trigger: "change"
          }
        ],
        reportCode: [
          {
            required: true,
            message: "上报代码不能为空",
            trigger: "change"
          }
        ],
        reportName: [
          {
            required: true,
            message: "上报名称不能为空",
            trigger: "change"
          }
        ],
        simpleName: [
          {
            required: true,
            message: "简称不能为空",
            trigger: "change"
          }
        ],
        archiveClassNum: [
          {
            required: true,
            message: "类号不能为空",
            trigger: "change"
          }
        ],
        theArchiveClass: [
          {
            required: true,
            message: "类名称不能为空",
            trigger: "change"
          }
        ]
      },
      columns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "类编码",
          key: "code"
        },
        {
          title: "简称",
          key: "simpleName"
        },
        {
          title: "类号",
          key: "archiveClassNum"
        },
        {
          title: "类名称",
          key: "theArchiveClass"
        },
        {
          title: "上报代码",
          key: "reportCode"
        },
        {
          title: "上报名称",
          key: "reportName"
        }
      ]
    };
  },
  computed: {
    realMlData() {
      return this.selected
        ? this.mlData.find(val => val.id == this.selected)
        : {};
    }
  },
  async created() {
    await this.loadAllData();
  },
  methods: {
    async loadAllData(){
        let data = await loadAllData();
    this.mlData = data;
    },
    slMl(id) {
      //console.log(id);
      this.selected = id;
    },
    ediMl() {
      this.mlModal = true;
      //console.log(this.realMlData);
      this.mlForm=this.realMlData;
      this.flag = 1;
    },
    addMl() {
      this.mlModal = true;
    },
    saveMl() {
      this.$refs["mlForm"].validate(async valid => {
        if (valid) {
          try {
            let result =
              this.flag == 0
                ? await addMlData(this.mlForm)
                : await ediMlData(this.mlForm);
            this.$Message.info("提交成功");
            await this.loadAllData();
            this.mlModal = false;
            this.mlForm = {};
          } catch (e) {
            this.$Message.error(e);
          }
        } else {
          this.$Message.error("提交失败，请检查必填项");
        }
      });
    }
  }
};
</script>
<style lang="less">
td.ivu-table-expanded-cell {
  padding: 0;
  border: 0;
  .ivu-table-wrapper {
    border: 0;
  }
}
</style>
