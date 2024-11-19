import "./index.css";

import { Fragment, memo } from "react";

function TotalBalance({ sum }) {
  return (
    <h1 className="total__container">
      {sum === null && <div class="total"></div>}
      {sum === 0 && <div class="total">$0</div>}
      {sum && (
        <Fragment>
          <div className="total">
            {sum.sign && sum.sign}${sum.dollars}
          </div>
          <div className="total__coins">.{sum.coins}</div>
        </Fragment>
      )}
    </h1>
  );
}

// function TotalBalance({ sum }) {
//   return (
//     <div className="total__container">
//       {sum === null && <div class="total"></div>}
//       {sum === 0 && <div class="total">$0</div>}
//       {sum && (
//         <Fragment>
//           <div className="total">
//             {sum.sign}${sum.dollars}
//           </div>
//           <div className="total__coins">.{sum.coins}</div>
//         </Fragment>
//       )}
//     </div>
//   );
// }

//memo - кешує компонент. Без dependancies = реакт сам відстежує пропси, при їх зміні здійснює перерендер компонента
export default memo(TotalBalance);
