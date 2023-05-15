import { Row, Col } from "antd";
import React, { useState, useEffect } from "react";
import PatientList from "./PatientList";
import CareNote from "./CareNote";
import axios from "axios";
import PatientInfo from "./PatientInfo";
import "../../assets/styles/Care.css";
function Care(props) {
  const [pno, setPno] = useState(0);
  const [rno, setRno] = useState(0);
  const [patient, setPatient] = useState({});
  const [isVisited, setIsVisited] = useState();
  let token = props.token;
  const fetchPatientInfo = async (pno) => {
    if (pno === 0) {
      return;
    }
    const response = await axios({
      method: "GET",
      url: `/api/care/${pno}`,
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });
    if (response.data.result !== "success") {
      throw new Error(`${response.data.result} ${response.data.message}`);
    }
    console.log("patient info", response.data.data);
    setPatient(response.data.data);
  };
  useEffect(() => {
    fetchPatientInfo(pno);
  }, [pno]);

  return (
    <>
      <div className="care">
        <Row gutter={[24, 0]}>
          <Col span={8}>
            <h1>진료 대기 환자 목록</h1>
            <PatientList
              setPno={setPno}
              setRno={setRno}
              patient={patient}
              setIsVisited={setIsVisited}
              token={token}
            />
          </Col>
          <Col span={8}>
            <CareNote
              rno={rno}
              setPatient={setPatient}
              isVisited={isVisited}
              setIsVisited={setIsVisited}
              token={token}
            />
          </Col>
          <Col span={8}>
            <PatientInfo patient={patient} token={token} />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Care;
