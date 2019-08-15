<template>
  <div>
    <Table :editable="true" :columns="columns" :show-header="showHeader" :data="tabData" highlight-row disabled-hover size="small" :border="border" @on-current-change="selectPdt" :no-data-text="noDataText"></Table>
    <div v-if="!noEdit || !noPage" class="brs"></div>
    <Row>
      <div>
        <ButtonGroup v-if="!noEdit">
          <Button @click="add">新增</Button>
          <Button @click="edi" v-if="!noEditBtn && selected">修改</Button>
          <Button @click="del" v-if="selected">删除</Button>
        </ButtonGroup>
        <page v-if="!noPage" style="float:right;" :page-size="pagesize" :current="page" :total="total" simple @on-change="pageChange"/>
      </div>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "page_table",
    props:{
      tabData: Array,
      columns: Array,
      pagesize: {
        type: Number,
        default: 10
      },
      page: Number,
      total: Number,
      noEditBtn:{
        type:Boolean,
        default: false
      },
      showHeader:{
        type:Boolean,
        default:true
      },
      noEdit: Boolean,
      noPage: Boolean,
      noDataText: {
        type:String,
        default: '暂无数据'
      },
      border: {
        type:Boolean,
        default: false
      }
    },
    data(){
      return {
        selected: ''
      }
    },
    methods:{
      pageChange(page){
        this.$emit('page-change',page);
      },
      selectPdt(row){
        this.selected = row;
        this.$emit('selected',row)
      },
      add(){
        this.$emit('add-page');
      },
      edi(){},
      del(){
        this.$emit('del-page',this.selected);
      },
    }
  }
</script>

<style scoped>

</style>
