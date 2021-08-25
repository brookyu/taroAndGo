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


// 用户状态信息
type State struct {
	State string `json:"state"`
	Home *Home	`json:"home"`
}

// 查找用户当前的状态信息
func (hm *HomeManager) UserState(user string) State{
	state := "init"
	for i:=0;i<len(hm.Homes);i++ {
		if user == hm.Homes[i].UserA || user == hm.Homes[i].UserB{
			if hm.Homes[i].UserB == ""{
				state = "one"
			}else{
				state = "gaming"
			}
			return State{
				State:state,
				Home: hm.Homes[i],
			}
		}
	}
	return State{
		State: state,
	}
}

// 添加一个房间，并将这个房间的信息返回回去
func (hm *HomeManager) AddHome(userA string) *Home {
	nh := &Home{
		Id:    strconv.FormatInt(time.Now().UnixNano()/1e6, 10),
		UserA: userA,
		Now: userA,
		End: false,
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

// 直接销毁房间信息
func (hm* HomeManager) GameOver(id string) error{
	for i:=0;i<len(hm.Homes);i++ {
		if id == hm.Homes[i].Id{
			hm.Homes = append(hm.Homes[0:i],hm.Homes[i+1:]...)
			return nil
		}
	}
	return errors.New("未找到该房间或该房间已经被销毁")
}

// 手动销毁房间信息
func (hm* HomeManager) DeleteHome(id string) error{
	for i:=0;i<len(hm.Homes);i++ {
		if id == hm.Homes[i].Id{
			// 告诉另一个玩家这个房间被销毁了
			// 注意，这里home对象虽然不在数组中了，但是另一个线程引用着，所以不会被立即销毁。
			//select {
			//case :
			//	break
			//default:
			//	break
			//}
			// 告诉自己结束循环
			hm.Homes[i].Stopped <- true
			// 告诉另一个人结束循环
			hm.Homes[i].Stopped <- true
			hm.Homes = append(hm.Homes[0:i],hm.Homes[i+1:]...)
			return nil
		}
	}
	return errors.New("未找到该房间或该房间已经被销毁")
}