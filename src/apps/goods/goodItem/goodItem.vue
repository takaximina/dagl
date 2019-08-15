<template>
  <div>
    <Row :gutter="10">
      <Col span="4">
        <good-types
          :data="treeData"
          :typeEdit="false"
          @selected="selected"
        ></good-types>
      </Col>
      <Col span="20">
        <Row v-if="selectedData.title">
          <Col span="24">
            <goodInfo ref="goodInfo" :data="selectedData"></goodInfo>
          </Col>
          <Col span="24">

          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
  import goodTypes from '../tpls/goodTypes'
  import goodInfo from '../tpls/info'
  import goodSku from '../tpls/sku'
  import { mapGetters } from 'vuex'
  import {listProductClassTree} from '@/api/goods'

  export default {
    components:{
      goodTypes,goodInfo,goodSku
    },
    name: 'goodItem',
    data(){
      return {
        treeData:[],
        selectedData:{}
      }
    },
    computed:{
      ...mapGetters([
        'userInfo'
      ])
    },
    mounted(){
      this.loadTree()
    },
    methods:{
      loadTree(){
        listProductClassTree().then(res => {
          if(!res) return ;
          this.treeData = res.menu;
        })
      },
      selected(row){
        try{
          this.$refs.goodInfo.brandReset('goodForm');
        }catch (e) {
          // console.log( e );
        }
        if(row) this.selectedData = row;
        else this.selectedData = {};
      }
    }
  }
</script>

<style scoped>

</style>
