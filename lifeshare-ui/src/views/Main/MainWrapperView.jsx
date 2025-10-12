import { Fragment, memo } from "react";
import "@/views/Main/MainWrapperView.css";
import { Routes, Route } from "react-router-dom";
import NaviMenu from "@/components/NaviMenu/NaviMenu.jsx";
import CommunityWrapperView from "@/views/Community/CommunityWrapperView.jsx";

const MainWrapperView = () => {
    return (
        <Fragment>
            <div className="v-main">
                <div className="nav-area">
                    <NaviMenu />
                </div>
                <div className="contents-area">
                    <Routes>
                        <Route path="/community/*" element={<CommunityWrapperView />} />
                    </Routes>
                </div>
            </div>
        </Fragment>
    );
};

export default memo(MainWrapperView);
