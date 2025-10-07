import { Fragment, useEffect } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {persistor} from "@/redux/store/StorePersist"
import ServiceApi from "@/common/ServiceApi";
import {setPublicKey} from "@/redux/action/AuthAction";
import LoginWrapperView from "@/views/Login/LoginWrapperView";

function App() {

  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  // componentDidMount
  useEffect(() => {
    doSessionCheck();
  }, []);

  // componentDidUpdate
  useEffect(() => {
    if (auth.publicKey === null) {
      reqGetRsaPublicKey();
    }
  }, [auth.publicKey]);

  const doSessionCheck = async () => {
    let token = sessionStorage.getItem("token");
    if (!token) {
      await persistor.purge();
      return;
    }
  };

  const reqGetRsaPublicKey = async () => {
    try {
      const result = await ServiceApi.auth.reqGetPublicKey();
      if (result.publicKey) {
        dispatch(setPublicKey(result.publicKey));
      }
    } catch (err) {
      // console.log(err);
    }
  };

  return (
      <BrowserRouter>
        <Fragment>
          <Routes>
            {auth && auth.isLogin ? (
                <>
                  {/* 루트 접근 시 /keyword/list로 리다이렉트 */}
                  {/*<Route path="/" element={<Navigate to="/keyword/list" replace />} />*/}
                  {/* 메인 페이지 */}
                  {/*<Route path="/keyword/*" element={<MainWrapperView />} />*/}
                  {/*<Route path="/employ/*" element={<EmployWrapperView />} />*/}
                </>
            ) : (
                <>
                  {/* 로그인 및 기타 경로 */}
                  <Route path="/login" element={<LoginWrapperView />} />
                  <Route path="/*" element={<LoginWrapperView />} />
                </>
            )}
            {/* 404 페이지 */}
            <Route path="/error" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Fragment>
      </BrowserRouter>
  );
}

export default App;
