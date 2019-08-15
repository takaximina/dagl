<template>
  <Card>
    <query-page ref="queryPage" :noAddBtn="true" :api="api" :pageUrl="pageUrl"></query-page>
  </Card>
</template>

<script>
  import queryPage from '@/apps/components/query_pages'
  import { mapGetters } from 'vuex'
  export default {
    name: "customMgt",
    components: {
      queryPage
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    mounted(){
      console.log(this.userInfo);
    },
    data(){
      return {
        pageUrl: '/customer/filter',
        api: 'customer'
      }
    },
    methods:{
      add(){},
      edi(){},
      del(){},
    }
  }
</script>

<style scoped>

</style>
