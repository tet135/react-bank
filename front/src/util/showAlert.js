//виводить помилку в Alert
export const showAlert = (status, text, name = "") => {
  let alert = null;

  if (name === "password") {
    alert = document.querySelector(`form.form[name="password"] div.alert`);
  } else if (name === "email") {
    alert = document.querySelector(`form.form[name="email"] div.alert`);
  } else {
    alert = document.querySelector(`.alert`);
  }

  if (status === "progress") {
    alert.classList = "alert alert--progress";
  } else if (status === "error") {
    alert.classList = "alert alert--error";
  } else if (status === "success") {
    alert.classList = "alert alert--success";
  } else if (status === "novalid") {
    alert.classList = "alert alert--error";
  } else {
    alert.classList = "alert alert--disabled";
  }

  if (text) alert.innerText = text;
};
