<template>
  <Card>
    <Input search enter-button placeholder="输入查询页面" @on-search="search"/>
    <div v-if="pageUrl" class="brs"></div>
    <query-page ref="queryPage" v-if="pageUrl" :pageUrl="pageUrl"></query-page>
  </Card>
</template>

<script>
  import queryPage from '@/apps/components/query_pages'
  import {isURL} from "@/libs/tools";

  export default {
    name: "query_page_test",
    components:{
      queryPage
    },
    data(){
      return {
        pageUrl:''
      }
    },
    methods:{
      search(val){
        /*if( !isURL(val) ){
          return this.$Message.error('请输入正确的URL');
        }*/
        this.pageUrl = val;
        //this.$refs.queryPage.created();
      }
    }
  }
</script>

<style scoped>

</style>
