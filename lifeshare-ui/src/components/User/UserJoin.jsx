import {Fragment, useCallback, useRef, useState, useContext, useEffect, memo, cloneElement} from "react";
import "@/components/User/User.css";
import {Form, Formik} from "formik";
import {Input} from "@progress/kendo-react-inputs";
import {Button} from "@progress/kendo-react-buttons";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";
import {modalContext} from "@/components/Common/Modal";
import ServiceApi from "@/common/ServiceApi";
import CustomSearchComboBox from "@/components/Custom/CustomSearchComboBox";
import {useHistory} from "react-router";
import {JSEncrypt} from "jsencrypt";
import {useSelector} from "react-redux";

/**
 * @className : UserJoin
 * @description : 회원가입 화면 클래스
 * @date : 2022-06-15 오전 11:09
 * @author : parksujin
 * @version : 1.0.0
 * @see
 * @history : 2022-08-09 cukwom 수정
 **/
const UserJoin = (props) => {

    //formdata state
    const [formData, setFormData] = useState({
        userId: null,
        pwd: null,
        pwdChk: null,
        userNm: null,
        email: null,
        orgCode: null,
        userIdValidate: false,
        emailValidate: false,
    });

    const history = useHistory();

    //auth redux
    const auth = useSelector((store) => store.auth);

    //ref 설정
    const formRef = useRef();
    const userIdRef = useRef();
    const emailRef = useRef();

    //context
    const modal = useContext(modalContext);
    const loadingSpinner = useContext(loadingSpinnerContext);

    //clean up 변수
    let isComponentMounted = true;

    //todo componentDidUnMount
    useEffect(() => {
        return () => {
            isComponentMounted = false;
        };
    }, []);

    /**
     * @funcName : onChangeHandler
     * @description : 공통 change 이벤트 핸들러
     * @param name : 필드명
     * @param event : 이벤트 객체
     * @return :
     * @exception :
     * @date : 2022-06-15 오전 11:09
     * @author : parksujin
     * @see
     * @history :
     **/
    const onChangeHandler = useCallback((name, event) => {
        let value = event.value;
        switch (name) {
            case "orgCode":
                value = value.admCode
                break;
            default:
                break;
        }
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, [formData]);

    /**
     * @funcName : onSubmit
     * @description : submit 이벤트 핸들러
     * @param data : 폼 정보
     * @return :
     * @exception :
     * @date : 2022-06-15 오전 11:09
     * @author : parksujin
     * @see
     * @history :
     **/
    const onSubmit = useCallback((data) => {
        if (!data.userIdValidate) {
            modal.showAlert("알림", "아이디 중복체크를 해주세요.")
            return false;
        }
        if (!data.emailValidate) {
            modal.showAlert("알림", "이메일 중복체크를 해주세요.")
            return false;
        }
        if (data.pwd !== data.pwdChk) {
            modal.showAlert("알림", "비밀번호를 확인해주세요.");
            return false;
        }

        //rsa
        const params = {...data};
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(auth.publicKey);
        params.userId = encrypt.encrypt(data.userId);
        params.pwd = encrypt.encrypt(data.pwd);
        params.email = encrypt.encrypt(data.email);

        delete params["pwdChk"];

        reqPostUserInfo(params);

    }, []);

    /**
     * @funcName : reqPostUserInfo
     * @description : 회원정보를 등록한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date : 2022-06-15 오전 11:09
     * @author : parksujin
     * @see
     * @history :
     **/
    const reqPostUserInfo = async (params) => {
        loadingSpinner.show(formRef.current);
        try {
            const result = await ServiceApi.user.reqPostUserInfo(params);
            if (result && isComponentMounted) {
                modal.showAlert("알림", "회원가입이 완료되었습니다.\r\n관리자승인 후 로그인이 가능합니다.", null, () => {
                    history.push("/login");
                });
            } else {
                modal.showAlert("알림", "회원가입에 실패했습니다.");
            }
            loadingSpinner.hide();
        } catch (e) {
            //console.log(e);
            loadingSpinner.hide();
        }
    };

    /**
     * @funcName : reqGetUserIdDuplicationCheck
     * @description : 아이디 중복을 조회한다.
     * @param userId : 아이디
     * @return :
     * @exception :
     * @date : 2022-06-15 오전 11:09
     * @author : parksujin
     * @see
     * @history :
     **/
    const reqGetUserIdDuplicationCheck = async (userId) => {
        loadingSpinner.show(formRef.current);
        try {
            const params = {
                userId: userId
            };
            const result = await ServiceApi.user.reqGetUserIdDuplicationCheck(params);
            if (result && isComponentMounted) {
                modal.showAlert("알림", "사용가능한 아이디입니다.");
                setFormData(prevState => ({
                    ...prevState,
                    userIdValidate: true
                }));
            } else {
                modal.showAlert("알림", "이미 등록된 아이디입니다.");
            }
            loadingSpinner.hide();
        } catch (e) {
            loadingSpinner.hide();
        }
    };

    /**
     * @funcName : reqGetUserEmailDuplicationCheck
     * @description : 이메일 중복을 조회한다.
     * @param email : 이메일
     * @return :
     * @exception :
     * @date : 2022-06-15 오전 11:09
     * @author : parksujin
     * @see
     * @history :
     **/
    const reqGetUserEmailDuplicationCheck = async (email) => {
        loadingSpinner.show(formRef.current);
        try {
            const params = {
                email: email
            };
            const result = await ServiceApi.user.reqGetUserEmailDuplicationCheck(params);
            if (result && isComponentMounted) {
                modal.showAlert("알림", "사용가능한 이메일입니다.");
                setFormData(prevState => ({
                    ...prevState,
                    emailValidate: true
                }));
            } else {
                modal.showAlert("알림", "이미 등록된 이메일입니다.");
            }
            loadingSpinner.hide();
        } catch (e) {
            loadingSpinner.hide();
        }
    };

    /**
     * @funcName : onCheckDuplication
     * @description : 중복체크를 한다.
     * @param name : name
     * @return :
     * @exception :
     * @date : 2022-06-15 오전 11:09
     * @author : parksujin
     * @see
     * @history :
     **/
    const onCheckDuplication = useCallback((event, name) => {
        event.preventDefault();
        event.stopPropagation();

        switch (name) {
            case "userId":
                if (userIdRef.current.validity.valid) {
                    reqGetUserIdDuplicationCheck(formData.userId);
                } else {
                    //valid 메시지 표출
                    userIdRef.current.element.reportValidity(false);
                }
                break;
            case "email":
                if (emailRef.current.validity.valid) {
                    reqGetUserEmailDuplicationCheck(formData.email);
                } else {
                    //valid 메시지 표출
                    emailRef.current.element.reportValidity(false);
                }
                break;
        }
    }, [formData]);

    /**
     * @funcName : onClickCancel
     * @description : 취소 버튼 클릭 이벤트 핸들러
     * @param event : 이벤트 객체
     * @return :
     * @exception :
     * @date : 2022-08-10 오후 6:40
     * @author : chauki
     * @see
     * @history :
    **/
    const onClickCancel = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        history.push("/login");
    }, []);

    return (
        <Fragment>
            <div className={"ns-user-join"}>
                <Formik enableReinitialize={true}
                        initialValues={formData}
                        onSubmit={onSubmit}>
                    {
                        formik => {
                            return (
                                <Form className={"form"} onSubmit={formik.handleSubmit} ref={formRef}>
                                    <h1>국도교통정보시스템</h1>
                                    <p>회원가입</p>
                                    <div className={"tbl"}>
                                        <table>
                                            <colgroup>
                                                <col width="*"/>
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <Input
                                                        style={{width: "275px"}}
                                                        ref={userIdRef}
                                                        name={"userId"}
                                                        minLength={4}
                                                        maxLength={12}
                                                        pattern={"^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{4,12}$"}
                                                        readOnly={formData.userIdValidate}
                                                        required={true}
                                                        placeholder={"아이디를 입력해주세요."}
                                                        validationMessage={"아이디는 4~12자리, 영소문자+숫자 조합으로 가능합니다."}
                                                        onChange={(event) => onChangeHandler("userId", event)}
                                                    />
                                                    <Button className={"duple-check-btn btn"}
                                                            onClick={(event) => onCheckDuplication(event, "userId")}>중복체크</Button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Input
                                                        name={"pwd"}
                                                        type={"password"}
                                                        minLength={4}
                                                        maxLength={12}
                                                        pattern={"^(?=.*[a-z])[a-z\\d@$!%*#?&^+=-]{4,12}$"}
                                                        validationMessage={"비밀번호는 4~12자리, 영소문자를 최소 한 글자 이상 포함해야합니다. (한글, 영대문자 불가)"}
                                                        required={true}
                                                        placeholder={"비밀번호를 입력해주세요."}
                                                        onChange={(event) => onChangeHandler("pwd", event)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Input
                                                        name={"pwdChk"}
                                                        type={"password"}
                                                        minLength={4}
                                                        maxLength={12}
                                                        pattern={"^(?=.*[a-z])[a-z\\d@$!%*#?&^+=-]{4,12}$"}
                                                        validationMessage={"비밀번호는 4~12자리, 영소문자를 최소 한 글자 이상 포함해야합니다. (한글, 영대문자 불가)"}
                                                        required={true}
                                                        placeholder={"비밀번호를 확인해주세요."}
                                                        onChange={(event) => onChangeHandler("pwdChk", event)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Input
                                                        name={"userNm"}
                                                        required={true}
                                                        placeholder={"이름을 입력해주세요."}
                                                        validationMessage={"이름을 입력해주세요."}
                                                        onChange={(event) => onChangeHandler("userNm", event)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Input
                                                        style={{width : "275px"}}
                                                        ref={emailRef}
                                                        name={"email"}
                                                        type={"email"}
                                                        readOnly={formData.emailValidate}
                                                        required={true}
                                                        placeholder={"이메일을 입력해주세요."}
                                                        validationMessage={"이메일 형식을 확인해주세요."}
                                                        onChange={(event) => onChangeHandler("email", event)}
                                                    />
                                                    <Button className={"duple-check-btn btn"}
                                                            onClick={(event) => onCheckDuplication(event, "email")}>중복체크</Button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <CustomSearchComboBox
                                                        name={"orgCode"}
                                                        placeholder={"소속을 검색해주세요."}
                                                        remoteUrl={"/api/common/region/lvl2"}
                                                        textField={"fulAdmNm"}
                                                        dataItemKey={"admCode"}
                                                        onChange={(event) => onChangeHandler("orgCode", event)}
                                                        itemRender={(li, itemProps) => {
                                                            const itemChildren = (
                                                                <p>{itemProps.dataItem.fulAdmNm}</p>
                                                            );
                                                            return cloneElement(li, li.props, itemChildren);
                                                        }}
                                                        required={true}
                                                    />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <ul className={"btnWrap"}>
                                        <li>
                                            <Button type={"submit"} className={"registration-btn"}
                                                    onClick={props.onConfirm}>등록</Button>
                                            <Button className={"cancel-btn btn ml5"}
                                                    onClick={onClickCancel}>취소</Button>
                                        </li>
                                    </ul>
                                </Form>
                            )
                        }
                    }
                </Formik>
            </div>
        </Fragment>
    );
}
export default memo(UserJoin);
