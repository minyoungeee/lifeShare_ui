import {Fragment, useCallback, useContext, useEffect, useRef, useState, memo, cloneElement} from "react";
import {Button, Input, Switch} from '@progress/kendo-react-all';
import CustomSearchComboBox from "@/components/Custom/CustomSearchComboBox";
import CustomDropDownList from "@/components/Custom/CustomDropDownList";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";
import {Form, Formik} from "formik";
import "@/components/User/User.css";
import {modalContext} from "@/components/Common/Modal";
import ServiceApi from "@/common/ServiceApi";
import {util} from "@/common/Common";
import {useHistory} from "react-router";
import {JSEncrypt} from "jsencrypt";
import {useSelector} from "react-redux";

/**
 * @funcName : UserDetail
 * @description : 사용자 상세 정보 컴포넌트
 * @param :
 * @return :
 * @exception :
 * @date :
 * @author : taejin
 * @see
 * @history :
 **/
const UserDetail = (props) => {

    //auth redux
    const auth = useSelector((store) => store.auth);

    const admCodeList = useSelector((store) => store.admCode.admCodeInfo);

    const [userInfo, setUserInfo] = useState({
        userId: null,
        orgCode: null,
        userNm: null,
        email: null,
        userGrad: null,
        applvlYn: null,
        userList: []
    });

    const formRef = useRef();
    const loadingSpinner = useContext(loadingSpinnerContext);
    const modal = useContext(modalContext);
    const history = useHistory();

    let isComponentMounted = true;

    useEffect(() => {
        updateData();
    }, [props.location]);

    useEffect(() => {
        return () => {
            isComponentMounted = false;
        };
    }, []);

    const updateData = () => {
        if (props.location.state) {
            setUserInfo({...props.location.state});
        }
    };

    /**
     * @funcName : onSubmit
     * @description : view 컴포넌트로 정보와 type을 보낸다.
     * @param data : form 데이터
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const onSubmit = useCallback((data) => {
        modal.showConfirm("알림", name + " 사용자 정보를 수정하시겠습니까?", {
            btns: [
                {
                    title: "확인",
                    click: () => {
                        const params = {...data};
                        const encrypt = new JSEncrypt();
                        encrypt.setPublicKey(auth.publicKey);
                        params.userId = encrypt.encrypt(data.userId);
                        params.email = encrypt.encrypt(data.email);
                        reqPutUserInfo(params);
                    }
                },
                {
                    title: "취소",
                    click: () => {
                    }
                }
            ]
        });
    }, [userInfo]);

    /**
     * @funcName : reqPutUserInfo
     * @description : 사용자 정보를 수정한다.
     * @param :
     * @return :
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const reqPutUserInfo = async (params) => {
        // loadingSpinner.show(formRef.current);
        try {
            const result = await ServiceApi.user.reqPutUserInfo(params);
            if (result && isComponentMounted) {
                modal.showAlert("알림", "사용자 정보가 수정되었습니다.");
            } else {
                modal.showAlert("알림", "사용자 정보 수정에 실패했습니다.");
            }
            // loadingSpinner.hide();
        } catch (err) {
            //console.log(err);
            // loadingSpinner.hide();
        }
        handleUseHistory();
    };
    // 취소 버튼 클릭 시 목록 화면으로 전환
    const handleUseHistory = () => {
        history.push("/systems/user/list");
    };

    /**
     * @funcName : onChangeHandler
     * @description : 공통 change 이벤트 핸들러
     * @param name : 필드명
     * @param event : 이벤트 객체
     * @exception :
     * @date :
     * @author : taejin
     * @see
     * @history :
     **/
    const onChangeHandler = useCallback((name, event) => {
        let value = event.value;
        switch (name) {
            case "orgCode":
                value = value.admCode
                break;
            case "userId":
                value = value.userId
                break;
            case "userGrad":
                value = value.codeId
                break;
            case "applvlYn":
                if (!value) {
                    value = 'N'
                } else {
                    value = 'Y'
                }
            default:
                break;
        }
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, [userInfo]);

    return (
        <Fragment>
            <h2>사용자 수정</h2>
            <div className={"ns-user-detail"}>
                <Formik enableReinitialize={true}
                        initialValues={userInfo}
                        onSubmit={onSubmit}>
                    {
                        formik => {
                            return (
                                <Form className={"form"} onSubmit={formik.handleSubmit} ref={formRef}>
                                    <table className={"tbl"}>
                                        <colgroup>
                                            <col width="140px"/>
                                            <col width="*"/>
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>사용자 ID</th>
                                            <td>{userInfo.userId}</td>
                                        </tr>
                                        <tr>
                                            <th>소속</th>
                                            <td>
                                                <CustomSearchComboBox
                                                    name={"orgCode"}
                                                    style={{width: "240px"}}
                                                    placeholder={"지역으로 검색해주세요."}
                                                    remoteUrl={"/api/common/region/lvl2"}
                                                    textField={"fulAdmNm"}
                                                    dataItemKey={"admCode"}
                                                    defaultValue={util.setInitialValueForString(userInfo.orgCode, "")}
                                                    onChange={(event) => onChangeHandler("orgCode", event)}
                                                    itemRender={(li, itemProps) => {
                                                        const itemChildren = (
                                                            <p>{itemProps.dataItem.fulAdmNm}</p>
                                                        );
                                                        return cloneElement(li, li.props, itemChildren);
                                                    }}
                                                    required={true}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>사용자 명</th>
                                            <td>
                                                <Input
                                                    style={{width: "240px"}}
                                                    name={"userNm"}
                                                    maxLength={50}
                                                    placeholder={"사용자 명을 입력해주세요."}
                                                    validationMessage={"사용자 명을 입력해주세요."}
                                                    value={util.setInitialValueForString(userInfo.userNm, "")}
                                                    onChange={(event) => onChangeHandler("userNm", event)}
                                                    required={true}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이메일</th>
                                            <td>
                                                <Input
                                                    style={{width: "240px"}}
                                                    name={"email"}
                                                    minLength={4}
                                                    maxLength={50}
                                                    placeholder={"이메일을 입력해주세요."}
                                                    validationMessage={"이메일을 입력해주세요."}
                                                    value={util.setInitialValueForString(userInfo.email, "")}
                                                    onChange={(event) => onChangeHandler("email", event)}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>권한</th>
                                            <td>
                                                <CustomDropDownList
                                                    style={{width: "240px"}}
                                                    name={"userGrad"}
                                                    remoteUrl={"/api/common/code?codeType=U0"}
                                                    dataItemKey={"codeId"}
                                                    textField={"codeNm"}
                                                    onChange={(event) => onChangeHandler("userGrad", event)}
                                                    defaultValue={util.setInitialValueForString(userInfo.userGrad, "")}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>승인 여부</th>
                                            <td>
                                                <Switch name={"applvlYn"}
                                                        checked={(userInfo.applvlYn === 'Y') ? true : false}
                                                        onChange={(event) => onChangeHandler("applvlYn", event)}
                                                />
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <ul className="btnWrap">
                                        <li>
                                            <Button type={"submit"} className={"btn"}
                                                    style={{float: "right"}}
                                                    onClick={props.onConfirm}>수정
                                            </Button>
                                        </li>
                                        <li>
                                            <Button className={"btn"}
                                                    style={{float: "right"}}
                                                    onClick={handleUseHistory}>취소
                                            </Button>
                                        </li>
                                    </ul>
                                </Form>
                            )
                        }
                    }
                </Formik>
            </div>
        </Fragment>
    );
};
export default memo(UserDetail);
