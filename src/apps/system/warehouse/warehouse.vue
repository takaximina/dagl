<template>
  <div>
    <Row :gutter="20">
      <Col span="6">
        <Card>
          <p slot="title">仓库</p>
          <p slot="extra">
            <Button size="small" icon="md-add" @click="addData"></Button>
            <Button v-if="selected" size="small" icon="md-close" @click="delData"></Button>
            <Button v-if="selected" size="small" icon="md-list-box" @click="ediData"></Button>
          </p>
          <CellGroup @on-click="sltData">
            <Cell v-for="item in tableData" :selected="selected == item.id" :name="item.id" :title="item.name"/>
          </CellGroup>
        </Card>
      </Col>
    </Row>
    <Modal
      v-model="modal"
      :title=" flag ? '修改' : '新增仓库' ">
      <Form ref="formData" :model="formData" label-position="left" :label-width="100">
        <FormItem label="仓库名称：">
          <Input v-model="formData.name"></Input>
        </FormItem>
        <FormItem label="备注：">
          <Input type="textarea" :autosize="{minRows: 1,maxRows: 3}"  v-model="formData.remark"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveData">确定</Button>
        <Button type="text" @click="resetForm">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { listWarehouse, addWarehouse, removeWarehouse, updateWarehouse, queryWarehouse } from "@/api/system/warehouse";
  import { forEach } from '@/libs/tools';

  export default {
    name: "warehouse",
    created(){
      this.loadData()
    },
    data(){
      return {
        tableData: [],
        selected: '',
        modal: false,
        flag: 0,
        formData: {}
      }
    },
    methods: {
      loadData(){
        listWarehouse().then( res => {
          if( res )
            this.tableData = res;
        })
      },
      sltData(id){
        if( !id ){
          this.selected = ''; return
        }
        this.selected = id;
      },
      addData(){
        this.flag = 0;
        this.modal = true;
      },
      delData(){
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除所选仓库？</p>',
          onOk: () => {
            removeWarehouse( this.selected ).then(res => {
              if(!res) return ;
              this.$Message.info('删除成功！');
              this.loadData();
            })
          }
        });
      },
      ediData(){
        queryWarehouse( this.selected ).then( res=> {
          if( !res ) return;
          this.formData = res;
          this.flag = 1;
          this.modal = true;
        })
      },
      valData(){
        if( !this.formData.name ){
          this.$Message.error('请输入仓库名称');
          return false
        }
        return true
      },
      saveData(){
        if( !this.valData() ){
          return false
        }
        if( this.flag ){
          updateWarehouse( this.formData ).then( res => {
            if( !res )  return;
            this.$Message.info('保存成功');
            this.resetForm()
          })
        }else {
          addWarehouse( this.formData ).then( res => {
            if( !res )  return;
            this.$Message.info('保存成功');
            this.resetForm()
          })
        }
      },
      resetForm(){
        this.formData = {};
        this.modal = false;
        this.loadData();
      },
    }
  }
</script>

<style scoped>

</style>
