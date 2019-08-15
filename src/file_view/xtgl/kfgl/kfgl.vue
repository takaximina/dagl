<template>
  <Row :gutter="20">
    <Col span="6">
      <Card>
        <p slot="title">档案室</p>
        <p slot="extra">
          <Button size="small" icon="md-add" @click="handleAddRoom"></Button>
        </p>
        <Tree :data="data1" :render="renderContent"></Tree>
      </Card>
    </Col>
    <Col span="18">
      <Card>
        <p slot="title">详细存储</p>
        <Row v-for="n in  r" :key="n" :class-name="$style.rc">
          <span>第{{r-n+1}}层</span>
          <div :class="$style.c" v-for="nc in c" :key="nc" @click="loadPerson(r-n+1,nc)">
            <Progress :percent="filterAmount(r-n+1,nc)" :stroke-width="50"></Progress>
          </div>
        </Row>
      </Card>
    </Col>
    <!-- 柜子的人员列表 -->
    <Modal v-model="showPersonList" :closable="false">
      <Table border :columns="columns" :data="personList"></Table>
    </Modal>
    <!-- 添加 -->
    <Modal v-model="showAdd" footer-hide :closable="false">
      <Form ref="addForm" v-model="addForm" :label-width="120">
        <FormItem :label="`${addForm.theRank==1?'档案室':addForm.theRank==2?'分区':'档案柜'}名称`">
          <Input placeholder="请输入名称" v-model="addForm.name"/>
        </FormItem>
        <!-- 当rank为1的时候 是添加的档案室，所有没有上级，但当rank不等于1的话，就肯定需要又所属档案室这个上级-->
        <FormItem v-if="addForm.theRank!=1" label="所属档案室">
          <input type="hidden" v-model="addForm.parentId">
          {{addForm.root}}
        </FormItem>
        <!-- 当rank为3的时候 是添加的柜子，所有需要所属区域此上级 -->
        <FormItem v-if="addForm.theRank==3" label="所属区域">
          <input type="hidden" v-model="addForm.parentId">
          {{addForm.parent}}
        </FormItem>
        <FormItem label="规格" v-if="addForm.theRank==3">
          <Input type="number" v-model="addForm.amount">
            <span slot="append">个</span>
          </Input>
        </FormItem>
        <FormItem label="层数" v-if="addForm.theRank==3">
          <Input type="number" v-model="addForm.theRow">
            <span slot="append">层</span>
          </Input>
        </FormItem>
        <FormItem label="列数" v-if="addForm.theRank==3">
          <Input type="number" v-model="addForm.theColumn">
            <span slot="append">列</span>
          </Input>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="addForm.remark"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('addForm')">提交</Button>
          <Button style="margin-left: 8px" @click="handleReset('addForm')">重置</Button>
          <Button style="margin-left: 8px" @click="showAdd=false;addForm={}">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!--修改-->
    <Modal v-model="showUpdate" footer-hide :closable="false">
      <Form ref="updateForm" v-model="updateForm" :label-width="80">
        <input type="hidden" v-model="updateForm.id">
        <FormItem label="名称">
          <Input v-model="updateForm.name"/>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="updateForm.remark"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('updateForm')">提交</Button>
          <Button style="margin-left: 8px" @click="handleReset('updateForm')">重置</Button>
          <Button style="margin-left: 8px" @click="showUpdate=false;updateForm={}">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </Row>
</template>
<script>
import {
  loadAllRoom,
  loadAmount,
  loadAmountByRC,
  add,
  update,
  remove
} from "./api";
export default {
  data() {
    return {
      r: 0,
      c: 0,
      data1: [],
      showAdd: false, //是否显示添加弹窗
      showUpdate: false, //是否显示更新弹窗
      realGuiId: "", //当前选中的柜子id
      realAmount: [], //当前柜子的行列数据
      showPersonList: false, //是否展示柜子存储的档案人员列表，
      personList: [], //柜子存储的人员列表
      columns: [
        { title: "档案编号", key: "theNumber" },
        { title: "姓名", key: "name" },
        { title: "性别", key: "sex" }
      ],
      addForm: {
        root: "",
        parent: "",
        amount: 0,
        name: "",
        parentId: "",
        remark: "",
        theColumn: "",
        theRank: 1,
        theRow: ""
      },
      updateForm: {
        id: "",
        name: "",
        remark: ""
      }
      // ruleValidate: {
      //   name: [{ required: true, message: "名称不能为空"}],
      //   amount: [
      //     {
      //       required: true,
      //       message: "规格不能为空至少1",
      //     }
      //   ],
      //   theColumn: [
      //     {
      //       required: true,
      //       message: "列数不能为空至少为1",
      //     }
      //   ],
      //   theRow: [
      //     {
      //       required: true,
      //       message: "层数不能为空至少为1",
      //     }
      //   ]
      // }
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    //加载左侧树数据，在页面创建时候加载
    async loadData() {
      let data = await loadAllRoom();
      this.data1 = data;
    },
    //自定义渲染左侧树
    renderContent(h, { root, node, data }) {
      let aad = (
        <p
          style="display:inline-block;width:100%"
          onClick={() => this.clickTree(data)}
        >
          {data.name}

          {data.theRank != 3 ? (
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
              <Button
                type="default"
                size="small"
                icon="ios-repeat"
                onClick={e => {
                  e.stopPropagation();
                  this.handleUpdate(data);
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
                  this.handleDelete(data);
                }}
              >
                删除
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
                  this.handleUpdate(data);
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
                  this.handleDelete(data);
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
    //提交
    async handleSubmit(name) {
      let res;
      if (name == "addForm") {
        res = await add(this.addForm);
      } else {
        res = await update(this.updateForm);
      }
      if (res) {
        this.reset();
        this.$Message.success("提交成功");
        await this.loadData();
      }
    },
    //重置
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //新增
    handleAdd(root, node, data) {
      //console.log(root,node,data);
      let parentList = this.filterTree(root, node);
      let parent = [...parentList].reverse()[0].node;
      let rootName =
        parentList.length == 2 ? parentList[0].node.name : parent.name;

      console.log(rootName, parent, parentList);
      this.addForm = Object.assign({}, this.addForm, {
        root: rootName,
        parent: parent.name,
        theRank: parent.theRank + 1,
        parentId: parent.id
      });
      this.showAdd = true;
    },
    //新增档案室
    handleAddRoom(){
      this.addForm={
        theRank:1,
      };
      this.showAdd=true;
    },
    //修改
    handleUpdate(data) {
      console.log(data);
      this.updateForm = Object.assign({}, this.updateForm, {
        name: data.name,
        id: data.id,
        remark: data.remark
      });
      this.showUpdate = true;
    },
    //删除
    handleDelete(data) {
      this.$Modal.confirm({
        title: "删除？",
        content: `${data.name}可能包含重要档案，确认删除么？`,
        loading: true,
        onOk: async () => {
          let res = await remove(data.id);
          if (res) this.$Message.success("删除成功");
          this.reset();
          await this.loadData();
          this.$Modal.remove();
        },
        onCancel: () => {
          this.$Modal.remove();
        }
      });
    },
    //初始化
    reset() {
      this.r = 0;
      this.c = 0;
      this.showAdd = false; //是否显示添加弹窗
      this.showUpdate = false; //是否显示更新弹窗
      this.realGuiId = ""; //当前选中的柜子id
      this.realAmount = []; //当前柜子的行列数据
      this.showPersonList = false; //是否展示柜子存储的档案人员列表，
      this.personList = [];
    },
    //点击树加载数据，对data.theRank进行判断为3则为最后一层树然后加载右侧面板。
    async clickTree(data) {
      if (data.theRank == 3) {
        this.r = Number(data.theRow);
        this.c = Number(data.theColumn);
        this.realGuiId = data.id;
        let res = await loadAmount(data.id);
        this.realAmount = res;
      }
    },
    //点击格子加载格子存储的人员列表，参数为行和列,以及当前选中的柜子id
    async loadPerson(r, c) {
      if (this.filterAmount(r, c)) {
        let res = await loadAmountByRC({
          condition: {
            archiveCabinet: this.realGuiId,
            archiveColumn: c,
            archiveRow: r
          },
          pageIndex: 0,
          pageSize: 10,
          searchText: ""
        });
        this.personList = res.respnoseData;
        this.showPersonList = true;
      }
    },
    //柜子数据格式化，参数为行列，返回值为，人员数目
    filterAmount(r, c) {
      let result = this.realAmount.find(val => {
        return val.archiveColumn == c && val.archiveRow == r;
      });
      return result ? result.amount : 0;
    },
    //通过递归root，和node加载 tree组件的父子关系数组
    filterTree(root, node, result = []) {
      result.unshift(node);
      if (node.parent != null) {
        return this.filterTree(root, root[node.parent], result);
      } else {
        return result;
      }
    }
  }
};
</script>
<style lang="less" module>
.rc {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  & > span {
    width: 60px;
    flex: 0 0 auto;
  }
  .c {
    flex: 1 1 100%;
  }
}
</style>
