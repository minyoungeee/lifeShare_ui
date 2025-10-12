import axios from "axios";

/**
 * @name : ajax 패키지
 * @description : ajax 관련 패키지를 정의한다.
 * @author : chauki
 */
export const ajax = {

    /**
     * @name : requestApi
     * @description : api를 전송한다.
     * - axios 라이브러리 사용
     * @param url : api url 정보
     * @param options : 옵션정보
     * @author : chauki
     */
    requestApi: (url, options) => {
        const _axios = axios.create();

        //파라미터 설정
        let params = {};
        if (options.params !== undefined && options.params !== null) {
            params = options.params;
        }

        //method 설정
        let method = "get";
        if (options.method !== undefined && options.method !== null) {
            method = options.method;
            if (method.toLowerCase() === "post" || method.toLowerCase() === "put") {
                params = JSON.stringify(params);
                //console.log(params);
            }
        }

        //request 요청 시, loadingBar를 표출할 경우, interceptor로 loadingBar 표출
        if (options.isLoading !== undefined && options.el !== undefined && new Boolean(options.isLoading) instanceof Boolean) {
            _axios.interceptors.request.use(function (config) {
                return config;
            }, function (error) {
                return Promise.reject(error);
            });

            _axios.interceptors.response.use(function (response) {
                // 응답 받으면 로딩 끄기
                return response;
            }, function (error) {
                // 응답 에러 시에도 로딩 끄기
                return Promise.reject(error);
            });
        }

        return new Promise((resolve, reject) => {
            _axios
                .request({
                    method : method,
                    headers : {"content-type" : "application/json"},
                    url : url,
                    params :(method.toLowerCase() === "get" || method.toLowerCase() === "delete") ? params : null,
                    data : (method.toLowerCase() === "put" || method.toLowerCase() === "post") ? params : null
                })
                .then((res) => {
                    resolve(res.data);
                })
                .catch((res) => {
                    reject(res.data);
                });
        });
    }
};

export const util = {

    /**
     * @funcName : getFormData
     * @description : Form에서 데이터를 가져온다.
     * @param form : form 엘리먼트
     * @return :
     * @exception :
     * @date : 2021-05-14 오후 5:19
     * @author : chauki
     * @see
     * @history :
    **/
    getFormData: (form) => {
        let field, params = {};
        if (typeof form == 'object' && form.nodeName == "FORM") {
            let len = form.elements.length;
            for (let i=0; i<len; i++) {
                field = form.elements[i];
                if (field.name &&
                    !field.disabled &&
                    field.type != 'file' &&
                    field.type != 'reset' &&
                    field.type != 'submit' &&
                    field.type != 'button') {
                    if (field.type == 'select-multiple') {
                        for (let j=form.elements[i].options.length-1; j>=0; j--) {
                            if (field.options[j].selected) {
                                if (encodeURIComponent(field.options[j].value != "")) {
                                    params[encodeURIComponent(field.name)] = encodeURIComponent(field.options[j].value)
                                }
                            }
                        }
                    } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                        if (encodeURIComponent(field.value) != "") {
                            params[encodeURIComponent(field.name)] = encodeURIComponent(field.value)
                        }
                    }
                }
            }
        }
        return params;
    },

    /**
     * @funcName : setInitialValueForHash
     * @description : Hash Map 형태의 값을 초기화한다.
     * @param targetData : string 데이터
     * @param fieldName : 변수명(key 값)
     * @param initialValue : string
     * @return :
     * @exception :
     * @date : 2021-05-31 오전 9:08
     * @author : chauki
     * @see
     * @history :
    **/
    setInitialValueForHash: (targetData, fieldName, initialValue) => {
        if (targetData == undefined || targetData == null) {
            if (initialValue !== undefined) {
                return initialValue;
            }
            return null;
        }
        if (initialValue == undefined) {
            initialValue = null;
        }
        return targetData[fieldName] !== undefined && targetData[fieldName] !== null ? targetData[fieldName] : initialValue;
    },

    /**
     * @funcName : setInitialValueForString
     * @description : String 형태의 값을 초기화한다.
     * @param value : 값
     * @param initialValue : string
     * @return :
     * @exception :
     * @date : 2021-12-14 오후 12:08
     * @author : parksujin
     * @see
     * @history :
    **/
    setInitialValueForString: (value, initialValue) => {
        if (value == undefined || value == null) {
            if (initialValue !== undefined) {
                return initialValue;
            }
            return null;
        }
        if (initialValue == undefined) {
            initialValue = null;
        }
        return value !== undefined && value !== null ? value : initialValue;
    },

    /**
     * @funcName : setInitialValueForNumber
     * @description : Number 형태의 값을 초기화한다.
     * @param value : 값
     * @param initialValue : Number
     * @return :
     * @exception :
     * @date : 2023-01-12 오후 3:08
     * @author : parksujin
     * @see
     * @history :
     **/
    setInitialValueForNumber: (value, initialValue) => {
        if (initialValue == undefined) {
            initialValue = 0;
        }
        if (value == undefined || value == null) {
            return initialValue;
        }
        return value !== undefined && value !== null ? value : initialValue;
    },

    /**
     * @funcName : setKendoDropDownListValue
     * @description : kendo dropdownlist의 값을 세팅한다.
     * @param code : code 정보
     * @param text : string
     * @return :
     * @exception :
     * @date : 2021-05-27 오전 9:26
     * @author : chauki
     * @see
     * @history :
    **/
    setKendoDropDownListValue: (code, text) => {
        let tmpData = {};
        if (code !== undefined && code !== null) {
            tmpData["code"] = code;
        }
        if (text !== undefined && text !== null) {
            tmpData["text"] = text;
        }
        return tmpData;
    },

    /**
     * @funcName : setKendoDropDownListValueCommonCode
     * @description : 공통코드로 kendo dropdownlist의 값을 세팅한다.
     * @param sbctgCd : sbctgCd 정보
     * @param sbctgNm : sbctgNm 정보
     * @return :
     * @exception :
     * @date : 2021-12-14 오전 9:26
     * @author : parksujin
     * @see
     * @history :
    **/
    setKendoDropDownListValueCommonCode: (sbctgCd, sbctgNm) => {
        let tmpData = {};
        if (sbctgCd !== undefined && sbctgCd !== null) {
            tmpData["sbctgCd"] = sbctgCd;
        }
        if (sbctgNm !== undefined && sbctgNm !== null) {
            tmpData["sbctgNm"] = sbctgNm;
        }
        return tmpData;
    },

    /**
     * @funcName : setKendoDatePickerValue
     * @description : kendo datepicker 값을 세팅한다.
     * @param date : date 값 (string or date object)
     * @return :
     * @exception :
     * @date : 2021-05-27 오전 9:37
     * @author : chauki
     * @see
     * @history :
    **/
    setKendoDatePickerValue: (date) => {
        return date !== undefined && date !== null
               ? (date instanceof Date) ? date : new Date(date)
               : null;
    },

    /**
     * @funcName : randomIntFromInterval
     * @description : min ~ max 까지 랜덤 숫자를 리턴한다.
     * @param min : 최소값
     * @param max : 최대값
     * @date : 2021-12-23 오후 6:05
     * @author : chauki
     * @version : 1.0.0
     * @see
     * @history :
    **/
    randomIntFromInterval: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    /**
     * @funcName : getStringDayWeek
     * @description : 요일 값(0:일,1:월,2:화,3:수,4:목,5:금,6:토)에 해당하는 문자열을 리턴한다.
     * @param day : 요일값
     * @date : 2022-02-09 오후 2:07
     * @author : Yudy
     * @version : 1.0.0
     * @see
     * @history :
     **/
    getStringDayWeek: (day) => {
        switch (day) {
            case 0:
                return "일";
            case 1:
                return "월";
            case 2:
                return "화";
            case 3:
                return "수";
            case 4:
                return "목";
            case 5:
                return "금";
            case 6:
                return "토";
            default:
                return "";

        }
    },

    /**
     * @funcName : changeDate
     * @description : 년월일 형태로 리턴
     * @param dateTime : date()_
     * @date : 2022-01-25 오전 10:13
     * @author : khlee
     * @version : 1.0.0
     * @see
     * @history :
    **/
    changeDate: (dateTime) => {
        const moment = require('moment');

        const publish_date = moment(dateTime).format('YYYY년 MM월 DD일')
        return publish_date
    },

    hexToRgba : (hex, opacity) => {
        if (opacity === undefined || opacity === null) {
            opacity = 1;
        }
        const rgb = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            ,(m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));
        return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + opacity + ")";
    },

    /**
     * @funcName : rgbaToHex
     * @description : converts RGBA to HEX
     * @param :
     * @return :
     * @exception :
     * @date : 2022-08-17 오후 4:05
     * @author : ChoiJisoo
     * @see
     * @history :
    **/
    rgbaToHex : (rgba) => {
        const values = rgba
            .replace(/rgba?\(/, '')
            .replace(/\)/, '')
            .replace(/[\s+]/g, '')
            .split(',');

        const a = parseFloat(values[3] || 1),
            r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

        return "#" +
            ("0" + r.toString(16)).slice(-2) +
            ("0" + g.toString(16)).slice(-2) +
            ("0" + b.toString(16)).slice(-2);
    },

    randomHex : (size) => {
        let result = [];
        let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

        for (let n = 0; n < size; n++) {
            result.push(hexRef[Math.floor(Math.random() * 16)]);
        }
        return "#" + result.join('');
    },

    getRandomColor : (index, opacity) => {
        let opc = opacity ? opacity : 1;
        const colors = [
                "rgba(255, 99, 88," + opc + " )",
                "rgba(255, 225, 98," + opc + " )",
                "rgba76, 209, 128," + opc + " )",
                "rgba(75, 95, 250," + opc + " )",
                "rgba(172, 88, 255," + opc + " )",
                "rgba(255, 88, 146," + opc + " )",
                "rgba(255, 138, 130," + opc + " )",
                "rgba(255, 233, 137," + opc + " )",
                "rgba(121, 221, 160," + opc + " )",
                "rgba(120, 135, 251)," + opc + " )"
        ];
        return colors[index % 10];
    },

     /**
     * @funcName : getTimesArray
     * @description : 차트 x축 배열을 반환한다.
     * @param : option.search : 기간 설정 ex) DAY(일별), MONTH(월별)
     * @param : option.collectDt : 수집 기간
     * @return :
     * @exception :
     * @date : 2023-01-02 오후 4:05
     * @author : parksujin
     * @see
     * @history :
     **/
    getTimesArray: (option) => {
        let timesArray = [];
        switch (option.search) {
            case "DAY":
                timesArray = [
                    "00", "01", "02", "03", "04", "05", "06", "07",
                    "08", "09", "10", "11", "12", "13", "14", "15",
                    "16", "17", "18", "19", "20", "21", "22", "23"
                ]
                break;
            case "MONTH":
                let day = 1;
                const collectDtYear = parseInt(option.collectDt.substr(0, 4));
                const collectDtDay = parseInt(option.collectDt.substr(4, 2));
                let lastDay = new Date(collectDtYear, collectDtDay, 0).getDate();
                while (day <= lastDay) {
                    timesArray.push(day);
                    day++;
                }
                break;
            default :
                break;
        }
        return timesArray;
    },

};
