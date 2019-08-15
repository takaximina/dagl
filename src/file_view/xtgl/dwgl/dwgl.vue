<template>
  <Row :gutter="20">
    <Col span="6">
      <Card>
        <p slot="title">单位分类</p>
        <CellGroup @on-click="sltUnit">
          <Cell
            v-for="item in unitData"
            :key="item.id"
            :selected="selected == item.id"
            :name="item.id"
            :title="item.name"
            :label="item.value"
          />
        </CellGroup>
      </Card>
    </Col>
    <Col span="18">
      <Card v-if="selected">
        <p slot="title">单位列表</p>
        <p slot="extra">
          <Button size="small" @click="addUnit">新增</Button>
        </p>
        <Table
          ref="dwTable"
          :columns="unitColums"
          :data="unitColumnData.slice((this.currentPage-1)*10,this.currentPage*10)"
        ></Table>
        <div class="brs"></div>
        <Row>
          <div>
            <page
              v-if="unitColumnData.length>0"
              simple
              :current="1"
              :total="unitColumnData.length"
              style="float:right"
              @on-change="pageChange"
            ></page>
          </div>
        </Row>
      </Card>
    </Col>
    <Modal v-model="unitModal" :title=" unitFlag ? '修改单位' : '新增单位' ">
      <Form
        ref="unitForm"
        :model="unitForm"
        label-position="left"
        :label-width="100"
        :rules="rules"
      >
        <FormItem label="名称：" prop="name">
          <Input v-model="unitForm.name"></Input>
        </FormItem>
        <FormItem label="代码：" prop="code">
          <Input v-model="unitForm.code"></Input>
        </FormItem>
        <FormItem label="上报代码：" prop="reportCode">
          <Input v-model="unitForm.reportCode"></Input>
        </FormItem>
        <FormItem label="上报名称：" prop="reportName">
          <Input v-model="unitForm.reportName"></Input>
        </FormItem>
        <FormItem label="简称：" prop="simpleName">
          <Input v-model="unitForm.simpleName"></Input>
        </FormItem>
        <FormItem label="分类">{{realUnitclass['name']}}</FormItem>
        <FormItem label="备注：" prop="remark" style="margin-bottom: 0">
          <Input type="textarea" v-model="unitForm.remark" :autosize="{minRows: 2,maxRows: 3}"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveUnit">确定</Button>
        <Button type="text" @click="resetUnitForm">取消</Button>
      </div>
    </Modal>
  </Row>
</template>
<script>
import { listAppDictValueByCode } from "@/api/application/dictionary";
import { loadUnitData, addUnitData, updateUnitData, delUnitData } from "./api";
export default {
  data() {
    return {
      currentPage: 1,
      //单位数据
      unitData: [],
      //选中的单位
      selected: "",
      //是否显示添加单位的弹窗
      unitModal: false,
      //新增还是修改
      unitFlag: 0,
      //单位表单构造器
      unitForm: {},
      unitColumnData: [],
      unitColums: [
        {
          title: "单位名称",
          key: "name"
        },
        {
          title: "简称",
          key: "simpleName"
        },
        {
          title: "所属分类",
          key: "unitClassName"
        },
        {
          title: "上报名称",
          key: "reportName"
        },
        {
          title: "备注",
          key: "remark"
        },
        {
          title: "操作",
          width: 100,
          render: (h, params) => {
            return (
              <div>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginRight: "5px" }}
                  onClick={() => this.ediUnit(params.row)}
                >
                  修改
                </Button>
                <Button
                  size="small"
                  style={{ marginRight: "5px" }}
                  onClick={() => this.delUnit(params.row.id)}
                >
                  删除
                </Button>
              </div>
            );
          }
        }
      ],
      rules: {
        name: [
          { required: true, message: "单位名称不能为空", trigger: "change" }
        ],
        code: [
          { required: true, message: "单位代码不能为空", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    realUnitclass() {
      return this.selected
        ? this.unitData.find(val => val.id == this.selected)
        : {};
    }
  },
  async created() {
    await this.loadAllData();
  },
  methods: {
    async loadAllData() {
      let data = await listAppDictValueByCode("unit_class");
      this.unitData = data;
    },
    //页码变化的回调函数
    pageChange(page) {
      if (page > Math.floor(this.unitColumnData.length / 10)) return;
      this.currentPage = page;
    },
    //新增单位分类
    addUnit() {
      this.unitModal = true;
      this.unitFlag = 0;
      //console.log(this.realUnitclass);
      this.unitForm.dictValueId = this.realUnitclass.id;
      this.unitForm.unitClassName = this.realUnitclass.name;
    },
    //删除单位
    delUnit(id) {
      this.$Modal.confirm({
        title: "删除",
        content: "确定删除单位么？",
        loading: true,
        onOk: async () => {
          let res = await delUnitData(id);
          this.$Modal.info({ content: "删除成功" });
          await this.sltUnit(this.selected);
          setTimeout(() => {
            this.$Modal.remove();
          }, 2000);
        },
        onCancel: () => {
          this.$Modal.remove();
        }
      });
    },
    //更新单位
    ediUnit(row) {
      this.unitForm = { ...row };
      delete this.unitForm._index;
      delete this.unitForm._rowKey;
      this.unitModal = true;
      this.unitFlag = 1;
    },
    //选中单位分类
    async sltUnit(id) {
      if (!id) {
        this.selected = "";
        return;
      }
      this.selected = id;
      //console.log(id);
      let unitId = this.unitData.find(val => val.id == id)["id"];
      let data = await loadUnitData(unitId);
      //console.log(data);
      this.unitColumnData = data;
      this.currentPage = 1;
    },
    //保存单位信息并提交后端
    saveUnit() {
      this.$refs["unitForm"].validate(async valid => {
        if (valid) {
          try {
            let result =
              this.unitFlag == 0
                ? await addUnitData(this.unitForm)
                : await updateUnitData(this.unitForm);
            this.$Message.info("提交成功");
            await this.sltUnit(this.selected);
            this.unitModal = false;
            this.unitForm = {};
          } catch (e) {
            this.$Message.error(e);
          }
        } else {
          this.$Message.error("提交失败，请检查必填项");
        }
      });
    },
    //充值单位表单
    resetUnitForm() {
      this.unitModal = false;
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
