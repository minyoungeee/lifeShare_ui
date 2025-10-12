/**
 * 선택 대시보드 action
 */
export const SELECTED_DASHBOARD = "@@RD2/SELECTED_DASHBOARD";

/**
 * 대시보드 목록 action
 */
export const SET_DASHBOARD = "@@RD2/SET_DASHBOARD";

/**
 * 선택된 대시보드를 저장한다.
 *
 * @param tabIndex 탭 인덱스
 * @param timestamp 타임스탬프
 * @author chauki
 * @version 1.0
**/
export const setSelectedDashboard = (tabIndex, timestamp) => ({
    type : SELECTED_DASHBOARD,
    payload : {
        tabIndex : tabIndex,
        timestamp : timestamp
    }
});

/**
 * 대시보드 목록을 저장한다.
 *
 * @param dashboardList 대시보드 목록 정보
 * @param isInit 초기화 여부
 * @author chauki
 * @version 1.0
**/
export const setDashboardList = (dashboardList, isInit = true) => ({
    type : SET_DASHBOARD,
    payload : {
        dashboardList : [...dashboardList],
        isInit : isInit
    }
});