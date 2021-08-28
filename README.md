# 梓琪流 两颗打一颗

# 一、项目介绍

本项目是一款微信小程序，名为“梓琪流 两颗打一颗”。作者来自河北省邢台市广宗县农村，该项目是小时候常跟家人一起玩的一种游戏，科研无聊了所以就把这个小游戏实现了一下。可以扫描下面的二维码来查看小游戏的详细玩法。

+ 该项目前端采用`Taro`作为主要的技术框架，使用`Taro-ui`作为主要的样式。

+ 该项目后端采用`Gin`作为主要的技术框架，未使用数据库。

![](https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210828173702.png)



# 二、项目功能

- [x] 创建游戏房间
- [x] 提前销毁游戏房间
- [x] 进入游戏房间，利用websocket实现棋盘数据更新
- [x] 分享到好友和朋友圈
- [x] 超时销毁游戏房间
- [ ] 游戏结束，倒计时60s确认用户是否继续游戏
- [ ] 对战历史信息
- [ ] 关于小程序、作者



# 三、项目目录

```shell
.
├── client                              // 微信小程序代码
│   ├── babel.config.js
│   ├── config
│   │   ├── dev.js
│   │   ├── index.js
│   │   └── prod.js
│   ├── dist
│   ├── package-lock.json
│   ├── package.json
│   ├── project.config.json
│   ├── project.private.config.json
│   ├── project.tt.json
│   ├── src                             // 主要源代码 
│   │   ├── app.config.js
│   │   ├── app.js
│   │   ├── app.less
│   │   ├── assets
│   │   ├── config
│   │   ├── index.html
│   │   ├── models
│   │   ├── pages
│   │   └── utils
│   └── yarn.lock
└── server                           // 后端代码
    ├── Home                         // 游戏房间相关对象
    │   ├── Handle.go
    │   ├── Home.go
    │   ├── HomeManager.go
    │   ├── chess.go
    │   ├── response.go
    │   └── utils.go
    ├── go.mod
    ├── go.sum
    ├── main.go                      // 启动入门
    └── server                       // 打包好的二进制程序
```



# 四、项目启动

```shell
# 下载项目
git clone https://github.com/zju-zry/6
cd 6
```



## 4.1 后端

因为没有考虑小程序会有很多用户访问，所以后端采用内存来管理游戏房间，某房间长时间未使用会被超时释放。



### 1. 使用GoLang打开`6/server`

![](https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210828180638.png)



### 2. 下载依赖包

> 直接执行 `go run main.go`，会下载相关依赖包。



### 3. 启动项目

```shell
go run main.go
```





## 4.2 微信小程序端



### 1. 安装相关包

```shell
cd client
npm install
```

> 若`npm install`出错，请您自行安装`node`环境，我开发时使用的`node`版本为`v16.4.0`



### 2. 启动项目

```shell
npm run start
```



### 3. 查看启动情况

打开微信小程序IDE`微信开发者工具`，导入小程序项目，打开效果如下。

![](https://zhangruiyuan.oss-cn-hangzhou.aliyuncs.com/picGo/images/20210828180333.png)





# License

[Apache License 2.0](https://github.com/zju-zry/6/blob/main/LICENSE)

