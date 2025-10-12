import axios from "axios";

export const file = {

    /**
     * @funcName : reqGetFileDownload
     * @description : 파일을 다운로드한다.
     * @param :
     * @return :
     * @exception :
     * @date : 2023-03-07 오후 4:35
     * @author : ChoiJisoo
     * @see
     * @history :
     **/
    reqGetFileDownload: function () {
        return axios.get("/api/file/download",
            {
                responseType: "blob",
            })
            .then((res) => {
                const fileName = decodeURI(res.headers["content-disposition"].split("UTF-8''")[1]); //.match(/"(.*)"/).pop();
                const url = window.URL.createObjectURL(new Blob([res.data]));
                let link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },

    /**
     * @funcName : reqPostFileUpload
     * @description : 파일을 업로드한다.
     * @param :
     * @return :
     * @exception :
     * @date :
     * @author :
     * @see
     * @history :
     **/
    reqPostContentFileUpload: function(params) {
        const formData = new FormData();
        for (const key in params) {
            if (params[key] !== null) formData.append(key, params[key]);
        }

        const token = localStorage.getItem('token');

        return axios.post("/api/file/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            withCredentials: false // 토큰 방식이면 false
        })
            .then(res => res.data)
            .catch(err => {
                // 안전한 에러 처리: err.response가 없을 수 있음 (CORS, 네트워크)
                if (err.response) {
                    return { error: true, status: err.response.status, message: err.response.data?.message || err.message };
                } else {
                    return { error: true, message: err.message || 'Network error' };
                }
            });
    },

    /**
     * 파일 목록을 삭제한다.
     *
     * @author 강보경
     * @version 1.0
     **/
    reqDeleteFileList: function (params) {
        return axios.delete("/api/file", {params: params})
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err.response.data.message;
            });
    },
}