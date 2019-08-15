<template>
  <div>
    <Row :gutter="20">
      <Col span="12">
        <Row :gutter="10">
          <Col span="24">
            <Card>
              <p slot="title">前台分类</p>
              <!-- <Input search size="small" v-model="front" @on-enter="Searchfront"/> -->
              <p slot="extra">
                <Dropdown style="margin-left: 20px" @on-click="add" trigger="click">
                  <Button size="small" icon="md-add"></Button>
                  <DropdownMenu slot="list">
                    <DropdownItem name="0">添加根分类</DropdownItem>
                    <DropdownItem name="1" v-if="selected">添加子分类</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <!--<Button v-if="selected" size="small" icon="md-create" @click="edi"></Button>-->
                <Button v-if="selected" size="small" icon="md-close" @click="del"></Button>
              </p>
              <Tree
              :data="treeData"
              @on-select-change="selectFront">
              </Tree>
            </Card>
          </Col>
          <!-- <Col span="12">
            <Card></Card>
          </Col> -->
        </Row>
      </Col>
      <Col span="12">
        <Card>
          <p slot="title">后台分类</p>
          <!-- <Input search size="small" v-model="back" @on-enter="Searchback"/> -->
          <p slot="extra" >
            <Button size="small" v-if="selected" @click="addBack">保存</Button>
          </p>
          <Tree
          v-if="selected"
          :data="backTreeData"
          show-checkbox
          ref="tree"
          multiple
          @on-select-change="selectBack"
          @on-check-change="checkBack">
          </Tree>
        </Card>
      </Col>
    </Row>
    <!-- @on-ok="saveParentClass" -->
    <Modal
    :mask="true"
    :draggable="true"
    :mask-closable="true"
    :closable="true"
    footer-hide
    title="添加分类"
    v-model="addModal">
    <!-- :rules="ClassData" -->
      <Form ref="productClass" :model="productClass" :rules="classData" label-position="right" :label-width="80">
        <FormItem label="分类编码" prop="classCode">
          <Input v-model="productClass.classCode" placeholder="请输入分类编码"></Input>
        </FormItem>
        <FormItem label="分类名称" prop="className">
          <Input v-model="productClass.className" placeholder="请输入分类名称"></Input>
        </FormItem>
        <FormItem label="分类说明" prop="remark">
          <Input v-model="productClass.remark" placeholder="请输入分类说明"></Input>
        </FormItem>
        <FormItem label-position="left">
            <Button type="primary" @click="handleSubmit('productClass')">确认</Button>
            <Button @click="handleReset('productClass')" style="margin-left: 8px">重填</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>


<script>
  import goodTypes from '../tpls/goodTypes'
  import{listProductClassTree} from '@/api/goods'
  import{hasOneOf,oneOf,forEach} from '@/libs/tools'
  import{listProductClass,saveProductClass,removeProductClass,listBackProductClass,listBackProductClassById,saveBackProduct} from '@/api/productClass'
  export default {
    name: "frontClass",
    components:{
      goodTypes
    },
    data(){
      return {
        classData:{
          classCode: [
            { required: true, message: '请输入分类编码', trigger: 'blur' }
          ],
          className: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ],
        },
        productClass:{
          classCode:'',
          className:'',
          remark:''
        },
        front:'',
        back:'',
        addModal:false,
        treeData:[],
        backTreeData:[],
        backdata:[],
        indexs:[],
        selected: '',
        selectback:'',
        checkback:'',
        editType: '',
        addModal:false,
        ParentClass:{
          classCode: '',
          className: '',
          parentClassId: '',
          remark:''
        },
        editType:'',
      }
    },
    mounted(){
      this.loadFrontTree();
      this.loadBackTree();
    },
    methods:{
      loadFrontTree(){
        listProductClass().then(res=>{
          this.treeData = res;
        })
      },
      loadBackTree(){
        listProductClassTree().then(res => {
          if(!res) return;
          this.backTreeData = res.menu;
        })
      },
      Searchfront(){

      },
      Searchback(){

      },
      selectFront(row){
        this.selected = row;
        let this_ = this;
        let back_ = '';
        //定义递归
        let digui = (id,data)=>{
          forEach(data,(v,i)=>{
            if(v.id == id){
              v.checked = true;
              if(!v.children){
                v.children = 0
              }
            }
            if(v.children){
              digui(id,v.children)
            }
          })
        }
        //递归进行后台分类勾选处理
        listBackProductClassById(this.selected[0].id).then(res=>{
          // console.log(res)
          if(res!=null){
            back_ = res.map(function(json){
              return json.id
            })
            forEach(back_,(v,i)=>{
                digui(v,this_.backTreeData)
            })
          }else if(res==null){
            this.loadBackTree();
          }
          //////////////////
        })
      },
      selectBack(row){
        this.selectBack = row
      },
      checkBack(row){
        this.checkback = row
        let last = this.checkback[this.checkback.length-1].id
      },
      addBack(){
        let check=this.$refs.tree.getCheckedNodes();
        let par = {
          classId: [],
          viewClassId: this.selected[0].id,
        };
        for(let i =0;i<check.length;i++){
          par.classId.push(check[i].id);
        }
        if(par.classId!=''){
          saveBackProduct(par).then(res=>{
            this.$Message.info("保存成功")
            this.loadBackTree();
          })
        }
      },
      add(name){
        this.editType = name;
        this.addModal = true;
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid && this.editType=='0') {
              this.ParentClass={
                "classCode": this.productClass.classCode,
                "className": this.productClass.className,
                "parentClassId": '',
                "remark": this.productClass.remark
              }
              saveProductClass(this.ParentClass).then(res=>{
                if(res="true"){
                  this.$Message.info("添加成功")
                  this.addModal=false;
                  this.handleReset(name);
                  this.loadFrontTree();
                }
              })
            }else if(valid && this.editType=='1'){
              this.ParentClass={
                  "classCode": this.productClass.classCode,
                  "className": this.productClass.className,
                  "parentClassId": this.selected[0].id,
                  "remark": this.productClass.remark
              }
              saveProductClass(this.ParentClass).then(res=>{
                  if(res="true"){
                    this.$Message.info("添加成功");
                    this.addModal=false;
                    this.handleReset(name);
                    this.loadFrontTree();
                  }
              })
            } else {
                this.$Message.error('请填写!');
            }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      del(){
        this.$Modal.error({
          title: '警告!',
          closable:true,
          maskclosable:true,
          content: '<p>确认删除?</p>',
          onOk: () => {
            removeProductClass(this.selected[0].id).then(res=>{
              if(!res) return ;
              this.$Message.info('删除成功');
              this.loadFrontTree();
            })
          },
          onCancel: () => {
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>
