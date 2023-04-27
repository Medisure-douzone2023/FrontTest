import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Care from "./pages/Care";
import InsertManual from "./pages/InsertManual";
import Spec from "./pages/Spec";
import Bill from "./pages/Bill";
import Rtl from "./pages/Rtl";
import SignUp from "./pages/Bill";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
// import "./assets/styles/main.css";
// import "./assets/styles/responsive.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path="/receipt" component={Home} />
          <Route exact path="/care" component={Care} />
          <Route exact path="/insertManual" component={InsertManual} />
          <Route exact path="/spec" component={Spec} />
          <Route exact path="/bill" component={Bill} />
          <Route exact path="/rtl" component={Rtl} />
          <Redirect from="*" to="/receipt" />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
