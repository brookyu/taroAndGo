/**
 * @note:
 * @author: zhangruiyuan
 * @date:2021/8/19
**/
package Home

import (
	"errors"
	"strconv"
)

// 棋子
type chess struct {
	Pieces [4][4]int `json:"pieces"`
}

// 移动棋子
func (c *chess)movePieces(startX, startY, endX, endY, movP int) error {
	if startX<0||startX>=4||startY<0||startY>=4||endX<0||endX>=4||endY<0||endY>=4{
		return errors.New("数组越界")
	}

	if c.Pieces[startX][startY] != movP{
		return errors.New("您不可置对手棋")
	}

	if c.Pieces[startX][startY] == 0 || c.Pieces[endX][endY] != 0{
		return errors.New("棋盘检验不正确或重复置棋")
	}

	c.Pieces[endX][endY] = c.Pieces[startX][startY]
	c.Pieces[startX][startY] = 0
	return nil
}

// 消除棋子 (移动的数字，移动位置)
func (c *chess)clear(movP, advP, endX, endY int)  {
	//	找到所有2 对 1的行或者列，其中 2 个movP数字， 且要求终点位置的棋子在这2个之中
	// 遍历 endX endY 的行和列即可
	//	遍历行
	if c.Pieces[endX][0] == 0 || c.Pieces[endX][3] == 0{
		line := ""
		movPNum := 0
		for i:=0;i<4;i++{
			if c.Pieces[endX][i]!=0{
				line += strconv.Itoa(c.Pieces[endX][i])
			}
			if c.Pieces[endX][i]==movP{
				movPNum += 1
			}
		}
		if len(line)==3 && movPNum == 2 {
			if line[1] == line[0] || line[1] == line[2]{
				// 这一行是消除行，消除字符为 advP
				for i:=0;i<4;i++{
					if c.Pieces[endX][i]==advP{
						c.Pieces[endX][i] = 0
					}
				}
			}
		}
	}
	//	遍历列
	if c.Pieces[0][endY] == 0 || c.Pieces[3][endY] == 0{
		line := ""
		movPNum := 0
		for i:=0;i<4;i++{
			if c.Pieces[i][endY]!=0{
				line += strconv.Itoa(c.Pieces[i][endY])
			}
			if c.Pieces[i][endY]==movP{
				movPNum += 1
			}
		}
		if len(line)==3 && movPNum == 2 {
			if line[1] == line[0] || line[1] == line[2]{
				// 这一行是消除行，消除字符为 advP
				for i:=0;i<4;i++{
					if c.Pieces[i][endY]==advP{
						c.Pieces[i][endY] = 0
					}
				}
			}
		}
	}

}

// 判断输赢
func (c *chess)Judge(advP int) bool {
	ans := 0
	for i:=0;i<4;i++{
		for j:=0;j<4;j++{
			if c.Pieces[i][j] == advP{
				ans ++
			}
		}
	}
	return ans <= 1
}

// 初始化棋子对象
func NewChess() *chess {
	return &chess{
		Pieces: [4][4]int{
			{2,2,2,2},
			{2,0,0,2},
			{1,0,0,1},
			{1,1,1,1},
		},
	}
}