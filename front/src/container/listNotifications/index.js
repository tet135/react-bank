import "./index.css";
import "../../style/skeleton.css";
import "../../style/card.css";

// import { AuthContext } from "../../App";

import {
  useCallback,
  useEffect,
  useState,
  useReducer,
  lazy,
  Suspense,
  Fragment,
} from "react";

import { STATE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";
import { calculateTimeAgo } from "../../util/calculateTimeAgo";
import { reducer, initState, ACTION_TYPE } from "../../util/reduser";

import Skeleton from "../../component/skeletonTransList";
const LazyNotificationsList = lazy(() =>
  import("../../component/notifiicationsList")
);

export default function Component() {
  const token = getTokenSession();

  const [state, dispatch] = useReducer(reducer, initState);

  const convertData = useCallback((data) => {
    return {
      ...data,
      list: data.list.reverse().map((item) => ({
        ...item,
        time: calculateTimeAgo(item.date),
      })),
    };
  }, []);

  const loadNotificationsList = useCallback(async () => {
    //формуємо запит на сервер about getting List
    try {
      const res = await fetch(
        `http://localhost:4000/notifications-data?token=${token}`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${context.state.token}`,
          // },
        }
      );

      const data = await res.json();

      if (res.ok) {
        dispatch({ type: ACTION_TYPE.SUCCESS, payload: convertData(data) });
      } else {
        dispatch({ type: ACTION_TYPE.ERROR, payload: data });
      }
    } catch (err) {
      dispatch({ type: ACTION_TYPE.ERROR, payload: err.message });
    }
  }, [token, convertData]);

  useEffect(() => {
    loadNotificationsList();
  }, []);

  return (
    <div className="notifications__list card__list">
      {state.status === STATE.SUCCESS &&
        state.data.list.map((item) => {
          return (
            <Fragment key={item.id}>
              <Suspense fallback={<Skeleton />}>
                <LazyNotificationsList notification={item} />
              </Suspense>
            </Fragment>
          );
        })}
      {state.status === STATE.ERROR && (
        <div style={{ font: "16px", fontWeight: "bold" }}>
          {state.data.message}
        </div>
      )}
    </div>
  );
}
