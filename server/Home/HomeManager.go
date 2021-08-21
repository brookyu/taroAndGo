/**
 * @note:
 * @author: zhangruiyuan
 * @date:2021/8/19
**/
package Home

import (
	"errors"
	"strconv"
	"time"
)

// 房间管理器
type HomeManager struct {
	Homes []*Home
}

func NewHomeManager() *HomeManager{
	return &HomeManager{

	}
}

// 添加一个房间，并将这个房间的信息返回回去
func (hm *HomeManager) AddHome(userA string) *Home {
	nh := &Home{
		Id:    strconv.FormatInt(time.Now().UnixNano()/1e6, 10),
		UserA: userA,
		Now: userA,
		Chess: NewChess(),
		Ch: make(chan string,1),
		TimeoutChan: afterTime(time.Second * 60 * 60),
		Stopped: make(chan bool,1),
		ChNow: make(chan bool,1),
	}
	hm.Homes = append(hm.Homes, nh)
	return nh
}

// 获取房间信息
func (hm * HomeManager) GetHome (id string) * Home {
	for i:=0;i<len(hm.Homes);i++ {
		if id == hm.Homes[i].Id{
			return hm.Homes[i]
		}
	}
	return nil
}

// 销毁房间信息
func (hm* HomeManager) DeleteHome(id string) error{
	for i:=0;i<len(hm.Homes);i++ {
		if id == hm.Homes[i].Id{
			hm.Homes = append(hm.Homes[0:i],hm.Homes[i+1:]...)
			return nil
		}
	}
	return errors.New("未找到该房间或该房间已经被销毁")
}