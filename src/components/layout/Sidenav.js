import { Menu } from "antd";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/medisure.png";
import "../../assets/styles/Sidenav.css";
import {
  CloudUploadOutlined,
  DiffOutlined,
  SwapOutlined,
  PrinterOutlined,
  CarryOutOutlined,
  EditOutlined,
} from "@ant-design/icons";
function Sidenav({ color }) {
  const position = localStorage.getItem("position");
  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
      </div>
      <Menu theme="light" mode="inline">
        {position === "doctor" && (
          <Menu.Item key="2">
            <NavLink to="/care">
              <span className="icon">
                <CarryOutOutlined style={{ fontSize: "24px" }} />
              </span>
              <span className="label">진료</span>
            </NavLink>
          </Menu.Item>
        )}
        {position === "admin" && (
          <Menu.Item key="3">
            <NavLink to="/commonT">
              <span className="icon">
                <CloudUploadOutlined style={{ fontSize: "24px" }} />
              </span>
              <span className="label">공통테이블</span>
            </NavLink>
          </Menu.Item>
        )}
        {position === "office" && (
          <>
            <Menu.Item key="1">
              <NavLink to="/receipt">
                <span className="icon">
                  <EditOutlined style={{ fontSize: "24px" }} />
                </span>
                <span className="label">접수/수납</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item className="menu-item-header" key="4">
              보험심사
            </Menu.Item>
            <Menu.Item key="5 ">
              <NavLink to="/insertManual">
                <span className="icon">
                  <PrinterOutlined style={{ fontSize: "24px" }} />
                </span>
                <span className="label">수동생성</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="6">
              <NavLink to="/spec">
                <span className="icon">
                  <DiffOutlined style={{ fontSize: "24px" }} />
                </span>
                <span className="label">심사</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="7">
              <NavLink to="/bill">
                <span className="icon">
                  <SwapOutlined style={{ fontSize: "24px" }} />
                </span>
                <span className="label">송신</span>
              </NavLink>
            </Menu.Item>
          </>
        )}
      </Menu>
    </>
  );
}

export default Sidenav;
