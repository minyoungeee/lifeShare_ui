import React, { useEffect, memo, Fragment, useCallback } from "react";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import "@/components/Menu/Menu.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import {setSelectedDashboard} from "@/redux/action/DashboardAction.jsx";

/**
 * 메뉴 컴포넌트 (React Router v6 호환)
 *
 * @author
 * @version 2.0
 */
const Menu = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /** mount/unmount lifecycle */
    useEffect(() => {
        return () => {
            // cleanup
        };
    }, []);

    /**
     * 메뉴 클릭 시 페이지 이동
     * @param {*} event
     */
    const onSelectMenu = useCallback((event) => {
        const path = event?.target?.props?.content;
        if (path) {
            navigate(path);

            // Redux 대시보드 초기화 (기존 로직 유지)
            dispatch(setSelectedDashboard(-1, moment().toDate().getTime()));
        }
    }, [dispatch, navigate]);

    return (
        <Fragment>
            <div className="ns-menu-contents">
                <PanelBar expandMode="single" onSelect={onSelectMenu}>
                    {/*<PanelBarItem*/}
                    {/*    title="검색 키워드"*/}
                    {/*    content="/keyword/list"*/}
                    {/*    selected={false}*/}
                    {/*/>*/}
                    {/*<PanelBarItem*/}
                    {/*    title="솔루션"*/}
                    {/*    content="/solution/list"*/}
                    {/*/>*/}
                    {/*<PanelBarItem*/}
                    {/*    title="채용 정보"*/}
                    {/*    content="/employ/list"*/}
                    {/*/>*/}
                    {/*<PanelBarItem*/}
                    {/*    title="이웃피드"*/}
                    {/*    content="/feed/list"*/}
                    {/*/>*/}
                    <PanelBarItem
                        title="Community"
                        content="/community/list"
                    />
                </PanelBar>
            </div>
        </Fragment>
    );
};

export default memo(Menu);
