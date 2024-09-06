export const updateGlobalState = (type, data, context) => {
  // console.log("user from updateGlobalState", user); //ok
  // виклик dispatch-function, куди передаємо action(що має type + payload)
  context.dispatch({
    type: type,
    payload: data,
  });
};
