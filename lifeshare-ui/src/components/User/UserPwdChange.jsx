import React, {Fragment, useContext, useRef, useState, useCallback, memo, useEffect} from 'react';
import {Formik, Form} from "formik";
import {Input, Button} from '@progress/kendo-react-all';
import {modalContext} from "@/components/Common/Modal";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";
import "@/components/User/User.css";
import ServiceApi from "@/common/ServiceApi";
import {useSelector} from "react-redux";
import {util} from "@/common/Common";
import {useHistory} from "react-router";
import {persistor} from "@/redux/store/StorePersist";
import { JSEncrypt } from "jsencrypt";

/**
 * @className : UserPwdChange
 * @description : 비밀번호 변경 컴포넌트
 * @date : 2022-06-03 오후 2:00
 * @author : taejin
 * @version : 1.0.0
 * @see
 * @history :
 **/
const UserPwdChange = (props) => {
    //useSelector = hook api
    const store = useSelector((store) => store);
    const auth = store.auth;

    //modal context 설정
    const modal = useContext(modalContext);
    const loadingSpinner = useContext(loadingSpinnerContext);
    const history = useHistory();

    //폼 ref hook
    const formRef = useRef();

    //clean up
    let isComponentMounted = true;

    //form data state
    const [formData, setFormData] = useState({
        userId : null,
        pwd: null,
        newPwd: null,
        newPwdChk: null
    });

    //todo componentDidUpdate
    useEffect(() => {
        if (props.location && props.location.state) {
            setFormData(prevState => ({
                ...prevState,
                userId : props.location.state.userId
            }));
        }
    }, [props.location]);

    //todo componentDidUpDate
    useEffect(() => {
        if (auth.user) {
            setFormData(prevState => ({
                ...prevState,
                userId : auth.user.userId
            }));
        }
    }, [auth.user]);

    //todo componentDidUnMount
    useEffect(() => {
        return () => {
            isComponentMounted = false;
        }
    }, []);

    /**
     * @funcName : doPwdChange
     * @description : 비밀번호를 변경한다.
     * @date : 2022-06-03 오후 2:25
     * @author : taejin
     * @version : 1.0.0
     * @see
     * @history :
     **/
    const doPwdChange = async (formData) => {
        if (formData.newPwd !== formData.newPwdChk) {
            modal.showAlert("알림", "새로운 비밀번호를 확인해주세요.");
            return false;
        }
        loadingSpinner.show(formRef.current);
        try {

            const params = {...formData};

            //rsa
            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(auth.publicKey);
            params.pwd = encrypt.encrypt(params.pwd);
            params.newPwd = encrypt.encrypt(params.newPwd);
            delete params["userId"];
            delete params["newPwdChk"];


            const result = await ServiceApi.user.reqPutUserPwdChange(params);
            if (result) {
                modal.showAlert("알림", "비밀번호 변경에 성공했습니다.\r\n다시 로그인 해주세요.", null,() => {
                    if (props.type && props.type === "AFTER_LOGIN") {
                        reqPostLogout();
                    }else {
                        history.push("/login");
                    }
                });
            } else {
                modal.showAlert("알림", "비밀번호 변경에 실패했습니다.\r\n다시 시도해주세요.");
            }
            loadingSpinner.hide();
        } catch (err) {
            modal.showAlert("알림", "서버처리 중 오류가 발생하였습니다.\r\n관리자에게 문의해주세요.");
            loadingSpinner.hide();
        }
    };

    /**
     * @funcName : onChangeHandler
     * @description : 공통 change 이벤트 핸들러
     * @param name : 필드명
     * @param event : 이벤트 객체
     * @return :
     * @exception :
     * @date : 2022-06-03 오후 4:00
     * @author : taejin
     * @see
     * @history :
     **/
    const onChangeHandler = useCallback((name, event) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: event.value
        }));
    }, [formData]);


    const reqPostLogout = async () => {
        try {
            const result = await ServiceApi.auth.reqLogout();
            if (result && isComponentMounted) {
                sessionStorage.removeItem("token");
                await persistor.purge();
            }
        }catch (err) {
            //console.log(err);
        }
    };

    return (
        <Fragment>
            <div className={"ns-user-pwd-change"}>
                <h2>사용자 비밀번호 변경</h2>
                {
                    props.type && props.type === "AFTER_LOGIN"
                    ?
                        <Formik
                            enableReinitialize={true}
                            initialValues={formData}
                            onSubmit={doPwdChange}>
                            {
                                formik => {
                                    return (
                                        <Form ref={formRef} className={"form"}>
                                            <table className={"tbl"}>
                                                <colgroup>
                                                    <col width="140px"/>
                                                    <col width="*"/>
                                                </colgroup>
                                                <tbody>
                                                <tr>
                                                    <th>사용자 ID</th>
                                                    <td>{formData.userId}</td>
                                                </tr>
                                                <tr>
                                                    <th>현재 비밀번호</th>
                                                    <td>
                                                        <Input
                                                            style={{width: "240px"}}
                                                            name={"pwd"}
                                                            type={"password"}
                                                            placeholder={"현재 비밀번호를 입력해주세요."}
                                                            minLength={4}
                                                            maxLength={12}
                                                            required={true}
                                                            onChange={(event) => onChangeHandler("pwd", event)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>새 비밀번호</th>
                                                    <td>
                                                        <Input
                                                            style={{width: "240px"}}
                                                            name={"newPwd"}
                                                            type={"password"}
                                                            placeholder={"새로운 비밀번호를 입력해주세요."}
                                                            minLength={4}
                                                            maxLength={12}
                                                            pattern={"^(?=.*[a-z])[a-z\\d$@$!%*?-_+=&]{4,12}$"}
                                                            validationMessage={"비밀번호는 4~12자리, 영소문자를 최소 한 글자 이상 포함해야합니다. (한글, 영대문자 불가)"}
                                                            required={true}
                                                            onChange={(event) => onChangeHandler("newPwd", event)}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>새 비밀번호 확인</th>
                                                    <td>
                                                        <Input
                                                            style={{width: "240px"}}
                                                            name={"newPwdChk"}
                                                            type={"password"}
                                                            placeholder={"새로운 비밀번호 한번 더 입력해주세요."}
                                                            minLength={4}
                                                            maxLength={12}
                                                            pattern={"^(?=.*[a-z])[a-z\\d@$!%*#?&^+=-]{4,12}$"}
                                                            validationMessage={"비밀번호는 4~12자리, 영소문자를 최소 한 글자 이상 포함해야합니다. (한글, 영대문자 불가)"}
                                                            required={true}
                                                            onChange={(event) => onChangeHandler("newPwdChk", event)}
                                                        />
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <ul className="btnWrap">
                                                <li>
                                                    <Button type={"submit"} className={"btn"}
                                                            style={{float: "right"}}>변경하기
                                                    </Button>
                                                </li>
                                            </ul>
                                        </Form>
                                    )
                                }
                            }
                        </Formik>
                    :
                        <Formik
                            enableReinitialize={true}
                            initialValues={formData}
                            onSubmit={doPwdChange}>
                            {
                                formik => {
                                    return (
                                        <div className={"form"}>
                                            {/*<div style={{textAlign: "center"}}>
                                                <p>비밀번호 변경</p><br/>
                                                <span>
                                                        초기에 설정된 비밀번호는<br/>
                                                        안전한 사용을 위해 꼭 변경해주세요.</span>
                                            </div>*/}
                                            <h1>국도교통정보시스템</h1>
                                            {/*<p>비밀번호 변경</p>*/}
                                            <Form ref={formRef}>
                                                <fieldset>
                                                    {/*<div>*/}
                                                    {/*    <Input*/}
                                                    {/*        name={"userId"}*/}
                                                    {/*        className={"wdfull"}*/}
                                                    {/*        type={"text"}*/}
                                                    {/*        required={true}*/}
                                                    {/*        value={formData.userId || ''}*/}
                                                    {/*        readOnly={true}*/}
                                                    {/*    />*/}
                                                    {/*</div>*/}
                                                    <p>{formData.userId}</p>
                                                    <div className={"mt5"}>
                                                        {/*<h2>현재 비밀번호를 입력해주세요.</h2>*/}
                                                        <Input
                                                            className={"wdfull"}
                                                            name={"pwd"}
                                                            type={"password"}
                                                            placeholder={"현재 비밀번호를 입력해주세요."}
                                                            minLength={4}
                                                            maxLength={12}
                                                            required={true}
                                                            onChange={(event) => onChangeHandler("pwd", event)}
                                                        />
                                                    </div>
                                                    <div  className={"mt5"}>
                                                        {/* <h2>새로운 비밀번호를 입력해주세요.</h2>*/}
                                                        <Input
                                                            className={"wdfull"}
                                                            name={"newPwd"}
                                                            type={"password"}
                                                            placeholder={"새로운 비밀번호를 입력해주세요."}
                                                            minLength={4}
                                                            maxLength={12}
                                                            pattern={"^(?=.*[a-z])[a-z\\d$@$!%*?-_+=&]{4,12}$"}
                                                            validationMessage={"비밀번호는 4~12자리, 영소문자를 최소 한 글자 이상 포함해야합니다. (한글, 영대문자 불가)"}
                                                            required={true}
                                                            onChange={(event) => onChangeHandler("newPwd", event)}
                                                        />
                                                    </div>
                                                    <div  className={"mt5"}>
                                                        {/*  <h2>새로운 비밀번호를 한번 더 입력해주세요.</h2>*/}
                                                        <Input
                                                            className={"wdfull"}
                                                            name={"newPwdChk"}
                                                            type={"password"}
                                                            placeholder={"새로운 비밀번호 한번 더 입력해주세요."}
                                                            minLength={4}
                                                            maxLength={12}
                                                            pattern={"^(?=.*[a-z])[a-z\\d@$!%*#?&^+=-]{4,12}$"}
                                                            validationMessage={"비밀번호는 4~12자리, 영소문자를 최소 한 글자 이상 포함해야합니다. (한글, 영대문자 불가)"}
                                                            required={true}
                                                            onChange={(event) => onChangeHandler("newPwdChk", event)}
                                                        />
                                                    </div>
                                                    <div className={"mt20"}>
                                                        <Button
                                                            type={"submit"}
                                                            className={"ht35 wdfull"}
                                                            themeColor={"primary"}>변경하기</Button>
                                                    </div>
                                                </fieldset>
                                            </Form>
                                        </div>
                                    )
                                }
                            }
                        </Formik>
                }
            </div>
        </Fragment>
    );
}
export default memo(UserPwdChange);