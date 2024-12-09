import { useContext } from "react";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";
import SignupConfirmPage from "../../page/signupConfirmPage";

export default function Component({ children }) {
  const context = useContext(AuthContext);

  if (context.state.token) {
    if (context.state.user.isConfirm) {
      return <>{children}</>;
    } else {
      return <SignupConfirmPage />;
    }
  }

  return <Navigate to="/" replace={true} />;
}
