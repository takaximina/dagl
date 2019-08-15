<template>
  <Card>
    <p slot="title">{{title}}</p>
    <p slot="extra">
      <ButtonGroup size="small" v-if="!noEdit">
        <Button @click="add">新增</Button>
        <Button @click="edi" v-if="selectedData">修改</Button>
        <Button @click="del" v-if="selectedData">删除</Button>
      </ButtonGroup>
    </p>
    <Table size="small" disabled-hover border highlight-row :columns="columns" :data="data" @on-current-change="selected"></Table>
    <slot></slot>
  </Card>
</template>

<script>
    export default {
      name: "infoTable",
      props:{
        title: String,
        data: Array,
        columns: Array,
        noEdit: Boolean,
        id:String
      },
      data(){
        return {
          selectedData: ''
        }
      },
      watch:{
        data(n,o){
          if(n != o){
            this.selectedData = '';
          }
        }
      },
      methods:{
        selected(row){
          this.selectedData = row;
          this.$emit('table-selected',row);
        },
        add(){
          this.$emit('add-btn',this.selectedData)
        },
        edi(){
          this.$emit('edi-btn',this.selectedData)
        },
        del(){
          this.$emit('del-btn',this.selectedData)
        }
      }
    }
</script>

<style scoped>

</style>
