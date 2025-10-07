import {Fragment, memo, useState} from "react";
import UserSearchId from "@/components/User/UserSearchId";
import UserSearchIdResult from "../../../components/User/UserSearchIdResult";
import UserPwdReset from "../../../components/User/UserPwdReset";

/**
 * @className : LoginFindPasswordView
 * @description : 로그인 비밀번호 찾기 화면 컴포넌트
 * @date : 2022-08-09 오전 12:31
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history
**/
const LoginFindPasswordView = (props) => {

    //data state
    const [data, setData] = useState({
        findUser : null,
        mode : "SEARCH"
    });

    return (
        <Fragment>
            <div>
                {
                    (() => {
                        switch (data.mode) {
                            case "SEARCH":
                                return <UserSearchId data={setData} />
                            case "RESULT":
                                return <UserSearchIdResult data={data.findUser} />
                            case "RESET":
                                return <UserPwdReset data={data.findUser} />
                        }
                    })()
                }
            </div>
        </Fragment>
    );
};
export default memo(LoginFindPasswordView);
