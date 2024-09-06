import "./index.css";

export default function Component({ children, background = "" }) {
  return <div className={`page page--${background}`}>{children}</div>;
}
