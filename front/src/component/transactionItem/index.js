import "./index.css";
import "../../style/transactionItem.css";

import { Fragment, memo } from "react";

function Component({ trans }) {
  return (
    <Fragment>
      <div className="item">
        <div className="item__data">Date</div>
        <div className="item__data">
          {trans.date.day} {trans.date.mounth}, {trans.date.hours}:
          {trans.date.minutes}
        </div>
      </div>
      <div className="divider"></div>
      <div className="item">
        <div className="item__data">{trans.address}</div>
        <div className="item__data">{trans.author}</div>
      </div>
      <div className="divider"></div>
      <div className="item">
        <div className="item__data">Type</div>
        <div className="item__data">{trans.type}</div>
      </div>
    </Fragment>
  );
}

export default memo(Component);
