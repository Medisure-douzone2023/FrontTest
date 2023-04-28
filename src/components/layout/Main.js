import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Drawer, Affix } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);

  const openDrawer = () => setVisible(!visible);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");

  useEffect(() => {
    if (pathname === "rtl") {
      setPlacement("left");
    } else {
      setPlacement("right");
    }
  }, [pathname]);

  return (
    <Layout className={`layout-dashboard`}>
      <Drawer
        title={false}
        placement={"left"}
        key={"left"}
        width={250}
        className={`drawer-sidebar`}
      >
        <Layout className={`layout-dashboard`}>
          <Sider
            theme="light"
            className={`sider-primary ant-layout-sider-primary`}
            style={{ background: "transparent" }}
          >
            <Sidenav color={"#1890ff"} />
          </Sider>
        </Layout>
      </Drawer>
      <Sider
        width={250}
        theme="light"
        className={`sider-primary ant-layout-sider-primary`}
        style={{ background: "transparent" }}
      >
        <Sidenav color={"#1890ff"} />
      </Sider>
      <Layout>
          <Affix>
            <AntHeader className={`ant-header-fixed`}>
              <Header
                onPress={openDrawer}
                name={pathname}
                subName={pathname}
              />
            </AntHeader>
          </Affix>
        <Content className="content-ant">{children}</Content>
      </Layout>
    </Layout>
  );
}

export default Main;
