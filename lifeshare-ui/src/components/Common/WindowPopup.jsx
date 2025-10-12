import {useRef, useState, useLayoutEffect, Fragment, useCallback, createContext} from 'react';
import {Button} from "@progress/kendo-react-buttons";

//context 생성
//context를 생성해야지만 전역으로 사용할 수 있음
export const windowPopupContext = createContext(null);

/**
 * @className : WindowPopupProvider
 * @description : WindowPopupProvider 컴포넌트
 * @date : 2021-05-14 오후 3:22
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history :
**/
const WindowPopupProvider = (props) => {
    //state 정의
    const [windowPopup, setWindowPopup] = useState({
        title : "알림",
        show : false,
        component : null
    });

    let windowRef = useRef(null);

    /**
     * @funcName : showWindowPopup
     * @description : 윕도우 팝업을 show 한다.
     * @param title : 제목
     * @param component : JSX.Element 들어간 컴포넌트
     * @param options : 옵션정보
     * @return :
     * @exception :
     * @date : 2021-05-14 오후 3:23
     * @author : chauki
     * @see
     * @history :
    **/
    const showWindowPopup = (title, component, options) => {
        setWindowPopup(prevState => ({
            ...prevState,
            title : title,
            show : true,
            component : component ? component : null,
            options : options
        }));
    }

    /**
     * @funcName : close
     * @description : 윈도우 팝업을 close 한다.
     * @param :
     * @return :
     * @exception :
     * @date : 2021-05-14 오후 3:24
     * @author : chauki
     * @see
     * @history :
    **/
    const close = (event) => {
        setWindowPopup(prevState => ({
            ...prevState,
            show : false
        }));
    };

    /**
     * @funcName : clear
     * @description : 윈도우 팝업을 clear 한다.
     * @param :
     * @return :
     * @exception :
     * @date : 2021-05-14 오후 3:24
     * @author : chauki
     * @see
     * @history :
    **/
    const clear = () => {
        close(null);
    }

    return (
        <windowPopupContext.Provider value={{close, showWindowPopup, clear, windowRef}} {...props}>
            {props.children}
            <WindowPopup
                windowRef={windowRef}
                show={windowPopup.show}
                title={windowPopup.title}
                component={windowPopup.component}
                options={windowPopup.options}
                onClose={close} />
        </windowPopupContext.Provider>
    );
}

/**
 * @className : WindowPopup
 * @description : 윈도우 팝업 컴포넌트
 * @date : 2021-05-14 오후 3:25
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history :
**/
const WindowPopup = (props) => {

    //window popup ref
    const windowRef = props.windowRef;

    /**
     * @funcName : useEffect
     * @description : 컴포넌트가 업데이트 된 후 실행
     * - alert 창의 min/max 버튼을 숨긴다.
     * @param :
     * @return :
     * @exception :
     * @date : 2021-05-14 오후 3:27
     * @author : chauki
     * @see
     * @history :
    **/
    useLayoutEffect(() => {
        if (windowRef.current) {
            let window = windowRef.current.windowElement;
           // window.querySelector(".popup-window .k-window-actions").classList.add("hide");
        }

        //min|maximize 버튼 숨김
        if (props.show) {
            if (windowRef.current) {
               // setTimeout(() => {
                    let window = windowRef.current.windowElement;
                    let height = window.offsetHeight;
                    window.style.top =  "calc(50% - " + (height/2) + "px)";
             //   })

            }
        }
       /* if (props.options && props.options.isHeaderHide != undefined && props.options.isHeaderHide) {
            if (windowRef.current) {
                windowRef.current.windowElement.querySelector(".popup-window .k-window-titlebar").classList.add("hide");
            }
        }*/


    }, [props]);

    /**
     * @funcName : onMove
     * @description : onMove 이벤트 핸들러
     * @param event : 이벤트 객체
     * @return :
     * @date : 2022-08-26 오전 12:58
     * @author : chauki
     * @version : 1.0.0
     * @see
     * @history
    **/
    const onMove = useCallback((event) => {
        const bodyWidth = document.getElementsByTagName("body")[0].clientWidth;
        const bodyHeight = document.getElementsByTagName("body")[0].clientHeight;
        const offsetRight = event.left + event.width;
        const offsetHeight = event.top + event.height;

        if (offsetRight >= bodyWidth) {
            windowRef.current.windowElement.style.left = (bodyWidth - event.width) + "px";
        }

        if (offsetHeight >= bodyHeight) {
            windowRef.current.windowElement.style.top = (bodyHeight - event.height) + "px";
        }

    }, []);

    return (
        <Fragment>
           {/* <Fade className={props.show ? "pos-abs" : ""}>*/}
                {
                    props.show ?
                        <Window
                            ref={windowRef}
                            className={"popup-window"}
                            title={
                                <div className={"title-wrapper"}>
                                    <span>{props.title}</span>
                                    {
                                        props.options && props.options.showRefreshButton === true &&
                                        <Button onClick={(event) => {
                                            if (props.options && props.options.onRefresh && props.options.onRefresh instanceof Function) {
                                                props.options.onRefresh(event);
                                            }
                                        }}>
                                            <span><i className={"k-icon k-i-refresh"}></i></span>
                                        </Button>
                                    }
                                </div>
                            }
                            width={(props.options && props.options.width) ? props.options.width : null }
                            height={(props.options && props.options.height) ? props.options.height : null}
                            minHeight={(props.options && props.options.minHeight) ? props.options.minHeight : null}
                            modal={true}
                            resizable={false}
                            draggable={(props.options && props.options.draggable) ? props.options.draggable : false}
                            doubleClickStageChange={false}
                            onClose={props.onClose}
                            onStageChange={props.options.onStageChange}
                            onMove={onMove}>
                            {props.component}
                        </Window>: null
                }
           {/* </Fade>*/}
        </Fragment>
    );
}
export default WindowPopupProvider;
