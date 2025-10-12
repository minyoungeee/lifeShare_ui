import {Fragment, memo} from "react";
import CommunityDetail from "@/components/Community/CommunityDetail";

/**
 * CommunityDetailView : 채용 공고 상세 화면 컴포넌트
 *
 * @author minyoung
 * @version 1.0.0
 **/


const CommunityDetailView = (props) => {
    return (
        <Fragment>
            <div className={"v-community-list v-layout"}>
                <CommunityDetail {...props}/>
            </div>
        </Fragment>
    );
};
export default memo(CommunityDetailView);