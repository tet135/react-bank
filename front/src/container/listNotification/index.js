import "./index.css";
import "../../style/skeleton.css";
import "../../style/card.css";

// import { AuthContext } from "../../App";

import {
  useCallback,
  useEffect,
  useState,
  lazy,
  Suspense,
  Fragment,
} from "react";

import { STATE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";
import { calculateTimeAgo } from "../../util/calculateTimeAgo";

import Skeleton from "../../component/skeletonTransList";
const LazyNotificationsList = lazy(() =>
  import("../../component/notifiicationsList")
);

export default function Component() {
  const token = getTokenSession();

  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);

  //конвертуэ дні, що надходять з бекенду в фронтенд-вигляд
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

      // console.log("data = data.list", data); //ok

      if (res.ok) {
        setStatus(STATE.SUCCESS);
        const convertedData = convertData(data);
        // console.log("converted data", convertedData); //ok
        setData(convertedData);
      } else {
        setStatus(STATE.ERROR);
        setData(data);
      }
    } catch (err) {
      setStatus(STATE.ERROR);
      //тут не конвертуэмо
      setData({ message: err.message });
    }
  }, [token, convertData]);

  useEffect(() => {
    loadNotificationsList();
  }, []);

  return (
    <div className="notifications__list card__list">
      {status === STATE.SUCCESS &&
        data.list.map((item) => {
          console.log("item", item);
          return (
            <Fragment key={item.id}>
              <Suspense fallback={<Skeleton />}>
                <LazyNotificationsList notification={item} />
              </Suspense>
            </Fragment>
          );
        })}
      {status === STATE.ERROR && (
        <div style={{ font: "16px", fontWeight: "bold" }}>{data.message}</div>
      )}
    </div>
  );
}
