import {useCallback, useContext, useEffect, useState, Fragment, memo} from "react";
import "@/components/File/File.css";
import {modalContext} from "@/components/Common/Modal";
import ServiceApi from "@/common/ServiceApi";
import {Button} from "@progress/kendo-react-all";


/**
 * @className : FileExcelDownload
 * @description : 파일 엑셀 다운로드 컴포넌트
 * @date : 2023-09-27 오전 09:24
 * @author : jinwoo
 * @version : 1.0.0
 * @see
 * @history :
 **/

const FileExcelDownload = (props) => {
    const path = props.path;
    const modal = useContext(modalContext);
    const fileCSVDownload =useCallback(async () => {
        try {
            // HistoryAccidenPredictList.jsx 사고위험도 예측이력 관리
            if(path === "accident"){
                await ServiceApi.file.reqGetFileCSVDownload(props.path, props.reqDt);

            // HistoryAccidentAlarmList.jsx 사고위험 알림이력 관리
            } else if (path === "notify") {
                await ServiceApi.file.reqGetFileCSVDownload(props.path, props.reqDt, props.lkId);

            // TrafficPredictMap > StandardDateControl.jsx 교통흐름예측
            } else if (path === "trafficDate") {
                await ServiceApi.file.reqGetFileCSVDownload(props.path, props.reqDt);

            // CntrmsrPredictMap > StandardDateControl.jsx 특별교통대책
            } else if (path === "cntrmsrDate") {
                await ServiceApi.file.reqGetFileCSVDownload(props.path, props.reqDt, "", props.cntrmsrAnalId);

            // OutbrkPredictMap > StandardDateControl.jsx 돌발상황예측
            } else if (path === "outbrkDate") {
                await ServiceApi.file.reqGetFileCSVDownload(props.path, props.reqDt, "", "", props.outbrkAnalId);

            // AccidentPredictMap > StandardDateControl.jsx 사고위험도예측
            } else if (path === "accidentDate") {
                await ServiceApi.file.reqGetFileCSVDownload(props.path, props.reqDt);
            }

        } catch (err) {
            modal.showAlert("알림", "파일을 다운로드 하지 못하였습니다.");
        }
    }, []);

    return (
        <Fragment>
            <Button onClick={fileCSVDownload} className={"btn xls"}>엑셀 다운로드</Button>
        </Fragment>
    );
}

export default memo(FileExcelDownload);
