import React, { Component } from "react";
import { Layout, Button, Form, Input } from "antd";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { withRouter } from "react-router-dom";
import "../../assets/styles/SignIn.css";
import { WebSocketContext  } from '../../utils/WebSocketProvider';
const { Content } = Layout;

class SignIn extends Component {
  static contextType = WebSocketContext;
  componentDidMount() {
    const container = document.getElementById("container");

    setTimeout(() => {
      container.classList.add("sign-in");
    }, 200);
  }

  handleLogin = async (values) => {
    const data = {
      userid: values.userid,
      pwd: values.pwd,
    };
    const response = await axios({
      method: "POST",
      url: `/api/user`,
      data: data,
      headers: {
        Accept: "application/json",
      },
    });
    if (response.data.result !== "success") {
      alert("아이디, 비밀번호 확인 필요");
      return;
    }
    //토큰 이거 왜 안먹닝?
    // axios.defaults.headers.common['Authorization'] = 'Bearer '+response.data.data;
    localStorage.setItem("accessToken", response.data.data);
    console.log("accessTokea:", response.data.data);
    const decoded = jwtDecode(response.data.data);
    localStorage.setItem("userid", decoded.sub);
    localStorage.setItem("position", decoded.position);
    localStorage.setItem("name", decoded.name);
    console.log("token name:", decoded.name);
    this.context.connectWebSocket();

    switch (decoded.position) {
      case "doctor":
        this.props.history.push("/care");
        break;
      case "office":
        this.props.history.push("/receipt");
        break;
      case "admin":
        this.props.history.push("/commonT");
        break;
      default:
        break;
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
      <div id="container" className="container">
        <Layout className="layout-default layout-signin">
          <Content>
            <div className="row">
              <div className="col align-items-center flex-col sign-in">
                <div className="form-wrapper align-items-center">
                  <Form
                    className="form sign-in"
                    onFinish={this.handleLogin}
                    onFinishFailed={this.onFinishFailed}
                    layout="vertical"
                  >
                    <Form.Item
                      className="input-group"
                      label="아이디"
                      name="userid"
                      rules={[
                        {
                          required: true,
                          message: "Please input your id!",
                        },
                      ]}
                    >
                      <Input placeholder="id" />
                    </Form.Item>
                    <Form.Item
                      className="input-group"
                      label="비밀번호"
                      name="pwd"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        SIGN IN
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
            <div className="row content-row">
              <div className="col align-items-center flex-col">
                <div className="text sign-in">
                  <h2>Welcome to Medisure</h2>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default withRouter(SignIn);
