import {Fragment, useContext, useRef, useState, useCallback, memo, useEffect} from 'react';
import {Formik, Form} from "formik";
import {Input, Button} from '@progress/kendo-react-all';
import {modalContext} from "@/components/Common/Modal";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";
import ServiceApi from "@/common/ServiceApi";
import {useHistory} from "react-router";

/**
 * @className : UserSearchId
 * @description : 아이디찾기 클래스
 * @date : 2022-06-27 오후 5:09
 * @author : parksujin
 * @version : 1.0.0
 * @see
 * @history : 2022-08-09 cukwom 수정
 **/
const UserSearchId = (props) => {

    //modal context 설정
    const modal = useContext(modalContext);
    const loadingSpinner = useContext(loadingSpinnerContext);
    const history = useHistory();

    //폼 ref hook
    const formRef = useRef();

    //clean up 변수
    let isComponentMounted = true;

    //form data state
    const [formData, setFormData] = useState({
        userNm: null,
        email: null,
    });

    //todo componentDidUnMount
    useEffect(() => {
        return () => {
            isComponentMounted = false;
        };
    }, []);

    /**
     * @funcName : reqGetUserId
     * @description : 사용자 아이디를 가져온다.
     * @param formData
     * @return :
     * @exception :
     * @date : 2022-06-27 오후 5:09
     * @author : parksujin
     * @see
     * @history :
     **/
    const reqGetUserId = async (formData) => {
        loadingSpinner.show(formRef.current);
        try {
            const result = await ServiceApi.user.reqGetUserId(formData);
            if (result && isComponentMounted) {
                if (result.exist) {
                    if (props.data && props.data instanceof Function) {
                        props.data(preState => ({
                            ...preState,
                            findUser : {...result.userInfo},
                            mode : result.userInfo.pwdResetSttus === "R" ? "RESET" : "RESULT"
                        }));
                    }
                }else {
                    modal.showAlert("알림", "인증에 실패하였습니다.");
                }
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
     * @date : 2022-06-27 오후 5:09
     * @author : parksujin
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
            <div className={"ns-search-id"}>
                <Formik enableReinitialize={true}
                        initialValues={formData}
                        onSubmit={reqGetUserId}>
                    {
                        formik => {
                            return (
                                <Form className={"form"} onSubmit={formik.handleSubmit} ref={formRef}>
                                    <h1>국도교통정보시스템</h1>
                                    <p>ID/비밀번호 찾기</p>
                                    <div className={"tbl"}>
                                        <table>
                                            <colgroup>
                                                <col width="*"/>
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <Input
                                                        name={"userNm"}
                                                        required={true}
                                                        placeholder={"이름을 입력해주세요."}
                                                        onChange={(event) => onChangeHandler("userNm", event)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Input
                                                        name={"email"}
                                                        type={"email"}
                                                        required={true}
                                                        placeholder={"이메일을 입력해주세요."}
                                                        onChange={(event) => onChangeHandler("email", event)}
                                                    />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <ul className={"btnWrap"}>
                                        <li>
                                            <Button type={"submit"} className={"confirm-btn"}
                                                    onClick={props.onConfirm}>인증하기</Button>
                                            <Button className={"cancel-btn btn"}
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
export default memo(UserSearchId);
