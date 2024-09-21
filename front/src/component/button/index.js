import "./index.css";
import "../../style/click.css";

export default function Component({
  children,
  classModificator,
  handleClick,
  disabled = true,
  id,
}) {
  return (
    <button
      onClick={handleClick}
      className={`button button--${classModificator} ${
        disabled ? "disabled" : ""
      }  click`}
      type="button"
      id={id}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
