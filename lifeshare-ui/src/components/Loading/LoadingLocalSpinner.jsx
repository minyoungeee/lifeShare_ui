import {useEffect, useState, Fragment, memo} from "react";
import {
    ClipLoader,
    PuffLoader,
    PulseLoader,
    RotateLoader,
    BeatLoader,
    ScaleLoader} from "react-spinners";
import "@/components/Loading/Loading.css";

const LoadingLocalSpinner = (props) => {

    //data state 설정
    const [data, setData] = useState({
        loading : false,
        color : "#fff",
        size : 20
    });

    useEffect(() => {
        updateData();
    }, [props.loading]);

    const updateData = () => {
        setData(prevState => ({
            ...prevState,
            ...props
        }));
    };

    return (
        <Fragment>
            <div className={"ns-loading-spinner"}>
                <div className={"spinner-box"}>
                    <ClipLoader color={data.color} loading={data.loading} size={data.size}/>
                </div>
            </div>
        </Fragment>
    );
};
export default memo(LoadingLocalSpinner);
