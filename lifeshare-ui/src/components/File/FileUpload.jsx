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
const FileUpload = (props) => {

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

    const [formData, setFormData] = useState({
        fileId: null,
        targId: "",
        typeNm: "",
        fileNm: null,
        realFileNm: "",
        filePath: "",
        ext: "",
        videoYn: "",
        regDt: "",
        isSubmit: false,
        accept: "*",
        required: false
    });

    /**
     * file input ref
     */
    const fileInputRef = useRef();

    //todo componentDidMount
    useLayoutEffect(() => {
        initData();
    }, [])

    //todo componentDIdUpdate
    useLayoutEffect(() => {
        updateData();
    }, [props.defaultValue]);

    /**
     * 초기화 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const initData = () => {

    };

    useEffect(() => {
        if (formData.isSubmit) {
            onFileSubmit(); // 파일업로드
            setFormData(prevState => ({
                ...prevState,
                isSubmit: false
            }));
        }
    }, [formData]);

    const onFileDel = (e) => {
        setFormData(prevState => ({
            ...prevState
        }));

    };
    const onSubmitCallback = useCallback((result) => {
        if (props.onReusltCallback && props.onReusltCallback instanceof Function) {
            props.onReusltCallback(result);
        } else {
            // alert(attFileSn);
        }
    })

    /**
     * state를 업데이트 한다.
     *
     * @author chauki
     * @version 1.0
     **/
    const updateData = () => {
        setFile(prevState => ({
            ...prevState,
            fileNm: props.defaultValue ? props.defaultValue : null
        }));
    };

    /**
     * 파일 업로드 팝업창을 표출한다.
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onClickFile = useCallback((event) => {
        if (fileRef.current) {
            fileRef.current._element.previousSibling.click();
        }
    }, [file]);

    // const onFileSubmit = () => {
    //     let files = {};
    //
    //         if (file)
    //             fileUpload(files);
    //         else {
    //             // modal.showAlert(t('fail'), t('pleaseCheckTheFileFormat'));
    //
    //             setFormData(prevState => ({
    //                 ...prevState,
    //             }));
    //             // onFailCallback();
    //         }
    //     }
    // };

    /**
     * 파일 선택 이벤트 핸들러
     *
     * @param event 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const onChangeFile = useCallback((event) => {
        if (event.target.files.length > 0) {
            console.log("11111");
            const fileInfo = event.target.files[0];
            console.log(fileInfo);
            setFile(prevState => ({
                ...prevState,
                fileNm : fileInfo.name,
                fileInfo: fileInfo
            }));

            if (props.onChange && props.onChange instanceof Function) {
                props.onChange(event, fileInfo);
            }

            event.target.value = "";

        }
    }, [file]);

    const fileUpload = useCallback(async (params) => {
        try {
            const fileRef = await ServiceApi.file.reqPostContentFileUpload(params);

            if (fileRef.current) {
                fileRef.current._element.previousSibling.click(params);
            }
            onSubmitCallback(fileRef.result)
            if (fileRef.result === "success") {
                modal.showAlert("알림", "파일 업로드를 완료했습니다.");
            }
        } catch (err) {
            modal.showAlert("알림", "파일을 업로드 하지 못하였습니다.");
        }
    }, []);

    return (
        <Fragment>
            <div className={"ns-file-upload"}>
                <div className={"file-wrapper"}>
                    <div className={"btn"} onClick={onClickFile}>
                        <input
                            type="file"
                            name={"fileInfo"}
                            style={{width: "240px"}}
                            accept={props.accept ? props.accept : "*"}
                            onChange={onChangeFile}
                            onClick={fileUpload}
                        />
                    </div>
                </div>
            </div>
        </Fragment>
    );

};
export default memo(FileUpload);

