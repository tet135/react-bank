export function setInputFocus(inputRef) {
  if (inputRef && inputRef.current) {
    inputRef.current.focus();
  }
}
