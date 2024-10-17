import "./index.css";
import "../../style/skeleton.css";
import "../../style/card.css";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../App";

import { SRC, STATE } from "../../util/configConsts";

export default function Component() {
  const context = useContext(AuthContext);

  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);

  //перемальовуэ зовнійній вигляд в залежності від status
  //враховує status, змінює вигляд element через зміну innerHTML
  const updateView = (status, data) => {
    const element = document.querySelector(".notifications__list");
    // console.log("element", element); //ok
    if (!element) throw new Error("Element is null");

    element.innerHTML = "";
    // console.log("status", status);
    // console.log("data", data);

    switch (status) {
      case STATE.LOADING:
        element.innerHTML = `
        <div class="card__container card__container--big ">
          <div class="card__img_bg skeleton"></div>
          <div class="card__info">
            <p class="card__name skeleton"></p>
            <div class="card__details skeleton"></div>
          </div>
        </div>

        <div class="card__container card__container--big">
          <div class="card__img_bg skeleton"></div>
          <div class="card__info">
            <p class="card__name skeleton"></p>
            <div class="card__details skeleton"></div>
          </div>
        </div>
            `;
        break;
      case STATE.SUCCESS:
        data.list.forEach((item) => {
          element.innerHTML += `
          <div class="card__container card__container--big two-colums">
            <div class="card__img_bg">
              <img
                src="${
                  item.type === "Warning" ? SRC.WARNING : SRC.ANNOUNCEMENT
                }"
                alt="img"
                width={18}
                height={18}
              />
            </div>
            <div class="card__info">
              <p class="card__name">${item.name}</p>

              <div class="card__details">
                <span class="card__data">
                  ${item.time} min. ago
                </span>
                <span class="card__data">${item.type}</span>
              </div>
            </div>
          </div>
          `;
        });
        break;
      case STATE.ERROR:
        element.innerHTML = `
          <div class="card__name">${data.message}</div>
          `;
        break;
      default:
        return (element.innerHTML = ``);
    }
  };

  //конвертуэ дні, що надходять з бекенду в фронтенд-вигляд
  const convertData = (data) => {
    return {
      ...data,
      list: data.list.map((item) => ({
        ...item,
        time: Math.round((Date.now() - new Date(item.date)) / 1000 / 60),
      })),
    };
  };

  const loadNotificationsList = async () => {
    setStatus(STATE.LOADING);
    console.log("status", status);
    updateView(STATE.LOADING, data);
    // return null;

    //формуємо запит на сервер about getting List
    try {
      const res = await fetch(
        `http://localhost:4000/notifications-data?token=${context.state.token}`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${context.state.token}`,
          // },
        }
      );

      const data = await res.json();

      console.log("data = data.list", data); //ok

      if (res.ok) {
        setStatus(STATE.SUCCESS);
        const convertedData = convertData(data);
        // console.log("converted data", convertedData); //ok
        setData(convertedData);
        updateView(STATE.SUCCESS, convertedData);
      } else {
        setStatus(STATE.ERROR);
        setData(data);
        updateView(STATE.ERROR, data);
      }
    } catch (err) {
      setStatus(STATE.ERROR);
      //тут не конвертуэмо
      setData({ message: err.message });
    }
  };

  useEffect(() => {
    loadNotificationsList();
  }, []);

  return <div className="notifications__list card__list"></div>;
}
