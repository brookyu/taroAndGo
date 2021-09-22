/**
 * @note:
 * @author: zhangruiyuan
 * @date:2021/8/20
**/
package Home

import (
	"time"
)

// 过期超时
func afterTime(t time.Duration) <-chan time.Time {
	return time.After(t)
}
