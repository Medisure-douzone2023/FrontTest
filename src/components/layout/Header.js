import { useState, useEffect } from "react";
import {LogoutOutlined,BellFilled} from "@ant-design/icons";
import { Row, Col, Badge, Dropdown, Avatar, Menu, List } from "antd";

import { Link } from "react-router-dom";
import avtar from "../../assets/images/team-2.jpg";
import "../../assets/styles/Header.css";

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
  },
];
const menu = (props) => (
  <Menu>
    <Menu.Item key={"/"}>
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

const week = ["일", "월", "화", "수", "목", "금", "토"];

function Header(props) {
  const name = localStorage.getItem("name");
  const [time, setTime] = useState();

  const todayTime = () => {
    let now = new Date();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let dayOfWeek = week[now.getDay()];
    let hours = now.getHours();
    let minutes = now.getMinutes();
    return month + "월 " + date + "일(" + dayOfWeek + ") " + hours + "시 " + minutes + "분";
  };
  // useEffect(() => window.scrollTo(0, 0));
  useEffect(() => {
    setTime(todayTime());
    const interval = setInterval(() => {
      setTime(todayTime());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const [username] = useState(name);

  const handleLogout = () => {
    //토큰 내용 초기화
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userid");
    localStorage.removeItem("position");
    document.location.href = "/";
  };
  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={6} className="header-control todayInfo">
          <div>{time}</div>
        </Col>
        <Col span={18} className="header-control headerContent">
          <Badge size="small" count={4}>
            <Dropdown overlay={menu} trigger={["click"]} className="Dropback">
              <a href="#pablo" className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <BellFilled />
              </a>
            </Dropdown>
          </Badge>

          <Link onClick={handleLogout} className="btn-sign-in">
            <span>Log out</span>
            <LogoutOutlined />
          </Link>
          <div className="headerUser">{username}님, 안녕하세요</div>
        </Col>
      </Row>
    </>
  );
}

export default Header;
