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
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";  
import App from "./App";

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const socket = new SockJS('/websocket');
const stompClient = Stomp.over(socket);


ReactDOM.render(
  <BrowserRouter>
    <App stompClient={stompClient} />
  </BrowserRouter>,
  document.getElementById("root"),
);
