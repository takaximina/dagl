<template>
  <Card>
    <p slot="title">商品品类</p>
    <p slot="extra" v-if="typeEdit">
      <Dropdown style="margin-left: 20px" @on-click="add" trigger="click">
        <Button size="small" icon="md-add"></Button>
        <DropdownMenu slot="list">
          <DropdownItem name="0">添加根分类</DropdownItem>
          <DropdownItem name="1" v-if="selected">添加子分类</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <!--<Button v-if="selected" size="small" icon="md-create" @click="edi"></Button>-->
      <Button v-if="selected" size="small" icon="md-close" @click="delClass"></Button>
    </p>
    <w-tree :data="data" :edit="typeEdit" @select-data="select"></w-tree>
    <Modal
      width="360"
      v-model="addModal"
      title="增加类别"
      :footer-hide="true"
      @on-visible-change="modalChange"
    >
      <Form ref="formData" :model="formData" :rules="ruleValidate" label-position="top">
        <FormItem label="名称" prop="className">
          <Input v-model="formData.className" placeholder="类别名称"></Input>
        </FormItem>
        <FormItem label="编码" prop="classCode">
          <Input v-model="formData.classCode" placeholder="类别编码"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formData')" style="float: right">确定</Button>
          <Button type="text" @click="handleReset('formData')" style="float: right">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>

<script>
  import wTree from '../../components/tree_';
  import { removeProductClass,saveProductClass, } from '@/api/goods'

  export default {
    name: "goodTypes",
    components:{
      wTree
    },
    props:{
      data: Array,
      typeEdit: Boolean,
    },
    data(){
      return {
        userInfo: '',
        selected: '',
        addModal: false,
        type: 0,
        formData: {
          className: '',
          classCode: '',
          parentClassId: null
        },
        ruleValidate: {
          className: [
            { required: true, message: '请输入类别名称', trigger: 'blur' }
          ],
          classCode: [
            { required: true, message: '请输入类别编码', trigger: 'blur' },
          ]
        }
      }
    },
    mounted(){
      this.userInfo = this.$store.getters.userInfo;
    },
    methods:{
      select(data){
        this.selected = data;
        this.$emit('selected',data);
      },
      add(name){
        this.type = name;
        this.addModal = true;
      },
      modalChange(state){
        if(!state){
          this.handleReset('formData')
        }
      },
      handleSubmit (name) {
        let this_ = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {
              ...this_.formData,
              appId:this_.userInfo.appId,
              tenantId:this_.userInfo.tenantId,
            };
            if(this_.type == '1'){
              data.parentClassId = this_.selected.id
            }else{
              data.parentClassId = this_.selected.parentClassId
            }
            saveProductClass(data).then(res=>{
              if(!res) return ;
              this_.addModal=false;
              this_.$Message.success('添加成功!');
              this_.$refs[name].resetFields();
              this_.$emit('update');
            })
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
        this.addModal=false;
      },
      delClass(){

        let id = this.selected.id;
        let this_ = this;

        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该品类？删除后无法恢复！</p>',
          onOk: () => {
            removeProductClass(id).then(res=>{
              if(!res) return ;
              this_.$Message.info('删除成功');
              this_.$emit('update');
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
