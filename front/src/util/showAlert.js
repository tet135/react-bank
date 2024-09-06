//виводить помилку в Alert
export const showAlert = (status, text) => {
  // const form = document.querySelector("form");

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
