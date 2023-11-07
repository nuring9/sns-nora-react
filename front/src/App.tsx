import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import routes from "./routes";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
