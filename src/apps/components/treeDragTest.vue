<template>
  <div>
    <Tree :data="getTreeData" :render="sel" ref="tree"></Tree>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: "tree",
    data(){
      return {
        saveVal:'',
        originNode:'',
      }
    },
    props:['name'],
    computed:{
      ...mapGetters([
        'getTreeData'
      ])
    },
    watch:{

    },
    methods:{
      sel(h,{root,node,data}){
        if(this.name === 'set'){
          return this.renderContentSet(h,{root,node,data})
        }else if(this.name === 'relation'){
          return this.renderContentPack(h,{root,node,data})
        }else{
          return this.renderContentDel(h,{root,node,data})
        }
      },
      renderContentSet(h,{root,node,data}){ //书本编辑树
        return h('div',{
          class:['hover','clear'],
          style:{display:'inline-block',userSelect:'none'}
        },[
          h('span',{
            style:{fontSize:'16px',cursor:'pointer',float:'left'},
            on:{
              mousedown:(e)=>{
                if($(e.target).attr('contentEditable')){return;}
                if( e.which !== 1 ){return;}
                let sY = e.clientY,sTop,targetNode,cloneNode,hasClone = 1;
                const parentKey = root.find(el => el === node).parent !== 'undefined' ? root.find(el => el === node).parent : '';
                if(parentKey === 0 || parentKey){
                  const parent = root.find(el => el.nodeKey === parentKey).node;
                  const index = parent.children.indexOf(data);
                  targetNode = $(e.target).parent().parent().parent();
                  cloneNode = targetNode.clone().empty().css({'height': targetNode.height() +'px',margin:'8px 0'});
                  sTop = targetNode.position().top;
                  let obj = {sY,targetNode,cloneNode,sTop,hasClone,index,parent};
                  this.dragNode(root,node,data,obj)
                }else{

                }
              }
            }
          },data.title),
          h('div',{ class:['iconShow'],style:{display:'none',marginLeft:'5px',cursor:'pointer',float:'left'} },[
            h('Button',{
              props:{type:'ghost',icon:'ios-plus-empty',size:'small'},
              style:{marginRight:'5px'},
              on:{
                click:()=>{ this.addNode(data) }
              }
            }),
            h('Button',{
              props:{type:'ghost',icon:'ios-compose',size:'small'},
              style:{marginRight:'5px'},
              on:{
                click:(e)=>{ this.changeTitle(e,data) }
              }
            }),
            h('Button',{
              props:{type:'ghost',icon:'ios-close-empty',size:'small'},
              style:{marginRight:'5px'},
              on:{
                click:()=>{ this.deleteNode(root,node,data) }
              }
            })
          ]),
        ])
      },
      addNode(data){ //添加节点
        const children = data.children || [];
        data.expand = true;
        children.push({title:'未定义标题',expand:true});
        this.$set(data, 'children', children);
      },
      changeTitle(e,data){ // 改变标题
        $(e.target).parents('.iconShow').siblings('span').attr('contentEditable','true').focus();
        $(e.target).parents('.iconShow').siblings('span').blur(function(){
          if(!$(this).html()){
            $(this).html( data.title )
          }else{
            data.title = $(this).html()
          }
          $(this).removeAttr('contentEditable')
        });
      },
      deleteNode(root, node, data) { // 删除节点
        if(data.children && data.children.length > 0){
          this.$Modal.error({
            title: '提示',
            content: '存在子目录，无法删除'
          });
          return;
        }
        const parentKey = root.find(el => el === node).parent !== 'undefined' ? root.find(el => el === node).parent : '';
        if(parentKey === 0 || parentKey){
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          parent.children.splice(index, 1);
        }else{
          for(let i=0;i<this.getTreeData.length;i++){
            if(data.id===this.getTreeData[i].id){
              this.getTreeData.splice(i,1);
              break;
            }
          }
        }
      },
      dragNode(root,node,data,obj){ //拖拽节点
        let This = this;
        document.onmousemove = function(e){
          let nY = e.clientY,top,prev,next,scrollTop = obj.targetNode.parents('.TabPane').scrollTop();
          if(obj.hasClone){
            obj.targetNode.before(obj.cloneNode).css({
              'position':'absolute',
              'width':'auto',
            }).appendTo(obj.targetNode.parent());
            obj.hasClone = 0;
          }

          top = obj.sTop + nY - obj.sY ;

          obj.targetNode.css({
            top: top + 'px'
          });

          prev = obj.cloneNode.prev().not('.hover');
          next = obj.cloneNode.next().not( obj.targetNode );

          //向上排序
          if(prev.length && scrollTop + top < prev.position()['top'] + prev.outerHeight()/2){
            obj.cloneNode.after(prev)
          }
          //向下排序
          if(next.length && scrollTop + top > next.position()['top'] + next.outerHeight()/2 - 20){
            obj.cloneNode.before(next)
          }

        };
        document.onmouseup = function(e){
          if( !obj.hasClone ){
            let i = obj.cloneNode.index()-2;
            obj.cloneNode.before(obj.targetNode.removeAttr('style')).remove();

            This.findNode(This.getTreeData,obj.parent);
            if(i - obj.index >= 0) {
              This.originNode.children.splice(i+1,0,This.originNode.children[obj.index]);
              This.originNode.children.splice(obj.index,1)
            }else{
              This.originNode.children.splice(i,0,This.originNode.children[obj.index]);
              This.originNode.children.splice(obj.index + 1,1)
            }

            This.$set(obj.parent,'children',This.originNode.children)

            // obj.parent.children.splice(0,obj.parent.children.length);
            //
            // This.originNode.children.forEach(function(item){
            //     obj.parent.children.push(item)
            // });

            // This.$set(This.getTreeData[0],'children',[])
            // setTimeout(function(){
            //     This.$set(obj.parent,'children',This.originNode.children)
            // },60)
          }
          document.onmousemove = null;
          document.onmouseup = null;
        }
      },
      findNode(root,node){ //递归查找节点
        for(let item of root){
          if(item.id !== node.id){
            if(item.children){
              this.originNode = JSON.parse(JSON.stringify(item.children))
              this.findNode(this.originNode,node)
            }
          }else{
            return this.originNode = JSON.parse(JSON.stringify(item))
          }
        }
      },
      renderContentPack(h,{root,node,data}){ //书本关联树

      },
      renderContentDel(h,{root,node,data}){ // 书本详情树
        return h('div',{
          class:['treeBox'],
          style:{display:'inline-block',width:'100%'},
          on:{click:()=>{}}
        },[
          data.ultima ? h('span',{
            class:[this.publishStatus(data).class],
            style:{marginRight:'5px',padding:'0 5px',color:'#fff',borderRadius:'2px'}
          },this.publishStatus(data).text) : '',
          h('span',{ class:['cite'] },data.title),
          h('span', { class:['treeBadge'] } ,data.count)
        ])
      },
      publishStatus(data){ // 判断书本状态
        let obj = {};
        switch (data.publishStatus){
          case 0:
          case 1:
            obj.class = 'pink';
            obj.text = '录入中';
            break;
          case 2:
            obj.class = 'yellow';
            obj.text = '待校对';
            break;
          case 3:
            obj.class = 'yellow';
            obj.text = '校对中';
            break;
          case 4:
            obj.class = 'green';
            obj.text = '已校对';
            break;
          case 5:
            obj.class = 'green';
            obj.text = '已发布';
            break;
          default:
            obj.text = '未知状态';
            break
        }
        return obj
      },
    },
    mounted(){
      console.log(this.$refs.tree)
    }
  }
</script>

<style scoped>

</style>
