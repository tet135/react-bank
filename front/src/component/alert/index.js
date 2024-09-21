import "./index.css";

// export default function Component({ alertType = "disabled", text = "" }) {
//   return <div className={`alert alert--${alertType}`}>{text}</div>;
// }

// id === {`alert-${buttonText}`}
export default function Component(id = null) {
  console.log("id in Alert", id);
  return <div className="alert alert--disabled" id={id}></div>;
}
