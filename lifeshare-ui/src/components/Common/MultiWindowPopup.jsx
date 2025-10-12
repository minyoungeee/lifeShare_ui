import {useRef, useState, useCallback, useEffect, useContext, createContext} from 'react';
import {modalContext} from "@/components/Common/Modal";
import {Button} from "@progress/kendo-react-buttons";

export const multiWindowPopupContext = createContext(null);

const MultiWindowPopupProvider = (props) => {
    const [multiWindowPopupList, setMultiWindowPopupList] = useState({});
    const ref = useRef(null);
    const modal = useContext(modalContext);

    useEffect(() => {
        ref.current = multiWindowPopupList
    }, [multiWindowPopupList]);

    const addWindowPopup = (id, title, component, options) => {
        if (options.maxCnt && options.maxCnt <= Object.values((ref.current)).length)
            return modal.showAlert("알림", "팝업은 최대 " + options.maxCnt +"개까지만 사용할 수 있습니다.");

        if (ref.current[id] !== null && ref.current[id] !== undefined) {
            // 열려있는
            const popup = ref.current[id]
            return modal.showAlert("알림", '"' + popup.props.title + '"' + "가 이미 존재 합니다.");
        } else {
            if (options.showGrid) {
                const popWidth = options.width ? options.width : options.initialWidth ? options.initialWidth : null
                const popHeight = options.height ? options.height : options.initialHeight ? options.initialHeight : null
                const position = getPosition(popWidth, popHeight, options.showGrid)
                if (position.left && position.top) {
                    options.initialTop = position.top
                    options.initialLeft = position.left
                }
            }

            const popup = <MultiWindowPopup title={title}
                                            component={component}
                                            options={options}
                                            onClose={remove}
                                            key={id} id={id}/>
            setMultiWindowPopupList(prevState => ({
                ...prevState,
                [id]: popup
            }));
        }
    }

    const getPosition = (pWidth, pHeight, align) => {
        const DEFAULT_LEFT_MARGIN = 15
        const DEFAULT_TOP_MARGIN = 15

        const width = pWidth + DEFAULT_LEFT_MARGIN
        const height = pHeight + DEFAULT_TOP_MARGIN
        const popCnt = Object.values((ref.current)).length + 1

        let topResult;
        let leftResult
        if (align === "vertical"){
            // 현재 화면 상 수직 한줄에 띄울 수 있는 팝업 갯수
            const visibleVerticalCnt = Math.floor(window.innerHeight / height)
            const standard = popCnt / visibleVerticalCnt
            const horizonPoint = Math.floor(Object.values((ref.current)).length / visibleVerticalCnt)
            const verticalPoint = (standard - horizonPoint) === 0 ? 1 :(standard - horizonPoint)

            topResult = (visibleVerticalCnt * verticalPoint * height) - height + DEFAULT_TOP_MARGIN
            leftResult = (horizonPoint * width) + DEFAULT_LEFT_MARGIN
        }else{
            // 현재 화면 상 수평 한줄에 띄울 수 있는 팝업 갯수
            const visibleHorizonCnt = Math.floor(window.innerWidth / width)
            const standard = popCnt / visibleHorizonCnt
            const horizonPoint = Math.floor(Object.values((ref.current)).length / visibleHorizonCnt)
            const verticalPoint = (standard - horizonPoint) === 0 ? 1 :(standard - horizonPoint)

            topResult = (horizonPoint * height) + DEFAULT_TOP_MARGIN
            leftResult = (visibleHorizonCnt * verticalPoint * width) - width + DEFAULT_LEFT_MARGIN
        }

        // 화면 다차면 중앙
        if ((topResult + pHeight) >= window.innerHeight
            || (leftResult + pWidth) >= window.innerWidth){
            topResult = null
            leftResult = null
        }

        return {left :leftResult, top : topResult}
    }

    const remove = (id) => {
        setMultiWindowPopupList(prevState => {
            const prevList = {...prevState}
            delete prevList[id]
            return prevList
        })
    }

    const clear = () => {
        setMultiWindowPopupList({})
    }

    return (
        <multiWindowPopupContext.Provider value={{addWindowPopup, remove, clear, multiWindowPopupList}} {...props}>
            {props.children}
            {Object.values((multiWindowPopupList))}
        </multiWindowPopupContext.Provider>
    );
}

const MultiWindowPopup = (props) => {
    const windowRef = useRef();
    const [isMinimum, setIsMinimum] = useState(false);

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
        <Window
            ref={windowRef}
            className={isMinimum ? "ns-multi-popup-window popup-window minimum " : "ns-multi-popup-window popup-window"}
            id={props.id}
            title={
            <div className={"title-wrapper"}>
                <span className={props.options.titleCls ? props.options.titleCls : ""}>{props.title}</span>
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
            initialTop={props.options.initialTop ? props.options.initialTop : undefined}
            initialLeft={props.options.initialLeft ? props.options.initialLeft : undefined}
            width={(props.options && props.options.width) ? props.options.width : undefined}
            height={(props.options && props.options.height) ? props.options.height : undefined}
            initialWidth={(props.options && props.options.initialWidth) ? props.options.initialWidth : undefined}
            initialHeight={(props.options && props.options.initialHeight) ? props.options.initialHeight : undefined}
            modal={(props.options && props.options.modal != null) ? props.options.modal : true}
            resizable={(props.options && props.options.resizable) ? props.options.resizable : false}
            draggable={(props.options && props.options.draggable) ? props.options.draggable : false}
            onStageChange={props.options.onStageChange}
            doubleClickStageChange={false}
            onClose={() => props.onClose(props.id)}
            onMove={onMove}>
            {props.component}

           {/* <div className={"ns-multi-popup-window-content"} style={{display: isMinimum ? 'none' : 'flex'}}>
                {props.component}
                <WindowActionsBar>
                    <Button
                        className={"ns-multi-popup-close btn"}
                        onClick={() => props.onClose(props.id)}
                    >닫기
                    </Button>
                </WindowActionsBar>
            </div>*/}
        </Window>
    );
}
export default MultiWindowPopupProvider
