import {Fragment, memo} from "react";
import "@/views/Main/MainWrapperView.css";
import {Route, Switch} from "react-router-dom";
// import {Menu} from "@progress/kendo-react-layout";

/**
 * 메인 래퍼 뷰
 *
 * @author ChoiJisoo
 * @version 1.0.0
 **/
const MainWrapperView = (props) => {

    return (
        <Fragment>
            <div className={"v-main"}>

                {/* 메뉴 영역 */}
                <div className={"nav-area"}>
                    {/*<NaviMenu/>*/}
                </div>
                <div className={"menu-area"}>
                    {/*<Menu/>*/}
                </div>

                {/* 화면 경로 영역 */}
                {/*<div className={"page-area"}>
                    <Breadcrumb data={data}/>
                </div>*/}

                <div className={"contents-area"}>
                    <Switch>
                        {/*<Route path={"/keyword"} component={KeywordWrapperView}/>*/}
                        {/*<Route path={"/employ"} component={EmployWrapperView}/>*/}
                        {/*<Route path={"/solution"} component={SolutionWrapperView}/>*/}
                        {/*<Route path={"/feed"} component={FeedWrapperView}/>*/}
                        {/*<Route path={"/community"} component={CommunityWrapperView}/>*/}
                        {/*<Route path={"/patent"} component={PatentWrapperView}/>*/}
                           {/* <Route path={"/components"} component={ComponentsWrapperView}/>*/}
                        {/*<Route path={["/*", "/error"]} component={NotFound}/>*/}
                    </Switch>
                </div>
            </div>
        </Fragment>
);
};
export default memo(MainWrapperView);
