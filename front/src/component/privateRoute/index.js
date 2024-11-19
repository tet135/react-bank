import { useContext } from "react";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";
import SignupConfirmPage from "../../page/signupConfirmPage";
import { getSession } from "../../util/session";

// export default function Component({ children }) {
//   const context = useContext(AuthContext);
//   console.log("context in privatRoute", context);

//   const session = getSession();
//   console.log("session in privatRoute", session);

//   if (session.token) {
//     if (session.user.isConfirm) {
//       return <>{children}</>;
//     } else {
//       return <SignupConfirmPage />;
//       // return <Navigate to="/signup-confirm" replace={true} />;
//     }
//   }

//   return <Navigate to="/" replace={true} />;
// }

export default function Component({ children }) {
  const context = useContext(AuthContext);

  // console.log("context in privatRoute", context);

  if (context.state.token) {
    if (context.state.user.isConfirm) {
      return <>{children}</>;
    } else {
      return <SignupConfirmPage />;
      // return <Navigate to="/signup-confirm" replace={true} />;
    }
  }

  return <Navigate to="/" replace={true} />;
}
