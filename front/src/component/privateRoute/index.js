import { useContext } from "react";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";
import SignupConfirmPage from "../../page/signupConfirmPage";

export default function Component({ children }) {
  const context = useContext(AuthContext);

  console.log("context in privatRoute", context);

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

// export default function Component({ children }) {
//   const context = useContext(AuthContext);

// if (!context.state.user.isConfirm) {
//   if (!context.state.token) {
//     return <Navigate to="/" replace={true} />;
//   }
//   return <Navigate to="/signup-confirm" replace={true} />;
// }

//  return <>{children}</>;
// }
