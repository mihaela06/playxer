import { useDispatch } from "react-redux";
import { exchangeCode } from "../../../_actions/user_actions";

function CallbackPage(props) {
  const dispatch = useDispatch();
  var url = new URL(window.location.href);
  const code = new URLSearchParams(url.search).get("code");
  const id = localStorage.getItem("userId");

  let dataToSubmit = {
    code: code,
    userID: id,
  };


  dispatch(exchangeCode(dataToSubmit))
    .then((response) => {
      if (response.payload.success && response.payload.success === true) {
        window.location.replace("/");
        return <div> SUCCESS </div>;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return <div> </div>;
}

export default CallbackPage;
