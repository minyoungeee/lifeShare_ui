import {Fragment, useRef, useCallback, useContext, useEffect, useState, memo} from "react";
import "@/components/User/User.css";
import {Button, Pager, Switch} from "@progress/kendo-react-all";
import ServiceApi from "@/common/ServiceApi";
import {ListView} from "@progress/kendo-react-listview";
import {DatePicker} from "@progress/kendo-react-dateinputs";
import {Checkbox, Input} from "@progress/kendo-react-inputs";
import {Form, Formik} from "formik";
import moment from "moment";
import {modalContext} from "@/components/Common/Modal";
import CustomDropDownList from "@/components/Custom/CustomDropDownList";
import LoadingLocalSpinner from "@/components/Loading/LoadingLocalSpinner";
import {useHistory} from "react-router";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";

/**
 * @className : UserList
 * @description : 사용자 목록 컴포넌트
 * @date : 2022-07-25 오전 9:42
 * @author : taejin
 * @version : 1.0.0
 * @see
 * @history :
 **/
const UserList = (props) => {

    const [data, setData] = useState({
        userList : [],
        totalCnt : 0,
        skip : 0,
        take : 10,
        search : null,
        registDt : null,
        loginDt : null,
        userGrad : null,
        orgCode : null,
        timestamp : null
    });

    //clean up 변수
    let isComponentMounted = true;

    //loading spinner
    const [loading, setLoading] = useState(false);

    const modal = useContext(modalContext);

    const loadingSpinner = useContext(loadingSpinnerContext);

    // 체크박스 선택 시 삭제할 리스트
    const [delCheckedList, SetDelCheckedList] = useState([]);

    // 전체 체크 클릭 시 발생하는 함수
    const onCheckedAll = useCallback(
        (checked) => {
            if (checked) {
                const checkedListArray = [];

                data.userList.forEach((list) => checkedListArray.push(list.userId));
                SetDelCheckedList(checkedListArray);
            } else {
                SetDelCheckedList([]);
            }
        },
        [data.userList]
    );

    // 개별 체크 클릭 시 발생하는 함수
    const onCheckedElement = useCallback(
        (event, userId) => {
            event.preventDefault();
            event.stopPropagation();

            if (event.target.checked) {
                SetDelCheckedList([...delCheckedList, userId]);
            } else {
                SetDelCheckedList(delCheckedList.filter((el) => el !== userId));
            }
        },
        [delCheckedList]
    );

    // ref 정의
    const listRef = useRef(); //list 컴포넌트 ref

    //todo componentDidMount
    useEffect(() => {
        reqGetUserList();
    }, [data.skip, data.registDt, data.loginDt, data.userGrad, data.orgCode, data.search, data.timestamp])

    //todo componentDidUnMount
    useEffect(() => {
        return () => {
            isComponentMounted = false;
            setLoading(false);
        }
    }, []);

    /**
     * @funcName : onDelete
     * @description : 사용자 삭제 이벤트 핸들러
     * @param :
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const onDelete = useCallback(() => {
        if (delCheckedList.length !== 0) {
            modal.showConfirm("알림", "사용자 정보를 삭제하시겠습니까?",{
                btns: [
                    {
                        title: "확인",
                        click: () => {
                            reqDeleteUserList(delCheckedList)
                        }
                    },
                    {
                        title: "취소",
                        click: () => {
                            SetDelCheckedList([]);
                        },
                    }
                ],
            });
        }
    }, [delCheckedList]);

    /**
     * @funcName : reqGetUserList
     * @description : 사용자 목록 정보를 조회한다.
     * @param :
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const reqGetUserList = async () => {
        SetDelCheckedList([])

        loadingSpinner.show();
        try {
            const params = {
                pageNo : data.skip,
                limit : data.take
            };
            if (data.search !== null && data.search !== "") {
                params["search"] = data.search;
            }
            if (data.registDt !== null) {
                params["registDt"] = moment(data.registDt).format("YYYY-MM-DD")
            }
            if (data.loginDt !== null) {
                params["loginDt"] = moment(data.loginDt).format("YYYY-MM-DD")
            }
            if (data.userGrad !== null && data.userGrad !== "") {
                params["userGrad"] = data.userGrad;
            }
            if (data.orgCode !== null && data.orgCode !== "") {
                params["orgCode"] = data.orgCode;
            }

            const result = await ServiceApi.user.reqGetUserList(params);
            if (result && isComponentMounted) {
                setData(prevState => ({
                    ...prevState,
                    userList : result.userList,
                    totalCnt : result.totalCnt
                }));
            }
            loadingSpinner.hide();
        } catch (err) {
            loadingSpinner.hide();
        }
    };

    /**
     * @funcName : reqDeleteUserList
     * @description : 사용자 정보를 삭제한다.
     * @param :
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const reqDeleteUserList = async (data) => {
        try {
            const params = {
                userIdList: (data).join(",")
            };

            const result = await ServiceApi.user.reqDeleteUserList(params);

            if (result && isComponentMounted) {
                modal.showAlert("알림", "사용자 정보가 삭제되었습니다.");
            }
            reqGetUserList()
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }

    /**
     * @funcName : onChangeSwitch
     * @description : 승인 여부
     * @param :
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const onChangeSwitch = useCallback((name, event, userId) => {
        event.syntheticEvent.preventDefault();
        event.syntheticEvent.stopPropagation();

        let value = event.value ? 'Y' : 'N';

        modal.showConfirm("알림", "승인 여부 수정을 하시겠습니까?",{
            btns: [
                {
                    title: "확인",
                    click: () => {
                        reqPutUserApprove(userId, value);
                    }
                },
                {
                    title: "취소",
                    click: () => {

                    },
                }
            ],
        });
    }, [data]);

    /**
     * @funcName : reqPutUserApprove
     * @description : 사용자 정보를 수정한다.
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const reqPutUserApprove = async (userId, value) => {
        try {
            const params = {};
            params["userId"] = userId;
            params["applvlYn"] = value;

            const result = await ServiceApi.user.reqPutUserApprove(params);
            if (result && isComponentMounted) {
                modal.showAlert("알림", "승인 여부가 수정되었습니다.");
                reqGetUserList();
            } else {
                modal.showAlert("알림", "승인 여부 수정에 실패했습니다.");
            }
            setLoading(false);
        } catch (e) {
            //console.log(e);
            setLoading(false);
        }
    };

    /**
     * @funcName : onClickButton
     * @description : 초기화
     * @param :
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const onClickButton = useCallback(
        (type, event, userId) => {
            event.preventDefault();
            event.stopPropagation();

            modal.showConfirm("알림", "비밀번호 초기화 승인을 하시겠습니까?",{
                btns: [
                    {
                        title: "확인",
                        click: () => {
                            reqPutUserPwdApprove(userId)
                        }
                    },
                    {
                        title: "취소",
                        click: () => {
                        },
                    }
                ],
            });
        }, [data]);

    /**
     * @funcName : reqPutUserInfo
     * @description : 비밀번호 초기화 승인
     * @param params : 파라미터 정보
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const reqPutUserPwdApprove = async (userId) => {
        try {
            const params = {};
            params["userId"] = userId;

            const result = await ServiceApi.user.reqPutUserPwdApprove(params);
            if (result && isComponentMounted) {
                modal.showAlert("알림", "비밀번호 초기화 승인을 하였습니다.");
                reqGetUserList();
            } else {
                modal.showAlert("알림", "비밀번호 초기화 승인에 실패했습니다.");
            }
            setLoading(false);
        } catch (e) {
            //console.log(e);
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <div className={"ns-user-list"} ref={listRef}>
                {/* 조건설정 컴포넌트 */}
                <SearchBar onClickSearch={setData}/>
                {/* 목록 컴포넌트 */}
                <ListContent
                    data={data}
                    onPageChange={setData}
                    loading={loading}
                    pageable={props.pageable !== undefined && props.pageable !== null ? props.pageable : true}
                    onDelete={onDelete}
                    SetDelCheckedList={SetDelCheckedList}
                    onCheckedAll={onCheckedAll}
                    onCheckedElement={onCheckedElement}
                    delCheckedList={delCheckedList}
                    onChangeSwitch={onChangeSwitch}
                    onClickButton={onClickButton}
                />
            </div>
        </Fragment>
    );
};

const SearchBar = (props) => {

    const [formData, setFormData] = useState({
        registDt : null,
        loginDt : null,
        userGrad : "",
        orgCode : null,
        search : null
    });

    const onChangeHandler = useCallback((event, type) => {
        let value = event.value;
        switch (type) {
            case "userGrad":
                value = value.codeId;
                break;
            default:
                break;
        }
        setFormData(prevState => ({
            ...prevState,
            [type]: value
        }));
    }, [formData]);

    const onSubmit = useCallback(() => {
        if (props.onClickSearch && props.onClickSearch instanceof Function) {
            props.onClickSearch(prevState => ({
                ...prevState,
                registDt : formData.registDt,
                loginDt : formData.loginDt,
                userGrad : formData.userGrad,
                // orgCode : formData.orgCode,
                search : formData.search,
                skip : 0,
                timestamp: moment().toDate().getTime()
            }));
        }
    }, [props.onPageChange, formData]);

    return (
        <Fragment>
            <Formik
                initialValues={formData}
                onSubmit={onSubmit}
                enableReinitialize={true}>
                {
                    formik => {
                        return (
                            <Fragment>
                                <h2>사용자 조회</h2>
                                <Form onSubmit={formik.handleSubmit}>
                                    <fieldset>
                                        <div className={"schValue"}>
                                            <p>가입일자</p>
                                            <DatePicker
                                                name={"registDt"}
                                                style={{width: ""}}
                                                value={formData.registDt}
                                                onChange={(event) => onChangeHandler(event, "registDt")}
                                            />
                                            <p>최근접속일시</p>
                                            <DatePicker
                                                name={"loginDt"}
                                                style={{width: ""}}
                                                value={formData.loginDt}
                                                onChange={(event) => onChangeHandler(event, "loginDt")}
                                            />
                                            <p>권한</p>
                                            <CustomDropDownList
                                                name={"userGrad"}
                                                textField={"codeNm"}
                                                dataItemKey={"codeId"}
                                                defaultValue={formData.userGrad}
                                                onChange={(event) => onChangeHandler(event, "userGrad")}
                                                data={[
                                                    {codeId : "", codeNm : "전체"},
                                                    {codeId : "U00", codeNm : "관리자(운용자)"},
                                                    {codeId : "U01", codeNm : "일반사용자"},
                                                ]}
                                            />
                                            {/*<p>소속</p>*/}
                                            {/*<CustomSearchComboBox*/}
                                            {/*    name={"orgCode"}*/}
                                            {/*    style={{width: "240px"}}*/}
                                            {/*    placeholder={"지역으로 검색하세요."}*/}
                                            {/*    remoteUrl={"/api/common/region/lvl2"}*/}
                                            {/*    textField={"fulAdmNm"}*/}
                                            {/*    dataItemKey={"admCode"}*/}
                                            {/*    itemRender={(li, itemProps) => {*/}
                                            {/*        const itemChildren = (*/}
                                            {/*            <p>{itemProps.dataItem.fulAdmNm}</p>*/}
                                            {/*        );*/}
                                            {/*        return cloneElement(li, li.props, itemChildren);*/}
                                            {/*    }}*/}
                                            {/*    onChange={(event) => onChangeHandler("orgCode", event)}*/}
                                            {/*/>*/}
                                            <p className={"ml110"}>사용자 명 / 사용자 ID</p>
                                            <Input
                                                name={"search"}
                                                className={"mw255"}
                                                placeholder={"사용자 명 또는 사용자 ID를 입력해주세요."}
                                                value={formData.search ? formData.search : ""}
                                                onChange={(event) => onChangeHandler(event, "search")}
                                            />
                                            <Button className={"btn sch ml10"} type={"submit"}>검색</Button>
                                        </div>
                                    </fieldset>
                                </Form>
                            </Fragment>
                        )
                    }
                }
            </Formik>
        </Fragment>
    )
};

/**
 * @className : ListContent
 * @description : 목록 내용
 * @date : 2022-07-25 오전 9:42
 * @author : taejin
 * @version : 1.0.0
 * @see
 * @history :
 **/
const ListContent = (props) => {

    const onPageChange = useCallback((event) => {
        props.onPageChange && props.onPageChange(prevState => ({
            ...prevState,
            skip : event.skip,
            take : event.take,
        }));
        props.SetDelCheckedList([]);
    }, [props.onPageChange]);

    return (
        <Fragment>
            <div className="tblList">
                <div className={"tbl"}>
                    <strong>총<i>{props.data.totalCnt}</i>개</strong>
                    <ListHeader
                        data={props.data}
                        onCheckedAll={props.onCheckedAll}
                        delCheckedList={props.delCheckedList}
                    />
                    {
                        props.loading
                            ? <LoadingLocalSpinner loading={props.loading}/>
                            : props.data.userList && props.data.userList.length > 0
                                ? (
                                    <Fragment>
                                        <ListView
                                            data={props.data.userList}
                                            item={(listViewItemProps) => {
                                                return <ListItem {...listViewItemProps}
                                                                 take={props.data.take}
                                                                 onCheckedElement={props.onCheckedElement}
                                                                 delCheckedList={props.delCheckedList}
                                                                 onChangeSwitch={props.onChangeSwitch}
                                                                 onClickButton={props.onClickButton}
                                                />
                                            }}
                                        />
                                        <Pager
                                            skip={props.data.skip}
                                            take={props.data.take}
                                            onPageChange={onPageChange}
                                            total={props.data.totalCnt}
                                            buttonCount={5}
                                            info={false}
                                            previousNext={true}
                                        />
                                    </Fragment>
                                )
                                : <div className={"list-item empty"}>
                                    <div className={"item"}>검색결과가 없습니다.</div>
                                </div>
                    }
                </div>
            </div>
            <div className="btnWrap">
                <div>
                    <Button
                        className={"btn"}
                        style={{float: "right"}}
                        disabled={props.delCheckedList.length === 0 ? true : false}
                        onClick={(event) => props.onDelete(event)}
                    >
                        삭제</Button>
                </div>
            </div>
        </Fragment>
    )
};

/**
 * @className : ListHeader
 * @description : 목록 헤더 컴포넌트
 * @date : 2022-07-25 오전 9:42
 * @author : taejin
 * @version : 1.0.0
 * @see
 * @history :
 **/
const ListHeader = (props) => {
    return (
        <Fragment>
            <table className="tbl header">
                <thead>
                <tr>
                    <th style={{width: "70px"}}>
                        <Checkbox
                            checked={
                                props.delCheckedList.length === 0
                                    ? false
                                    : props.delCheckedList.length === props.data.userList.length
                                        ? true
                                        : false
                            }
                            onChange={(e) => props.onCheckedAll(e.target.value)}
                        />
                    </th>
                    <th style={{width: ""}}>사용자 ID</th>
                    <th style={{width: ""}}>사용자 명</th>
                    <th style={{width: ""}}>권한</th>
                    <th style={{width: ""}}>소속</th>
                    <th style={{width: ""}}>이메일</th>
                    <th style={{width: ""}}>가입일</th>
                    <th style={{width: ""}}>최근 접속 일시</th>
                    <th style={{width: ""}}>승인 여부</th>
                    <th style={{width: "70px"}}>초기화</th>
                </tr>
                </thead>
            </table>
        </Fragment>
    );
};

/**
 * @className : ListItem
 * @description : 목록 아이템 컴포넌트
 * @date : 2022-07-25 오전 9:42
 * @author : taejin
 * @version : 1.0.0
 * @see
 * @history :
 **/
const ListItem = (props) => {

    const history = useHistory();
    const onClickItem = useCallback((event, data) => {
        history.push({
            pathname: "/systems/user/detail",
            state: {...data}
        });
    }, []);

    return (
        <Fragment>
            <div className={"list-item"}
                 key={props.index}
                 onClick={(event) => onClickItem(event, props.dataItem)}>
                <div className={"item"} style={{width:"70px"}}>
                    <Checkbox
                        className={"check"}
                        onClick={(event) => props.onCheckedElement(event, props.dataItem.userId)}
                        checked={
                            props.delCheckedList.includes(props.dataItem.userId) ? true : false
                        }
                    />
                </div>
                <div className={"item ac"} style={{width: ""}}>{props.dataItem.userId}</div>
                <div className={"item ac"} style={{width: ""}}>{props.dataItem.userNm}</div>
                <div className={"item ac"} style={{width: ""}}>{props.dataItem.userGradNm}</div>
                <div className={"item ac"} style={{width: ""}}>{props.dataItem.orgNm ? props.dataItem.orgNm : "-"}</div>
                <div className={"item ac"} style={{width: ""}}>{props.dataItem.email}</div>
                <div className={"item ac"} style={{width: ""}}>{props.dataItem.registDt ? moment(props.dataItem.registDt).format("YYYY-MM-DD HH:mm:ss") : "-"}</div>
                <div className={"item ac"} style={{width: ""}}>{props.dataItem.loginDt ? moment(props.dataItem.loginDt).format("YYYY-MM-DD HH:mm:ss") : "-"}</div>
                <div className={"item ac"} style={{width: ""}}>
                    <Switch
                        checked={(props.dataItem.applvlYn === 'Y') ? true : false}
                        onChange={(event) => props.onChangeSwitch("applvlYn", event, props.dataItem.userId)}
                    />
                </div>
                <div className={"item ac"} style={{width: "70px"}}>
                    {
                        props.dataItem.pwdResetSttus === 'W' &&
                        <Button
                            className={"btn can"}
                            onClick={(event) => props.onClickButton("pwdResetSttus", event, props.dataItem.userId)}
                        >
                        </Button>
                    }
                </div>
            </div>
        </Fragment>
    );
};
export default memo(UserList);
