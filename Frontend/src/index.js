import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReduxToastr from "react-redux-toastr";
import configureStore from "./store/configureStore";
import "bootstrap/dist/css/bootstrap.css";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import { Provider } from "react-redux";
import FileUpload from "./simplecomp";
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Fragment>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReduxToastr
        timeOut={2500}
        newestOnTop={false}
        preventDuplicates
        position="top-left"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        closeOnToastrClick
      />
    </Fragment>
  </Provider>,
  document.getElementById("root")
);
