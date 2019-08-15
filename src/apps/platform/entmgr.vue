<template>
  <div>
    <!-- @v-for="ent in entList" -->
    <!-- <p slot="extra" style="aligin:right">
    <i-Button class="add" @click="Add" type="primary">添加</i-Button>
    </p>
    v-if="editAppObj === null"
    <Table border :columns="columns7" :data="data6" ></Table> -->
    <Card :bordered="false">
      <p slot="title">企业列表</p>
      <p slot="extra">
        <Button type="primary" size="small" @click="modal1 = true">添加</Button>
      </p>
      <p>
      <Table border :columns="columns7" :data="data6">
      </Table>
      </p>
    </Card>
    <Modal
      v-model="modal1"
      width="400"
      title="添加企业"
      @on-ok="Add"
      draggable
      :mask-closable="true">

      企业代码：<Input v-model="code" placeholder="请输入企业代码" style="width: 300px" size="large"/><br/>

      企业名字：<Input v-model="name" placeholder="请输入企业名" style="width: 300px" size="large"/><br/>

      说明备注：<Input v-model="remark" placeholder="请输入说明" style="width: 300px" size="large"/>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'ent_manage',
    data() {
      return {
        modal1: false,
        code: '',
        name: '',
        remark: '',
        columns7: [
          {
            title: '名字',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.name)
              ]);
            }
          },
          {
            title: '创建人',
            key: 'createUsername'
          },
          {
            title: '说明',
            key: 'remark'
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
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
                      this.show(params.index)
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',

                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                }, '删除'),
                // h('Button', {
                //     props: {
                //         type: 'primary',
                //         size: 'small',

                //     },
                //     style: {
                //         marginRight: '5px'
                //     },
                //     on: {
                //         click:() => {
                //            this.modal1 = true;
                //            this.edit(params)
                //         }
                //     }
                // }, '修改'),
              ]);
            }
          }
        ],
        data6: [],
        entList: {
          code: '',
          name: '',
          parentId: -1
        }

      }
    },
    mounted: function () {
      let that = this
      this.$http.post('ent/listEntByParentId', '-1').then(res => {
        that.data6 = res.data.data;
      });
    },

    methods: {
      query() {
        let that = this
        this.$http.post('ent/listEntByParentId', '-1').then(res => {
          that.data6 = res.data.data;
        });
      },
      show(index) {
        this.$Modal.info({
          title: '详细信息',
          content: `企业名：${this.data6[index].name}<br>创建人：${this.data6[index].createUsername}<br>说明：${this.data6[index].remark}`
        })
      },
      remove(params) {
        let that = this
        that.$Modal.confirm({
          title: "确认删除吗?",
          onOk: () => {
            that.$http.post('/ent/removeEnt', params.row.id).then(res => {
              //console.log(res.data.message);
              that.$Message.info("删除成功");
              that.query();
            });
          }
        });
      },
      // edit(params){
      //     let that = this
      //     console.log(params.row);
      //     that.id = params.row.id;
      //     that.code = params.row.code;
      //     that.name = params.row.name;
      //     that.remark = params.row.remark;
      // },
      Add() {
        let that = this
        this.entList.code = that.code;
        this.entList.name = that.name;
        this.entList.remark = that.remark;
        this.$http.post('/ent/saveEnt', this.entList).then(res => {
          if (res.data.message == 'OK') {
            this.$Message.success('添加成功');
            that.query();
          } else {
            this.$Message.warning(res.data.message);
          }
        });
      },
    }
  }
</script>

<style>
</style>
