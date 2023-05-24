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
import { WebSocketProvider } from './utils/WebSocketProvider'

function App() {
  let token = localStorage.getItem("accessToken");
  const position = localStorage.getItem("position");
  return (
    <div className="App">
      <Switch>
      
        {token !== null ? (
          <Main>
            {position === "doctor" && (
              <>
              <WebSocketProvider>
                <Route exact path="/care" render={() => <Care token={token} />} />
                </WebSocketProvider>
                <Redirect from="*" to="/care" />
              </>
            )}
            {position === "office" && (
              <>
              <WebSocketProvider>
                <Route exact path="/receipt" render={() => <Receipt token={token} />} />
                </WebSocketProvider>
                <Route exact path="/insertManual" render={() => <InsertManual token={token} />} />
                <Route exact path="/spec" render={() => <Spec token={token} />} />
                <Route exact path="/bill" render={() => <Bill token={token} />} />
                <Redirect from="*" to="/receipt" />
              </>
            )}
            {position === "admin" && (
              <>
                <Route exact path="/commonT" render={() => <CommonT token={token} />} />
                <Redirect from="*" to="/commonT" />
              </>
            )}
          </Main>
        ) : (
          <>
            <Redirect to="/sign-in" />
            <WebSocketProvider>
            <Route exact path="/sign-in" component={SignIn} />
            </WebSocketProvider>
          </>
        )}
      </Switch>
    </div>
  );
}

export default App;
