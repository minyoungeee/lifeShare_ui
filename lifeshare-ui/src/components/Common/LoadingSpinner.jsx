import {Fragment, useState, createContext} from 'react';
import {
    ClipLoader,
    PuffLoader,
    PulseLoader,
    RotateLoader,
    BeatLoader,
    ScaleLoader} from "react-spinners";

//context 생성
//context를 생성해야지만 전역으로 사용할 수 있음
export const loadingSpinnerContext = createContext(null);

/**
 * @className : LoadingProvider
 * @description : Loading Spinner Provider 컴포넌트
 * @date : 2021-03-09 오전 10:59
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history :
**/
const LoadingProvider = (props) => {
    //state 설정
    const [spinner, setSpinner] = useState({
        loading : false,
        target : null,
        color : "#fff",
        size : 20
    });

    /**
     * @funcName : show
     * @description : Loading Spinner를 show 한다.
     * @param target : target 엘리먼트(optional) - target 엘리먼트 내에 loading spinner 생성
     * @param color : loading spinner color(optional)
     * @param size : loading spinner size(optional)
     * @return :
     * @exception :
     * @date : 2021-03-09 오전 11:03
     * @author : chauki
     * @see
     * @history :
    **/
    const show = (target, color, size) => {
        setSpinner({
            loading : true,
            target :  (target !== undefined && target !== null) ? target : spinner.target,
            color : (color !== undefined && color !== null) ? color : spinner.color,
            size : (size !== undefined && size !== null) ? size : spinner.size
        });
    }

    /**
     * @funcName : hide
     * @description : Loading Spinner를 hide 한다.
     * @param :
     * @return :
     * @exception :
     * @date : 2021-03-09 오전 11:27
     * @author : chauki
     * @see
     * @history :
    **/
    const hide = () => {
        //setTimeout(() => {
            setSpinner({
                ...spinner,
                loading : false
            });
        //}, 300);
    }

    /**
     * @funcName : clear
     * @description : loading spinner를 clear 한다.
     * @param :
     * @return :
     * @exception :
     * @date : 2021-03-11 오전 11:58
     * @author : chauki
     * @see
     * @history :
    **/
    const clear = () => {
        hide();
    }

    return (
        <loadingSpinnerContext.Provider value={{show, hide, clear}} {...props}>
            {props.children}
            <LoadingSpinner
                loading={spinner.loading}
                color={spinner.color}
                size={spinner.size}
                target={spinner.target}
            />
        </loadingSpinnerContext.Provider>
    )
}

/**
 * @className : LoadingSpinner
 * @description : Loading Spinner 컴포넌트
 * @date : 2021-03-09 오전 11:27
 * @author : chauki
 * @version : 1.0.0
 * @see
 * @history :
**/
const LoadingSpinner = (props) => {
    const {loading, target, color, size} = props;
    let maskStyle;
    if (target == null) {
        maskStyle = {
            position : "absolute",
            top : "0",
            width : "100%",
            height : "100%",
            backgroundColor: "transparent",
            opacity: "1"
        };
    }
    //target이 있을 경우,
    //target 영역에 loading spinner를 생성하기 위해 영역 계산
    else {
        const rect = target.getBoundingClientRect();
        maskStyle = {
            position : "absolute",
            top : rect.top,
            left : rect.left,
            width : rect.width,
            height : rect.height,
            backgroundColor: "transparent",
            opacity: "1"
        };
    }

    //spinner style 설정
    const padding = 20;
    const css = {
        margin:"0 auto",
        position: "absolute",
        left:"calc(50% - " + (parseInt(size/2) + padding) + "px)",
        top:"calc(50% - " + (parseInt(size/2) + padding) + "px)",
        padding: padding +"px",
/*        border : "1px solid #ddd",*/
        borderRadius: "5px",
        background : "rgba(58, 65, 80, 0.6)",
        zIndex : 30000
    };

    return (
        <Fragment>
            {
                loading
                    ? <div style={maskStyle}>
                        <div style={css}>
                            <ClipLoader color={color} loading={loading} size={size}/>
                        </div>
                      </div>
                    : null
            }
        </Fragment>
    );
}
export default LoadingProvider;
