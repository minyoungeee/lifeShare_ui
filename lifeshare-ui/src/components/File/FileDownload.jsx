import {useCallback, useContext, useEffect, useState, Fragment, memo} from "react";
import {util} from "@/common/Common";
import "@/components/File/File.css";
import ServiceApi from "@/common/ServiceApi";
import {modalContext} from "@/components/Common/Modal";
import {Button} from "@progress/kendo-react-all";
import {saveAs, encodeBase64} from '@progress/kendo-file-saver';
import modal from "@/components/Common/Modal";
import {Link} from "react-router-dom";

/**
 * @className : FileDownload
 * @description : 파일 다운로드 컴포넌트
 * @date :
 * @author :
 * @version : 1.0.0
 * @see
 * @history :
 **/
const FileDownload = (props) => {

    const modal = useContext(modalContext);

    /**
     * @funcName : fileDownload
     * @description : 파일을 다운로드한다.
     * @params :
     * @return :
     * @exception :
     * @date :
     * @author :
     * @see
     * @history :
     **/
    const fileDownload = useCallback(async () => {
        try {
            await ServiceApi.file.reqGetFileDownload();
        }catch (err) {
            modal.showAlert("알림", "파일을 다운로드 하지 못하였습니다.");
        }
    }, []);

    return (
        <div className={"ns-file-download"}>
            <div className={"btn"}>
                {/*<Link to="/src/res/templateCamera.xlsx" target="_blank" download>*/}
                <a className={"download"} onClick={fileDownload}>
                    등록 양식 다운로드
                </a>
            </div>
        </div>
    );
}

export default memo(FileDownload);
