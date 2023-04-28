import { Layout, Row, Col } from "antd";
import { HeartFilled } from "@ant-design/icons";

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
            © 2023, made with
            {<HeartFilled />} by
            <a href="#pablo" className="font-weight-bold" target="_blank">
              Medisure
            </a>
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
