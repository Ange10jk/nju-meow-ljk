const app = getApp();

Page({
  data: {
    cat: {
      status: undefined,
      activity_range: undefined,
      color: undefined,
      location: -1,
      image_id: undefined
    },
    pickers: {
      color: ['橘猫', '狸花', '奶牛', '三花', '纯色', '玳瑁'],
      gender: ['', '公猫', '母猫', '不详'],
      status: ['在校', '已领养', '送医', '失踪', '喵星'],
      activity_range: ['北园 科技馆', '北园 同心之家', '北园 北大楼草坪', '北园 纪念碑附近', '北园 念慈亭附近', '北园 树华楼知行楼', '南园 18舍', '南园 13舍','南园 11舍', '南园 5舍','北园 逸夫馆','北园 健忠楼']
    },
    picker_selected: {},
    tempImageFilePath: '',
    imageUrl: '',
  },

  onLoad: function(options) {
    app.mpServerless.db.collection('catsinfo').find({
      name: options.name,
    }, {}).then(res => {
      this.setData({
        cat: res.result[0],
        classification: res.result[0].classification,
      });
    }).then(res => {
      var picker_selected = {};
      const pickers = this.data.pickers;
      for (const key in pickers) {
        const items = pickers[key];
        const value = this.data.cat[key];
        const idx = items.findIndex((v) => v === value);
        picker_selected[key] = idx === -1 && typeof value === "number" ? value : idx;
      }
      this.setData({
        picker_selected: picker_selected,
      });
    })
  },

  bindDateChange: function(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      ['cat.' + key]: e.detail.value
    })
  },

  bindPickerChange(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      ['cat.' + key]: this.data.pickers[key][e.detail.value]
    });
  },

  upload() {
    for (var i = 0; i < 12; i++) {
      if (this.data.pickers.activity_range[i] === this.data.cat.activity_range) {
        this.setData({
          'cat.location': i
        });
        break;
      }
    }

    wx.showModal({
      title: '提示',
      content: '确定修改吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '更新中...' });

          try {
            if (this.data.tempImageFilePath) {
              const processedImages = await this.processImages(this.data.tempImageFilePath);
              
              await Promise.all([
                app.mpServerless.file.uploadFile({
                  filePath: processedImages.normalImage,
                  cloudPath: `/catimageforindex/${this.data.cat.name}.jpg`,
                }),
                app.mpServerless.file.uploadFile({
                    filePath: processedImages.normalImage,
                    cloudPath: `/catimage(compressed)/${this.data.cat.name}.jpg`,
                  }),
                app.mpServerless.file.uploadFile({
                  filePath: processedImages.mapImage,
                  cloudPath: `/catImageForMap100px/${this.data.cat.name}.png`
                })
              ]);
              this.setData({
                  'cat.image_id':"jpg"
              })
            }
            if(this.data.cat.status!="在校")
                this.setData({
                    'cat.location':-1
                })
            await app.mpServerless.db.collection('catsinfo').updateMany({
              name: this.data.cat.name
            }, {
              $set: {
                gender: this.data.cat.gender,
                color: this.data.cat.color,
                personality: this.data.cat.personality,
                appearance: this.data.cat.appearance,
                more: this.data.cat.more,
                birth: this.data.cat.birth,
                activity_range: this.data.cat.activity_range,
                is_neutured: this.data.cat.is_neutured,
                image_id: this.data.cat.image_id,
                status: this.data.cat.status,
                nickname: this.data.cat.nickname,
                location: this.data.cat.location,
                latitude: this.data.cat.latitude,
                longtitude: this.data.cat.longtitude,
                zindex: this.data.cat.zindex,
                lastEditTime: Date(),
                lastEditAdministrator: app.globalData.admin,
              }
            });

            wx.hideLoading();
            wx.showToast({ icon: 'success', title: '操作成功', duration: 1000 });
            setTimeout(() => wx.switchTab({ url: '/pages/catsindex/catsindex' }), 500);
          } catch (err) {
            console.error('操作失败：', err);
            wx.hideLoading();
            wx.showToast({ icon: 'error', title: '操作失败' });
          }
        }
      }
    });
  },

  inputText(e) {
    this.setData({
      ['cat.' + e.currentTarget.dataset.key]: e.detail.value
    });
  },

  async processImages(filePath) {
    try {
      const [normalImage, mapImage] = await Promise.all([
        this.processNormalImage(filePath),
        this.processMapIcon(filePath)
      ]);
      return { normalImage, mapImage };
    } catch (err) {
      console.error('处理图片失败:', err);
      throw err;
    }
  },

  async processNormalImage(filePath) {
    try {
      return await this.convertToJpg(filePath);
    } catch (err) {
      console.error('处理普通图片失败:', err);
      throw err;
    }
  },

  async convertToJpg(filePath, maxSize = 800) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: filePath,
        success: imgInfo => {
          const query = this.createSelectorQuery();
          query.select('#normalCanvas')
            .fields({ node: true, size: true })
            .exec((res) => {
              const canvas = res[0].node;
              const ctx = canvas.getContext('2d');

              // 计算等比例缩放尺寸
              let targetWidth, targetHeight;
              if (imgInfo.width > imgInfo.height) {
                targetWidth = Math.min(maxSize, imgInfo.width);
                targetHeight = (imgInfo.height / imgInfo.width) * targetWidth;
              } else {
                targetHeight = Math.min(maxSize, imgInfo.height);
                targetWidth = (imgInfo.width / imgInfo.height) * targetHeight;
              }

              canvas.width = targetWidth;
              canvas.height = targetHeight;

              // 填充白色背景
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, targetWidth, targetHeight);

              const img = canvas.createImage();
              img.src = filePath;

              img.onload = () => {
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                wx.canvasToTempFilePath({
                  canvas: canvas,
                  fileType: 'jpg',
                  quality: 0.8,
                  success: res => resolve(res.tempFilePath),
                  fail: reject
                });
              };
              img.onerror = reject;
            });
        },
        fail: reject
      });
    });
  },

  async processMapIcon(filePath) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: filePath,
        success: imgInfo => {
          const minSize = Math.min(imgInfo.width, imgInfo.height);
          const offsetX = (imgInfo.width - minSize) / 2;
          const offsetY = (imgInfo.height - minSize) / 2;

          const query = this.createSelectorQuery();
          query.select('#circleCanvas')
            .fields({ node: true, size: true })
            .exec((res) => {
              const canvas = res[0].node;
              const ctx = canvas.getContext('2d');
              canvas.width = canvas.height = 100;

              const img = canvas.createImage();
              img.src = filePath;

              img.onload = () => {
                ctx.clearRect(0, 0, 100, 100);
                ctx.save();
                ctx.beginPath();
                ctx.arc(50, 50, 50, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(
                  img,
                  offsetX, offsetY, minSize, minSize,
                  0, 0, 100, 100
                );
                ctx.restore();

                wx.canvasToTempFilePath({
                  canvas: canvas,
                  fileType: 'png',
                  quality: 1,
                  success: res => resolve(res.tempFilePath),
                  fail: err => {
                    console.error('导出PNG失败:', err);
                    reject(err);
                  }
                });
              };
              img.onerror = err => {
                console.error('加载图片失败:', err);
                reject(err);
              };
            });
        },
        fail: reject
      });
    });
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success: (res) => {
        const filePath = res.tempFiles[0].tempFilePath;
        this.setData({
          tempImageFilePath: filePath,
          'cat.image_id': filePath.split('.').pop(),
        });
        wx.showToast({ title: "图片选择成功", icon: "success" });
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
        wx.showToast({ title: '图片选择失败', icon: 'error' });
      }
    });
  },

  previewImg: function(e) {
    wx.previewImage({
      current: this.data.tempImageFilePath,
      urls: [this.data.tempImageFilePath]
    })
  }
})