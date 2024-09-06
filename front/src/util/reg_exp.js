// export const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

// export const REG_EXP_PASSWORD = new RegExp(
//   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g
// );

// ^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$

const regexpPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const REG_EXP_PASSWORD = RegExp(regexpPassword);
// console.log(REG_EXP_PASSWORD)

const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// //prittier чомусь коригує сам вираз якщо писати його всерединуnew RegExp(...)
export const REG_EXP_EMAIL = new RegExp(regexpEmail);
