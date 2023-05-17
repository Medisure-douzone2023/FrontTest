import React, { Component, useEffect } from "react";
import { Layout, Button, Row, Col, Typography, Form, Input} from "antd";
import signinbg from "../../assets/images/img-signin.jpg";
import '../../assets/styles/SignIn.css';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { withRouter } from "react-router-dom";
const { Title } = Typography;
const { Content } = Layout;

// class SignIn extends Component {
//   render(props) {
//     const onFinish = async(values) => {
//       const data = {
//         'userid': values.userid,
//         'pwd': values.pwd
//       }
//       const response = await axios({
//         method: 'POST',
//         url: `/api/user`,
//         data: data,
//         headers: {
//           'Accept': 'application/json' 
//         }
//       });
//       if(response.data.result !== 'success'){
//         alert('아이디, 비밀번호 확인 필요');
//       }
//       //토큰 이거 왜 안먹닝?
//       // axios.defaults.headers.common['Authorization'] = 'Bearer '+response.data.data;
//       localStorage.setItem("accessToken", response.data.data);
//       console.log("accessToken:", response.data.data);
//       const decoded = jwtDecode(response.data.data);
//       localStorage.setItem("userid", decoded.sub);
//       localStorage.setItem("position", decoded.position);
//       localStorage.setItem("name", decoded.name);
//       console.log("token name:", decoded.name);

//       switch (decoded.position) {
//         case 'doctor':
//           document.location.href = '/care'
//           break;
//         case 'office':
//           document.location.href = '/receipt'
//           break;
//         case 'admin':
//           document.location.href = '/commonT'
//           break;
//         default:
//           break;
//       }
//     };
 
//     const onFinishFailed = (errorInfo) => {
//       console.log("Failed:", errorInfo);
//     };
//     return (
//       <>
//         <Layout className="layout-default layout-signin">
//           <Content>
//             <Row gutter={[24, 0]} justify="space-around">
//               <Col
//                 lg={{ span: 6, offset: 2 }}
//                 md={{ span: 12 }}
//               >
//                 <Title className="mb-15">Sign In</Title>
//                 <Title className="font-regular text-muted" level={5}>
//                   Enter your email and password to sign in
//                 </Title>
//                 <Form
//                   onFinish={onFinish}
//                   onFinishFailed={onFinishFailed}
//                   layout="vertical"
//                   className="row-col"
//                 >
//                   <Form.Item
//                     className="username"
//                     label="아이디"
//                     name="userid"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please input your id!",
//                       },
//                     ]}
//                   >
//                     <Input placeholder="id" />
//                   </Form.Item>

//                   <Form.Item
//                     className="username"
//                     label="비밀번호"
//                     name="pwd"
//                     rules={[
//                       {
//                         required: true,
//                         message: "Please input your password!",
//                       },
//                     ]}
//                   >
//                     <Input type="password" placeholder="Password" />
//                   </Form.Item>
//                   <Form.Item>
//                     <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
//                       SIGN IN
//                     </Button>
//                   </Form.Item>
//                 </Form>
//               </Col>
//               <Col
//                 className="sign-img"
//                 style={{ padding: 12 }}
//                 xs={{ span: 24 }}
//                 lg={{ span: 12 }}
//                 md={{ span: 12 }}
//               >
//                 <img src={signinbg} alt="" />
//               </Col>
//             </Row>
//           </Content>
//         </Layout>
//       </>
//     );
//   }
// }


// export default withRouter(SignIn);

class SignIn extends Component {
  componentDidMount() {
    const container = document.getElementById('container');

    const toggle = () => {
      container.classList.toggle('sign-in');
      container.classList.toggle('sign-up');
    };

    setTimeout(() => {
      container.classList.add('sign-in');
    }, 200);
  }
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
          document.location.href = '/care'
          break;
        case 'office':
          document.location.href = '/receipt'
          break;
        case 'admin':
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
      <div id="container" className="container">
        <Layout className="layout-default layout-signin">
           <Content>
             <Row gutter={[24, 0]} justify="space-around" className="row">
               <Col
                 className="col align-items-center flex-col"
                 lg={{ span: 6, offset: 2 }}
                 md={{ span: 12 }}
               >
                <div className="row content-row">
                  <div className="col align-items-center flex-col">
                    <div className="text sign-in">
                      <h2>
                        Welcome
                      </h2>
                    </div>
                  </div>
                </div>
               </Col>
               <Col
                 className="col align-items-center flex-col sign-in"
                 style={{ padding: 20, display: "flex", justifyContent: "center" }}
                 xs={{ span: 24 }}
                 lg={{ span: 10 }}
                 md={{ span: 20 }}
               >
                <div className="form-wrapper align-items-center" style={{ maxWidth: "400px", height: "600px" }}>
                 <Form
                   onFinish={onFinish}
                   onFinishFailed={onFinishFailed}
                   layout="vertical"
                   className="form sign-in"
                 >
                   <Form.Item
                     className="input-group"
                     name="userid"
                     rules={[
                       {
                         required: true,
                         message: "Please input your id!",
                       },
                     ]}
                   >
                     <Input placeholder="id"/>
                   </Form.Item>

                   <Form.Item
                     className="input-group"
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
                     <Button type="primary" htmlType="submit" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                       SIGN IN
                     </Button>
                   </Form.Item>
                 </Form>
                 </div>
               </Col>
             </Row>
           </Content>
         </Layout>
      </div>
    );
  }
}


export default withRouter(SignIn);