<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from '_c/login-form';
  import { login, getUserInfo, getTenants, listMyMenu } from "@/api/user";
  import { getMenuByRouter, getMenuMyUser } from '@/libs/util';
  import Main from '@/components/main';

  export default {
    components: {
      LoginForm
    },
    methods: {
      handleSubmit({userName, password}) {
        let data = {
          username: userName,
          password: password
        };
        login(data).then( token => {
          if(!token){
            return false;
          }
          this.$store.commit('setToken',token);
          getUserInfo().then( res => {
            if(!res){
              return false;
            }
            this.$store.commit('setUserInfo',res);
            this.$store.commit('setAccess',res.userType);
            document.title = res.appName;
            if( res.userType == 'PlatformAdmin' || res.userType == 'ApplicationAdmin' ){
              this.$router.push('home');
              return ;
            }
            listMyMenu().then( menu => {

              let route = getMenuMyUser(menu, Main);
              this.$router.addRoutes( route );
              this.$router.push('home');
              let routeMenuList = getMenuByRouter( route, res.userType );
              localStorage.setItem( 'routeMenuList', JSON.stringify( routeMenuList ) );
              localStorage.setItem( 'userRoutes', JSON.stringify( menu ) );
            })
          });
          /*getTenants().then( res => {
            if(!res){
              return false;
            }
            this_.$store.commit('setTenants',res);
          });*/

        });
      }
    }
  }
</script>

<style>

</style>
