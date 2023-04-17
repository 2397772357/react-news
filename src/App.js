import "./App.css";
import IndexRouter from "./router/indexRouter";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
function App() {
  let element = useRoutes(IndexRouter);
  return (
    <Provider store={store}>
        <div className="App">{element}</div>
    </Provider>
  );
}

export default App;
