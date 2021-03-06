// pages/message/message.js
Page({

  // 页面的初始数据
  data: {
    userInfo: {},
    msg_list: []
  },

  // 生命周期函数--监听页面显示
  onShow: function () {
    var that = this;
    this.setData({userInfo: JSON.parse(wx.getStorageSync("userInfo"))});
    wx.request({
      url: getApp().globalData.elevatorBackUrl+'message/getMessageListByReceiverAndState?receiverId='+that.data.userInfo.id+'&receiverType=0&page=1&limit=100&status=-1',
      method: "GET",
      data: {},
      success: function (res) {
        //console.log(res)
        //var assign = res.data.data;
        that.setData({ msg_list: res.data.data })
      }
    })
  },

  setStatus: function(e){
    var formData = {
      id: e.target.dataset.id,
      status: 1
    };
    var index = e.target.dataset.index;  // 对应msgList的数组下标
    var that = this;
    //console.log("消息编号："+e.target.dataset.id);
    //console.log("数组下标：" + e.target.dataset.index);
    wx.request({
      url: getApp().globalData.elevatorBackUrl+'message/modifyMessageStatus',
      data: JSON.stringify(formData), 
      method: "POST",
      success: function(res){
        //console.log(res)
        //wx.showToast({title: '成功阅读该条消息！',});
        var list = that.data.msg_list;
        list[index].status = 1;
        that.setData({ msg_list: list });
      }
    })
  },

  mysubstr: function(str,len){
    return str.substr(0,len);
  }
})