import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            © 2023, made with Douzone__HealthCare 4 Team
            {<HeartFilled />}
            <a href="#pablo" className="font-weight-bold" target="_blank">
            
            </a>
            for a better Life
          </div>
        </Col>

      </Row>
    </AntFooter>
  );
}

export default Footer;
