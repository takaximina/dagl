<template>
  <div>
    <Tree v-if="edit" :data="data" @on-select-change="select" :render="renderContent"></Tree>
    <Tree v-if="!edit" :data="data" @on-select-change="select"></Tree>
  </div>
</template>

<script>
  export default {
    name: "wTree",
    props:{
      data: Array,
      edit:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        selectId: ''
      }
    },
    methods:{
      select(data){
        this.$emit('select-data', data[0])
      },
      OnSelect(data) {
        this.$emit("select-data", data);
      },
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
            cursor:'pointer'
          }
        }, [
          h('span',{
            class: ["ivu-tree-title", {"ivu-tree-title-selected":this.selectId==data.id}],
            on:{
              click: () => {
                this.selectId = data.id;
                this.OnSelect(data);
              }
            }
          }, data.title),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '15px'
            }
          }
          /*, [h('Button', {
              props:  {
                icon: 'md-arrow-up',
                type: 'default',
                size: 'small',
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  console.log(root,node,data);
                }
              }
            }), h('Button', {
              props: {
                icon: 'md-arrow-down',
                type: 'default',
                size: 'small',
              },
              on: {
                click: () => {
                  console.log(root,node,data);
                }
              }
            })]*/
          )
        ]);
      },
    }
  }
</script>


<style lang="less">
  .preparesTree {
    float: left;
    margin-left: 24px;
    height: 440px;
    width: 222px;
    border: 1px solid #e8e8e8;
    .tree {
      width: 222px;
      height: 400px;
      padding: 10px 34px 0 14px;
      // border: 1px solid #e8e8e8;
      border-top: 0;
      overflow: auto;
    }
  }
  .user-defined-tree {
    background-color: #333;
  }
</style>
