import React, { Component } from "react";
import { Layout, Button, Row, Col, Typography, Form, Input} from "antd";
import signinbg from "../../assets/images/img-signin.jpg";
import '../../assets/styles/SignIn.css';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { withRouter } from "react-router-dom";
const { Title } = Typography;
const { Content } = Layout;

class SignIn extends Component {
  render(props) {
    const onFinish = async(values) => {
      const data = {
        'userid': values.userid,
        'pwd': values.pwd
      }
      const response = await axios({
        method: 'POST',
        url: `/api/user`,
        data: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      if(response.data.result !== 'success'){
        alert('아이디, 비밀번호 확인 필요');
      }
      //토큰 이거 왜 안먹닝?
      // axios.defaults.headers.common['Authorization'] = 'Bearer '+response.data.data;
      localStorage.setItem("accessToken", response.data.data);
      console.log("accessToken:", response.data.data);
      const decoded = jwtDecode(response.data.data);
      localStorage.setItem("userid", decoded.sub);
      localStorage.setItem("position", decoded.position);
      localStorage.setItem("name", decoded.name);
      console.log("token name:", decoded.name);

      switch (decoded.position) {
        case 'doctor':
          // this.props.history.push('/care');
          document.location.href = '/care'
          break;
          case 'office':
            // this.props.history.push('/receipt');
            document.location.href = '/receipt'
            break;
            case 'admin':
              // this.props.history.push('/commonT');
              document.location.href = '/commonT'
          break;
        default:
          break;
      }
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return (
      <>
        <Layout className="layout-default layout-signin">
          <Content>
            <Row gutter={[24, 0]} justify="space-around">
              <Col
                lg={{ span: 6, offset: 2 }}
                md={{ span: 12 }}
              >
                <Title className="mb-15">Sign In</Title>
                <Title className="font-regular text-muted" level={5}>
                  Enter your email and password to sign in
                </Title>
                <Form
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  layout="vertical"
                  className="row-col"
                >
                  <Form.Item
                    className="username"
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
                    className="username"
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
                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                      SIGN IN
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col
                className="sign-img"
                style={{ padding: 12 }}
                xs={{ span: 24 }}
                lg={{ span: 12 }}
                md={{ span: 12 }}
              >
                <img src={signinbg} alt="" />
              </Col>
            </Row>
          </Content>
        </Layout>
      </>
    );
  }
}


export default withRouter(SignIn);