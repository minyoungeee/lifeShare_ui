import axios from "axios";

export const common = {

    /**
     * @funcName : reqGetCommonCategoryList
     * @description : 공통 카테고리 목록 정보를 조회한다.
     * @param params : 파라미터 정보
     * @return : 공토 카테고리 목록 정보
     * @exception :
     * @date : 2021-08-23 오후 3:46
     * @author : chauki
     * @see
     * @history :
     **/
    reqGetCommonCategoryList: function (params) {
        return axios.get(process.env.PUBLIC_URL + "/api/common/category", {
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
     * @funcName : reqGetRegionList
     * @description : 지역코드를 조회한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date : 2022-07-11 오전 11:30
     * @author : parksujin
     * @see
     * @history :
     **/
    reqGetRegionList : (params) => {
        return axios.get("/api/common/region", {
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
     * @funcName : reqGetCodeList
     * @description : 코드를 조회한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date : 2022-08-12 오후 3:14
     * @author : ChoiJisoo
     * @see
     * @history :
    **/
    reqGetCodeList : (params) => {
        return axios.get("/api/common/code", {
            params : params
        })
            .then((res) => {
                return res.data.result;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },
};