/**
 * @note:
 * @author: zhangruiyuan
 * @date:2021/8/20
**/
package Home

type Handle struct {
	User string `json:"user"`
	StartX int `json:"startX"`
	StartY int `json:"startY"`
	EndX int `json:"endX"`
	EndY int `json:"endY"`
}
