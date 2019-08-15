<template>
  <Card>
    <b style="font-size: 18px;color: #17233d;">会计月：</b>
    <span style="color: #2b85e4;"> {{begin}} 至 {{end}} </span>
    <div class="brs"></div>
    <Button type="primary" size="large" @click="carryOver">结转</Button>
  </Card>
</template>

<script>
  import { carryOver, queryNextAccountMonth } from "@/api/store/qcInStore";

  export default {
    name: "checkOut",
    data(){
      return {
        begin: '',
        end: '',
        accountMonth: 0
      }
    },
    mounted(){
      queryNextAccountMonth().then( res => {
        this.begin = res.beginDate;
        this.end = res.endDate;
        this.accountMonth = res.accountMonth;
      })
    },
    methods: {
      carryOver(){
        carryOver( this.accountMonth ).then( res => {

        })
      }
    }
  }
</script>

<style scoped>

</style>
