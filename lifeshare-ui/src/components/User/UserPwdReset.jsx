import {Fragment, useContext, useRef, useState, useCallback, memo, useEffect} from 'react';
import {Formik, Form} from "formik";
import {Input, Button} from '@progress/kendo-react-all';
import {modalContext} from "@/components/Common/Modal";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";
import ServiceApi from "@/common/ServiceApi";
import {useHistory} from "react-router";

/**
 * @funcName : UserPwdReset
 * @description : 비밀번호 초기화 컴포넌트
 * @param :
 * @return :
 * @exception :
 * @date : 2022-06-08 오전 10:08
 * @author : ChoiJisoo
 * @see
 * @history : 2022-08-09 cukwom 수정
 **/
const UserPwdReset = (props) => {

    //modal context 설정
    const modal = useContext(modalContext);
    const loadingSpinner = useContext(loadingSpinnerContext);

    //폼 ref hook
    const formRef = useRef();
    const history = useHistory();

    //clean up 변수
    let isComponentMounted = true;

    //form data state
    const [formData, setFormData] = useState({
        userId: null,
        userNm: null,
        newPwd: null,
        newPwdChk: null,
        pwdResetSttus: null,
    });

    //todo componentDidUpdate
    useEffect(() => {
        if (props.data) {
            setFormData(prevState => ({
                ...prevState,
                ...props.data
            }));
        }
    }, [props.data]);

    //todo componentDidUnMount
    useEffect(() => {
        return () => {
            isComponentMounted = false;
        };
    }, []);

    /**
     * @funcName : reqPutUserPwdReset
     * @description : 비밀번호를 초기화한다
     * @param :
     * @return :
     * @exception :
     * @date : 2022-06-08 오전 10:09
     * @author : ChoiJisoo
     * @see
     * @history :
     **/
    const reqPutUserPwdReset = async (formData) => {
        if (formData.newPwd !== formData.newPwdChk) {
            modal.showAlert("알림", "새로운 비밀번호가 동일하지 않습니다.");
            return false;
        }
        loadingSpinner.show(formRef.current);
        try {
            const result = await ServiceApi.user.reqPutUserPwdReset(formData);
            if (result && isComponentMounted) {
                modal.showAlert("알림", "비밀번호가 변경되었습니다.\r\n다시 로그인 해주세요.", null, () => {
                    history.push("/login");
                });
            } else {
                modal.showAlert("알림", "비밀번호 변경 실패하였습니다.\r\n다시 시도해주세요.");
            }
            loadingSpinner.hide();

        } catch (err) {
            modal.showAlert("알림", "서버처리 중 오류가 발생하였습니다.\r\n관리자에게 문의해주세요.");
            loadingSpinner.hide();
        }
    }

    /**
     * @funcName : onChangeHandler
     * @description : 공통 change 이벤트 핸들러
     * @param name : 필드명
     * @param event : 이벤트 객체
     * @return :
     * @exception :
     * @date : 2022-06-08 오전 10:13
     * @author : ChoiJisoo
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
            <div className={"ns-pwd-reset"} style={{display: "table-cell", verticalAlign: "middle"}}>
                {
                    formData.pwdResetSttus && formData.pwdResetSttus === "R" ?
                        <Formik
                            enableReinitialize={true}
                            initialValues={formData}
                            onSubmit={reqPutUserPwdReset}>
                            {
                                formik => {
                                    return (
                                        <Form className={"form"} onSubmit={formik.handleSubmit} ref={formRef}>
                                            <h1>국도교통정보시스템</h1>
                                            <p>비밀번호 변경</p>
                                            <div className={"tbl"}>
                                                <table>
                                                    <colgroup>
                                                        <col width="*"/>
                                                    </colgroup>
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <Input
                                                                value={formData.userId}
                                                                readOnly={true}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Input
                                                                name={"newPwd"}
                                                                type={"password"}
                                                                placeholder={"변경할 비밀번호를 입력해주세요."}
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
                                                        <td>
                                                            <Input
                                                                name={"newPwdChk"}
                                                                type={"password"}
                                                                placeholder={"변경할 비밀번호를 확인해주세요."}
                                                                minLength={4}
                                                                maxLength={12}
                                                                pattern={"^(?=.*[a-z])[a-z\\d$@$!%*?-_+=&]{4,12}$"}
                                                                validationMessage={"비밀번호는 4~12자리, 영소문자를 최소 한 글자 이상 포함해야합니다. (한글, 영대문자 불가)"}
                                                                required={true}
                                                                onChange={(event) => onChangeHandler("newPwdChk", event)}
                                                            />
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ul className={"btnWrap"}>
                                                <li>
                                                    <Button type={"submit"} className={"change-btn"}>변경하기</Button>
                                                    <Button className={"cancel-btn btn"} onClick={onClickCancel}>취소</Button>
                                                </li>
                                            </ul>
                                        </Form>
                                    )
                                }
                            }
                        </Formik>
                        :
                        <p>비밀번호 초기화 요청. 관리자에게 문의하십시오.</p>
                }

            </div>
        </Fragment>
    );
}
export default memo(UserPwdReset);
