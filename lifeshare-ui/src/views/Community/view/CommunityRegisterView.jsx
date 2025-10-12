import {Fragment, memo} from "react";
import CommunityRegistration from "@/components/Community/CommunityRegistration";

/**
 * 공지사항 등록 화면 컴포넌트
 *
 * @author minyoung
 * @version 1.0
 **/
const CommunityRegisterView = (props) => {
    return (
        <Fragment>
            <div className={"v-community-register v-layout"}>
                <CommunityRegistration />
            </div>
        </Fragment>
    );
};
export default memo(CommunityRegisterView);