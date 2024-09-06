import "./index.css";
import "../../style/click.css";

export default function Component({
  handleChangeInput,
  // value,
  label,
  placeholder,
  name,
  toggle = "",
}) {
  const handleToggle = (e) => {
    const spanImg = e.target;
    spanImg.toggleAttribute("show");

    const input = spanImg.previousSibling;

    if (input.getAttribute("type") === "password") {
      input.setAttribute("type", "text");
    } else {
      input.setAttribute("type", "password");
    }
  };

  return (
    <div className="input_container">
      <label className="input__label" name={name}>
        {label}
      </label>
      <div className="input__wrapper">
        <input
          onInput={handleChangeInput}
          className="input click"
          placeholder={placeholder}
          name={name}
          type={name}
          required
          // value={value}
        />
        {toggle && (
          <span onClick={handleToggle} className="input__icon click"></span>
        )}
      </div>
      <span className="input__error" name={name}></span>
    </div>
  );
}
