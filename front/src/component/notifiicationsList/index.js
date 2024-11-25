import "./index.css";
import "../../style/transactionList.css";
import "../../style/card.css";

import { memo } from "react";

import { SRC } from "../../util/configConsts";

function Component({ notification }) {
  return (
    <div class="card__container card__container--big two-colums">
      <div class="card__img_bg">
        <img
          src={notification.type === "Warning" ? SRC.WARNING : SRC.ANNOUNCEMENT}
          alt="img"
          width={18}
          height={18}
        />
      </div>
      <div class="card__info">
        <p class="card__name">{notification.name}</p>
        <div class="card__details">
          <span class="card__data">{notification.time}</span>
          <span class="card__data">{notification.type}</span>
        </div>
      </div>
    </div>
  );
}

export default memo(Component);
