import { Fragment, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/action/AuthAction";
import ServiceApi from "@/common/ServiceApi";
import { modalContext } from "@/components/Common/Modal";
import { util } from "@/common/Common";
import '@/components/NaviBar/NaviBar.css';
import { Button } from "@progress/kendo-react-buttons";

/**
 * @component : NaviBar
 * @description : 상단 네비게이션 바 (홈 이동, 로그아웃 등)
 **/
const NaviBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((store) => store.auth);
    const modal = useContext(modalContext);

    /** 메인 페이지 이동 */
    const goMainView = () => {
        navigate("/community/list");
    };

    /** 로그아웃 수행 */
    const doLogout = () => {
        modal.showConfirm("알림", "로그아웃하시겠습니까?", {
            btns: [
                {
                    title: "로그아웃",
                    click: async () => {
                        try {
                            const result = await ServiceApi.auth.reqLogout(null);
                            if (result) {
                                dispatch(logout());
                                sessionStorage.removeItem("session");
                                sessionStorage.removeItem("token");
                                navigate("/login");
                            } else {
                                modal.showAlert("알림", "로그아웃을 하지 못하였습니다.");
                            }
                        } catch (err) {
                            modal.showAlert("알림", "로그아웃 중 오류가 발생했습니다.");
                        }
                    },
                },
                {
                    background: "#75849a",
                    title: "취소",
                },
            ],
        });
    };

    return (
        <Fragment>
            <div className="navibar-wrapper">
                <div className="fl" style={{ width: "20%", minWidth: "300px" }}>
                    <Button className="ml10" style={{ marginTop: "-10px" }} primary={true} onClick={goMainView}>
                        홈
                    </Button>
                    <span className="ml10" style={{ fontSize: "20px" }}>LifeShare</span>
                </div>

                <div className="fr" style={{ width: "30%", minWidth: "500px" }}>
                    <div className="fr">
                        <Button className="mr10" style={{ marginTop: "-10px" }} primary={true} onClick={doLogout}>
                            로그아웃
                        </Button>
                    </div>
                    <div className="fr" style={{ padding: "0 20px" }}>
                        <span>
                            <b>{util.setInitialValueForHash(auth.user, "emplNm", "")}</b> 님 환영합니다.
                        </span>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default NaviBar;
