<template>
  <Card>
    <page-table
      ref="pageTable"
      :tabData="dataList"
      :columns="columns"
      :noPage="true"
      @add-page="addUser"
    >
    </page-table>
    <Modal
      v-model="userModal"
      :title=" flag ? '修改' : '新增用户' ">
      <Form ref="userForm" :model="userForm" label-position="left" :label-width="60">
        <FormItem label="用户名：">
          <Input v-model="userForm.userName"></Input>
        </FormItem>
        <FormItem label="密码：">
          <Input type="password" v-model="userForm.password"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveUser">确定</Button>
        <Button type="text" @click="resetForm">取消</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
  import pageTable from '@/apps/components/page_table';
  import { userList, addUser } from "@/api/platform/account";

  export default {
    name: "account",
    components:{
      pageTable
    },
    data(){
      return {
        dataList: [],
        columns: [
          {
            title: '#',
            type: 'index',
            width: 30
          },
          {
            title: '用户名',
            key: 'userName',
          },
          {
            title: '用户类型',
            key: 'userType',
          },
        ],

        userModal: false,
        userForm: {},
        flag: 0

      }
    },
    mounted(){
      this.getUserList();
    },
    methods:{
      getUserList(){
        userList().then(res => {
          this.dataList = res ;
        })
      },
      addUser(){
        this.flag = 0;
        this.userModal = true;
      },
      validate(){
        if( !this.userForm.userName ){
          this.$Message.error('请输入用户名');
          return false;
        }
        if( !this.userForm.password ){
          this.$Message.error('请输入密码');
          return false;
        }
        return true
      },
      saveUser(){
        let validate = this.validate();
        if( !validate ) return;
        let data = {...this.userForm};
        addUser(data).then( res => {
          if(!res) return ;
          this.$Message.success('操作成功!');
          this.resetForm();
          this.getUserList();
        })
      },
      resetForm(){
        this.userModal = false;
        this.$refs.userForm.resetFields();
      },
    }
  }
</script>

<style scoped>

</style>
