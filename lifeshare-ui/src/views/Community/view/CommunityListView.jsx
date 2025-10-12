import {Fragment, memo} from "react";
import CommunityList from "@/components/Community/CommunityList";
/**
 * CommunityListView : 공지사항 목록 화면 컴포넌트
 *
 * @author minyoung
 * @version 1.0.0
 */
const CommunityListView = (props) => {
    return (
        <Fragment>
            <div className={"v-community-list v-layout"}>
                <CommunityList/>
            </div>
        </Fragment>
    )
}
export default memo(CommunityListView);