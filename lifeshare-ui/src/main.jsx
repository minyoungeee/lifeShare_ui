import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-licensing'; // 자동 감지 방식 (1.7.1 전용)

// ✅ React 관련 import
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

/* ✅ 기본 contextAPI 컴포넌트 */
import ModalProvider from "@/components/Common/Modal";
import LoadingProvider from "@/components/Common/LoadingSpinner";
import NotificationProvider from "@/components/Common/Notification";
import WindowPopupProvider from "@/components/Common/WindowPopup";
import MultiWindowPopupProvider from "@/components/Common/MultiWindowPopup";

/* ✅ Redux */
import { Provider } from "react-redux";
import store from "@/redux/store/Store";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/redux/store/StorePersist";

/* ✅ KendoReact 한글 로케일 세팅 */
import likelySubtags from "cldr-core/supplemental/likelySubtags.json";
import currencyData from "cldr-core/supplemental/currencyData.json";
import weekData from "cldr-core/supplemental/weekData.json";
import numbers from "cldr-numbers-full/main/ko-KP/numbers.json";
import caGregorian from "cldr-dates-full/main/ko-KP/ca-gregorian.json";
import dateFields from "cldr-dates-full/main/ko-KP/dateFields.json";
import timeZoneNames from "cldr-dates-full/main/ko-KP/timeZoneNames.json";
import {
    IntlProvider,
    load,
    loadMessages,
    LocalizationProvider,
} from "@progress/kendo-react-intl";
import language from "@/language/language.json";
import MapContextProvider from "./components/Common/MapContext";

caGregorian.main["ko-KP"].dates.calendars.gregorian.dateTimeFormats.availableFormats.d = "d";

load(
    likelySubtags,
    currencyData,
    weekData,
    numbers,
    caGregorian,
    dateFields,
    timeZoneNames
);
loadMessages(language, "lan");

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <LocalizationProvider language="lan">
                        <IntlProvider locale="ko-KP">
                            <LoadingProvider>
                                <NotificationProvider>
                                    <ModalProvider>
                                        <WindowPopupProvider>
                                            <MultiWindowPopupProvider>
                                                <App />
                                            </MultiWindowPopupProvider>
                                        </WindowPopupProvider>
                                    </ModalProvider>
                                </NotificationProvider>
                            </LoadingProvider>
                        </IntlProvider>
                    </LocalizationProvider>
                </PersistGate>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
