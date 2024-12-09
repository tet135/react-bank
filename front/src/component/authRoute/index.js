import { useContext } from "react";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";
import BalancePage from "../../page/balancePage";
import { getTokenSession } from "../../util/session";

export default function Component({ children }) {
  const context = useContext(AuthContext);
  console.log("context in authroute", context);

  if (context.state.token) {
    return <Navigate to="/balance" replace={true} />;
    // return <BalancePage />;
  }

  return <>{children}</>;
}

// export default function Component({ children }) {
//   // const context = useContext(AuthContext);
//   const token = getTokenSession();
//   console.log("token in authRoute", token);

//   if (token) {
//     return <Navigate to="/balance" replace={true} />;
//   }

//   return <>{children}</>;
// }
