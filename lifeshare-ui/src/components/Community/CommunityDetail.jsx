import React, { Fragment, memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import "@/components/Community/CommunityDetail.css";
import { useNavigate, useLocation } from "react-router-dom";
import { loadingSpinnerContext } from "@/components/Common/LoadingSpinner";
import { modalContext } from "@/components/Common/Modal";
import { Form, Formik } from "formik";
import RichTextEditor from "@/components/Common/RichTextEditor";
import { util } from "@/common/Common";
import ServiceApi from "@/common/ServiceApi";
import FileMultiUpload from "@/components/File/FileMultiUpload";
import {Input} from "@progress/kendo-react-inputs";
import {Button} from "@progress/kendo-react-buttons";

const CommunityDetail = () => {
    const [formData, setFormData] = useState({
        boardId: null,
        ctgrId: null,
        title: null,
        cont: null,
        regDt: null,
        fileList: [],
        fileData: [],
    });

    const formRef = useRef();
    const loadingSpinner = useContext(loadingSpinnerContext);
    const modal = useContext(modalContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [isFileSubmit, setIsFileSubmit] = useState(false);

    useEffect(() => {
        if (location.state) {
            setFormData({ ...location.state });
        }
    }, [location.state]);

    const handleGoBack = () => navigate("/community/list");

    const reqPutCommunityInfo = async (params) => {
        loadingSpinner.show(formRef.current);
        try {
            const formData = new FormData();
            formData.append("boardId", params.boardId);
            formData.append("title", params.title);
            formData.append("cont", params.cont);

            if (params.files) {
                params.files.forEach((file) => {
                    if (!file.attchmntFileId) {
                        formData.append("files", file.getRawFile());
                    }
                });
            }

            const result = await ServiceApi.community.reqPutCommunityInfo(formData);
            console.log('result', result);

            // ✅ 확실한 성공 판정 (서버 응답이 null이 아니면)
            if (result !== null && result !== undefined) {
                modal.showAlert("알림", "공지사항이 수정되었습니다.", null, () => {
                    handleUseHistory(); // ✅ 성공 시 이동
                });
            } else {
                modal.showAlert("알림", "공지사항 수정에 실패했습니다.");
            }
        } catch (err) {
            console.error("❌ 수정 오류:", err);
            modal.showAlert("알림", "공지사항 수정 중 오류가 발생했습니다.");
        } finally {
            loadingSpinner.hide();
        }
    };

    /**
     * 공지사항 목록 화면으로 이동
     *
     * @author minyoung
     * @version 1.0
     */
    const handleUseHistory = () => {
        navigate("/community/list");
    };

    const onChangeHandler = useCallback((name, event) => {
        setFormData((prev) => ({
            ...prev,
            [name]: event.value,
        }));
    }, []);

    const onChangeHandlers = useCallback((name, content) => {
        setFormData((prev) => ({
            ...prev,
            [name]: content,
        }));
    }, []);

    const onFileUploadSuccessCallback = (uploadedFiles) => {
        setIsFileSubmit(false);
        setFormData((prev) => ({
            ...prev,
            files: uploadedFiles,
        }));
        document.querySelector(".submitBtn").click();
    };

    const onFileUploadFailCallback = () => {
        setIsFileSubmit(false);
        modal.showAlert("알림", "첨부파일 업로드 중 문제가 발생하였습니다.");
    };

    const onSubmit = useCallback((data) => {
        reqPutCommunityInfo(data);
    }, []);

    const onFileSubmit = useCallback((e) => {
        e.preventDefault();
        modal.showConfirm("알림", "공지사항을 수정하시겠습니까?", {
            btns: [
                {
                    title: "확인",
                    click: () => setIsFileSubmit(true),
                },
                {
                    title: "취소",
                },
            ],
        });
    }, []);

    return (
        <Fragment>
            <div className="ns-employ-register">
                <h1 className="k-h1">Edit</h1>

                <Formik enableReinitialize initialValues={formData} onSubmit={onSubmit}>
                    {(formik) => (
                        <Form className="form" onSubmit={formik.handleSubmit} ref={formRef}>
                            <div className="tbl">
                                <table>
                                    <colgroup>
                                        <col width="120px" />
                                        <col width="*" />
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th>제목</th>
                                        <td>
                                            <Input
                                                name="title"
                                                style={{ width: "100%" }}
                                                placeholder="제목을 입력해주세요."
                                                value={util.setInitialValueForString(formData.title, "")}
                                                onChange={(e) => onChangeHandler("title", e)}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>파일첨부</th>
                                        <td>
                                            <FileMultiUpload
                                                defaultFiles={location.state?.fileData?.length ? location.state.fileData : []}
                                                onSuccessCallback={onFileUploadSuccessCallback}
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
                                        수정
                                    </Button>
                                </li>
                                <li>
                                    <Button className="btn" onClick={onFileSubmit}>
                                        수정
                                    </Button>
                                </li>
                                <li>
                                    <Button className="btn" onClick={handleGoBack}>
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

export default memo(CommunityDetail);
