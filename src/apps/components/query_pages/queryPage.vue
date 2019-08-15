<template>
  <div>
    <Row>
      <div class="search_group" @keyup.enter="query">
        <Dropdown @on-click="dropClick" placement="bottom-start">
          <Button type="primary">
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="">自动识别</DropdownItem>
            <DropdownItem v-for="item in paramsList" :name="item.name">{{item.displayName}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button v-if="dropData">{{dropData.displayName}}：</Button>
        <AutoComplete v-if="!dropData" ref="autoCpe"
          v-model="searchText"
          :data="searchData"
          @on-search="search"
          placeholder="选择类别搜索，或者输入关键字搜索"
          style="width:350px">
        </AutoComplete>
        <Select
          clearable
          v-if="dropData && dropData.selectData && dropData.selectData.length"
          v-model="senFrom[dropData.name]"
          style="width:350px">
          <Option v-for="item in dropData.selectData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input
          v-if="dropData && dropData.dataType=='STRING' && !dropData.selectData"
          v-model="senFrom[dropData.name]"
          style="width:350px"/>
        <InputNumber
          v-if="dropData && dropData.dataType=='INT' && !dropData.selectData"
          :min="0"
          v-model="senFrom[dropData.name]"
          style="width: 300px"
        ></InputNumber>
        <InputNumber
          v-if="dropData && dropData.dataType=='NUMBER' && !dropData.selectData"
          :min="0"
          v-model="senFrom[dropData.name]"
          style="width: 300px"
        ></InputNumber>
        <DatePicker
          type="date"
          v-if="dropData && dropData.dataType=='DATE' && !dropData.selectData"
          v-model="senFrom[dropData.name]"
          style="width: 300px"
        ></DatePicker>
        <Button type="primary" icon="ios-search" @click="query"></Button>
      </div>
      <div class="sen-btn">
        <Button type="text" v-if="paramsList.length" @click="showSenior = !showSenior">{{showSenior ? '普通搜索' : '高级搜索'}}</Button>
      </div>
      <Button v-if="!noEdit && !noAddBtn" style="float: right" type="primary" @click="add">{{addBtnStr}}</Button>
      <Button v-if="reportBtnStr" style="float: right;margin-right: 10px" type="primary" @click="exportExcel">{{reportBtnStr}}</Button>
    </Row>
    <Row v-if="showSenior">
      <div class="brs"></div>
      <Form ref="senFrom" label-position="left" :model="senFrom" class="sen-form" :label-width="80">
        <Row :gutter="20">
          <Col :span="noEdit ? 12 : 6" v-for="item in paramsList">
            <FormItem :label="item.displayName + '：'" v-if=" !item.filterHidden ">
              <Select
                clearable
                v-if="item.selectData && item.selectData.length"
                v-model="senFrom[item.name]"
                size="small">
                <Option v-for="i in item.selectData" :value="i.value">{{i.label}}</Option>
              </Select>
              <Input
                v-if="item.dataType == 'STRING' && !item.selectData"
                v-model="senFrom[item.name]"
                size="small"
              ></Input>
              <Input
                v-if="item.dataType == 'NONE' && !item.selectData"
                v-model="senFrom[item.name]"
                size="small"
              ></Input>
              <InputNumber
                v-if="item.dataType == 'NUMBER' && !item.selectData"
                v-model="senFrom[item.name]"
                :style="{width:'100%'}"
                :min="0"
                size="small"
              ></InputNumber>
              <DatePicker
                type="date"
                v-if="item.dataType=='DATE' && !item.selectData"
                v-model="senFrom[item.name]"
                size="small"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <div class="brs"></div>
        <Row>
          <div style="float: right">
            <Button :size="'small'" type="primary" @click="senSubmit('senFrom')">搜索</Button>
            <Button :size="'small'" @click="senReset('senFrom')" style="margin-left: 8px">清空</Button>
          </div>
        </Row>
      </Form>
    </Row>
    <div class="brs"></div>
    <div>
      <Table :loading="loading" ref="el_table" size="small" disabled-hover border highlight-row
        :columns="columns" :data="tabData"
        @on-current-change="sltTbRow"
      ></Table>
      <div class="brs"></div>
      <Row>
        <div>
          <!--<ButtonGroup v-if="!noEdit">
            <Button @click="add">新增</Button>
            <Button @click="edi" v-if="tbRow">查看/编辑</Button>
            <Button @click="del" v-if="tbRow">删除</Button>
          </ButtonGroup>-->
          <page
            style="float:right;"
            :current="page"
            :total="total"
            :page-size="pageSize"
            show-elevator
            show-total
            @on-change="pageChange"
          />
        </div>
      </Row>
    </div>
  </div>
</template>

<script>
  import { forEach } from "@/libs/tools";
  import { getRelativeTime, hasKey, getDateToStr } from "@/libs/tools";
  import { queryForm, queryPages } from "@/api/query_pages";

  export default {
    name: "query_page",
    props:{
      api: String,
      pageUrl:String,
      noEdit:{
        type: Boolean,
        default: false
      },
      noAddBtn:{
        type: Boolean,
        default: false
      },
      addBtnStr: {
        type: String,
        default: '新增'
      },
      reportBtnStr: {
        type: String
      },
      pageSize:{
        type: Number,
        default: 10
      },
      operation: Object,
    },
    /*watch:{
      async pageUrl(){
        await this.loadForm();
        // this.loadData(1)
      },
      '$route'(){
        if( hasKey(this.$route.query) ){
          let drop;
          for(let item in this.$route.query){
            drop = item;
          }
          this.dropClick( drop );
          this.senFrom = {...this.$route.query};
          this.loadData(1);
        }else{
          this.dropClick();
          this.senReset();
          this.loadData(1);
        }
      }
    },*/
    async created(){
      await this.loadForm();
      /*if(this.$route.query && this.$route.query.id){
        this.dropClick( this.$route.query.query );
        this.senFrom[this.$route.query.query] = this.$route.query.id;
      }*/
      if( hasKey(this.$route.query) ){
        let drop;
        for(let item in this.$route.query){
          drop = item;
        }
        this.dropClick( drop );
        this.senFrom = {...this.$route.query};
      }
      this.loadData(1);
      if(this.operation){
        this.columns.push(this.operation);
      }
    },
    data(){
      return{
        loading: true,
        newPageUrl:'',
        showSenior: false,
        paramsList: [],
        columns: [],
        ParamsKey:'',

        dropData: '',
        searchText: '',
        searchData: [],
        senFrom: {},
        tabData: [],
        page:1,
        total:0,
        LOADFORM:{},

        autoData:[],
        tbRow: ''
      }
    },
    methods:{
      async loadForm(){
        let res = await queryForm(this.pageUrl, this.api);
        if(!res) return;
        this.newPageUrl = res.name;
        // 生成查询条件
        let paramsList = res.request.filter( v => v.name=='condition')[0];
        this.paramsList = paramsList.childField;
        let senFrom = {};
        forEach(paramsList.childField,function ( v, i ) {
          if(v.dataType == 'NUMBER' || v.dataType =='INT' ){
            senFrom[v.name] = 0
          }else
            senFrom[v.name] = ''
        });
        this.LOADFORM = {...senFrom};
        this.senFrom = senFrom;

        // 生成table头
        let columns = res.response.filter(v => v.name=='respnoseData')[0];
        let colList = [{
          title: '#',
          width: 35,
          align: 'center',
          type: 'index',
        }];
        let key = '';
        let attr = '';
        forEach(columns.childField,(v,i)=>{
          if(v.key){
            key = v.name
          }
          if(v.displayName == '属性'){
            attr = v.name;
            return ;
          }
          if(!v.column || v.key) return ;
          let item = {};
          item.title = v.displayName;
          item.key = v.name;
          if( v.dataType == 'NONE' || v.dataType == 'INT'){
            item.width = 80;
            item.align = 'right';
          }
          if( v.dataType == 'NUMBER' ){
            // item.width = 80;
            item.align = 'right';
            item.render = (h, params)=>{
              let str = params.row[v.name]? params.row[v.name].toFixed(2) : ''
              return h('span', {}, str)
            }
          }
          if( v.displayName == '商品' ){
            item.render = (h, params)=>{
              return h('div',{}, [
                h('div',{
                  style: {
                    fontSize: '14px',
                    height: '30px',
                    lineHeight:'35px',
                  },
                },[
                    h('span',{},params.row[v.name]),
                    h('Icon',{
                      props:{
                        type: params.row.packType ? 'md-albums' : '',
                        size: 18
                      },
                      style: {
                        verticalAlign: 'sub',
                        marginLeft: '5px',
                      }
                    })
                ]),
                h('div',{
                  style: {
                    fontSize: '12px',
                    height: '20px',lineHeight:'15px',
                    color:'#9ea7b4',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  },},params.row[attr] || '无描述')
              ])
            };
            item.width = 350
          }
          if( v.dataType == 'DATE' ){
            // item.width = 80;
            item.render = (h, params)=>{
              let str = params.row[v.name]? getDateToStr(params.row[v.name]) :'';
              return h('span', {}, str)
            }
          }
          if( v.displayName.indexOf('状态') >= 0 ){
            item.width = 80;
            item.align = 'center';
          }
          if( v.selectData ){

          }
          colList.push(item);
        });
        this.columns = colList;
        this.ParamsKey = key;
      },
      loadData(page){
        this.loading = true;
        let this_ = this;
        let data = {
          condition:{ ...this_.senFrom },
          pageIndex: page,
          pageSize: this_.pageSize,
          searchText: this_.searchText
        };
        for( let v in data.condition){
          if( ! data.condition[v] ){
            delete data.condition[v]
          }
        }
        queryPages(data, this.newPageUrl, this.api).then(res=>{
          this.loading = false;
          if(!res) return;
          this.tabData = res.respnoseData;
          this.total = res.resultCount;
        });
      },
      dropClick(name){
        if(!name) this.dropData = '';
        this.dropData = this.paramsList.filter( v => v.name == name)[0];
        this.searchText = '';
        this.senFrom = {...this.LOADFORM};
        // this.$route.query = {};
      },
      search(v){
        //if(v) this.$emit('query',v)
      },
      keyDown(key){
        console.log(key)
      },
      query(){
        this.loadData(1)
      },
      pageChange(page){
        this.loadData(page)
        this.page = page;
      },
      senSubmit(){
        this.loadData(1)
        //this.showSenior = false;
      },
      senReset(name){
        this.senFrom = {...this.LOADFORM};
      },
      // table
      sltTbRow(row){
        this.tbRow = {...row};
        this.$emit('slt',{...row}, this.ParamsKey);
      },
      add(){
        this.$emit('add');
      },
      exportExcel(){
        this.$emit('exportExcel',this.senFrom);
      },
      edi(){
        this.$emit('edi',this.tbRow, this.ParamsKey)
      },
      del(){
        this.$emit('del',this.tbRow, this.ParamsKey)
      },
      clearTable(){
        this.$refs.el_table.clearCurrentRow();
      },
      focusIpt(){
        console.log(this.$refs.autoCpe)
        this.$refs.autoCpe.$refs.input.focus()
      },
      loadPageData(){
        this.loadData(this.page)
      },
      getSenForm(){
        return this.senFrom
      },
      getColumns(){
        if(this.operation){
          let columns =  [...this.columns];
          columns.pop();
          return columns;
        }else{
          return this.columns
        }
      }
    }
  }
</script>

<style lang="less">
  .search_group {
    float: left;
    .ivu-btn,.ivu-input,.ivu-select-selection,.ivu-input-number{
      border-radius: 0;
    }
    .ivu-input,.ivu-select-selection,.ivu-input-number{
      border-left: 0;
      &:hover,&:focus{
        border-color: #dcdee2;
        box-shadow: none;
      }
    }
    .ivu-btn-default{
      margin-right: 0;
      padding-right: 0;
      padding-left: 10px;
      border-left: 0;
      border-right: 0;
      &:hover,&:focus{
        border-color: #dcdee2;
        box-shadow: none;
      }
    }
  }
  .sen-btn{
    float: left;
    .ivu-btn-text{
      &:focus{
        box-shadow: none;
      }
    }
  }
  .sen-form{
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
</style>
