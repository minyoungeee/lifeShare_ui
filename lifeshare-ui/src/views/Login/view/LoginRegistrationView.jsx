import {Fragment, memo} from "react";
import UserJoin from "@/components/User/UserJoin";

/**
 * @className : LoginRegistrationView
 * @description : 회원가입 화면 컴포넌트
 * @date : 2022-08-08 오후 10:54
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history
**/
const LoginRegistrationView = (props) => {
    return (
        <Fragment>
            <div>
                <UserJoin />
            </div>
        </Fragment>
    );
};
export default memo(LoginRegistrationView);
