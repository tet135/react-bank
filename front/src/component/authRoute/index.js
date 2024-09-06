import { useContext } from "react";
import { AuthContext } from "../../App";

import SignupConfirmPage from "../../page/signupConfirmPage";

export default function Component({ children }) {
  const context = useContext(AuthContext);
  // console.log("context in AuthContext", context);
  // console.log("context.state.token in AuthContext", context.state.token);//ok

  return context.state.token ? <SignupConfirmPage /> : <>{children}</>;
}
