<template>
  <Tree :data="treeData" @on-select-change="select" ></Tree>
</template>

<script>
    export default {
        name: "wTree",
        props:{
            url: String
        },
        mounted(){
            this.$http.post(this.url).then(res=>{
              let data = res.data.data;
              let tree = function(data,parentId){
                let itemArr = [];
                for (let i = 0; i < data.length; i++) {
                  let node = data[i];
                  if ( node.parent_id == parentId ) {
                    let newNode = {};
                    newNode.id = node.id;
                    newNode.title = node.name;
                    newNode.children = tree(data, node.id);
                    itemArr.push(newNode);
                  }
                }
                return itemArr;
              };
              this.treeData = tree(data,'-1');
            })
        },
        methods:{
          select(data){
            this.$emit('select-data', data)
          }
        },
        data(){
            return {
              treeData: []
            }
        }
    }
</script>

<style scoped>

</style>
