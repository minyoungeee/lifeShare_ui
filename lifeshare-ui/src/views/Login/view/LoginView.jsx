import {Fragment, memo} from "react";
import Login from "@/components/Login/Login";

/**
 * @className : LoginView
 * @description : 로그인 화면 컴포넌트
 * @date : 2022-08-08 오후 10:48
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history
**/
const LoginView = (props) => {
    return (
        <Fragment>
            <div>
                <Login />
            </div>
        </Fragment>
    );
};
export default memo(LoginView);
