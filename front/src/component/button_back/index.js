import "./index.css";
import "../../style/click.css";

import { useNavigate } from "react-router-dom";

export default function Component() {
  let navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className="button-back click">
      <img
        src="/../../../svg/arrow-back.svg"
        className="img"
        alt="button-back"
        height={24}
        width={24}
      />
    </button>
  );
}
