/**
 * @note:
 * @author: zhangruiyuan
 * @date:2021/8/20
**/
package Home

import "net/http"

type Response struct {
	Status int         `json:"status"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data"`
}


func SuccessResponse() Response {
	return Response{
		Status: http.StatusOK,
		Data: nil,
	}
}

func FailResponse(msg string, data interface{}) Response{
	return Response{
		Status: http.StatusBadRequest,
		Msg: msg,
		Data: data,
	}
}

