<template>
  <div>
    <Card>
      <p slot="title">租户</p>
      <page-table
        ref="pageTable"
        :tabData="Table"
        :columns="columns"
        :pagesize="pagesize"
        :page="page"
        :total="total"
        :noEdit="true"
        @page-change="loadData">
      </page-table>
    </Card>
    <Modal
      v-model="modal"
      title="新增租户">
      <Form ref="tenantForm" :model="tenantForm" label-position="left" :label-width="100">
        <FormItem label="所属企业：">
          {{ entName }}
        </FormItem>
        <FormItem label="所属应用：">
          {{ appName }}
        </FormItem>
        <FormItem label="租户账号：" prop="userName">
          <Input v-model="tenantForm.userName"></Input>
        </FormItem>
        <FormItem label="结束时间：" prop="endDate">
          <DatePicker :options="dateOpt" style="width: 100%" type="date" v-model="tenantForm.endDate"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save">确定</Button>
        <Button type="text" @click="reset">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import pageTable from '@/apps/components/page_table';
  import { forEach } from '@/libs/tools';
  import { list, add } from "@/api/application/tenant";

  export default {
    name: "tenant",
    components:{
      pageTable
    },
    data(){
      return {
        appId: this.$store.getters.userInfo.appId,
        appName: this.$store.getters.userInfo.appName,
        Table: [],
        columns: [
          /*{
            type: 'expand',
            width: 26,
            render: (h, params) => {
              if(params.row.children){
                return h( tbExpand , {
                  props:{
                    list: params.row.children,
                    columns: this_.dictColumns,
                    delDictVal: this_.delDictVal,
                    ediDictVal: this_.ediDictVal
                  }
                })
              }
            }
          },*/
          {
            title: '#',
            type: 'index',
            width: 30
          },
          {
            title: '名称',
            key: 'name',
            /*render: (h, params) => {
              let left = params.row.left * 26;
              return h( 'div' , {
                style: {
                  paddingLeft: left+ 'px'
                }
              }, params.row.name)
            }*/
          },
          {
            title: '操作',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.addTenant( params.row )
                    }
                  }
                }, '创建租户'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.cancel( params.row )
                    }
                  }
                }, '注销租户')
              ]);
            }
          }
        ],
        pagesize: 10,
        page: 1,
        total: 0,

        dateOpt: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        modal: false,
        tenantForm:{},
        entName: '',
      }
    },
    mounted(){
      this.loadData(0);
      this.reset();
    },
    methods:{
      loadData(index){
        let data = {
          pageIndex: index,
          pageSize: 10
        };
        list(data).then(res => {
          this.Table = res.respnoseData;
        })
      },
      addTenant(row){
        this.modal = true ;
        this.entName = row.name;
        this.tenantForm.entId = row.id;
      },
      cancel(row){},
      save(){
        if(!this.tenantForm.userName){
          this.$Message.error('请输入租户账号');
          return false;
        }
        let data = {...this.tenantForm};
        add( data ).then( res => {
          this.$Message.info('创建成功，初始密码为'+ res);
          this.loadData();
          this.reset();
        })
      },
      reset(){
        let date1 = new Date();
        let date2 = new Date(date1);
        date2.setDate(date1.getDate() + 30);
        this.tenantForm.userName = '';
        this.tenantForm.endDate = date2;
        this.tenantForm.appId = this.appId;
        this.modal = false ;
      },
    }
  }
</script>

<style scoped>

</style>
