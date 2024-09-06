import "./index.css";
import "../../style/click.css";

export default function Component({
  children,
  classModificator,
  handleClick,
  disabled = "disabled",
}) {
  return (
    <button
      onClick={handleClick}
      className={`button button--${classModificator} click ${disabled}`}
      type="button"
      id="button"
    >
      {children}
    </button>
  );
}
