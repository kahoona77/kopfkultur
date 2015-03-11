package response

// Response - a JSOn reponse
type Response struct {
	Success bool        `json:"success"`
	Status  string      `json:"status"`
	Data    interface{} `json:"data"`
}

//OK - creates a succesful JSON Response
func OK(data interface{}) *Response {
	return &Response{true, "ok", data}
}

//Error - creates a succesful JSON Response
func Error(err error) *Response {
	return &Response{false, "Error: " + err.Error(), nil}
}
