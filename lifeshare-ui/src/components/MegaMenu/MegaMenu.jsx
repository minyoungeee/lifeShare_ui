import {
    useState,
    useCallback,
    Fragment,
    memo,
    cloneElement,
    useEffect
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "@/components/MegaMenu/MegaMenu.css";
import { useSelector } from "react-redux";

/**
 * 메인 MegaMenu 컴포넌트
 */
const MegaMenu = ({ container }) => {
    return (
        <div className="ns-mega-menu">
            {container}
        </div>
    );
};

/**
 * MegaMenu 컨테이너 (좌/중앙/우 구성)
 */
const MegaMenuContainer = ({ leftItems, centerItems, rightItems }) => {
    const [isOpen, setIsOpen] = useState(false);

    const dropMenuOpen = useCallback(() => setIsOpen(true), []);
    const dropMenuClose = useCallback(() => setIsOpen(false), []);

    const addDropMenuEventProps = (elem) => {
        return cloneElement(elem, {
            onMenuOpen: dropMenuOpen,
            onMenuClose: dropMenuClose,
        });
    };

    return (
        <Fragment>
            <div
                className={`ns-menu-container ${isOpen ? "open" : "close"}`}
            >
                <ul className="ns-menu-items">
                    {leftItems && (
                        <li className="mega-left-item">
                            {addDropMenuEventProps(leftItems)}
                        </li>
                    )}
                    {centerItems && (
                        <li className="mega-center-item">
                            {addDropMenuEventProps(centerItems)}
                        </li>
                    )}
                    {rightItems && (
                        <li className="mega-right-item">
                            {addDropMenuEventProps(rightItems)}
                        </li>
                    )}
                </ul>
            </div>
        </Fragment>
    );
};

/**
 * MegaMenu 목록 데이터 관리
 */
const MegaMenuList = ({ data, onMenuOpen, onMenuClose }) => {
    const location = useLocation();
    const auth = useSelector((store) => store.auth);
    const [menuList, setMenuList] = useState([]);
    const [locationPath, setLocationPath] = useState([]);

    /** 유저 권한에 따라 메뉴 필터링 */
    useEffect(() => {
        if (!auth?.user) return;
        if (auth.user.userGrad === "U01") {
            // 일반 운용자
            const tmpData = data.filter(
                (item) =>
                    item.path !== "settings" &&
                    item.path !== "systems" &&
                    item.path !== "history"
            );
            setMenuList(tmpData);
        } else {
            setMenuList(data);
        }
    }, [auth, data]);

    /** 현재 경로 추출 */
    useEffect(() => {
        const paths = location.pathname.split("/").filter(Boolean);
        setLocationPath(paths);
    }, [location]);

    return (
        <Fragment>
            {menuList.length > 0 && (
                <MegaMenuWrapper
                    data={menuList}
                    onMenuOpen={onMenuOpen}
                    onMenuClose={onMenuClose}
                    nowLocation={locationPath}
                />
            )}
        </Fragment>
    );
};

/**
 * MegaMenu Wrapper (1뎁스 메뉴)
 */
const MegaMenuWrapper = ({ data, onMenuOpen, onMenuClose, nowLocation }) => {
    return (
        <ul className="ns-menu-list-dept-0">
            {data.map((dept1, idx) => (
                <MegaMenuItem
                    key={idx}
                    data={dept1}
                    dept={0}
                    url={dept1.url}
                    onMenuOpen={onMenuOpen}
                    onMenuClose={onMenuClose}
                    nowLocation={nowLocation}
                />
            ))}
        </ul>
    );
};

/**
 * MegaMenu Item (재귀적 메뉴 렌더링)
 */
const MegaMenuItem = ({
                          data,
                          dept,
                          url,
                          onMenuOpen,
                          onMenuClose,
                          nowLocation,
                      }) => {
    const [isSelectedMenu, setIsSelectedMenu] = useState(false);
    const navigate = useNavigate();

    /** 현재 경로와 비교하여 선택 상태 반영 */
    useEffect(() => {
        if (nowLocation.length > dept) {
            setIsSelectedMenu(nowLocation[dept] === data.path);
        } else {
            setIsSelectedMenu(false);
        }
    }, [nowLocation, data.path, dept]);

    /** 메뉴 클릭 시 이동 */
    const goURL = useCallback(() => {
        if (url) {
            navigate(url);
            onMenuClose?.();
        }
    }, [navigate, url, onMenuClose]);

    return (
        <li className={isSelectedMenu ? "now" : ""}>
            <a onClick={goURL}>
                {dept === 1 ? (
                    <strong className={isSelectedMenu ? "now" : ""}>
                        {data.title}
                    </strong>
                ) : (
                    <span className={isSelectedMenu ? "now" : ""}>
                        {data.title}
                    </span>
                )}
            </a>

            {/* 하위 메뉴 */}
            {data.subMenu && data.subMenu.length > 0 && (
                <ul className={`ns-menu-list-dept-${dept + 1}`}>
                    {data.subMenu.map((child, index2) => (
                        <MegaMenuItem
                            key={`${dept}-${index2}`}
                            data={child}
                            dept={dept + 1}
                            url={child.url}
                            onMenuOpen={onMenuOpen}
                            onMenuClose={onMenuClose}
                            nowLocation={nowLocation}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export { MegaMenu, MegaMenuContainer, MegaMenuList };
export default memo(MegaMenu);
