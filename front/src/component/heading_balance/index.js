import "./index.css";
import "../../style/click.css";
import "../../style/skeleton.css";
import { Fragment, Suspense, lazy, memo } from "react";
import { Link } from "react-router-dom";

const LazyTotalBalance = lazy(() => import("../../component/totalBalance"));

function Component({ sum }) {
  return (
    <Fragment>
      <div className="balance__heading">
        <Link to="http://localhost:3000/settings">
          <img
            src="/../../../svg/settings.svg"
            className={`img click`}
            alt="settings"
          />
        </Link>
        <p className={`description`}>Main wallet</p>
        <Link to="http://localhost:3000/notifications">
          <img
            src="/../../../svg/notifications.svg"
            className={`img click`}
            alt="notifications"
          />
        </Link>
      </div>
      <Suspense fallback={<div className="total skeleton">$...</div>}>
        <LazyTotalBalance sum={sum} />
      </Suspense>
      <div className="balance__container balance__container--gap">
        <Link to="http://localhost:3000/receive">
          <div className="img--white">
            <div className={`img--round click`}>
              <img
                src="/../../../svg/receive.svg"
                className="img"
                alt="receive"
              />
            </div>
          </div>
          <p className="sign">receive</p>
        </Link>
        <Link to="http://localhost:3000/send">
          <div className="img--white">
            <div className={`img--round click`}>
              <img src="/../../../svg/send.svg" className="img" alt="send" />
            </div>
          </div>
          <p className="sign">send</p>
        </Link>
      </div>
    </Fragment>
  );
}

export default memo(Component);
