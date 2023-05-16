import { useState, useEffect } from "react";

import {Row, Col,Badge,Dropdown,Avatar,Menu,List} from "antd";  
 
import { Link } from "react-router-dom";
import avtar from "../../assets/images/team-2.jpg";
import '../../assets/styles/Header.css';

const bell = [
  <svg
    width="20"
    height="20" 
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      d="M10 2C6.68632 2 4.00003 4.68629 4.00003 8V11.5858L3.29292 12.2929C3.00692 12.5789 2.92137 13.009 3.07615 13.3827C3.23093 13.7564 3.59557 14 4.00003 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0787 13.009 16.9931 12.5789 16.7071 12.2929L16 11.5858V8C16 4.68629 13.3137 2 10 2Z"
      fill="#111827"
    ></path>
    <path
      d="M10 18C8.34315 18 7 16.6569 7 15H13C13 16.6569 11.6569 18 10 18Z"
      fill="#111827"
    ></path>
  </svg>,
];

const data = [
  {
    title: "정성웅 환자님 진료실 들어가십니다.",
    avatar: avtar,
  } 
];
const menu = (props) => (
  <Menu>
  <Menu.Item key ={'/'}>
    <List
      className="header-notifications-dropdown"
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <>
          <Avatar shape="square" src={item.avatar} />
          <div> {item.title}</div>
        </>
      )}
    />
  </Menu.Item>
</Menu>
);

const profile = [
  <svg
    width="30"
    height="30"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path fillRule="evenodd" clipRule="evenodd" fill="#111827"
      d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z"
    />
  </svg>,
];

function Header(props) {
  const name = localStorage.getItem("name");
  useEffect(() => window.scrollTo(0, 0));
  const [username] = useState(name); 

  const handleLogout = () => {
    //토큰 내용 초기화
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('position');
    document.location.href = '/'
  }
  return (
    <>
      <Row gutter={[24, 0]} className="header">
        <Col span={24} md={24} className="header-control">
          <Badge size="small" count={4}>
            <Dropdown overlay={menu} trigger={["click"]} className="Dropback">
              <a
                href="#pablo"
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                {bell}
              </a>
            </Dropdown>
          </Badge>
          
          <Link onClick={handleLogout} className="btn-sign-in">
            { profile }
            <span>Log out</span>
          </Link>
          <div className="headerUser">{username}님, 안녕하세요</div>
        </Col>
      </Row>
    </>
  );
}

export default Header;