import "./index.css";
import "../../style/skeleton.css";
import "../../style/transactionItem.css";

import { Fragment, memo } from "react";

function Component() {
  return (
    <Fragment>
      <div className="item">
        <div className="item__data">Date</div>
        <div className="item__data skeleton"></div>
      </div>
      <div className="divider"></div>
      <div className="item">
        <div className="item__data">Address/Payment system</div>
        <div className="item__data skeleton"></div>
      </div>
      <div className="divider"></div>
      <div className="item">
        <div className="item__data">Type</div>
        <div className="item__data skeleton"></div>
      </div>
    </Fragment>
  );
}
export default memo(Component);
