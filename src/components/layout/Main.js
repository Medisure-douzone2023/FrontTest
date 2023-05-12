import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Affix } from "antd";
import Sidenav from "./Sidenav";
import Header from "./Header";

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const [visible, setVisible] = useState(false);

  const openDrawer = () => setVisible(!visible);

  let { pathname } = useLocation();
  pathname = pathname.replace("/", "");
  

  return (
    <Layout className={`layout-dashboard`}>
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
