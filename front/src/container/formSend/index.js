import "./index.css";
import "../../style/form.css";

import Button from "../../component/button";
import Input from "../../component/input";
import Alert from "../../component/alert";

import { AuthContext } from "../../App";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// import { AuthContext } from "../../App";

import { checkDisabled } from "../../util/checkDisabled";
import { validate } from "../../util/validate";
import { showAlert } from "../../util/showAlert";
import { validateAll } from "../../util/validateAll";
import { changeInputOnError } from "../../util/changeInputOnError";
import { ALERT, FIELD_NANE } from "../../util/configConsts";
import { getTokenSession } from "../../util/session";

export default function Container({ buttonPath }) {
  const context = useContext(AuthContext);
  console.log("context in Send form", context);
  const token = getTokenSession();
  const navigate = useNavigate();

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

  const submit = async () => {
    if (disabled === true) {
      validateAll(value, setDisabled);
      //ще показати поле, яке треба заповнити?!
    } else {
      console.log(value); //ok returns   {email: 'test@mail.com', password: 'Dfgdf12d34'}

      showAlert("progress", ALERT.PROGRESS); //ok

      //відправити дані реєстрації на бекенд - формуємо запит на сервер на реєстрацію користувача
      try {
        const res = await fetch(`http://localhost:4000/send?token=${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: value.email,
            amount: value.amount,
          }),
        });

        const data = await res.json();
        console.log("data = transaction", data); //

        if (res.ok) {
          // console.log("res.ok");
          showAlert("success", ALERT.TRANSACTION);

          setTimeout(() => navigate("/balance"), 2000);
        } else {
          showAlert("error", data.message);
        }
      } catch (err) {
        showAlert("error", err.message);
      }
    }
  };

  const handleSending = (e) => {
    submit();
  };

  return (
    <form className="form">
      <Input
        handleChangeInput={handleChangeInput}
        label="Email"
        placeholder="example@gmail.com"
        name={FIELD_NANE.EMAIL}
      />
      <Input
        handleChangeInput={handleChangeInput}
        label="Sum"
        placeholder="$100"
        name={FIELD_NANE.SUM}
      />
      <Button
        handleClick={handleSending}
        path={buttonPath}
        classModificator="primary"
        disabled={disabled}
      >
        Send
      </Button>
      <Alert />
    </form>
  );
}
