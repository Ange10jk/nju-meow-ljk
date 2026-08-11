import * as echarts from '../../utils/ec-canvas/echarts';

let chart = null;

function initChart(canvas, width, height, dpr) {
    try {
        chart = echarts.init(canvas, null, {
            width: width,
            height: height,
            devicePixelRatio: dpr
        });
        canvas.setChart(chart);

        var option = {
            title: {
                text: '部分猫咪关系图（点击猫咪头像跳转详情页）'
            },
            tooltip: {},
            series: [{
                type: 'graph',
                layout: 'force',
                roam: true,
                // draggable: true,
                label: {
                    show: true,
                    color: "#000",
                    offset: [0, 30]
                },
                force: {
                    edgeLength: 70,
                    gravity: 0.1,
                    repulsion: 200,
                    adaptiveWeight: true
                },
                symbolSize: 45,
                symbolKeepAspect: true,
                symbol: 'roundRect',
                data: [{
                        name: '月饼',
                        symbol: 'image:///images/月饼大.jpeg',
                        fixed:true,
                        x:50,
                        y:50
                    },
                    {
                        name: '哪吒',
                        fixed:true,
                        symbol:`image:///images/哪吒.jpeg`,
                        x:175,
                        y:100
                    },
                    {
                        name: '大花',
                        symbol:'image:///images/大花.jpeg'
                    },
                    {
                        name: '木吒',
                        symbol:'image:///images/木吒.jpeg',
                        fixed:true,
                        x:300,
                        y:200
                    },
                    {
                        name: '独眼猫妈',
                        symbol:'image:///images/独眼猫妈.jpeg',
                        fixed:true,
                        x:300,
                        y:50
                    },
                    {
                        name: '金吒',
                        symbol:'image:///images/金吒.jpeg',
                        fixed:true,
                        x:350,
                        y:150
                    },
                    {
                        name: '娜扎',
                        symbol:'image:///images/娜扎.jpeg',
                    },
                    {
                        name: '小狸',
                        symbol:'image:///images/小狸.jpeg'
                    },
                    {
                      name: '大老鼠',
                      symbol:'image:///images/大老鼠.jpg',
                      fixed: true,
                      x:40,
                      y:325
                    },
                    {
                      name: '橘咪',
                      symbol:'image:///images/橘咪.jpg',
                      fixed: true,
                      x:50,
                      y:400
                    },
                    {
                        name: '建国',
                        symbol:'image:///images/建国.jpg',
                        fixed: true,
                        x:100,
                        y:475
                    },
                    {
                        name: '翠花',
                        symbol:'image:///images/翠花.jpeg',
                        fixed: true,
                        x:150,
                        y:400
                    },
                    {
                        name: '草叶',
                        symbol:'image:///images/草叶.jpeg',
                        fixed: true,
                        x:200,
                        y:550
                    },
                    {
                        name: '草花',
                        symbol:'image:///images/草花.jpeg',
                        fixed: true,
                        x:250,
                        y:475
                    },
                    {
                        name: '小草',
                        symbol:'image:///images/小草.jpeg',
                        fixed: true,
                        x:230,
                        y:375
                    },
                    {
                        name: '草芽',
                        symbol:'image:///images/草芽.jpeg',
                        fixed: true,
                        x:350,
                        y:475
                    },
                    
                ],
                links: [{
                        source: '月饼',
                        target: '大花',
                        label: {
                            formatter: '打架',
                            show: true
                        },
                        symbol: ['arrow', 'arrow'] //有向边
                    },
                    {
                        source: '月饼',
                        target: '哪吒',
                        label: {
                            formatter: '好朋友',
                            show: true
                        },
                    },
                    {
                        source: '独眼猫妈',
                        target: '哪吒',
                        label: {
                            formatter: '母女',
                            show: true
                        },
                        symbol: [,'arrow']
                    },
                    {
                        source: '独眼猫妈',
                        target: '木吒',
                        label: {
                            formatter: '母女',
                            show: true
                        },
                        symbol: [,'arrow']
                    },
                    {
                        source: '独眼猫妈',
                        target: '金吒',
                        label: {
                            formatter: '母女',
                            show: true
                        },
                        symbol: [,'arrow']
                    },
                    {
                        source: '独眼猫妈',
                        target: '娜扎',
                        label:{
                            formatter:'母女',
                            show:true
                        },
                        symbol:[,'arrow']
                    },
                    {
                        source: '娜扎',
                        target: '小狸',
                        label:{
                            formatter:'母女',
                            show:true
                        },
                        symbol:[,'arrow']    
                    },{
                        source: '大老鼠',
                        target:'橘咪',
                        value:10,
                        label:{
                            formatter:'父子',
                            show:true
                        },
                        symbol: [,"arrow"],
                    },{
                        source: '翠花',
                        target: '橘咪',
                        value:10,
                        label:{
                            formatter:'伴侣',
                            show:true
                        },
                        symbol: ['arrow',"arrow"],
                    },{
                        source: '橘咪',
                        target: '建国',
                        value:10,
                        label:{
                            formatter:'父子',
                            show:true
                        },
                        symbol: [,"arrow"],
                    },{
                        source: '翠花',
                        target: '建国',
                        value:10,
                        label:{
                            formatter:'母子',
                            show:true
                        },
                        symbol: [,"arrow"],
                    },{
                        source: '小草',
                        target: '草花',
                        value:10,
                        label:{
                            formatter:'母女',
                            show:true
                        },
                        symbol: [,"arrow"],
                    },{
                        source: '小草',
                        target: '草芽',
                        value:10,
                        label:{
                            formatter:'母女',
                            show:true
                        },
                        symbol: [,"arrow"],
                    },{
                        source: '小草',
                        target: '草叶',
                        value:10,
                        label:{
                            formatter:'母女',
                            show:true
                        },
                        symbol: [,"arrow"],
                    },{
                        source: '建国',
                        target: '草花',
                        value:10,
                        label:{
                            formatter:'好朋友',
                            show:true
                        },
                        symbol: ["arrow","arrow"],
                    },{
                        source: '建国',
                        target: '草叶',
                        value:10,
                        label:{
                            formatter:'好朋友',
                            show:true
                        },
                        symbol: ["arrow","arrow"],
                    },{
                        source: '草花',
                        target: '草叶',
                        value:10,
                        label:{
                            formatter:'好朋友',
                            show:true
                        },
                        symbol: ["arrow","arrow"],
                    }
                ],
                lineStyle: {
                    curveness: 0,
                    opacity: 1,
                    width: 3
                }
            }]
        };

        chart.setOption(option);

        // 直接在初始化函数内绑定事件
        chart.on('click', function (params) {
            if (params.componentType === 'series' && params.dataType === 'node') {
                const catName = params.data.name;

                wx.navigateTo({
                    url: `/pages/catdetail/catdetail?name=${catName}`
                });
            }
        });

        return chart;
    } catch (error) {
        console.error('图表初始化失败:', error);
        throw error;
    }
}

Page({
    data: {
        verify0:1,
        ec: {
            onInit: initChart,
            // 移除 onEvents，改用内部绑定
        }
    },

    onReady() {
    },

    onLoad(){
        wx.cloud.database().collection('Verify').where({
            VerifyContent: 1,
          }, {}).get()
          .then(res => {
            if (res.data[0].VerifyContent) {
              this.setData({
                verify1: 0,
                verify2: 1,
                verify0: 0,
              });
    
            }
          })
          .catch(res => {
            if (this.data.verify0) {
              this.setData({
                verify1: 1,
                verify2: 0,
              });
            }
          });
    },
    onShareAppMessage() {
        return {
          title: '南雍猫札',
          path: '/pages/catsindex/catsindex',
          imageUrl:'/images/icon.jpg'
        };
      },
      onShareTimeline() {
          return {
            title: '南雍猫札',  
            query: '/pages/catsindex/catsindex', 
            imageUrl: '/images/icon.jpg' 
          }
        }
});