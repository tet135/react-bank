import { useContext } from "react";
import { AuthContext } from "../../App";

import BalancePage from "../../page/balancePage";

export default function Component({ children }) {
  const context = useContext(AuthContext);
  // console.log("context in AuthContext", context);
  // console.log(
  //   "context.state.user.isConfirm, token in PrivatRoute",
  //   context.state.token,
  //   context.state.user.isConfirm
  // );

  return context.state.token && context.state.user.isConfirm === true ? (
    <BalancePage />
  ) : (
    <>{children}</>
  );
}
