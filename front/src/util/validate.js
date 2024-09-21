import { REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../util/reg_exp";
import { FIELD_NANE, FIELD_ERROR } from "../util/configConsts";

export const validate = (name, value) => {
  //ця функція поверне одну з помилок або underfined(якщо все ок)
  if (String(value).length < 1 || value === null) {
    // console.log("validation empty");
    return FIELD_ERROR.IS_EMPTY;
  }
  if (String(value).length > 20) {
    // console.log("validation too long");
    return FIELD_ERROR.IS_BIG;
  }

  if (name === FIELD_NANE.EMAIL || name === FIELD_NANE.EMAIL_NEW) {
    if (!REG_EXP_EMAIL.test(String(value))) {
      // console.log("validation email");
      return FIELD_ERROR.EMAIL;
    }
  }

  if (name === FIELD_NANE.PASSWORD || name === FIELD_NANE.PASSWORD_NEW) {
    if (!REG_EXP_PASSWORD.test(String(value))) {
      // console.log("validation password");
      return FIELD_ERROR.PASSWORD;
    }
  }

  // for passwordAgain field
  // if (name === this.FIELD_NAME.PASSWORD_AGAIN) {
  //   // const password =
  //   //   document.getElementsByName('password')[0].value

  //   // console.log(password)
  //   if (
  //     String(value) !==
  //     this.value[this.FIELD_NAME.PASSWORD]
  //   )
  //     return this.FIELD_ERROR.PASSWORD_AGAIN
  // }

  // for code
  // просто перевірка на число. а на бекенді далі йде перевірка прописана в класі User.js
  if (name === "code") {
    if (isNaN(value)) return FIELD_ERROR.CODE;
  }

  // // for isConfirm
  // if (name === this.FIELD_NAME.IS_CONFIRM) {
  //   if (Boolean(value) !== true)
  //     return this.FIELD_ERROR.NOT_CONFIRM
  // }
  //нічого не повертає, якщо всі поля ОК; повертає текст помилки, якщо його немає (underfined), то розуміємо, що всі поля введені коректно
};
