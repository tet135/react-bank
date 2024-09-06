import "./index.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../component/button";
import Input from "../../component/input";
import Alert from "../../component/alert";

import { checkDisabled } from "../../util/checkDisabled";
import { showAlert } from "../../util/showAlert";
import { validateAll } from "../../util/validateAll";
import { changeInputOnError } from "../../util/changeInputOnError";
import { validate } from "../../util/validate";
import { ALERT, FIELD_NANE } from "../../util/configConsts";
import { saveSession } from "../../util/session";

export default function Container({ buttonPath }) {
  const [error, setError] = useState({});

  //value -  це об'єкт з назвами інпутів та їх актуальними значеннями
  const [value, setValue] = useState({});

  //disabled -  це кнопка в формі
  const [disabled, setDisabled] = useState(true);

  const navigate = useNavigate();

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;
    const inputName = event.target.name;
    // console.log("inputValue", "inputName", inputName, inputValue);//ok
    setValue({ ...value, [inputName]: inputValue });
    // console.log("value", value); //ok

    // setFieldError(value, error, setError);

    // // validation();
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

    // // console.log("error", error);

    checkDisabled(value, error, disabled, setDisabled);
  };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const submit = async () => {
    // console.log("disabled in submit", disabled); //false
    if (disabled === true) {
      // console.log("works disabled === true");
      // validateAll();
      validateAll(value, setDisabled);
      //ще показати поле, яке треба заповнити?!
    } else {
      // console.log("value", value); //ok returns   code: '1845', password: 'A4aaaaaaa'
      showAlert("progress", ALERT.PROGRESS); //ok

      //відправити новий пароль на бекенд
      try {
        const res = await fetch(`http://localhost:4000/recovery-confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: Number(value.code),
            password: value.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          showAlert("success", ALERT.SUCCESS_RECOVERY);

          //зберегли сесію
          saveSession(data.session);

          setTimeout(() => navigate("/balance"), 3000);

          // //очистити поля! після відправки форми
          // if (isSubmitted) {
          //   const inputs = document.querySelectorAll("input");
          //   console.log(inputs);
          //   inputs.values("");
          // }
        } else {
          showAlert("error", data.message);
        }
      } catch (err) {
        showAlert("error", err.message);
      }
    }
  };

  const handleSubmit = (e) => {
    submit();
  };

  return (
    <form className="form">
      <Input
        handleChangeInput={handleChangeInput}
        label="Code"
        placeholder="you code"
        name={FIELD_NANE.CODE}
      />
      <Input
        handleChangeInput={handleChangeInput}
        label="New password"
        placeholder="password"
        name={FIELD_NANE.PASSWORD}
        toggle={true}
      />
      {/* //onClick={handleSubmit} */}
      <Button
        handleClick={handleSubmit}
        path={buttonPath}
        classModificator="primary"
      >
        Restore password
      </Button>
      <Alert />
    </form>
  );
}
