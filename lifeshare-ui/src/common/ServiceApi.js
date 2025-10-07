import {auth} from '@/components/Login/LoginApi';
import {common} from "@/common/CommonApi";
import {user} from "@/components/User/UserApi";
import {file} from "@/components/File/FileApi";
import {keyword} from "@/components/Keyword/KeywordApi";
import {feed} from "@/components/Feed/FeedApi";
import {solution} from "@/components/Solution/SolutionApi";
import axios from "axios";
import {employ} from "@/components/Employ/EmployApi";
import {community} from "@/components/Community/CommunityApi";
import {patent} from "@/components/Patent/PatentApi";


axios.defaults.withCredentials = true;
//axios.defaults.baseURL = "//211.189.132.59:8999";
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.timeout = 500000;

axios.interceptors.request.use(function (config) {
    let token = sessionStorage.getItem("token");

    if (config.url.indexOf("/kt-api") !== -1){
        token = '68a5c87af095dbd50d1233d8b9b2cfd00c22b98c7922ac662ff0a523e236321e1b364d5d' //KT GIS API Key
    }
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    // 응답 받으면 로딩 끄기
    const {data, headers} = response;
    let token = headers["authorization"];
    if (token != undefined && token != null) {
        token = token.replace("Bearer ", "");
        sessionStorage.setItem("token", token);
    }

    if (data.code === 401) {
        sessionStorage.removeItem("session");
        sessionStorage.removeItem("token");
    }
   /* switch (data.code) {
        case 400:
            break;
        case 401:
            sessionStorage.removeItem("session");
            sessionStorage.removeItem("token");
            break;
    }*/

    return response;
}, function (error) {
    //console.log(error);
    if (error.response.status === 504) {
        sessionStorage.removeItem("session");
        sessionStorage.removeItem("token");
    }

    setTimeout(() => {
        return Promise.reject(error);
    });

    // 응답 에러 시에도 로딩 끄기
    //return Promise.reject(error);
});

export default {
    common,
    auth,
    user,
    file,
    keyword,
    feed,
    solution,
    employ,
    community,
    patent,
};