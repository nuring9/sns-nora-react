// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import store from "./store/configureStore";
// import { Provider } from "react-redux";
// import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );
// root.render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// );

import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import AppRoutes from "./routes"; // 라우트 설정을 따로 분리한 파일을 import 합니다.
import store from "./store/configureStore";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <Router>
      <div>
        <Routes>
          {AppRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </Router>
  </Provider>
);
