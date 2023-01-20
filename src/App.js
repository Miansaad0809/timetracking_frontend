import { useRoutes } from "react-router-dom";
import routes from "./routes";

function App() {
  const routeResult = useRoutes(routes);
  return (
    <>
      {routeResult}
    </>
  );
}

export default App;
