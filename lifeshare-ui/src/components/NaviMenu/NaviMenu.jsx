import { Fragment, memo, useCallback, useEffect, useRef, useState } from "react";
import "@/components/NaviMenu/NaviMenu.css";
import { MegaMenu, MegaMenuContainer } from "@/components/MegaMenu/MegaMenu";
import { useSelector } from "react-redux";
import moment from "moment";
import { Button } from "@progress/kendo-react-buttons";
import ServiceApi from "@/common/ServiceApi";
import { useNavigate } from "react-router-dom";
import { persistor } from "@/redux/store/StorePersist";
import logoImg from "@/images/mng/login_logo.png";

/**
 * 네비게이션 메뉴
 * @version 2.0 (React Router v6 호환)
 */
const NaviMenu = () => {
    return (
        <Fragment>
            <MegaMenu
                container={
                    <MegaMenuContainer
                        leftItems={<LogoArea />}
                        rightItems={<UserArea />}
                    />
                }
            />
        </Fragment>
    );
};

/**
 * 로고 영역
 */
const LogoArea = () => {
    return (
        <Fragment>
            <h1 className="ns-title">
                <a href="/community/list">
                    <img
                        src={logoImg}
                        alt="LifeShare Logo"
                        className="logo-img"
                    />
                </a>
            </h1>
        </Fragment>
    );
};

/**
 * 사용자 정보 영역
 */
const UserArea = () => {
    const auth = useSelector((store) => store.auth);
    const navigate = useNavigate();

    const [time, setTime] = useState(new Date());
    const [alarmOn, setAlarmOn] = useState(false);
    const isMounted = useRef(true);

    /** 비밀번호 변경 버튼 클릭 */
    const onClickChangePwd = useCallback(() => {
        navigate("/systems/user/pwd");
    }, [navigate]);

    /** 로그아웃 요청 */
    const reqPostLogout = async () => {
        try {
            await ServiceApi.auth.reqLogout();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            sessionStorage.removeItem("token");
            await persistor.purge();
            navigate("/login");
        }
    };

    /** 🔹 로그아웃 버튼 클릭 */
    const onClickLogout = useCallback(() => {
        reqPostLogout();
    }, []);

    /** 🔹 실시간 시계 */
    useEffect(() => {
        const timer = setInterval(() => {
            if (isMounted.current) setTime(new Date());
        }, 1000);
        return () => {
            isMounted.current = false;
            clearInterval(timer);
        };
    }, []);

    /** 🔹 알림창 ON/OFF */
    const onClickAlarmPopUp = () => {
        setAlarmOn((prev) => !prev);
    };

    return (
        <Fragment>
            <div className="ns-user-area">
                <span className="ns-user-name">
                    {auth?.user?.userNm || "Guest"}
                </span>
                <time className="ns-now-time">
                    {moment().format("YYYY-MM-DD")}{" "}
                    {time.toLocaleTimeString("ko-KR")}
                </time>
                <Button className="ns-user-pwd-change" onClick={onClickChangePwd}>
                    비밀번호 변경
                </Button>
                <Button className="ns-user-logout" onClick={onClickLogout}>
                    로그아웃
                </Button>
            </div>
        </Fragment>
    );
};

export default memo(NaviMenu);
