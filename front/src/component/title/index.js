import "./index.css";

export default function Component({ children, className = "" }) {
  return <h2 className={`title ${className}`}>{children}</h2>;
}
