<template>
  <div>
    <div class="network-box" v-bind:style="{height: height || '300px'}">
      <div id="mynetwork" v-bind:style="{height: height || '300px'}"></div>
      <div class="network-box-spin" v-if="isLoading" v-bind:style="{height: height || '300px'}">
        <Spin fix>
          <Icon type="ios-loading" size=30 class="demo-spin-icon-load"></Icon>
        </Spin>
      </div>
    </div>
    <!--<button @click="fit">[]</button>-->
  </div>
</template>

<script>
  import vis from 'vis'

  import { forEach } from "@/libs/tools";

  export default {
    name: "visComponents",
    props: {
      data: Object,
      height: String
    },
    data(){
      return{
        timeOut: 1000,
        edges: '',
        nodes: '',
        network: '',
        options: '',
        container: '',
        isLoading: true,
      }
    },
    mounted(){
      this.init()
    },
    watch: {
      data(){
        this.init()
      }
    },
    methods: {
      init(){
        this.isLoading = true;
        this.createNetwork();
        this.bindEvent();
      },
      createNetwork(){
        if( this.network ){
          this.network.destroy();
        }
        this.options = {
          nodes: {
            physics: false,
            // fixed: true,
            shadow: {
              enabled: true,
              color: '#666',
            }
          },
          edges: {
            selectionWidth: .5,
            smooth: false,
            arrows: {
              to: {
                enabled: true,
                scaleFactor: .3,
                type: 'arrow'
              },
            },
            color: {
              color: '#001529',
              highlight: '#003d70'
            },
          }
        };
        this.container = document.getElementById('mynetwork');
        this.nodes = new vis.DataSet( this.createNodes() );
        this.edges = new vis.DataSet( this.data.edges );
        this.network = new vis.Network(this.container, {
          nodes: this.nodes,
          edges: this.edges
        }, {
          layout: {
            hierarchical: {
              enabled: true,
              direction: 'LR',
              levelSeparation: 100,
              nodeSpacing: 55
            }
          },
          physics: {enabled: false},
          interaction: {
            dragView: false, dragNodes: false, zoomView: false
          }
        });
        this.network.setOptions( this.options );
        setTimeout(function () {
          this.fit();
          this.isLoading = false;
        }.bind(this), this.timeOut)
      },
      createNodes(){
        let nodes = [];
        forEach(this.data.nodes, function (v, i) {
          let inner = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <foreignObject x="0" y="0" width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="display: table;width: 100px;height: 100px;font-size: 14px;background: #001529;color: #fff;border-radius: 10px;">
                <div style="display: table-cell;vertical-align: middle;text-align: center;">
                  <div style="padding: 0 10px;width: 100px;font-size: 16px;word-wrap:break-word; word-break:break-all;box-sizing: border-box">
                    ${ v.name }
                  </div>
                  <div style="padding: 0 10px;width: 100px;font-size: 12px;word-wrap:break-word; word-break:break-all;box-sizing: border-box">${v.remark || ''}</div>
                </div>
              </div>
            </foreignObject>
          </svg>`;
          let url = "data:image/svg+xml;charset=utf-8,"+ encodeURIComponent(inner);
          let node = {
            id: v.id, name: v.name, remark: v.remark, image: url, shape: 'image', level: v.level,
            // x: 100* v.level, y: 0,
          };
          nodes.push(node);
        });
        return nodes;
      },
      bindEvent(){
        this.network.on('selectNode', function ( node ) {
          this.nodes.update( this.sltNode( this.nodes.get( node.nodes )[0] ) )
        }.bind(this) );
        this.network.on('deselectNode', function ( node ) {
          if( !node.previousSelection.nodes || !node.previousSelection.nodes.length ) return false;
          this.nodes.update( this.dstNode( this.nodes.get( node.previousSelection.nodes )[0] ) )
        }.bind(this) );
        /*this.network.on('dragEnd', function ( node ) {
          this.nodes.update( this.dstNode( this.nodes.get( node.previousSelection.nodes )[0] ) )
        }.bind(this) );*/
      },
      sltNode( node ){
        let sltNode = node;
        let inner = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <foreignObject x="0" y="0" width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="display: table;width: 100px;height: 100px;font-size: 14px;background: #003d70;color: #fff;border-radius: 10px;">
                <div style="display: table-cell;vertical-align: middle;text-align: center;">
                  <div style="padding: 0 10px;width: 100px;font-size: 16px;word-wrap:break-word; word-break:break-all;box-sizing: border-box">
                    ${ node.name }
                  </div>
                  <div style="padding: 0 10px;width: 100px;font-size: 12px;word-wrap:break-word; word-break:break-all;box-sizing: border-box">${node.remark || ''}</div>
                </div>
              </div>
            </foreignObject>
          </svg>`;
        sltNode.image = "data:image/svg+xml;charset=utf-8,"+ encodeURIComponent(inner);
        return sltNode;
      },
      dstNode( node, isAdd ){
        let dstNode = node;
        let inner = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
            <foreignObject x="0" y="0" width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="display: table;width: 100px;height: 100px;font-size: 14px;background: #001529;color: #fff;border-radius: 10px;">
                <div style="display: table-cell;vertical-align: middle;text-align: center;">
                  <div style="padding: 0 10px;width: 100px;font-size: 16px;word-wrap:break-word; word-break:break-all;box-sizing: border-box">
                    ${ node.name }
                  </div>
                  <div style="padding: 0 10px;width: 100px;font-size: 12px;word-wrap:break-word; word-break:break-all;box-sizing: border-box">${node.remark || ''}</div>
                </div>
              </div>
            </foreignObject>
          </svg>`;
        dstNode.image = "data:image/svg+xml;charset=utf-8,"+ encodeURIComponent(inner);
        if(isAdd){
          let pos = this.network.DOMtoCanvas({x: 0,y: 60});
          dstNode.x = dstNode.level* 100;
          dstNode.y = pos.y;
          dstNode.shape = 'image';
        }
        return dstNode;
      },
      fit(){
        this.network.moveTo({
          scale: 1.6,
          animation: {
            duration: 0,
          }
        });
      },
      redraw(){
        this.network.redraw();
      },
      addNode(node){
        let newNode =  this.dstNode( node, 1 );
        this.nodes.add( newNode );
      },
      delNode(node){
        this.nodes.remove(node.id)
      },
      updNode(node){
        this.nodes.update(node)
      },

      addEdge(){},
      delEdge(){},
      updEdge(){},
    }
  }
</script>

<style lang="less">
  .network-box{
    position: relative;
  }
  #mynetwork{
    border: 1px solid #dcdee2;
    background: #fff;
  }
  .network-box-spin{
    position: absolute;top: 0;bottom: 0;right:0;left: 0;background: #fff
  }
  .network-box-spin .ivu-spin-fix{
    background: #fff;
  }

  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
