/*
 *  chub-cms-ui version 1.0
 *
 *  Copyright ⓒ 2023 KT & KTDS corp. All rights reserved.
 *
 *  This is a proprietary software of KT & KTDS corp, and you may not use this file except in
 *  compliance with license agreement with KT & KTDS corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of KT & KTDS corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */

import {useCallback, useContext, useEffect, useRef, useState, Fragment, memo} from "react";
import {Upload} from "@progress/kendo-react-upload";
import ServiceApi from "@/common/ServiceApi";
import {modalContext} from "@/components/Common/Modal";
import {loadingSpinnerContext} from "@/components/Common/LoadingSpinner";
import "@/components/File/File.css";

/**
 * 파일 업로드 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const FileMultiUpload = (props) => {

    /**
     * file ref
     */
    const fileRef = useRef();

    /**
     * modal context
     */
    const modal = useContext(modalContext);

    /**
     * loading spinner context
     */
    const loadingSpinner = useContext(loadingSpinnerContext);

    /**
     * 삭제 파일 목록 정보
     */
    const [delFileList, setDelFileList] = useState("");

    /**
     * validationCheck State
     */
    const [validationCheck, setValidationCheck] = useState(false);

    //todo componentDidUpdate
    useEffect(() => {
        if (props.isFileSubmit) {
            if (!validationCheck) {
                onDelFile();
            }
            else {
                // modal.showAlert("알림", "허용되지 않는 파일형식이 있습니다.");
                props.onFailCallback();
            }
        }
    }, [props.isFileSubmit, validationCheck]);

    /**
     * 모든 파일이 저장되었는지 확인한 후 콜백한다.
     *
     * @param e 업로드 상태 변경 이벤트 객체
     * @author 강보경
     * @version 1.0
     **/
    const onFileStatusChange = (e) => {
        // console.log(">>>>>>>>>> FILE - onFileStatusChange <<<<<<<<<< e ?", e);

        let complete = true;
        e.newState.map((file, index) => {
            if (file.progress < 100) {
                complete = false;
                return;
            }
        });

        if (complete) {
            let result = e.newState;
            props.onSuccessCallback(result);
        }
    };

    /**
     * 파일 목록 change 이벤트 핸들러
     *
     * @param e 이벤트 객체
     * @author 강보경
     * @version 1.0
     **/
    const onChangeFileList = useCallback((e)=> {
        // console.log(">>>>>>>>>> FILE - onChangeFileList <<<<<<<<<< e ?", e);
        if (fileRef.current) {
            if (fileRef.current.querySelector(".k-upload-files")) {
                fileRef.current.querySelector(".k-dropzone").classList.add("none-border");
            }else {
                fileRef.current.querySelector(".k-dropzone").classList.remove("none-border");
            }

            if(fileRef.current.querySelector(".k-upload-files .k-file-validation-message")){
                setValidationCheck(true);
            }
            else{
                setValidationCheck(false);
            }
        }

        if (props.onChangeFileList && props.onChangeFileList instanceof Function) {
            props.onChangeFileList(e);
        }
    }, []);

    /**
     * 파일을 삭제한다.
     *
     * @author 강보경
     * @version 1.0
     **/
    const onDelFile = async () => {
        if (delFileList.length > 0) {
            //파일삭제
            loadingSpinner.show(fileRef.current);
            try {
                const params = {
                    delFileList: delFileList
                };
                const result = await ServiceApi.file.reqDeleteFileList(params);
                if (result === true) {
                    // console.log('파일삭제 성공')
                    onSaveFile(result);
                }
                loadingSpinner.hide();
            } catch (e) {
                // console.log(e);
            }
        } else {
            onSaveFile();
        }
    };

    /**
     * 파일을 저장한다.
     *
     * @author 강보경
     * @version 1.0
     **/
    const onSaveFile = () => {
        // console.log(">>>>>>>>>> FILE - onSaveFile <<<<<<<<<< result", result);
        let uploadBtn = fileRef.current.querySelector(".ns-file-multiupload .k-button.k-upload-selected");
        if (uploadBtn !== null) {
            // console.log('업로드 버튼 클릭함')
            uploadBtn.click();
        } else {
            // console.log('삭제 끝나면 콜백');
            props.onSuccessCallback();
        }
    };

    return (
        <Fragment>
            <div className={"ns-file-multiupload"} ref={fileRef}>
                <div className={"write"}>
                    <Upload
                        batch={false}
                        multiple={props.multiple !== undefined && props.multiple !== null ? props.multiple : true}
                        restrictions={{
                            allowedExtensions:
                                props.allowedExtensions !== null && props.allowedExtensions != undefined ?
                                    props.allowedExtensions
                                    : ["zip", "hwp", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "bmp", "jpg", "jpeg", "gif", "png", "pdf"],
                        }}
                        defaultFiles={
                            props.defaultFiles !== null && props.defaultFiles !== undefined ?
                                props.defaultFiles
                                : []}
                        withCredentials={false}
                        autoUpload={false}

                        onAdd={(e) => {
                            onChangeFileList(e)
                        }}

                        onRemove={(e) => {
                            onChangeFileList(e);
                            let tmpDelFileList = delFileList;
                            if (e.affectedFiles && e.affectedFiles.length > 0) {
                                const affectedFile = e.affectedFiles[0];
                                if (affectedFile && affectedFile.attchmntFileId !== null && affectedFile.attchmntFileId !== undefined) {
                                    if (tmpDelFileList === "") {
                                        tmpDelFileList = affectedFile.attchmntFileId;
                                    } else {
                                        tmpDelFileList = tmpDelFileList + "," + affectedFile.attchmntFileId;
                                    }
                                    setDelFileList(tmpDelFileList);
                                }
                            }
                        }}

                        onStatusChange={(e) => {
                            onFileStatusChange(e)
                        }}

                        saveUrl={"/api/file/fileUpload"}
                        // removeUrl={"/api/file/fileRemove"}
                    />
                </div>
            </div>
        </Fragment>
    );
};
export default memo(FileMultiUpload)
