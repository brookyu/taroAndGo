/**
 * @note:
 * @author: zhangruiyuan
 * @date:2021/8/19
**/
package main

import (
	"6/Home"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
)


var upGrader = websocket.Upgrader{
	CheckOrigin: func (r *http.Request) bool {
		return true
	},
}

//webSocket请求ping 返回pong
func ping(c *gin.Context) {
	//升级get请求为webSocket协议
	ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer ws.Close()
	for {
		//读取ws中的数据
		mt, message, err := ws.ReadMessage()
		if err != nil {
			break
		}
		if string(message) == "ping" {
			message = []byte("pong")
		}
		//写入ws数据
		err = ws.WriteMessage(mt, message)
		if err != nil {
			break
		}
	}
}

// 全局房间管理器
var hm = Home.NewHomeManager()

// 创建房间
func createHome(c *gin.Context)  {
	user := c.Query("user")
	h := hm.AddHome(user)
	c.JSON(http.StatusOK,Home.Response{
		Status: http.StatusOK,
		Msg:    "创建房间成功",
		Data:   h,
	})
}

// 加入房间
func joinHome(c *gin.Context){
	id := c.Query("id")
	user := c.Query("user")
	h := hm.GetHome(id)
	h = h.JoinHome(user)
	c.JSON(http.StatusOK,Home.Response{
		Status: http.StatusOK,
		Msg:    "加入房间成功",
		Data:   h,
	})
}

// 进入房间
func visitHome(c *gin.Context){
	user := c.Query("user")
	id := c.Query("id")
	h := hm.GetHome(id)
	if h ==  nil{
		return
	}

	ws ,err := upGrader.Upgrade(c.Writer,c.Request,nil)
	if err != nil {
		return
	}
	defer ws.Close()

	fmt.Println("用户"+user+" 进入房间"+id)
	// 告知加入房间的用户棋盘信息
	if err := ws.WriteJSON(Home.Response{Status: http.StatusOK, Msg: user+"用户进入房间，获取最新的棋盘信息",Data: h});err!=nil{
		return
	}

	ifEnd := false
	for {
		if ifEnd {
			break
		}

		select {
		case <-h.TimeoutChan:
			// 超时销毁房间
			_ = hm.DeleteHome(id)
			_ = ws.WriteJSON(Home.Response{
				Status: http.StatusOK,
				Msg: "超时销毁房间",
			})
			ifEnd = true
			break

		case <-h.Stopped:
			// 手动销毁房间
			_ = hm.DeleteHome(id)
			_ = ws.WriteJSON(Home.Response{
				Status: http.StatusOK,
				Msg: "手动销毁房间",
			})
			ifEnd = true
			break

		default:

			if user == h.Now {
				// 某用户突然成为置棋用户的时候，可以立即获取最新的棋盘数据
				// 用户成为置棋用户的时候，棋盘的数据已经是可以下载的，但是不要多次重复下载
				if err := ws.WriteJSON(Home.Response{Status: http.StatusOK, Msg: "轮到"+user+"用户置棋，获取最新的棋盘信息",Data: h});err!=nil{
					ifEnd = true
					break
				}

				// 若加入房间的用户是正在进行的用户
				var msg Home.Handle

				// 等待客户端提交移动数据，这里会卡死
				fmt.Println("正在等待用户"+user+"上传置棋操作")
				if err := ws.ReadJSON(&msg); err == nil{

					var movP, advP int
					if user == h.UserA{
						movP = 1
						advP = 2
					}else{
						movP = 2
						advP = 1
					}

					if win,err := h.PutPiece(msg,movP,advP); err == nil{

						msg := "成功移动棋子，返回最新数据"
						if win {
							msg = "获胜啦"
						}

						if err := ws.WriteJSON(Home.Response{Status: http.StatusOK, Msg: msg, Data: h}); err == nil{
							break
						}else{
							// 只有这里是返回不了客户端数据是致命错误需要跳出循环，其他err都无须关心
							ifEnd = true
						}

					}
				}
				// 能进入到这里的说明提交出现问题
				_ = ws.WriteJSON(Home.FailResponse("您的置棋出现问题",h))
			}
			break
		}
	}
}

// 手动销毁房间
func deleteHome(c *gin.Context)  {
	id := c.Query("id")
	if err := hm.DeleteHome(id);err ==nil{
		c.JSON(http.StatusOK, "")
	}else{
		c.JSON(http.StatusBadRequest, "")
	}
}



func main() {
	bindAddress := "localhost:2303"
	r := gin.Default()
	r.GET("/create", createHome)
	r.GET("/join",joinHome)
	r.GET("/visit", visitHome)
	r.GET("/delete", deleteHome)
	_ = r.Run(bindAddress)

}