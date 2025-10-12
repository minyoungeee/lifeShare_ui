import {Fragment, memo, useCallback, useContext, useEffect, useRef, useState} from 'react';
import "@/components/Login/Login.css";
import {useDispatch, useSelector} from "react-redux";
import {login} from "@/redux/action/AuthAction";
import {Checkbox, Input} from "@progress/kendo-react-inputs";
import {Form, Formik} from "formik";
import {modalContext} from "@/components/Common/Modal.jsx";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner.jsx";
import ServiceApi from "@/common/ServiceApi.js";
import {useNavigate} from "react-router-dom";
import {Button} from "@progress/kendo-react-buttons";

/**
 * Login 화면 클래스
 *
 * @author minyoung
 * @version 1.0.0
 **/
const Login = (props) => {

    const auth = useSelector((store) => store.auth);

    //form data state
    const [formData, setFormData] = useState({
        userId: localStorage.getItem("savedId") !== null ? localStorage.getItem("savedId") : null,
        pwd: null
    });

    //redux dispatch
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //context api
    const modal = useContext(modalContext);
    const loadingSpinner = useContext(loadingSpinnerContext);

    //ref 설정
    const formRef = useRef();

    //clean up 변수
    let isComponentMounted = true;

    //체크박스 상태
    const [isSavedId, setIsSavedId] = useState(formData.userId !== null ? true : false);

    // //todo componentDidMount
    // useEffect(() => {
    // }, []);

    //todo componentDidUnMount
    useEffect(() => {
        return () => {
            isComponentMounted = false;
        };
    }, []);

    /**
     * doLogin 로그인을 수행한다.
     *
     * @param dataItem : 폼 데이터
     * @param event : 이벤트 객체
     * @author minyoung
     * @version 1.0.0
     **/
    const doLogin = useCallback(async (formData) => {
        loadingSpinner.show(formRef.current);
        try {

            //rsa
            const params = {...formData};
            console.log("params", params);

            // 보안용 RSA 로그인 우선 보류
            // const encrypt = new JSEncrypt();
            // encrypt.setPublicKey(auth.publicKey);
            // params.userId = encrypt.encrypt(params.userId);
            // params.pwd = encrypt.encrypt(params.pwd);

            const {data, headers} = await ServiceApi.auth.reqLogin(params);
            const result = data;

            console.log('result', result);


            //미승인 회원
            // if (result.user === "nonApprovedUser") {
            //     modal.showAlert("알림", "가입이 승인되지 않은 회원입니다.\r\n관리자에게 문의하여 주십시오.");
            //     loadingSpinner.hide();
            //     return false;
            // }
            let token = headers["authorization"];
            if (token != undefined && token != null) {
                token = token.replace("Bearer ", "");
            }
            if (result.login) {
                if (isSavedId) {
                    localStorage.setItem("savedId", result.user.userId);
                } else {
                    localStorage.removeItem("savedId");
                }
                sessionStorage.setItem("token", token);

                //비밀번호 변경 3개월 초과
                if (result.pwdChange) {
                    modal.showConfirm("알림", "비밀번호 변경 후 3개월이 초과되어있습니다. 비밀번호를 변경하시겠습니까?", {
                        btns: [
                            {
                                title: "변경하기",
                                click: () => {
                                    navigate({
                                        pathname: "/login/change/pwd",
                                        state: {...result.user}
                                    });
                                }
                            },
                            {
                                title: "다음에 하기",
                                click: () => {
                                    dispatch(login({
                                        ...result.user
                                    }));
                                    navigate("/predict/traffic/monitoring");
                                }
                            }
                        ]
                    });
                    //로그인 성공
                } else {
                    dispatch(login({
                        ...result.user
                    }));
                    navigate("/community/list");
                }
                //로그인 실패
            } else {
                modal.showAlert("알림", "로그인 인증이 실패하였습니다.\r\n아이디 또는 패스워드를 확인해주세요.");
            }
            loadingSpinner.hide();
        } catch (err) {
            modal.showAlert("알림", "서버처리 중 오류가 발생하였습니다.\r\n관리자에게 문의해주세요.");
            loadingSpinner.hide();
        }
    }, [formData, isSavedId]);

    /**
     * @funcName : onChangeHandler
     * @description : 공통 change 이벤트 핸들러
     * @param name : 필드명
     * @param event : 이벤트 객체
     * @return :
     * @exception :
     * @date : 2022-06-03 오전 10:00
     * @author : minyoung
     * @see
     * @history :
     **/
    const onChangeHandler = useCallback((name, event) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: event.value
        }));
    }, [formData]);

    /**
     * @funcName : onCheckSavedId
     * @description : 아이디 저장 버튼 클릭 이벤트 핸들러
     * @param :
     * @return :
     * @exception :
     * @date : 2022-06-03 오전 10:00
     * @author : minyoung
     * @see
     * @history :
     **/
    const onCheckSavedId = useCallback((event) => {
        if (event.value) {
            localStorage.removeItem("savedId");
        }
        setIsSavedId(event.value);
    }, [isSavedId]);

    return (
        <Fragment>
            <div className={"ns-login"}>
                <Formik
                    enableReinitialize={true}
                    initialValues={formData}
                    onSubmit={doLogin}>
                    {
                        formik => {
                            return (
                                <Fragment>
                                    <h1>LifeShare</h1>
                                    <Form ref={formRef}>
                                        <fieldset className={"field-wrapper"}>
                                            <Input
                                                name={"userId"}
                                                className={"wdfull"}
                                                type={"text"}
                                                placeholder={"아이디를 입력해주세요."}
                                                minLength={4}
                                                maxLength={12}
                                                required={true}
                                                defaultValue={formData.userId || ''}
                                                onChange={(event) => onChangeHandler("userId", event)}
                                            />
                                            <Input
                                                className={"wdfull"}
                                                name={"pwd"}
                                                type={"password"}
                                                placeholder={"비밀번호를 입력해주세요"}
                                                minLength={4}
                                                maxLength={12}
                                                required={true}
                                                onChange={(event) => onChangeHandler("pwd", event)}
                                            />
                                            <Button
                                                type={"submit"}
                                                className={"btn"}>로그인
                                            </Button>
                                            <Checkbox
                                                label={"ID 기억하기"}
                                                checked={isSavedId}
                                                onChange={onCheckSavedId}/>
                                            {/*<ul>
                                                <li>
                                                    <Link to={"/login/registration"}>
                                                        <span>회원가입</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={"/login/pwd"}>
                                                        <span>ID/PW 찾기</span>
                                                    </Link>
                                                </li>
                                            </ul>*/}
                                        </fieldset>
                                    </Form>
                                </Fragment>
                            )
                        }
                    }
                </Formik>
            </div>
        </Fragment>
    );
}
export default memo(Login);
