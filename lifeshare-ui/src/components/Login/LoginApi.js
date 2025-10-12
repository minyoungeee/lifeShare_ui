import axios from "axios";

/**
 * 로그인 API 모듈
 *
 * @author minyoung
 * @version 1.0.0
 * @date 2025.9.30
 **/
export const auth = {

    /**
     * 로그인을 수행한다.
     *
     * @param params 파라미터 정보
     * @author minyoung
     * @version 1.0
     **/
    reqLogin: (params) => {
        return axios.post("/auth/login", params, {
            maxRedirects: 0
        })
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error("🚨 API ERROR", err.response?.status, err.response?.data || err.message);
                return err.response.data.message;
            });
    },

    /**
     * 로그아웃을 수행한다.
     *
     * @param params 파라미터 정보
     * @author minyoung
     * @version 1.0
     **/
    reqLogout: () => {
        return axios.post("/auth/logout")
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * RSA 공개키를 조회한다.
     *
     * @author minyoung
     * @version 1.0
     **/
    reqGetPublicKey: () => {
        return axios.get("/auth/pubkey")
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    }
};
