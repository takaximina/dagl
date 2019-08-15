<template>
  <div>
    <!--<div class="expend-list">
      <div v-for="item in list">
        <Row :gutter="10">
          <Col span="10">
            <b>{{ item.skuName }}</b>
          </Col>
          <Col span="4">
            数量：{{item.packNumber}}
          </Col>
          <Col span="4">
            原始价格：{{item.skuPrice}}
          </Col>
          <Col span="6">
            销售属性：
          </Col>
        </Row>
      </div>
    </div>-->
    <Table :columns="columns" :data="list" :show-header="false"></Table>
  </div>
</template>

<script>
  export default {
    name: "tb_expand",
    props: {
      list: Array,
      skuName:String,
      amount: Number
    },
    mounted:function(){

    },
    data(){
      let this_ = this;
      return {
        number: 3,
        price: 12.999,
        columns:[
          {
            title: '商品',
            align:'left',
            key: 'productName',
            render: (h, params)=>{
              return h('div',{}, [
                h('div', {style: {float: 'left',paddingLeft: '75px'}}, [
                  h('div', {'class':
                      {hasDesc: params.row.desc,noDesc: !params.row.desc}
                  }, [
                    h('span',{
                      style: {
                        fontSize: '14px',
                        marginTop:'2px',
                        marginRight: '5px'
                      },
                    },params.row.productName)
                  ]),
                  h('div', {
                    style: {fontSize: '12px', color: '#bbb',height: '21px', display: params.row.desc?'block':'none'}
                  }, params.row.desc)
                ]),
                h('div', {
                  style: {
                    float: 'right',lineHeight: '50px',
                    display: (params.row.productType == 'SERVICE_PRODUCT' || params.row.productType == 'RESOURCE_PRODUCT') ? 'block' : 'none'
                  }
                }, [
                  h('span', {}, '选择时间：'),
                  h('DatePicker',{
                    props: {
                      size: 'small',
                      type: 'datetimerange',
                      format: 'yyyy-MM-dd HH:mm',
                      value: [params.row.chargeStartDate, params.row.chargeEndDate]
                    },
                    style: {
                      width: '260px'
                    },
                    on: {
                      'on-change'(d1){
                        // params.row.chargeStartDate = d1[0];
                        // params.row.chargeEndDate = d1[1];
                        // this_.list[params.index] = params.row;
                        this_.changeTime(d1, params.index)
                      }
                    }
                  })
                ])
              ])
            }
          },
          {
            title: '单价',
            width: 100,
            align:'right',
            key: 'price',
            render: (h, params) => {
              return h('div', {},'￥ '+ params.row.price.toFixed(2) )
            }
          },
          {
            title: '数量',
            width: 60,
            align:'center',
            key: 'chargeAmount',
            render: (h, params) => {
              /*return h('div', {
                style:{
                  textAlign: 'center'
                }
              }, params.row.chargeAmount * this_.amount,);*/
              return h('InputNumber', {
                props:{
                  size: 'small',
                  value: params.row.chargeAmount * this_.amount,
                  disabled: true,
                },
                style: {
                  width: '100%',
                  textAlign: 'center'
                }
              });
            }
          },
          {
            title: '小计',
            align:'right',
            width: 100,
            key: 'price',
            render: (h, params) => {
              // return h('div', {},'￥ '+ (params.row.price * params.row.chargeAmount * this_.amount).toFixed(2) );
              return h('div', {}, '');
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return h('span');
            }
          },
        ],
      }
    },
    methods:{
      changeTime(d1, index){
        this.$emit('changeTime', d1, index);
      }
    }
  }
</script>

<style lang="less">
  .expend-list>div{
    padding: 5px 0;
    border-bottom: 1px solid #dcdee2;
    &:last-child{
      border: 0;
    }
  }
  .noDesc{
    line-height: 50px;
  }
  .hasDesc{
    height: 30px;
    line-height: 35px;
  }
</style>
