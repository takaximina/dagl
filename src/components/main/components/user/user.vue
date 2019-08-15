<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar icon="md-person" :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="resetPwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal footer-hide :closable="false" v-model="resetModal">
      <Form :model="resetModel">
        <FormItem label="新密码：">
            <Input v-model="resetModel.newPassword " type="password" />
        </FormItem>
        <FormItem label="重复新密码：">
            <Input v-model="resetModel.rnewPassword" type="password"/>
        </FormItem>
        <FormItem label="原始密码：">
            <Input v-model="resetModel.oldPassword" type="password"/>
        </FormItem>
        <FormItem style="text-align:center">
            <Button type="primary" @click="handleSubmit">确定</Button>
            <Button @click="resetModel={pwd:'',rpwd:''};resetModal=false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions , mapMutations } from 'vuex';
import {resetPwd} from '@/api/user'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      resetModal:false,
      resetModel:{
        pwd:'',
        rpwd:''
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut',
    ]),
    handleSubmit(){
      if(!this.resetModel.newPassword ||!this.resetModel.rnewPassword ||!this.resetModel.oldPassword){
        this.$Message.error('请检查输入')
      }else if(this.resetModel.newPassword!=this.resetModel.rnewPassword){
        this.$Message.error('两次输入新密码不同，请重新输入')
      }else{
        resetPwd(this.resetModel).then(res=>{
          if(res){
            this.$Message.success('修改成功');
            this.resetModal=false;
            this.resetModel={
              pwd:'',
              rpwd:''
            }
          }
        })
      }
    },
    handleClick (name) {
      let this_ = this;
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
            /*this.$router.push({
              name: 'login'
            })*/
            window.location.reload()
          })
          break;
        case "resetPwd":
          this.resetModal=true;
          break;
      }
    }
  }
}
</script>
