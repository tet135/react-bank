import "./index.css";

import Button from "../../component/button";
import Input from "../../component/input";
import Alert from "../../component/alert";

import { AuthContext } from "../../App";
import { useContext, useState } from "react";

import { checkDisabled } from "../../util/checkDisabled";
import { validate } from "../../util/validate";
import { showAlert } from "../../util/showAlert";
import { validateAll } from "../../util/validateAll";
import { changeInputOnError } from "../../util/changeInputOnError";
import { ALERT, FIELD_NANE } from "../../util/configConsts";

export default function Container({ buttonPath }) {
  //помилка при валідації інпута
  const [error, setError] = useState({});

  //value -  це об'єкn з назвами інпутів та їх актуальними значеннями
  const [value, setValue] = useState({});

  const [disabled, setDisabled] = useState(true);

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;
    const inputName = event.target.name;
    // console.log("inputValue", "inputName", inputName, inputValue);//ok
    setValue({ ...value, [inputName]: inputValue });
    // console.log("value", value); //ok, але відображає дані - один символ((((((((((()))))))))))

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

  //in data must be email, isConfirm, token!!!!!!!!!!!!
  //now data contains only user with  email+isConfirm

  const submit = async () => {
    console.log("disabled in submit", disabled); //false
    if (disabled === true) {
      // console.log("works disabled === true");
      // console.log("value in formRecovery", value);
      validateAll(value, setDisabled);

      //ще показати поле, яке треба заповнити?!
    } else {
      console.log(value); //

      showAlert("progress", ALERT.PROGRESS); //ok

      //відправити дані реєстрації на бекенд - формуємо запит на сервер на відновлення паролю
      try {
        const res = await fetch(`http://localhost:4000/recovery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: value.email,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log("res.ok");
          showAlert("success", ALERT.RECOVERY);
          setTimeout(() => window.location.assign("/recovery-confirm"), 3000);
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
        label="Email"
        placeholder="example@gmail.com"
        name={FIELD_NANE.EMAIL}
      />
      <Button
        handleClick={handleSubmit}
        path={buttonPath}
        classModificator="primary"
      >
        Continue
      </Button>
      <Alert />
    </form>
  );
}
