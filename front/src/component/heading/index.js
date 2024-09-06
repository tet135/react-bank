import "./index.css";

export default function Component({ title, description, styleWelcome }) {
  return (
    <div className={`heading heading--${styleWelcome}`}>
      <h1 className={`title title--${styleWelcome}`}>{title}</h1>
      <p className={`description description--${styleWelcome}`}>
        {description}
      </p>
    </div>
  );
}
