import React, {
    Fragment,
    memo,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import "@/components/Community/CommunityRegistration.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { modalContext } from "@/components/Common/Modal";
import { loadingSpinnerContext } from "@/components/Common/LoadingSpinner";
import ServiceApi from "@/common/ServiceApi";
import { Form, Formik } from "formik";
import RichTextEditor from "@/components/Common/RichTextEditor";
import FileMultiUpload from "@/components/File/FileMultiUpload";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";

const CommunityRegistration = () => {
    const [formData, setFormData] = useState({
        title: "",
        files: [],
        cont: "",
    });

    const dispatch = useDispatch();
    const formRef = useRef();
    const navigate = useNavigate();
    const loadingSpinner = useContext(loadingSpinnerContext);
    const modal = useContext(modalContext);
    const [isFileSubmit, setIsFileSubmit] = useState(false);

    /** 페이지 언마운트 시 정리 */
    useEffect(() => {
        return () => {};
    }, []);

    /** 공지사항 목록 이동 */
    const goToList = useCallback(() => {
        navigate("/community/list");
    }, [navigate]);

    /** 제목 입력 변경 */
    const onChangeHandler = useCallback((name, event) => {
        const value = event.value;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    /** 에디터 내용 변경 */
    const onChangeHandlers = useCallback((name, content) => {
        setFormData((prev) => ({
            ...prev,
            [name]: content,
        }));
    }, []);

    /** 등록 요청 */
    const reqPostCommunityInfo = async (params) => {
        loadingSpinner.show(formRef.current);
        try {
            const formDataObj = new FormData();
            formDataObj.append("title", params.title);
            formDataObj.append("cont", params.cont);

            if (params.files?.length) {
                params.files.forEach((file) => {
                    formDataObj.append("files", file.getRawFile());
                });
            }

            const result = await ServiceApi.community.reqPostCommunityInfo(formDataObj);

            if (result) {
                modal.showAlert("알림", "공지사항 등록이 완료되었습니다.");
                navigate("/community/list");
            } else {
                modal.showAlert("알림", "공지사항 등록 중 문제가 발생하였습니다.");
            }
        } catch (e) {
            modal.showAlert("알림", "서버 처리 중 오류가 발생하였습니다.");
        } finally {
            loadingSpinner.hide();
        }
    };

    /** 파일 업로드 콜백 */
    const onFileUploadSuccessCallback = (uploadedFiles) => {
        setIsFileSubmit(false);
        setFormData((prev) => ({
            ...prev,
            files: uploadedFiles,
        }));
        document.querySelector(".submitBtn")?.click();
    };

    const onFileUploadFailCallback = () => {
        setIsFileSubmit(false);
        modal.showAlert("알림", "첨부파일 업로드 중 문제가 발생하였습니다.");
    };

    /** Form Submit */
    const onSubmit = useCallback((data) => {
        const params = { ...data };
        reqPostCommunityInfo(params);
    }, []);

    /** 등록 버튼 클릭 시 확인창 */
    const onFileSubmit = useCallback((event) => {
        event.preventDefault();
        modal.showConfirm("알림", "공지사항을 등록하시겠습니까?", {
            btns: [
                { title: "확인", click: () => setIsFileSubmit(true) },
                { title: "취소" },
            ],
        });
    }, []);

    return (
        <Fragment>
            <div className="ns-employ-register">
                <div className="form-header">
                    <h1 className="k-h1">Registration</h1>
                </div>

                <Formik enableReinitialize initialValues={formData} onSubmit={onSubmit}>
                    {(formik) => (
                        <Form className="form" onSubmit={formik.handleSubmit} ref={formRef}>
                            <div className="tbl">
                                <table>
                                    <colgroup>
                                        <col width="100px" />
                                        <col width="*" />
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th>제목</th>
                                        <td>
                                            <Input
                                                name="title"
                                                style={{ width: "100%" }}
                                                minLength={2}
                                                maxLength={50}
                                                placeholder="제목을 입력해주세요."
                                                onChange={(e) =>
                                                    onChangeHandler("title", e)
                                                }
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>파일첨부</th>
                                        <td>
                                            <FileMultiUpload
                                                onSuccessCallback={
                                                    onFileUploadSuccessCallback
                                                }
                                                onFailCallback={onFileUploadFailCallback}
                                                isFileSubmit={isFileSubmit}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>내용</th>
                                        <td>
                                            <RichTextEditor
                                                name="cont"
                                                content={formData.cont}
                                                onChange={onChangeHandlers}
                                            />
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <ul className="btnWrap">
                                <li>
                                    <Button
                                        type="submit"
                                        className="btn submitBtn"
                                        style={{ display: "none" }}
                                    >
                                        등록
                                    </Button>
                                </li>
                                <li>
                                    <Button
                                        className="btn"
                                        style={{ float: "right" }}
                                        onClick={onFileSubmit}
                                    >
                                        등록
                                    </Button>
                                </li>
                                <li>
                                    <Button
                                        className="btn"
                                        style={{ float: "right" }}
                                        onClick={goToList}
                                    >
                                        취소
                                    </Button>
                                </li>
                            </ul>
                        </Form>
                    )}
                </Formik>
            </div>
        </Fragment>
    );
};

export default memo(CommunityRegistration);
