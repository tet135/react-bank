import "./index.css";
import "../../style/click.css";
import "../../style/disabled.css";

import { SRC } from "../../util/configConsts";

export default function Component({ handleClick, disabled = true, text }) {
  return (
    <button
      onClick={handleClick}
      className={`pay_system ${disabled ? "disabled" : ""} click`}
      type="button"
      path="/balance"
      id={text}
      name={text}
      disabled={disabled}
    >
      <div className="pay_system__container">
        <div class="pay_system__bg">
          <img
            src={text === "Coinbase" ? SRC.COINBASE : SRC.STRIPE}
            alt="payment_system"
            width={18}
            height={18}
          />
        </div>
        <div>{text}</div>
      </div>

      <img
        src={text === "Coinbase" ? SRC.COINBASE_PAY : SRC.STRIPE_PAY}
        alt="payment_system"
        height={20}
      />
    </button>
  );
}
