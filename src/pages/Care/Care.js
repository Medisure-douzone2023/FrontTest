
import {Row, Col, Button} from 'antd';
import React, { useState, useEffect } from 'react';
import PatientList from './PatientList';
import CareNote from './CareNote';
import PatientInfo from './PatientInfo';

function Care() {
  const onButtonClick = () => {
    console.log("진료완료")
}
  const [patient, setPatient] = useState({});
  const fetchPatientInfo = async (pno) => {
    const response = await fetch(`/api/care/${pno}`,{
        method: 'get',
        headers: {
            "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4Mjk4NTIyNiwiZXhwIjoxNjgzMjg1MjI2fQ.2CpvMAsbnCssjovVWFDOeVpZ0Gy4fx22YYGHKzJ9i-Y",
            'Accept': 'application/json'
        }
    });
    const json = await response.json();
    console.log(json.data);
    if(json.result !== 'success') {
        throw new Error(`${json.result} ${json.message}`)
    }
    setPatient(json.data);
}
  useEffect(() => {
      fetchPatientInfo(1);
  },[]);

  return (
    <>
      <div className="tabled">
        <Row gutter = {[24,0]} >
          <Col span={6}>
            <h1>진료 대기 환자 목록</h1>
            <PatientList />
          </Col>
          <Col span={9}>
            <h1>진료메모, 상병, 처방</h1>
            <CareNote />
            <Button type="primary" ghost onClick={onButtonClick}>진료 완료</Button>
            <Button danger onClick={onButtonClick}>진료 취소</Button>
          </Col>
          <Col span={9} >
            <h1>환자정보, 진료 기록</h1>
            <PatientInfo patient={patient}/>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Care;
