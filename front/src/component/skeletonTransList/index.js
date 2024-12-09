import "./index.css";
import "../../style/skeleton.css";
import "../../style/card.css";
import "../../style/transactionList.css";

import { Fragment, memo } from "react";

function Component() {
  return (
    <Fragment>
      <div class="card__container">
        <div class="card__img_bg skeleton"></div>
        <div class="card_info">
          <p class="card__name skeleton"></p>
          <div class="card__details skeleton"></div>
        </div>
        <div class="transaction__sum skeleton"></div>
      </div>
    </Fragment>
  );
}
export default memo(Component);
