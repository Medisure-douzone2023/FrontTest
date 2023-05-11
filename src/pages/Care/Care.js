import { Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import PatientList from './PatientList';
import CareNote from './CareNote';
import PatientInfo from './PatientInfo';
function Care() {
  const [pno, setPno] = useState(0);
  const [rno, setRno] = useState(0);
  const [patient, setPatient] = useState({});
  const [isVisited, setIsVisited] = useState();
  const fetchPatientInfo = async (pno) => {
    const response = await fetch(`/api/care/${pno}`, {
      method: 'get',
      headers: {
        "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE",
        'Accept': 'application/json'
      }
    });
    const json = await response.json();
    console.log(json.data);
    if (json.result !== 'success') {
      throw new Error(`${json.result} ${json.message}`)
    }
    setPatient(json.data);
    console.log('patient:', json.data);
  }
  useEffect(() => {
    fetchPatientInfo(pno);
  }, [pno]);

  return (
    <>
      <div className="tabled">
        <Row gutter={[24, 0]} >
          <Col span={6} >
            <h1>진료 대기 환자 목록</h1>
            <PatientList setPno={setPno} setRno={setRno} patient={patient} setIsVisited={setIsVisited}/>
          </Col>
          <Col span={9}>
            <h1>진료메모, 상병, 처방</h1>
            <CareNote rno={rno} setPatient={setPatient} isVisited={isVisited} setIsVisited={setIsVisited}/>
          </Col>
          <Col span={9} >
            <h1>환자정보, 진료 기록</h1>
            <PatientInfo patient={patient} />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Care;
