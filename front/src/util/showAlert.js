//виводить помилку в Alert
export const showAlert = (status, text) => {
  // console.log("id in showAlert", id); //ok =Save password

  // let alert = null;
  // if (id) {
  //   const alertId = `#alert-${id}`;
  //   console.log("#alertId", alertId); //ok
  //   alert = document.querySelectorAll(alertId);
  //   console.log("alert in else", alert);
  // } else {
  //   alert = document.querySelector(".alert");
  //   console.log("alert in else", alert);
  // }

  const alert = document.querySelector(".alert");

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
