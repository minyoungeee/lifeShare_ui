import { Fragment, useEffect } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import {Routes, Route, Navigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "@/redux/store/StorePersist";
import ServiceApi from "@/common/ServiceApi";
import { setPublicKey } from "@/redux/action/AuthAction";
import LoginWrapperView from "@/views/Login/LoginWrapperView";
import CommunityWrapperView from "@/views/Community/CommunityWrapperView.jsx";
import MainWrapperView from "@/views/Main/MainWrapperView.jsx";

function App() {
  const auth = useSelector((store) => store.auth || { publicKey: null, isLogin: false });
  const dispatch = useDispatch();

  useEffect(() => {
    doSessionCheck();
  }, []);

  // 보류!!!!!!!
  // useEffect(() => {
  //   if (auth.publicKey === null) {
  //     reqGetRsaPublicKey();
  //   }
  // }, [auth.publicKey]);

  const doSessionCheck = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      await persistor.purge();
    }
  };

  // 보류!!!!!
  // const reqGetRsaPublicKey = async () => {
  //   try {
  //     const result = await ServiceApi.auth.reqGetPublicKey();
  //     if (result?.publicKey) {
  //       dispatch(setPublicKey(result.publicKey));
  //     }
  //   } catch (err) {
  //     console.error("RSA PublicKey 요청 실패:", err);
  //   }
  // };

  return (
      <Fragment>
        <Routes>
          {auth?.isLogin ? (
              <>
                <Route path="/" element={<Navigate to="/community/list" replace />} />
                <Route path="/*" element={<MainWrapperView />} />
              </>
          ) : (
              <>
                <Route path="/login" element={<LoginWrapperView />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
          )}

          {/*<Route path="/error" element={<NotFound />} />*/}
        </Routes>

      </Fragment>
  );
}

export default App;
