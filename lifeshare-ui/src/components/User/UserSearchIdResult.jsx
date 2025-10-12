import {Fragment, useContext, useRef, useState, memo, useEffect, useCallback} from 'react';
import {Button} from '@progress/kendo-react-all';
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";
import ServiceApi from "@/common/ServiceApi";
import {modalContext} from "@/components/Common/Modal";
import {useHistory} from "react-router";

/**
 * @className : UserSearchIdResult
 * @description : 아이디 찾기 결과 클래스
 * @date : 2022-06-27 오후 5:09
 * @author : parksujin
 * @version : 1.0.0
 * @see
 * @history : 2022-08-09 cukwom 수정
 **/
const UserSearchIdResult = (props) => {

    //user state
    const [user, setUser] = useState(null);

    //clean up 변수
    let isComponentMounted = true;

    const history = useHistory();

    //ref
    const formRef = useRef();

    //context api
    const loadingSpinner = useContext(loadingSpinnerContext);
    const modal = useContext(modalContext);

    //todo componentDidUpdate
    useEffect(() => {
        if (props.data) {
            setUser({...props.data})
        }
    }, [props.data]);

    //todo componentDidUnMount
    useEffect(() => {
        return () => {
            isComponentMounted = false;
        };
    }, []);

    /**
     * @funcName : reqPutUserPwdRequest
     * @description : 비밀번호 초기화 요청을 한다.
     * @param userId : userId
     * @return :
     * @exception :
     * @date : 2022-06-27 오후 5:09
     * @author : parksujin
     * @see
     * @history :
     **/
    const reqPutUserPwdRequest = async (userId) => {
        loadingSpinner.show(formRef.current);
        const params = {
            userId: userId
        }
        try {
            const result = await ServiceApi.user.reqPutUserPwdRequest(params);
            if (result && isComponentMounted) {
                modal.showAlert("알림", "초기화요청을 하였습니다.\r\n관리자가 승인 후, 비밀번호 초기화를 할 수 있습니다.", null, () => {
                    history.push("/login");
                });
            }else {
                modal.showAlert("알림", "초기화요청에 실패하였습니다.\r\n다시 시도해주세요.");
            }
            loadingSpinner.hide();
        } catch (err) {
            modal.showAlert("알림", "서버처리 중 오류가 발생하였습니다.\r\n관리자에게 문의해주세요.");
            loadingSpinner.hide();
        }
    };

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
            <div className={"ns-search-id-result"}>
                {
                    user ?
                        <Fragment>
                            <div className={"form"}>
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
                                                <strong>{user.userNm}님의 아이디는 <i>{user.userId}</i> 입니다.</strong>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <ul className={"btnWrap"}>
                                    <li>
                                        <Button type={"submit"} className={"reset-btn"}
                                                onClick={() => reqPutUserPwdRequest(user.userId)}>비밀번호 초기화 요청</Button>
                                        <Button className={"cancel-btn btn"}
                                                onClick={onClickCancel}>취소</Button>
                                    </li>
                                </ul>
                            </div>
                        </Fragment>
                        :
                        <p>아이디가 존재하지 않습니다.</p>
                }
            </div>
        </Fragment>
    );
}
export default memo(UserSearchIdResult);
