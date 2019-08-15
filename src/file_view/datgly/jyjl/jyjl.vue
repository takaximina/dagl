<template>
  <Card>
    <query-page
      ref="queryPage"
      pageUrl="/archiveborrow/findAllBorrowByAdmin"
      api="FILE"
      :operation="operation"
      noAddBtn
    ></query-page>
    <Modal v-model="showBrow" width="1000" @on-cancel="rowData=[]" :closable="false" @on-ok="rowData=[]">
      <Card title="详细记录">
        <Table :data="rowData" :columns="columns"></Table>
      </Card>
    </Modal>
  </Card>
</template>
<script>
import queryPage from "@/apps/components/query_pages";
import { loadBrowsById } from "./api";
export default {
  components: {
    queryPage
  },
  data() {
    return {
      rowData: [],
      showBrow: false,
      operation: {
        title: "操作",
        width: 160,
        render: (h, params) => {
          return (
            <span style={{ display: "flex", flex: "1 1 100%" }}>
              <Button
                onClick={() => this.showBrows(params.row.id)}
                type="primary"
                size="small"
              >
                详细记录
              </Button>
            </span>
          );
        }
      },
      columns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return (
              <div>
                {
                  params.row.archive.map(item=>{
                    return (<Row class="expand-row">
                              <Col span="4">
                                  <span class="expand-key">材料分类: </span>
                                  <span class="expand-value">{ item.archiveClassNum}</span>
                              </Col>
                              <Col span="8">
                                  <span class="expand-key">材料名称: </span>
                                  <span class="expand-value">{ item.itemName}</span>
                              </Col>
                              <Col span="6">
                                  <span class="expand-key">材料年份: </span>
                                  <span class="expand-value">{item.itemYear}</span>
                              </Col>
                              <Col span="6">
                                  <span class="expand-key">备注: </span>
                                  <span class="expand-value">{ item.remark }</span>
                              </Col>
                          </Row>)
                  })
                }
              </div>
            )
          }
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "出生日期",
          key: "birth"
        },
        {
          title: "职务",
          key: "thePosition"
        }
      ]
    };
  },
  methods: {
    async showBrows(id) {
      let data = await loadBrowsById(id);
      this.rowData = data.map(item => {
        return Object.assign({}, item, {
          archive: this.parseArchive(item.archive)
        });
      });
      this.showBrow = true;
      console.log(data);
    },
    parseArchive(item) {
      let _ = [];
      item
        .filter(data => {
          return data.archiveManItemDTOS.length > 0;
        })
        .map(data => {
          data.archiveManItemDTOS.map(archive => {
            _.push(archive);
          });
        });
      return _;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
