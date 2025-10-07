import {Fragment, memo, useEffect} from 'react';
import "@/views/Login/LoginWrapperView.css";
import {Route, Switch} from "react-router-dom";
import LoginView from "@/views/Login/view/LoginView";
// import LoginRegistrationView from "@/views/Login/view/LoginRegistrationView";
// import LoginFindPasswordView from "@/views/Login/view/LoginFindPasswordView";
// import UserPwdChange from "@/components/User/UserPwdChange";

/**
 * 로그인 래퍼 뷰
 *
 * @author ChoiJisoo
 * @version 1.0.0
**/
const LoginWrapperView = (props) => {

    /**
     * history
     */
    const history = useHistory();

    //todo componentDidMount
    useEffect(() => {
        history.push("/login");
    }, []);

    return (
        <Fragment>
            <main className={"v-login"}>
                <article className="loginForm">
                    <div className="login-wrap">
                        {/*<h1>*/}
                        {/*    <a href="#">KT RoadSense</a>*/}
                        {/*</h1>*/}
                        <Switch>
                            <Route path={`${props.match.path}`} exact={true} component={LoginView}/>
                            {/*<Route path={`${props.match.path}/registration`} exact={true} component={LoginRegistrationView}/>
                            <Route path={`${props.match.path}/pwd`} exact={true} component={LoginFindPasswordView}/>
                            <Route path={`${props.match.path}/change/pwd`} exact={true} component={UserPwdChange}/>*/}
                        </Switch>
                    </div>
                </article>
            </main>
        </Fragment>
    );
};
export default memo(LoginWrapperView);
