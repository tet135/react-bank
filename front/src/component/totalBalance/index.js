import "./index.css";

export default function Component({ type = null, sum, sumCoins }) {
  return (
    <div className="total__container">
      <span
        className={`total ${
          type === null
            ? "total--balance"
            : type === "Sending"
            ? ""
            : "total--receipt"
        }`}
      >
        {type === null ? "" : type === "Sending" ? "-" : "+"}
      </span>
      <span
        className={`total ${
          type === null
            ? "total--balance"
            : type === "Sending"
            ? ""
            : "total--receipt"
        }`}
      >
        $
      </span>
      <h1
        className={`total ${
          type === null
            ? "total--balance"
            : type === "Sending"
            ? ""
            : "total--receipt"
        }`}
      >
        {sum}
      </h1>
      <span
        className={`total__coins ${
          type === null
            ? "total__coins--balance"
            : type === "Sending"
            ? ""
            : "total__coins--receipt"
        }`}
      >
        .{sumCoins}
      </span>
    </div>
  );
}
