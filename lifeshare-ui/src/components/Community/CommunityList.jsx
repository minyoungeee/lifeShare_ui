import React, {
    Fragment,
    memo,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import "@/components/Community/Community.css";
import { useNavigate } from "react-router-dom";
import { loadingSpinnerContext } from "@/components/Common/LoadingSpinner";
import { modalContext } from "@/components/Common/Modal";
import ServiceApi from "@/common/ServiceApi";
import LoadingLocalSpinner from "@/components/Loading/LoadingLocalSpinner";
import { ListView } from "@progress/kendo-react-listview";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import {Pager} from "@progress/kendo-react-data-tools";

const CommunityList = () => {
    const [data, setData] = useState({
        communityList: [],
        totalCnt: 0,
        pageNo: 0,
        skip: 0,
        take: 10
    });
    const [loading, setLoading] = useState(false);
    const [delCheckedList, setDelCheckedList] = useState([]);

    const listRef = useRef();
    const isMounted = useRef(true);
    const modal = useContext(modalContext);
    const loadingSpinner = useContext(loadingSpinnerContext);
    const navigate = useNavigate();

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        reqGetCommunityList();
    }, [data.skip]);

    const onCheckedAll = useCallback(
        (checked) => {
            if (checked) {
                const allIds = data.communityList.map((item) => item.boardId);
                setDelCheckedList(allIds);
            } else {
                setDelCheckedList([]);
            }
        },
        [data.communityList]
    );

    const onCheckedElement = useCallback(
        (event, boardId) => {
            event.preventDefault();
            event.stopPropagation();
            setDelCheckedList((prev) =>
                event.target.checked
                    ? [...prev, boardId]
                    : prev.filter((id) => id !== boardId)
            );
        },
        []
    );

    const reqGetCommunityList = async () => {
        try {
            setLoading(true);
            const params = { pageNo: data.skip, limit: data.take };
            const result = await ServiceApi.community.reqGetCommunityList(params);

            console.log('result', result);

            if (!isMounted.current) return;

            const list = result?.communityList?.map((item) => ({
                ...item,
                fileData:
                    item.fileList?.map((f) => ({
                        name: f.realFileNm,
                        uid: f.fileId,
                        attchmntFileId: f.fileId,
                        extension: f.ext
                    })) || []
            }));

            setData((prev) => ({
                ...prev,
                totalCnt: result.totalCnt || 0,
                communityList: list || []
            }));
        } catch (err) {
            console.error("reqGetCommunityList error:", err);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    const reqDeleteCommunityInfo = async (ids) => {
        try {
            setLoading(true);
            const params = { boardId: ids.join(",") };
            const result = await ServiceApi.community.reqDeleteCommunityInfo(params);

            if (!isMounted.current) return;

            if (result) {
                modal.showAlert("알림", "공지사항 정보가 삭제되었습니다.");
                setData((prev) => ({ ...prev, skip: 0 }));
                reqGetCommunityList();
            } else {
                modal.showAlert("알림", "선택하신 정보를 삭제하지 못했습니다.");
            }
        } catch (err) {
            console.error("reqDeleteCommunityInfo error:", err);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    const onDelete = useCallback(() => {
        if (delCheckedList.length === 0) return;

        modal.showConfirm("알림", "공지사항 정보를 삭제하시겠습니까?", {
            btns: [
                { title: "확인", click: () => reqDeleteCommunityInfo(delCheckedList) },
                { title: "취소", click: () => setDelCheckedList([]) }
            ]
        });
    }, [delCheckedList]);

    return (
        <Fragment>
            <div className="ns-community-list" ref={listRef}>
                <CommunityListContent
                    data={data}
                    onPageChange={setData}
                    loading={loading}
                    pageable
                    onDelete={onDelete}
                    setDelCheckedList={setDelCheckedList}
                    onCheckedAll={onCheckedAll}
                    onCheckedElement={onCheckedElement}
                    delCheckedList={delCheckedList}
                    navigate={navigate}
                />
            </div>
        </Fragment>
    );
};

const CommunityListContent = (props) => {
    const navigate = props.navigate;

    const onRegister = useCallback(() => {
        navigate("/community/register");
    }, [navigate]);

    const onPageChange = useCallback(
        (event) => {
            props.onPageChange((prev) => ({
                ...prev,
                skip: event.skip,
                take: event.take
            }));
            props.setDelCheckedList([]);
        },
        [props.onPageChange]
    );

    return (
        <Fragment>
            <div className="tblList">
                <h1 className="k-h1">Community</h1>
                <div className="tbl">
                    <strong>
                        총<i>{props.data.totalCnt}</i>개
                    </strong>
                    <CommunityListHeader
                        data={props.data}
                        onCheckedAll={props.onCheckedAll}
                        delCheckedList={props.delCheckedList}
                    />
                    {props.loading ? (
                        <LoadingLocalSpinner loading={props.loading} />
                    ) : props.data.communityList?.length > 0 ? (
                        <Fragment>
                            <ListView
                                data={props.data.communityList}
                                item={(listProps) => (
                                    <CommunityListItem
                                        {...listProps}
                                        skip={props.data.skip}
                                        take={props.data.take}
                                        onCheckedElement={props.onCheckedElement}
                                        delCheckedList={props.delCheckedList}
                                        navigate={navigate}
                                    />
                                )}
                            />
                            <Pager
                                skip={props.data.skip}
                                take={props.data.take}
                                total={props.data.totalCnt}
                                buttonCount={5}
                                info={false}
                                previousNext
                                onPageChange={onPageChange}
                            />
                        </Fragment>
                    ) : (
                        <div className="list-item empty">
                            <div className="item">검색결과가 없습니다.</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="btnWrap">
                <Button
                    className="btn"
                    style={{ float: "left", marginRight: "10px" }}
                    onClick={onRegister}
                >
                    등록
                </Button>
                <Button
                    className="btn"
                    style={{ float: "right" }}
                    disabled={props.delCheckedList.length === 0}
                    onClick={props.onDelete}
                >
                    삭제
                </Button>
            </div>
        </Fragment>
    );
};

const CommunityListHeader = ({ data, delCheckedList, onCheckedAll }) => (
    <div className="list-header">
        <div className="col checkbox">
            <Checkbox
                checked={
                    delCheckedList.length > 0 &&
                    delCheckedList.length === data.communityList.length
                }
                onChange={(e) => onCheckedAll(e.target.checked)}
            />
        </div>
        <div className="col number">글번호</div>
        <div className="col title">제목</div>
        <div className="col writer">작성자</div>
        <div className="col date">날짜</div>
    </div>
);


const CommunityListItem = ({
                               index,
                               dataItem,
                               skip,
                               onCheckedElement,
                               delCheckedList,
                               navigate
                           }) => {
    const onClickItem = () => navigate("/community/detail", { state: dataItem });

    return (
        <div className="list-item" onClick={onClickItem}>
            <div className="col checkbox">
                <Checkbox
                    className="check"
                    onClick={(e) => onCheckedElement(e, dataItem.boardId)}
                    checked={delCheckedList.includes(dataItem.boardId)}
                />
            </div>
            <div className="col number">{skip + index + 1}</div>
            <div className="col title">{dataItem.title}</div>
            <div className="col writer">운영 관리자</div>
            <div className="col date">{dataItem.regDt}</div>
        </div>
    );
};

export default memo(CommunityList);
