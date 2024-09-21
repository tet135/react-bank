import "./index.css";

export default function Component(type, sum, sumCoins) {
  return (
    <div className="total__container">
      <span className="total total--receipt">
        {type === "Sending" ? "-" : "+"}
      </span>
      <span className="total total--receipt">$</span>
      <h1 className="total total--receipt">{sum}</h1>
      <span className="total__coins total__coins--receipt">.{sumCoins}</span>
    </div>
  );
}
