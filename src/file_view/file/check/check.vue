<template>
  <Card>
    <!-- <Row>
      <Col span="6">
        <Tree :data="dataSource" @on-select-change="show" :load-data="loadData"></Tree>
      </Col>
      <Col span="18">
        <button @click="currentPage++">{{currentPage}}</button>
        ,{{pageCount}}
        <Pdf
          :src="fileUrl"
          :page="currentPage"
          @num-pages="pageCount = $event"
          @page-loaded="currentPage = $event"
          style="width:595px"
        ></Pdf>
      </Col>
    </Row> -->
    <Row :gutter="20">
        <Col span='24'>
          <Card >
        <Input search enter-button @on-search="search" placeholder="请输入名字查询"/>
        <Table :columns="column1" :data="searchData"  v-if="!manId"></Table>
      </Card>
        </Col>
        <Col span="8" style="height:600px" v-if="manId">
          <Card title="档案分类" style="height:100%;overflow-y:scroll;overflow-x:hidden;">
            <p slot="extra">
              <Button type="primary" @click="showPrint=true">打印目录</Button>
              {{$route.query.name||manName}}
            </p>
            <Tree :data="treeData" :render="renderContent" children-key="archiveManItemDTOS"></Tree>
          </Card>
        </Col>
        <Col span="16" v-if="manId">
          <Card title="档案详情" v-if="fileSelected">
            <Table :columns="fileColumns" :data="realFile"></Table>
          </Card>
        </Col>
      </Row>
      <Modal footer-hide v-model="showPrint" width='1000' @on-cancel="showPrint=false">
        <p slot="header"></p>
        <Button slot="close" @click="showPrint=false">取消</Button>
        <Row>
          <Col span='8'>
           <Card title="档案分类" style="height:700px;overflow-x:hidden;overflow-y:scroll;">
             <p slot="extra">
              <Button type="primary" :disabled="!canAddPrint" @click="addPrint">增补打印</Button>
              <Button type="primary" :disabled="!canAllPrint" @click="allPrint">重打</Button>
            </p>
           <Table :data="treeData" :columns='column2' highlight-row @on-current-change="(currentRow,oldRow)=>{this.currentData=currentRow}">

           </Table>
          </Card>
          </Col>
          <Col span='16'>
           <Card title="打印预览" style="height:700px;overflow-x:hidden;overflow-y:scroll;" >
             <table id='table'  style="width:100%;" >
               <thead style="height:45px">
                 <tr>
                   <td rowspan="2" align="center"><p>序号</p></td>
                   <td rowspan="2">材料名称</td>
                   <td colspan="3" align="center">材料形成时间</td>
                   <td rowspan="2" align="center">页数</td>
                   <td rowspan="2" align="center">备注</td>
                 </tr>
                 <tr>
                   <td align="center">年</td>
                   <td align="center">月</td>
                   <td align="center">日</td>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td style="height:45px" align="center">{{currentData.archiveClassNum}}</td>
                   <td style="height:45px" width="40%"><p style="word-wrap: break-word;word-break: normal;">{{currentData.theArchiveClass}}</p></td>
                   <td style="height:45px" align="center"></td>
                   <td style="height:45px" align="center"></td>
                   <td style="height:45px" align="center"></td>
                   <td style="height:45px" align="center"></td>
                   <td style="height:45px" width="30%"><p style="word-wrap: break-word;word-break: normal;"></p></td>
                 </tr>
                 <tr v-for="item in 16" >
                   <td style="height:45px" width='5%' align="center">{{item<=archives.length?item:''}}</td>
                   <td style="height:45px" width="40%" ><p style="word-wrap: break-word;word-break: normal;">{{item<=archives.length?archives[item-1].itemName:''}}</p></td>
                   <td style="height:45px" width="10%" align="center">{{item<=archives.length?archives[item-1].itemYear:''}}</td>
                   <td style="height:45px" width='5%' align="center">{{item<=archives.length?archives[item-1].itemMonth:''}}</td>
                   <td style="height:45px" width='5%' align="center">{{item<=archives.length?archives[item-1].itemDay:''}}</td>
                   <td style="height:45px" width='5%' align="center">{{item<=archives.length?archives[item-1].itemPages:''}}</td>
                   <td style="height:45px" width="30%" ><p style="word-wrap: break-word;word-break: normal;">{{item<=archives.length?archives[item-1].remark:''}}</p></td>
                 </tr>
               </tbody>
             </table>
             <div style="display:none;">
               <table id='table1'  style="width:100%" >
               <tbody>
                 <tr style="visibility:hidden">
                   <td style="height:45px" width='5%' align="center">{{currentData.archiveClassNum}}</td>
                   <td width="40%" style="height:45px"><p style="word-wrap: break-word;word-break: normal;">{{currentData.theArchiveClass}}</p></td>
                   <td style="height:45px" align="center"></td>
                   <td style="height:45px" align="center"></td>
                   <td style="height:45px" align="center"></td>
                   <td style="height:45px" align="center"></td>
                   <td style="height:45px" width="30%"><p style="word-wrap: break-word;word-break: normal;"></p></td>
                 </tr>
                 <tr style="visibility:hidden" v-for="item in archives.filter(item=>item.printStatus).length">
                   <td style="height:45px">{{1}}</td>
                   <td style="height:45px" width="40%"><p style="word-wrap: break-word;word-break: normal;">{{1}}</p></td>
                   <td style="height:45px">{{1}}</td>
                   <td style="height:45px">{{1}}</td>
                   <td style="height:45px">{{1}}</td>
                   <td style="height:45px">{{1}}</td>
                   <td style="height:45px" width="30%"><p style="word-wrap: break-word;word-break: normal;">{{1}}</p></td>
                 </tr>
                 <tr style="" v-for="item in archives_add">
                   <td style="height:45px" width='5%'  align="center">{{item.itemNname}}</td>
                   <td style="height:45px" width="40%"><p style="word-wrap: break-word;word-break: normal;">{{item.itemName}}</p></td>
                   <td style="height:45px" width='10%'  align="center">{{item.itemYear}}</td>
                   <td style="height:45px" width='5%'  align="center">{{item.itemMonth}}</td>
                   <td style="height:45px" width='5%'  align="center">{{item.itemDay}}</td>
                   <td style="height:45px" width='5%'  align="center">{{item.itemPages}}</td>
                   <td style="height:45px" width="30%"><p style="word-wrap: break-word;word-break: normal;">{{item.remark}}</p></td>
                 </tr>
               </tbody>
             </table>
             </div>
             <!-- <div id='table' style="width:100%">
               <div style="height:80px;width:100%">ceshi</div>
               <div style="height:60px;visibility:hidden;width:100%">hhaha</div>
               <div style="height:20px;width:100%">ceshi2</div>
             </div> -->
          </Card>
          </Col>
        </Row>
      </Modal>
      <Modal footer-hide v-model="showAddOrUpdate" :closable="false" @on-cancel="fileForm={}">
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
                      action="http://192.168.12.57:8190/upload/addByWindow"
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
  </Card>
</template>
<script>
import Pdf from "vue-pdf";
import { listAppDictValueByCode } from "@/api/application/dictionary";
import { getToken } from "@/libs/util";
 import {getLodop} from "@/libs/lodopFuncs";
import {loadTreeData ,queryPerson ,saveFile} from './api'
export default {
  data() {
    return {
      currentData:{},
      showPrint:false,
      manName:'',
      treeData:[],
      readFile:[],
      token: getToken(),
      fileSelected:'',
      currentPage: 1,
      pageCount: 0,
      manId:'',
      searchData:[],
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
                <Button onClick={() => this.choose(params.row)}>详细档案</Button>
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
          title:'查看',
          render:(h,params)=>{
            return (
              <div>
              <Button onClick={() => {this.pdfUrl='http://192.168.12.57:8191/res/'+params.row.originalUrl;this.$nextTick(()=>{window.open(this.pdfUrl)})}}>详细档案</Button>
              </div>
            )
          }
        }
      ],
      column2:[
        {
          type:'index',
          width:60,
          align:'center'
        },
        {
          title:'分类名称',
          key:'name'
        },
      ],
      dataSource: [
        {
          title: "lev1",
          loading: false,
          children: []
        },
        { title: "lev2", loading: false, children: [] }
      ],
      fileUrl: "",
      fileForm: {},
      fileFormRules: {
        itemName: [
          { required: true, message: "请输入材料名称", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "请输入材料份数",trigger: "blur"  }
        ],
        itemPages: [
          { required: true, message: "请输入材料页数" ,trigger: "blur" }
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
      showAddOrUpdate:false,
      pdfUrl:'',
      showPdf:false
    };
  },
  components: {
    Pdf
  },
  computed:{
    canAddPrint(){
      return JSON.stringify(this.currentData)!='{}'&&this.currentData.archiveManItemDTOS.length>0&&this.currentData.archiveManItemDTOS.filter(item=>!item.printStatus)==0
    },
    canAllPrint(){
      return JSON.stringify(this.currentData)!='{}'
    },
    archives(){
      console.log(JSON.stringify(this.currentData));
      return JSON.stringify(this.currentData)!='{}'?this.currentData.archiveManItemDTOS:[]
    },
    archives_add(){
      return this.archives.filter(item=>!item.printStatus)
    }
  },
  async created() {
    console.log(this.$route.query.id);
    
    if(this.$route.query.id){
      this.manId=this.$route.query.id;
      await this.loadTreeData(this.manId)
      };
    
  },
  mounted(){
    
  },
  methods: {
    async choose(row){
      await this.loadTreeData(row.id);
      this.manName=row.name;
       this.manId=row.id;
       this.searchData=[];
    },
    show(...args) {
      this.fileUrl = args[1].fileUrl || "";
      console.log(Date.now());
    },
    loadData(item, fn) {
      const data = [
        {
          title: "children1",
          fileUrl: "/test.pdf"
        },
        {
          title: "children2",
          fileUrl: "/test1.pdf"
        }
      ];
      fn(data);
    },
    async loadTreeData(id) {
      let data = await loadTreeData(id);
      this.treeData = data;
    },
    sss(e) {
      console.log(e, Date.now());
    },
    clickTree(data) {
      if (data.manId) {
        this.fileSelected = data.id;
        this.realFile = [];
        this.realFile.push(data);
      }
    },
    handleAdd(root, node, data) {
      // this.fileForm = {
      //   manId: this.manId,
      //   archiveClassId: data.id,
      //   archiveClassNum: data.archiveClassNum
      // };
      this.fileForm=Object.assign({},this.fileForm,{
        manId: this.manId,
        archiveClassId: data.id,
        archiveClassNum: data.archiveClassNum
      })
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
      this.fileForm = Object.assign({},this.fileForm,formdata);
      this.showAddOrUpdate = true;
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
    renderContentPrint(h, { root, node, data }){
      return (
        <p
          style="display:inline-block;width:100%"
          onClick={() => this.clickTree(data)}
        >
          {data.reportName || data.itemName}
          {data.archiveManItemDTOS && data.archiveManItemDTOS.length > 0
            ? "(" + data.archiveManItemDTOS.length + ")份"
            : ""}
        </p>
      )
    },
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
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (name == "modalForm") {
            this.saveData()
              .then(res => {
                this.$refs["queryPage"].loadData(1);
                this.$Message.success({ content: "提交成功" });
                this.showActionModal = false;
                this.currentData={}
              })
              .catch(e => {
                console.log(e);
                this.$Message.error(e);
              });
          } else {
            this.saveFile()
              .then(res => {
                this.$Message.success({ content: "提交成功" });
                //this.showInfo(this.rowData);
                this.fileForm={};
                this.realFile = [];
              })
              .then(() => {
                this.showAddOrUpdate = false;
                this.currentData={}
              })
              .then(() => {
                this.loadTreeData(this.manId);
              })
              .catch(e => {
                console.log(e);
                this.fileForm={};
                this.realFile = [];
                this.currentData={};
                this.$Message.error(e);
              });
          }
        } else {
          this.$Message.error("请修改表单错误");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    uploadFile(response, file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      console.log(file);
      if (response.code == 0) {
        this.$Message.success("上传成功");
        this.fileForm.originalUrl = file.name;
        this.$set(this.fileForm,'originalUrl',file.name);
      } else {
        this.$Message.error(response.message);
      }
    },
    saveFile() {
      console.log()
      let date = new Date(this.fileForm.itemDate);
      let data = { ...this.fileForm };
      data.itemYear = date.getFullYear();
      data.itemMonth = date.getMonth() + 1;
      data.itemDay = date.getDate();
      delete data.itemDate;
      return saveFile(data);
    },
    allPrint(){
      let strBodyStyle="<style>table,td { border: 1px solid #000000;border-collapse:collapse }</style>";
      let LODOP=getLodop();
      LODOP.SET_PRINT_PAGESIZE(0);
      LODOP.NewPage();
      LODOP.ADD_PRINT_TEXT('')
      LODOP.ADD_PRINT_TABLE("5%","5%",'90%',"90%",strBodyStyle+document.getElementById('table').outerHTML);
      LODOP.PREVIEW();
    },
    addPrint(){
      let strBodyStyle="<style>table,td { border: 1px solid white;border-collapse:collapse }</style>";
      let LODOP=getLodop();
      LODOP.SET_PRINT_PAGESIZE(0);
      LODOP.NewPage();
      LODOP.ADD_PRINT_TABLE("5%","5%",'90%',"90%",strBodyStyle+document.getElementById('table1').outerHTML);
      LODOP.PREVIEW();
    },
    async search(e) {
      if (e) {
        let data = await queryPerson(e);
        this.manId="";
        this.searchData = data.respnoseData;
      }
    },
  }
};
</script>
<style lang="less">
.test {
  background: red;
  p {
    color: blue;
    position: absolute
  }
}
#table{
  border: 1px solid #000000;
  border-collapse: collapse;
  td {
    border: 1px solid #000000;
    border-collapse: collapse;
  }
}
</style>
