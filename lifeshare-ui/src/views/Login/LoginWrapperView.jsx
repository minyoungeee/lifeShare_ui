import { Fragment, memo } from "react";
import "@/views/Login/LoginWrapperView.css";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginView from "@/views/Login/view/LoginView";
// import LoginRegistrationView from "@/views/Login/view/LoginRegistrationView";
// import LoginFindPasswordView from "@/views/Login/view/LoginFindPasswordView";
// import UserPwdChange from "@/components/User/UserPwdChange";

/**
 * 로그인 래퍼 뷰
 * @author ...
 **/
const LoginWrapperView = () => {
    return (
        <Fragment>
            <main className="v-login">
                <article className="loginForm">
                    <div className="login-wrap">
                        <Routes>
                            {/* ✅ 기본: /login → 로그인 화면 */}
                            <Route index element={<LoginView />} />

                            {/* ✅ 다른 로그인 관련 탭들 */}
                            {/* <Route path="registration" element={<LoginRegistrationView />} /> */}
                            {/* <Route path="pwd" element={<LoginFindPasswordView />} /> */}
                            {/* <Route path="change/pwd" element={<UserPwdChange />} /> */}

                            {/* ✅ 존재하지 않는 하위 경로는 /login 으로 리다이렉트 */}
                            <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </div>
                </article>
            </main>
        </Fragment>
    );
};

export default memo(LoginWrapperView);
