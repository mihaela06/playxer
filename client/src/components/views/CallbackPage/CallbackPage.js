import { useDispatch } from "react-redux";
import { exchangeCode } from "../../../_actions/user_actions";

function CallbackPage(props) {
  const dispatch = useDispatch();
  var url = new URL(window.location.href);
  const code = new URLSearchParams(url.search);
  const id = localStorage.getItem("userId");

  console.log(url.search);
  console.log(code.get("code"));
  console.log(id);

  let dataToSubmit = {
    code: code,
    userID: id,
  };

  dispatch(exchangeCode(dataToSubmit))
    .then((response) => {
      console.log("Response ", response);
      if (response.success && response.success == true)
        return <div> SUCCESS </div>;
    })
    .catch((err) => {
      console.log(err);
    });

  return <div> </div>;
}

export default CallbackPage;
