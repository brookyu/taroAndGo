export default {
  pages: [
    'pages/index/index',
    'pages/createHome/index',
    'pages/mine/index',
    'pages/myHome/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "tabBar": {
    color: '#a1a7b3',
    selectedColor: '#1492ff',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/createHome/index',
        text: '创建游戏',
        iconPath: 'assets/create.png',
        selectedIconPath: 'assets/create_blue.png',
      },
      {
        pagePath: 'pages/myHome/index',
        text: '游戏中',
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home_blue.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的信息',
        iconPath: 'assets/mine.png',
        selectedIconPath: 'assets/mine_blue.png',
      },
    ],
  },
}
