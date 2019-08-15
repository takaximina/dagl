<template>
  <div>
    <page-table
      ref="pageTable"
      :tabData="list"
      :columns="columns"
      :pagesize="pagesize"
      :page="page"
      :show-header="false"
      :total="total"
      :noPage="true"
      :noEdit="true">
    </page-table>
  </div>
</template>

<script>
  import pageTable from '@/apps/components/page_table';
  export default {
    name: "tbExpand",
    components: {
      pageTable
    },
    props: {
      list: Array,
      columns: Array,
      delDictVal: Function,
      ediDictVal: Function,
    },
    data(){
      return {
        page : 0,
        total: 0,
        pagesize: 10
      }
    },
    mounted(){
    }
  }
</script>

<style lang="less">

</style>
