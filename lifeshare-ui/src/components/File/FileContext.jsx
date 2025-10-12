import {useCallback, useLayoutEffect, useRef, useState, Fragment, memo, useContext, useEffect} from "react";
import "@/components/File/File.css";
import {Button, ComboBox} from "@progress/kendo-react-all";
import {modalContext} from "@/components/Common/Modal";
import ServiceApi from "@/common/ServiceApi";

/**
 * 파입업로드 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
const FileContext = (props) => {

    /**
     * file state 설정
     */
    const [file, setFile] = useState({
        fileNm : "",
        fileInfo : null
    });

    const modal = useContext(modalContext);

    /**
     * file ref
     */
    const fileRef= useRef();

    /**
     * 파일 선택 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onChangeFile = useCallback((event) => {

        if (event.target.files.length > 0) {
            const fileInfo = event.target.files[0];
            setFile(prevState => ({
                ...prevState,
                fileNm : fileInfo.name,
                fileInfo: fileInfo
            }));

            if (props.onChange && props.onChange instanceof Function) {
                props.onChange(event, fileInfo);
            }
        }
    }, [file]);

    return (
        <Fragment>
            <div className={"ns-file-upload"}>
                <div className={"file-wrapper"}>
                    <div className={"btn"}>
                        <input
                            type={"file"}
                            name={"fileInfo"}
                            style={{width: "240px"}}
                            accept={props.accept ? props.accept : "*"}
                            onChange={onChangeFile}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );

};
export default memo(FileContext);

