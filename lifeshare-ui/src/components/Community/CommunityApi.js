import axios from "axios";


export const community = {

    /**
     * 공지사항 목록 정보 조회
     *
     * @author minyoung
     * @Version 1.0
     */
    reqGetCommunityList: (params) => {
        return axios.get("/api/community", {
            params: params
        })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },

    /**
     * 공지사항 정보를 수정한다.
     *
     * @param params 파라미터 정보
     * @author minyoung
     * @version 1.0
     **/
    reqPutCommunityInfo: (params) => {
        return axios.put("/api/community", params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }})
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                throw err.response.data.message;
            });
    },

    /**
     * 공지사항 정보를 등록한다.
     *
     * @param params 파라미터 정보
     * @author minyoung
     * @version 1.0
     **/
    reqPostCommunityInfo: function (params)
    {
        return axios.post("/api/community", params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }})
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                throw err.response.data.message;
            });
    },

    /**
     * 채용공고 정보를 삭제한다.
     *
     * @param params 파라미터 정보
     * @author minyoung
     * @version 1.0
     **/
    reqDeleteCommunityInfo: (params) => {
        return axios.delete("/api/community", {
            params: params
        })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },





}