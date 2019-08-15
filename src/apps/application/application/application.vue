<template>
  <div>

    <Row>
      <Card v-for="item in listData" :key="item.id" style="width:350px;height: 200px;float: left;margin-right: 20px;margin-bottom: 20px;">
        <p slot="title">
          <Icon type="md-apps"></Icon>
          {{ item.name }}
        </p>
        <p slot="extra">
          <a href="#" slot="extra" @click.prevent="editData(item)">
            <Icon type="md-settings" />
          </a>
          <span>&nbsp;&nbsp;</span>
          <a href="#" slot="extra" @click.prevent="delData(item)">
            <Icon type="md-close-circle" />
          </a>
        </p>

        <p>{{ item.remark || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquam blanditiis corporis culpa debitis doloremque ea illum, in ipsa magni minus molestiae necessitatibus voluptates!'}} </p>
      </Card>
      <Card style="width:350px;height: 200px;float: left;cursor:pointer;">
        <p style="text-align: center"  @click="addData" >
          <Icon type="ios-add" :size="150" :color="'#2d8cf0'"/>
        </p>
      </Card>
    </Row>
    <Modal
      v-model="modal"
      :title=" flag ? '修改' : '新增应用' ">
      <Form ref="formData" :model="formData" label-position="left" :label-width="100">
        <FormItem label="应用名称：" prop="name">
          <Input v-model="formData.name"></Input>
        </FormItem>
        <!--<FormItem label="编码：">
          <Input v-model="formData.code"></Input>
        </FormItem>-->
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveData">确定</Button>
        <Button type="text" @click="resetForm">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { forEach } from "@/libs/tools";
  import { listApp, saveApp, deleteApp } from "@/api/application/application";
  import { get_userInfo } from "@/libs/util";

  export default {
    name: "application",
    data(){
      return{
        listData: [],
        modal: false,
        flag: 0,
        formData: {},
      }
    },
    mounted(){
      this.loadData();
    },
    methods:{
      loadData(){
        listApp().then(res =>{
          this.listData = res;
        })
      },
      addData(){
        this.flag = 0;
        this.modal = true;
      },
      validate(){
        if( !this.formData.name ){
          this.$Message.error('请输入应用名称');
          return false;
        }
        return true
      },
      saveData(){
        let validate = this.validate();
        if(!validate) return ;
        let data = {...this.formData};
        saveApp( data ).then(res => {
          if(!res) return ;
          this.$Message.success('操作成功!');
          this.resetForm();
          this.loadData();
          eventBus.$emit('loadApp');
        })
      },
      resetForm(){
        this.modal = false;
        this.$refs.formData.resetFields();
        this.formData = {};
      },
      editData(row){
        this.modal = true;
        this.flag = 1;
        this.formData = {...row};
      },
      delData(row){
        let this_ = this;
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该应用？删除后无法恢复！</p>',
          onOk: () => {
            deleteApp( row.id ).then(res => {
              if (!res) return;
              this.loadData();
              this.$Message.info('删除成功');
              if( row.id == get_userInfo().appId ){
                eventBus.$emit('loadApp',1);
              }else{
                eventBus.$emit('loadApp');
              }
            })
          },
          onCancel: () => {
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
