import axios from "axios";

export const user = {

    /**
     * @funcName : reqGetUserInfo
     * @description : 사용자 정보를 조회한다.
     * @param params: 파라미터 정보
     * @return :
     * @exception :
     * @date : 2022-05-31 오후 12:02
     * @author : hanyk
     * @see
     * @history :
     **/
    reqGetUserInfo: (userId) => {
        return axios.get("/api/user/" + userId)
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    reqPutUserPwdChange: (params) => {
        return axios.put("/api/user/pwd/change", params)
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    reqPutUserPwdReset: (params) => {
        return axios.put("/api/user/pwd/reset", params)
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqPostUserInfo
     * @description : 회원가입을 한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date : 2022-06-13 오전 11:00
     * @author : parksujin
     * @see
     * @history :
     **/
    reqPostUserInfo : (params) => {
        return axios.post("/api/user/join", params)
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqGetUserIdDuplicationCheck
     * @description : 아이디 중복을 조회한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date : 2022-06-15 오전 11:09
     * @author : parksujin
     * @see
     * @history :
     **/
    reqGetUserIdDuplicationCheck: (params) => {
        return axios.get("/api/user/check/id", {
            params : params
        })
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqGetUserEmailDuplicationCheck
     * @description : 이메일 중복을 조회한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date : 2022-06-15 오전 11:09
     * @author : parksujin
     * @see
     * @history :
     **/
    reqGetUserEmailDuplicationCheck: (params) => {
        return axios.get("/api/user/check/email", {
            params : params
        })
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqGetUserId
     * @description : 사용자 아이디를 가져온다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date : 2022-06-27 오후 5:09
     * @author : parksujin
     * @see
     * @history :
     **/
    reqGetUserId: (params) => {
        return axios.get("/api/user/search", {
            params : params
        })
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },


    /**
     * @funcName : reqPutUserPwdRequest
     * @description : 비밀번호 초기화 요청을 한다.
     * @param params : {userId: userId} 정보
     * @return :
     * @exception :
     * @date : 2022-06-27 오후 5:09
     * @author : parksujin
     * @see
     * @history :
     **/
    reqPutUserPwdRequest: function (params) {
        return axios.put("/api/user/pwd/request", params)
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqPutUserPwdApprove
     * @description : 비밀번호 초기화 요청을 승인한다.
     * @param params : {userId: userId} 정보
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    reqPutUserPwdApprove: function (params) {
        return axios.put("/api/user/pwd/approve", params)
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqGetUserList
     * @description : 사용자 목록을 조회한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    reqGetUserList : function(params) {
        return axios.get("/api/user", {
            params : params
        })
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqPutUserInfo
     * @description : 사용자 상세 정보를 수정한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    reqPutUserInfo : function(params) {
        return axios.put("/api/user", params)
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqDeleteUserList
     * @description : 사용자 정보를 삭제한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    reqDeleteUserList : (params) => {
        return axios.delete("/api/user", {
            params: params
        })
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * @funcName : reqPutUserApprove
     * @description : 사용자 승인요청 여부를 승인한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    reqPutUserApprove: function (params) {
        return axios.put("/api/user/update/approve", params)
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                throw err.response.data.message;
            });
    },
};