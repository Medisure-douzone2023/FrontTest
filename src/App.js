import { Switch, Route, Redirect } from "react-router-dom";
import Receipt from "./pages/Receipt/Receipt";
import Care from "./pages/Care/Care";
import InsertManual from "./pages/InsertManual/InsertManual";
import Spec from "./pages/Spec/Spec";
import Bill from "./pages/Bill/Bill";
import SignIn from "./pages/LogIn/SignIn";
import CommonT from "./pages/CommonT/CommonT";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/Main.css";
import "./assets/styles/Responsive.css";

function App() { 
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path="/receipt" component={Receipt} />
          <Route exact path="/care" component={Care} />
          <Route exact path="/insertManual" component={InsertManual} />
          <Route exact path="/spec" component={Spec} />
          <Route exact path="/bill" component={Bill} />
          <Route exact path="/commonT" component={CommonT} />
          <Redirect from="*" to="/care" />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
