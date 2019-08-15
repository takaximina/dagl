<template>
  <div>
    <div class="opt-btn-right">
      <Checkbox @on-change="changeReplace" :disabled="isReadonly">商品更换</Checkbox>
      <RadioGroup @on-change="sltRle" v-if="showReplace" v-model="data.replacePriceEnum" :disabled="isReadonly">
        <Radio :disabled="isReadonly" v-for="v in replaceEnum" :label="v.name">{{v.label}}</Radio>
      </RadioGroup>
    </div>
    <div class="opt-btn-right">
      <Checkbox @on-change="changeNum" :disabled="isReadonly">商品增减</Checkbox>
      <RadioGroup @on-change="sltNum" v-if="showChange" v-model="data.changePriceEnum" :disabled="isReadonly">
        <Radio v-for="v in addOrDescEnum" :label="v.name" :disabled="isReadonly">{{v.label}}</Radio>
      </RadioGroup>
      <span v-if="showChange">
        最小值：
        <InputNumber @on-change="changeMin" :min="1" :step="1" size="small" style="width: 40px" :disabled="isReadonly"></InputNumber>
        最大值：
        <InputNumber @on-change="changeMax" :min="1" :step="1" size="small" style="width: 40px" :disabled="isReadonly"></InputNumber>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "add-btn-right",
    props: {
      data: Object,
      replaceEnum: Array,
      addOrDescEnum: Array,
      isReadonly: Boolean,
    },
    data(){
      return {
        showReplace: false,
        showChange: false,
      }
    },
    methods: {
      changeReplace(val){
        this.showReplace = val;
        this.$emit('changeReplace', val);
      },
      sltRle(val){
        this.$emit('sltRle', val);
      },
      changeNum(val){
        this.showChange = val;
        this.$emit('changeNum', val);
      },
      sltNum(val){
        this.$emit('sltNum', val);
      },
      changeMin(val){
        this.$emit('changeMin', val);
      },
      changeMax(val){
        this.$emit('changeMax', val);
      }
    }
  }
</script>

<style scoped>
  .opt-btn-right{
    line-height: 30px;
  }
</style>
