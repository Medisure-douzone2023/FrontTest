/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
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
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

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
