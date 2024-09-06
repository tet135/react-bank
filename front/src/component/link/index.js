import "./index.css";
import "../../style/click.css";

import { Link } from "react-router-dom";

export default function Component({ label, text, path }) {
  return (
    <div className="link__container">
      <p>{label}</p>
      <Link to={path} className="link click">
        {text}
      </Link>
    </div>
  );
}
