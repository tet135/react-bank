import React, { createContext, useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import WellcomePage from './page/welcomePage'
import SignInPage from './page/signinPage'
import SignUpPage from './page/signupPage'
import SignupConfirmPage from './page/signupConfirmPage'
import RecoveryPage from './page/recoveryPage'
import RecoveryConfirmPage from './page/recoveryConfirmPage'
import BalancePage from './page/balancePage'
import SendPage from './page/sendPage'


import AuthRoute from './component/authRoute'
import PrivateRoute from './component/privateRoute'

// type ContextType = {
//   token: boolean;
//   // user: {
//   //   email: (status: boolean) => void;
//   //   password: (status: boolean) => void;
//   // }
// }

import { initGlobalState, globalReducer } from "./util/glogalReducer"


export const AuthContext = createContext({})

function App() {  

  const [globalState, dispatch] = useReducer(globalReducer, initGlobalState);

  const AuthContectData = {
    state: globalState,
    dispatch: dispatch,
  }

  console.log("globalState", globalState)

  return  (
    <AuthContext.Provider value={AuthContectData}>
      <BrowserRouter>
        <Routes>
          <Route index element={
            <AuthRoute>
              <WellcomePage />
            </AuthRoute>}/>
          
          <Route path="/signin" element={
            <AuthRoute>
              <SignInPage />
            </AuthRoute>}/>

          <Route path="/signup" element={
            <AuthRoute>
              <SignUpPage />
            </AuthRoute>
          }/>
          <Route
            path="/signup-confirm"
            element={
              <PrivateRoute>
                <SignupConfirmPage />
              </PrivateRoute>
            }/>
          <Route
            path="/recovery"
            element={
              <AuthRoute>
                <RecoveryPage />
              </AuthRoute>
            }/>

          <Route
            path="/recovery-confirm"
            element={
              <AuthRoute>
                <RecoveryConfirmPage />
              </AuthRoute>
            }/>
          <Route
            path="/balance"
            element={
              <PrivateRoute>
                <BalancePage />
              </PrivateRoute>
            }/>
                      <Route
            path="/send"
            element={
              <PrivateRoute>
                <SendPage />
              </PrivateRoute>
            }/>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App;
