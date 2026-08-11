const app=getApp();
Page({
  data: {
      verify0:1,
    longitude: 118.7795137589178,  // 南京大学鼓楼校区大致经度
    latitude: 32.05490812590618,    // 南京大学鼓楼校区大致纬度
    scale: 16,
    polygons: [],         // 校区边界多边形
    markers: [],           // 猫咪活动区域标记
    //ljk
    cats: [],//
    location_a: [
      { latitude: 32.05480, longitude: 118.78135 },  // 科技馆
      { latitude: 32.05528, longitude: 118.78075 },  // 同心之家
      { latitude: 32.05624, longitude: 118.78079 },  // 北大楼草坪
      { latitude: 32.05619, longitude: 118.78005 },  // 纪念碑
      { latitude: 32.05551, longitude: 118.77909 },  // 念慈亭
      { latitude: 32.05499, longitude: 118.779412 },  // 树华楼
      { latitude: 32.05330, longitude: 118.78125 },  // 18舍
      { latitude: 32.05266, longitude: 118.77961 },  // 13舍
      { latitude: 32.05104, longitude: 118.78230 },  // 8舍(即11舍)
      { latitude: 32.05302, longitude: 118.78197 },   // 5舍
      { latitude: 32.056343, longitude: 118.777722  },  // 逸夫馆
      { latitude: 32.05543,  longitude:118.778179  }  // 健忠楼
    ],//猫咪活动区域左下角
    location_b: [
      { latitude: 32.05479, longitude: 118.78160 },
      { latitude: 32.05528, longitude: 118.780760 },
      { latitude: 32.05636, longitude: 118.78139 },
      { latitude: 32.05625, longitude: 118.78038 },
      { latitude: 32.05555, longitude: 118.77929 },
      { latitude: 32.05504, longitude: 118.77964 }, // 树华楼
      { latitude: 32.05336, longitude: 118.78162 },//18舍
      { latitude: 32.05271, longitude: 118.78008 },//13舍
      { latitude: 32.05108, longitude: 118.78275 },
      { latitude: 32.05305, longitude: 118.78236 },
      { latitude: 32.056338, longitude: 118.777974 },  // 逸夫馆
      { latitude: 32.055415, longitude:118.778372  }  // 健忠楼
    ],//右下角
    location_c: [
      { latitude: 32.05514, longitude: 118.78135 },
      { latitude: 32.05551, longitude: 118.78075 },
      { latitude: 32.05676, longitude: 118.78074 },
      { latitude: 32.05657, longitude: 118.78001 },
      { latitude: 32.05566, longitude: 118.77907 },
      { latitude: 32.05529, longitude: 118.77935 },// 树华楼
      { latitude: 32.05346, longitude: 118.78123 },//18舍
      { latitude: 32.05281, longitude: 118.77956 },//13舍
      { latitude: 32.05119, longitude: 118.78230 },
      { latitude: 32.05314, longitude: 118.78202 },
      { latitude: 32.056681, longitude:118.777681 },  // 逸夫馆
      { latitude: 32.055608,  longitude:118.778161  }  // 健忠楼
    ]//左上角
  },
  /*ljk - start*/
  async fetchCats() {
    try {
    const res = await app.mpServerless.db.collection('catsinfo').find(
        {}, // 查询条件，{} 表示查询全部 //catinfo
        {
          projection: {
            name: 1,
            image_id: 1,
            location: 1,
            latitude: 1,
            longtitude: 1
          }
        }
      );
      const cats=res.result || [];
      this.setData({
        cats
      });
    } catch (e) {
      const { errCode, cannotGetData } = e;
      console.error('Error fetching cats:', e);
    }
  },
  setBoundry() {
    this.setData({
      polygons: [{
        points: [
          // 北部边界
          { latitude: 32.059001306927684, longitude: 118.77473273859346 },
          { latitude: 32.05884039650903, longitude: 118.77902207934085 },
          { latitude: 32.05857923350113, longitude: 118.77902975546067 },
          { latitude: 32.05848442263577, longitude: 118.77919963270756 },
          { latitude: 32.058286021779196, longitude: 118.77923692283332 },
          { latitude: 32.05824124414315, longitude: 118.77975847424341 },
          { latitude: 32.05804931345602, longitude: 118.7798117599342 },
          { latitude: 32.05802673334759, longitude: 118.78017587893612 },
          { latitude: 32.05744341191367, longitude: 118.78033573605853 },
          { latitude: 32.05751587185224, longitude: 118.78083370401203 },
          { latitude: 32.05792231527734, longitude: 118.78104684677453 },
          { latitude: 32.05798917693652, longitude: 118.78162121525304 },
          { latitude: 32.05798917693652, longitude: 118.78162121525304 },
          // 东部边界
          { latitude: 32.056677605861246, longitude: 118.7819923011914 },
          { latitude: 32.05272542197961, longitude: 118.78287805623688 },
          { latitude: 32.051455494210074, longitude: 118.78322296302031 },
          { latitude: 32.05042129297751, longitude: 118.78343161730697 },
          // 南部边界
          { latitude: 32.050331062349535, longitude: 118.7826669678642 },
          { latitude: 32.05019532818218, longitude: 118.78143138807718 },
          { latitude: 32.05016227196131, longitude: 118.78085857736755 },
          { latitude: 32.05017506214157, longitude: 118.78019086484505 },//左下角
          // 西部边界
          { latitude: 32.05139998449951, longitude: 118.7801493980586 },
          { latitude: 32.051800005572645, longitude: 118.78001807238593 },
          { latitude: 32.05182785794871, longitude: 118.77980775864557 },
          { latitude: 32.05242946692355, longitude: 118.7795251498161 },
          { latitude: 32.053696177242315, longitude: 118.77920307533668 },
          { latitude: 32.05365569276813, longitude: 118.77819385050748 },
          { latitude: 32.05390079936595, longitude: 118.77816721422846 },
          { latitude: 32.05444718617735, longitude: 118.77577149261083 },
          { latitude: 32.055600596494656, longitude: 118.7757156756262 },
          { latitude: 32.055661871903425, longitude: 118.77600486971824 },
          { latitude: 32.05667974869793, longitude: 118.77597179582074 },
          { latitude: 32.05667007375086, longitude: 118.77546570610161 },
          { latitude: 32.05695709693424, longitude: 118.7754428750593 },
          { latitude: 32.05696858763133, longitude: 118.77588215563219 },
          { latitude: 32.057685938253016, longitude: 118.77596799074331 },
          { latitude: 32.057721343361344, longitude: 118.77450234017988 },
        ],
        strokeWidth: 3,
        strokeColor: '#FF0000',
        fillColor: '#00FF0022'
      }]
    });
  },
  setMarkers() {
    for (var i = 0; i<this.data.cats.length; i++) {
      const cat = this.data.cats[i];
      const loc = cat.location ; // 如果location不存在，默认使用-1
      if (loc < 0 || loc >= this.data.location_a.length) {
        continue;
      }
      this.data.markers.push({
        id:i,
        latitude: this.data.location_a[loc].latitude + cat.latitude * (this.data.location_c[loc].latitude - this.data.location_a[loc].latitude),
        longitude: this.data.location_a[loc].longitude + cat.longtitude * (this.data.location_b[loc].longitude - this.data.location_a[loc].longitude),
        iconPath: `https://你的CDN域名/catImageForMap100px/${cat.name}.png`,
        width: 44,
        height: 44,
        title:`${cat.name}`,
        callout: {
          content: `${cat.name}`, // 气泡文字
          display: 'ALWAYS', // 常显
          padding: 4,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: '#444',
        },
      });
    }
    // Update markers in data
    this.setData({
      markers: this.data.markers
    });

    // 验证所有图片是否可加载（真机有效）
    this._checkAllImages();
  },
  /**
 * 验证所有标记的图片URL是否有效
 */
_checkAllImages() {
    this.data.markers.forEach((marker, index) => {
      wx.getImageInfo({
        src: marker.iconPath,
        success: () => {
        },
        fail: (err) => {
          console.error(`图片加载失败: ${marker.iconPath}`, err);
          // 自动替换为备用图片
          this.data.markers[index].iconPath = '/images/icon_circle.png';
          this.setData({ markers: this.data.markers });
        }
      });
    });
  },
  onLoad: function () {
    this.fetchCats().then(() => {
      this.setBoundry();
      this.setMarkers();
    });
    this.mapContext = wx.createMapContext('map');
  },
  regionChange: function (e) {
  },
  onMarkerTap: function(e){
    const catName = this.data.cats[e.detail.markerId].name;
      wx.navigateTo({
        url: `/pages/catdetail/catdetail?name=${catName}`,
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
