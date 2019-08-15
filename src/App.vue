<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
    this.$Message.config({
      top: 240,
      duration: 2,
    });
  },
  watch:{
    '$router':function(newv,oldv){
      console.log(newv,oldv);
    }
  }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  /* overflow: hidden;*/
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
