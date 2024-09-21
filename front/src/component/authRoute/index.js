import { useContext } from "react";
import { AuthContext } from "../../App";
import { Navigate } from "react-router-dom";

export default function Component({ children }) {
  const context = useContext(AuthContext);

  if (context.state.token) {
    return <Navigate to="/balance" replace={true} />;
  }

  return <>{children}</>;
}
