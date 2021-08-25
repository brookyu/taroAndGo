/**
 * @note:
 * @author: zhangruiyuan
 * @date:2021/8/19
**/
package Home

import (
	"errors"
	"time"
)

// 房间
type Home struct {
	Id    string `json:"id"`
	UserA string `json:"userA"`
	UserB string `json:"userB"`
	Now   string `json:"now"`
	// 消息传递通道
	Ch chan string `json:"-"`
	// 房间超时 <-chan 表示只能接收值
	TimeoutChan <-chan time.Time `json:"-"`
	// 手动关闭
	Stopped chan bool `json:"-"`
	// 需要有序的访问Now参数
	ChNow chan bool `json:"-"`
	Chess *chess    `json:"chess"`
}

// 判断是不是当前用户在置棋
func (h *Home) IfNow(user string) bool {
	h.ChNow <- true
	ans := h.Now == user
	<- h.ChNow
	return ans
}

// 加入房间
func (h *Home) JoinHome(userB string)*Home{
	h.UserB = userB
	return h
}

// 放棋子
func (h *Home)PutPiece(hd Handle,movP,advP int) (bool,error) {
	// 1. 置棋
	if h.Now == hd.User{
		if err := h.Chess.movePieces(hd.StartX, hd.StartY, hd.EndX, hd.EndY,movP);err !=nil{
			return false, err
		}
		if hd.User == h.UserA{
			h.Now = h.UserB
		}else{
			h.Now = h.UserA
		}
	}else{
		return false, errors.New("不该您置棋")
	}

	// 2. 消棋
	h.Chess.clear(movP,advP,hd.EndX,hd.EndY)

	// 3. 判断输赢
	return h.Chess.Judge(advP), nil
}