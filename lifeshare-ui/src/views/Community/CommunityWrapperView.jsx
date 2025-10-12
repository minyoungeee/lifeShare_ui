import { Fragment, memo } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import CommunityListView from "@/views/Community/view/CommunityListView";
import CommunityRegisterView from "@/views/Community/view/CommunityRegisterView";
import CommunityDetailView from "@/views/Community/view/CommunityDetailView";
import "@/views/Community/CommunityWrapperView.css";

/**
 * 커뮤니티 화면 wrapper 뷰
 *
 * @author minyoung
 * @version 2.0 (탭바 포함)
 **/
const CommunityWrapperView = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 상단 탭 메뉴 목록
    const tabs = [
        { name: "Community", path: "/community/list" },
        // { name: "Employ", path: "/employ/list" },
        // { name: "Feed", path: "/feed/list" },
        // { name: "Patent", path: "/patent/list" },
    ];

    return (
        <Fragment>
            <div className="community-wrapper">
                {/* ✅ 탭바 */}
                <div className="community-tabbar">
                    {tabs.map((tab) => (
                        <div
                            key={tab.path}
                            className={`community-tab ${
                                location.pathname.startsWith(tab.path) ? "active" : ""
                            }`}
                            onClick={() => navigate(tab.path)}
                        >
                            {tab.name}
                        </div>
                    ))}
                </div>

                {/* ✅ 실제 콘텐츠 */}
                <div className="community-content">
                    <Routes>
                        {/* 리스트 */}
                        <Route path="list" element={<CommunityListView />} />

                        {/* 등록 */}
                        <Route path="register" element={<CommunityRegisterView />} />

                        {/* 상세 */}
                        <Route path="detail" element={<CommunityDetailView />} />

                        {/* 기본 접근 시 list로 이동 */}
                        <Route path="*" element={<Navigate to="list" replace />} />
                    </Routes>
                </div>
            </div>
        </Fragment>
    );
};

export default memo(CommunityWrapperView);
