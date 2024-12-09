import "./index.css";
import "../../style/form.css";

import ButtonPaySystem from "../../component/buttonPaySystem";
import Input from "../../component/input";
import Alert from "../../component/alert";
import Divider from "../../component/divider";

import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../App";

import { checkDisabled } from "../../util/checkDisabled";
import { validate } from "../../util/validate";
import { showAlert } from "../../util/showAlert";
import { validateAll } from "../../util/validateAll";
import { changeInputOnError } from "../../util/changeInputOnError";
import { ALERT, FIELD_NANE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";
import { setInputFocus } from "../../util/setInputFocus";

export default function Container() {
  const context = useContext(AuthContext);
  console.log("context in Send form", context);

  const token = getTokenSession();

  const navigate = useNavigate();

  const inputRef = useRef(null);
  //помилка при валідації інпута
  const [error, setError] = useState({});

  //value -  це об'єкn з назвами інпутів та їх актуальними значеннями
  const [value, setValue] = useState({});

  const [disabled, setDisabled] = useState(true);

  //handleChangeInput без змін, винести!
  const handleChangeInput = (event) => {
    const inputValue = event.target.value;
    const inputName = event.target.name;
    // console.log("inputValue", "inputName", inputName, inputValue); //
    setValue({ ...value, [inputName]: inputValue });
    // console.log("value", value); //

    // validation();
    const inputError = validate(inputName, inputValue); //текст помилки або underfined(=немаэ помилки
    // console.log("inputError", inputError);

    if (Boolean(inputError)) {
      //змінює інтерфейс при помилці
      changeInputOnError(inputName, error[inputName]);
      //в функцію setError передаємо нове значення стану(=помилку)
      setError({ ...error, [inputName]: inputError });
      // console.log("error", error); //ok
    } else {
      //змінює інтерфейс, коли поле пройшло валідацію успішно
      changeInputOnError(inputName, error[inputName]);

      //в функцію setError передаємо нове значення помилки null
      setError({ ...error, [inputName]: null });
      // console.log("error", error);

      //видаляэмо
      delete error[inputName]; //ввидаляэ з першого інпута, коли з'являється другий, то знов з'являється перший
      //   console.log("error after delete error[inputName]", error);
    }

    // console.log("error", error);

    checkDisabled(value, error, disabled, setDisabled);
  };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const handleReceive = async (pay_system) => {
    if (disabled === true) {
      validateAll(value, setDisabled);
      //ще показати поле, яке треба заповнити?!
    } else {
      // console.log(value); //ok

      showAlert("progress", ALERT.PROGRESS); //ok

      //відправити дані реєстрації на бекенд - формуємо запит на сервер на реєстрацію користувача
      try {
        const res = await fetch(
          `http://localhost:4000/receive?token=${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payment_system: pay_system,
              amount: value.amount,
            }),
          }
        );

        const data = await res.json();
        console.log("data = transaction", data); //

        if (res.ok) {
          // console.log("res.ok");
          showAlert("success", ALERT.TRANSACTION);

          setTimeout(() => navigate("/balance"), 3000);
        } else {
          showAlert("error", data.message);
        }
      } catch (err) {
        showAlert("error", err.message);
      }
    }
  };

  useEffect(() => setInputFocus(inputRef), []);

  return (
    <form className="form">
      <Input
        handleChangeInput={handleChangeInput}
        label="Receive amount"
        placeholder="$100"
        name={FIELD_NANE.SUM}
        inputRef={inputRef}
      />
      <Divider />
      <div className="label">Payment system</div>
      <ButtonPaySystem
        handleClick={() => handleReceive("Stripe")}
        disabled={disabled}
        text={"Stripe"}
      ></ButtonPaySystem>

      <ButtonPaySystem
        handleClick={() => handleReceive("Coinbase")}
        disabled={disabled}
        text={"Coinbase"}
      ></ButtonPaySystem>
      <Alert />
    </form>
  );
}
