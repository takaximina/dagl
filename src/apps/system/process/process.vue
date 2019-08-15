<template>
  <div>
    <Row :gutter="20">
      <Col span="6">
        <Card>
          <p slot="title">流程</p>
          <!--<p slot="extra">
            <Button size="small" icon="md-add" @click="addDict"></Button>
            <Button v-if="selected" size="small" icon="md-close" @click="delDict"></Button>
            <Button v-if="selected" size="small" icon="md-list-box" @click="ediDict"></Button>
          </p>-->
          <CellGroup @on-click="sltDict">
            <Cell v-for="item in pcsData" :selected="sltPcs == item.value" :name="item.value" :title="item.name" :extra="item.value"/>
          </CellGroup>
        </Card>
      </Col>
      <Col span="18">
        <Card v-if="sltPcs">
          <p slot="title">流程详情</p>
          <p slot="extra">
            <Button size="small" @click="addPcs">新增</Button>
          </p>
          <page-table
            ref="pageTable"
            :tabData="pcsList"
            :columns="columns"
            :pagesize="size"
            :page="page"
            :total="total"
            :noEdit="true"
            @page-change="loadPcsList">
          </page-table>
          <div class="brs"></div>
          <div v-if="network.nodes.length">
            <visComponents ref="visComponents" :data="network" :height="'300px'"></visComponents>
          </div>
        </Card>
      </Col>
      <Modal
        v-model="addPscModal"
        :title=" addPscFlag ? '修改' : '新增' ">
        <Form ref="addPscForm" :model="addPscForm" label-position="left" :label-width="100">
          <FormItem label="流程名称：">
            <Input v-model="addPscForm.name"></Input>
          </FormItem>
          <FormItem label="流程编码：">
            <Input v-model="addPscForm.code"></Input>
          </FormItem>
          <FormItem label="执行顺序：">
            <Input v-model="addPscForm.seq"></Input>
          </FormItem>
          <Row>
            <Col span="12">
              <FormItem label="是否撤回：">
                <i-switch v-model="addPscForm.canBack">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="是否重复：">
                <i-switch v-model="addPscForm.canRepeat">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="备注：">
            <Input v-model="addPscForm.remark" type="textarea" :autosize="{minRows: 2,maxRows: 3}"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="savePcs">确定</Button>
          <Button type="text" @click="resetPscForm">取消</Button>
        </div>
      </Modal>
    </Row>
    <!--<div style="width: 100px;">
      <div style="display: table;width: 100px;height: 100px;background: #001529;color: #fff;padding: 0;border-radius: 10px;">
        <div style="display: table-cell;vertical-align: middle;text-align: center;">
          <div style="width: 100px;word-wrap:break-word; word-break:break-all;padding: 0 10px">
            asdfsdfasdfasfdsdf
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
  import pageTable from '@/apps/components/page_table'
  import visComponents from '@/apps/components/visComponents'

  import { forEach } from "@/libs/tools";
  import { listAppDictValueByCode } from '@/api/application/dictionary'
  import { queryByFilter, addPsc, deletePsc, updatePsc, queryByTypeDict } from "@/api/application/process"
  //work.order.type

  export default {
    name: "process",
    components: {
      pageTable, visComponents
    },
    data(){
      let this_ = this;
      return {
        pcsData: [],
        sltPcs: '',
        pcsList: [],
        columns: [
          {
            title: '#',
            type: 'index'
          },{
            title: '名称',
            key: 'name',
          },{
            title: '编码',
            key: 'code',
          },{
            title: '执行顺序',
            key: 'seq',
            sortType: 'asc'
          },{
            title: '是否可返回',
            key: 'canBack',
          },{
            title: '是否可重复',
            key: 'canRepeat',
          },{
            title: '备注',
            key: 'remark',
          },{
            title: '操作',
            render(h, p){
              return h('div', {}, [
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'info'
                  },
                  on: {
                    click(){
                      this_.ediPcs(p.row)
                    }
                  },
                  style: { marginRight: '10px'}
                }, '修改'),
                h('Button', {
                  props: {
                    size: 'small',
                  },
                  on: {
                    click(){
                      this_.delPcs(p.row)
                    }
                  },
                  style: { marginRight: '10px'}
                }, '删除'),
              ])
            }
          }
        ],
        page: 0,
        size: 5,
        total: 0,
        addPscModal: false,
        addPscFlag: 0,
        addPscForm: {
          canBack: false,
          canRepeat: false,
        },
        network: {
          nodes: [],
          edges: []
        }
      }
    },
    mounted(){
      this.loadPcs()
    },
    methods:{
      loadPcs(){
        listAppDictValueByCode('work.order.type').then( res => {
          this.pcsData = res
        })
      },
      loadPcsList(page){
        let data = {
          condition: this.sltPcs,
          pageIndex: page,
          pageSize: 5,
        };
        queryByTypeDict( data ).then( res => {
          this.total = res.resultCount;
          this.page = res.pageIndex + 1 ;
          this.pcsList = res.respnoseData;
        });
        let data_ = {
          condition: this.sltPcs,
          pageIndex: 0,
          pageSize: 1000,
        };
        queryByTypeDict( data_ ).then( res => {
          let nodes = [];
          let edges = [];
          forEach( res.respnoseData, function (v, i) {
            let node = {
              id: v.id,
              name: v.name,
              level: v.seq,
              remark: v.remark
            };
            nodes.push(node);
            forEach( res.respnoseData, function (k, j) {
              let edge = {
                from: '' ,
                to: ''
              };
              if( v.seq == ( k.seq - 1 ) ){
                edge.from = v.id;
                edge.to = k.id;
                edges.push( edge )
              }
            });
          });
          this.network = { nodes, edges };
        })
      },
      sltDict(id){
        if( !id ){
          this.sltPcs = ''; return
        }
        this.sltPcs = id;
        this.loadPcsList(1)
      },
      addPcs(){
        this.addPscFlag = 0;
        this.addPscModal = true;
      },
      validateForm(){
        if( !this.addPscForm.name ){
          this.$Message.warning({
            content: '请输入流程名称!',
            duration: 1
          });
          return false;
        }
        if( !this.addPscForm.code ){
          this.$Message.warning({
            content: '请输入流程编码!',
            duration: 1
          });
          return false;
        }
        if( !this.addPscForm.seq ){
          this.$Message.warning({
            content: '请输入执行顺序!',
            duration: 1
          });
          return false;
        }
        return true;
      },
      savePcs(){
        if( this.validateForm() ){
          let data = { ... this.addPscForm };
          data.typeDict = this.sltPcs;
          if(this.addPscFlag) {
            updatePsc(data).then( res => {
              if(!res) return false;
              this.loadPcsList(1);
              this.resetPscForm();
              this.$Message.success('修改成功');
            });
            return ;
          }
          addPsc(data).then( res => {
            if(!res) return false;
            this.loadPcsList(1);
            let node = {
              id: res,
              name: data.name,
              level: data.seq,
              remark: data.remark
            };
            // this.$refs.visComponents.addNode( node );
            this.resetPscForm();
            this.$Message.success('新增成功!');
          })
        }
      },
      resetPscForm(){
        this.addPscForm = {
          canBack: false,
          canRepeat: false,
        };
        this.addPscFlag = 0;
        this.addPscModal = false;
        this.$refs.addPscForm.resetFields();
      },
      ediPcs(row){
        this.addPscForm = {...row};
        this.addPscModal = true;
        this.addPscFlag = 1;
      },
      delPcs(row){
        this.$Modal.confirm({
          title: '警告！',
          content: '<p>确认删除该流程？删除后无法恢复！</p>',
          onOk: () => {
            deletePsc( row.id ).then(res => {
              if (!res) return;
              this.$Message.info('删除成功！');
              this.loadPcsList(1)
            })
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
