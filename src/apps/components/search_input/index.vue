<template>
  <div>
    <Row>
      <div class="search_group">
        <Dropdown @on-click="dropClick" placement="bottom-start">
          <Button type="primary">
            <!--{{ drop || '选择分类' }}-->
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="">自动识别</DropdownItem>
            <DropdownItem name="炸酱面">炸酱面</DropdownItem>
            <DropdownItem name="豆汁儿">豆汁儿</DropdownItem>
            <DropdownItem name="冰糖芦">冰糖芦</DropdownItem>
            <DropdownItem name="北京鸭">北京鸭</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button v-if="drop">{{drop}}：</Button>
        <AutoComplete
          v-model="value"
          :data="data"
          @on-search="autoComp"
          placeholder="选择类别搜索，或者输入关键字搜索"
          style="width:500px">
        </AutoComplete>
        <Button type="primary" icon="ios-search"></Button>
      </div>
      <div style="float: right">
        <Button type="primary" @click="showSenior = !showSenior">{{showSenior ? '普通搜索' : '高级搜索'}}</Button>
      </div>
    </Row>
    <Row v-if="showSenior">
      <div class="brs"></div>
      <Form ref="senFrom" :label-width="130" label-position="left" class="sen-form">
        <Row :gutter="20">
          <Col span="8">
            <FormItem label="实力名称：">
              <Input v-model="value" size="small" placeholder="输入实例名称"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="Input">
              <Input v-model="value" size="small" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="Input">
              <Input v-model="value" size="small" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="实力名称：">
              <Input v-model="value" size="small" placeholder="输入实例名称"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="Input">
              <Input v-model="value" size="small" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="Input">
              <Input v-model="value" size="small" placeholder="Enter something..."></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <div style="float: right">
            <Button :size="'small'" type="primary" @click="senSubmit('senFrom')">提交</Button>
            <Button :size="'small'" @click="senReset('senFrom')" style="margin-left: 8px">清空</Button>
          </div>
        </Row>
      </Form>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "search-input",
    props:{
      dropData: Array,
      autoData: Array
    },
    data(){
      return{
        value: '',
        data:  [],
        drop:  '',
        formData:{},
        showSenior: false
      }
    },
    methods:{
      autoComp(v){
        if(v) this.$emit('no-search',v)
      },
      dropClick(name){
        this.drop = name;
      },
      senSubmit(name){},
      senReset(name){}
    }
  }
</script>

<style lang="less">
  .search_group {
    float: left;
    .ivu-btn,.ivu-input{
      border-radius: 0;
    }
    .ivu-input{
      border-left: 0;
      &:hover,&:focus{
        border-color: #dcdee2;
        box-shadow: none;
      }
    }
    .ivu-btn-default{
      margin-right: 0px;
      padding-right: 0;
      padding-left: 10px;
      border-left: 0;
      border-right: 0;
    }
  }
  .sen-form{
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
</style>
