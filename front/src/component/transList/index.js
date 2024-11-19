import "./index.css";
import "../../style/transactionList.css";
import "../../style/card.css";

import { memo } from "react";

import { Link } from "react-router-dom";

import { SRC } from "../../util/configConsts";

function Component({ transaction }) {
  return (
    <Link to={`/transaction/${transaction.id}`} class="card__container click">
      <div class="card__img_bg">
        <img
          src={
            transaction.payment_system === null
              ? SRC.SENDER
              : transaction.payment_system === "Coinbase"
              ? SRC.COINBASE
              : SRC.STRIPE
          }
          alt="transaction_method"
          width={18}
          height={18}
        />
      </div>
      <div class="card__info">
        <p class="card__name">
          {transaction.payment_system || transaction.recipient_email}
        </p>

        <div class="card__details">
          <span class="card__data">
            {transaction.date.hours} : {transaction.date.minutes}
          </span>
          <span class="card__data">{transaction.type}</span>
        </div>
      </div>
      <div class="transaction__sum">
        <span
          class={
            transaction.type === "Sending"
              ? "transaction__dollar"
              : "transaction__dollar transaction__dollar--received"
          }
        >
          {transaction.type === "Sending" ? "-" : "+"}$
        </span>

        <span
          class={
            transaction.type === "Sending"
              ? "transaction__dollar"
              : "transaction__dollar transaction__dollar--received"
          }
        >
          {transaction.amount.dollars}.
        </span>
        <span
          class={
            transaction.type === "Sending"
              ? "transaction__coins"
              : "transaction__coins--received"
          }
        >
          {transaction.amount.coins}
        </span>
      </div>
    </Link>
  );
}

export default memo(Component);
