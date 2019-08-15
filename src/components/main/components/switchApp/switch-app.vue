<template>
  <div>
    当前应用：
    <Select v-model="thisApp" style="width:200px" @on-change="changeApp" label-in-value>
      <Option v-for="i in appList" :value="i.id" :key="i.id">{{ i.name }}</Option>
    </Select>
  </div>
</template>

<script>
  import { listApp, changeApp } from "@/api/application/application";
  import { login, getUserInfo, getTenants } from "@/api/user";
  import { changeApp_ } from "@/libs/util";
  import { get_userInfo, setToken, getToken } from "@/libs/util";

  export default {
    name: "switch-app",
    data(){
      return {
        thisApp: get_userInfo().appId || '',
        appList: []
      }
    },
    computed:{
      userInfo(){
        return get_userInfo();
      }
    },
    mounted(){
      this.loadData()
    },
    created(){
      let this_ = this;
      eventBus.$on('loadApp',function (flag) {
        this_.loadData();
        if(flag){
          this_.thisApp = '';
          this_.changeApp()
        }
      })
    },
    methods: {
      loadData(){
        this.appList = [];
        if(this.userInfo.userType == 'PlatformAdmin' || this.userInfo.userType == 'ApplicationAdmin'){
          listApp().then(res => {
            this.appList = res;
          })
        }
      },
      changeApp(item){
        this.$Modal.confirm({
          title: '提示！',
          content: '<p>确认切换到 "'+ item.label +'"？</p>',
          onOk: () => {
            changeApp(item.value).then( res => {
              if(!res) return;
              // this.$store.commit('setToken',res);
              setToken(res);
              getUserInfo().then( res => {
                if(!res){
                  return false;
                }
                this.$store.commit('setUserInfo',res);
                this.$store.commit('setAccess',res.userType);
                window.location.reload();
              });
            })
          },
          onCancel: () => {
            this.thisApp = get_userInfo().appId;
          }
        });

      }
    }
  }
</script>

<style scoped>

</style>
