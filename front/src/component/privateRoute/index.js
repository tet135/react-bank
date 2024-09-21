import { useContext } from "react";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";

export default function Component({ children }) {
  const context = useContext(AuthContext);

  if (!context.state.user.isConfirm) {
    if (!context.state.token) {
      return <Navigate to="/" replace={true} />;
    }
    return <Navigate to="/signup-confirm" replace={true} />;
  }

  return <>{children}</>;
}
