import { Link } from "react-router-dom";
import "./index.css";
import click from "../../style/click.css";
import { Fragment } from "react";

export default function Component() {
  return (
    <Fragment>
      <div className="balance__heading">
        <Link to="http://localhost:3000/settings">
          <img
            src="/../../../svg/settings.svg"
            className={`img ${click}`}
            alt="settings"
          />
        </Link>
        <p className={`description`}>Main wallet</p>
        <Link to="http://localhost:3000/notifications">
          <img
            src="/../../../svg/notifications.svg"
            className={`img ${click}`}
            alt="notifications"
          />
        </Link>
      </div>
      <div className="balance__container">
        <span className="balance">$</span>
        <h1 className="balance">100</h1>
        <span className="balance__coins">.20</span>
      </div>
      <div className="balance__container balance__container--gap">
        <Link to="http://localhost:3000/receive">
          <div className="img--white">
            <div className={`img--round ${click}`}>
              <img
                src="/../../../svg/receive.svg"
                className="img"
                alt="receive"
              />
            </div>
          </div>
          <p className="name">receive</p>
        </Link>
        <Link to="http://localhost:3000/send">
          <div className="img--white">
            <div className={`img--round ${click}`}>
              <img src="/../../../svg/send.svg" className="img" alt="send" />
            </div>
          </div>
          <p className="name">send</p>
        </Link>
      </div>
    </Fragment>
  );
}
