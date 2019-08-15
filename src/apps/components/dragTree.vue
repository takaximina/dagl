<template>
  <div>
    <Tree id="trees" :data="getTreeData" :render="renderContent" ref="tree"></Tree>
  </div>

</template>

<script>
  // v-draggable="buttonOptions"
  /*buttonOptions: {
    trigger: '#button', // 设置能触发拖动的元素的CSS选择器
      body: '#button' // 设置需要移动的元素的CSS选择器
  }*/
  export default {
    data () {
      return {
        treeOptions: {
          trigger: '#trees', // 设置能触发拖动的元素的CSS选择器
          body: '#trees' // 设置需要移动的元素的CSS选择器
        },
        getTreeData: [
          {
            title: 'parent 1',
            expand: true,
            children: [
              {
                title: 'child 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1',
                    expand: true
                  }
                ]
              }
            ]
          }
        ],
        buttonProps: {
          type: 'default',
          size: 'small',
        }
      }
    },
    methods: {
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          },
          class:['tree-draggable'],
          /*directives:{
            name: 'draggable',
            binding:{
              trigger: '.tree-draggable', // 设置能触发拖动的元素的CSS选择器
              body: '#trees'
            }
          }*/
          directives: [
            {
              name: 'draggable',
              value: {
                trigger: '#trees', // 设置能触发拖动的元素的CSS选择器
                body: '.tree-draggable'
              },
              //expression: '1 + 1',
              //arg:  '',
              /*modifiers: {
                bar: true
              }*/
            }
          ],
        }, [
          h('span',[
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          }, [
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-add'
              }),
              style: {
                marginRight: '8px'
              },
              on: {
                mousedown: () => {

                }
              }
            })
          ])
        ]);
      }
    },
    mounted(){
      console.log(this.$refs.tree);
    }
  }
</script>

<style scoped>

</style>
