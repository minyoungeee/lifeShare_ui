import {useState, createContext} from "react";

//context를 생성해야지만 전역으로 사용할 수 있음
export const mapContext = createContext(null);

const MapContextProvider = (props) => {

    const [ktMapIns, setKtMapIns] = useState(null);

    const setMap = (map) => {
        setKtMapIns(map);
    };

    const getMap = () => {
        return ktMapIns;
    };

    const addMarker = () => {

    };

    return (
        <mapContext.Provider value={{
            ktMapIns,
            setMap,
            getMap
        }} {...props}>
            {props.children}
        </mapContext.Provider>
    );
};
export default MapContextProvider;
