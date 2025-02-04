import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import DiskListPage from "../pages/DiskListPage";
import NewDiskPage from "../pages/NewDiskPage";
import EditDiskPage from "../pages/EditDiskPage";
import SettingsPage from "../pages/SettingsPage";
import NotFound from "../pages/NotFound";
import { loginState, routeState, signUpState } from "../state/atom";
import { getLoc } from "../utils/localStorage";
import { initGA, logPageView } from "../utils/googleAnalytics";

const Router = () => {
  const [gaInit, setGaInit] = useState(false);

  const [loading, setLoading] = useRecoilState(routeState);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [isSignUp, setIsSignUp] = useRecoilState(signUpState);

  let location = useLocation();
  const accessToken = getLoc("accessToken");
  const memberId = getLoc("memberId");

  useEffect(() => {
    initGA();
    setGaInit(true);
  }, []);

  useEffect(() => {
    if (!isSignUp && !isLogin) {
      accessToken ? setIsLogin(true) : setIsLogin(false);
    }
    setLoading(false);
  }, [loading]);

  useEffect(() => {
    if (gaInit) logPageView();
  }, [gaInit, location]);

  return (
    <>
      {!loading ? (
        <Routes>
          <Route
            path="/"
            element={
              isLogin || isSignUp ? (
                <Navigate to={`/home/${memberId}`} />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path="/home/:id" element={<HomePage />} />
          <Route
            path="/signUp"
            element={
              isLogin ? <Navigate to={`/home/${memberId}`} /> : <SignUpPage />
            }
          />
          <Route
            path="/login"
            element={
              isLogin ? <Navigate to={`/home/${memberId}`} /> : <LoginPage />
            }
          />
          <Route path="/disk-list/:id" element={<DiskListPage />} />
          <Route
            path="/new-disk"
            element={
              isLogin || isSignUp ? <NewDiskPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/edit-disk/:id"
            element={
              isLogin || isSignUp ? <EditDiskPage /> : <Navigate to="/" />
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      ) : (
        <></>
      )}
    </>
  );
};

export default Router;
