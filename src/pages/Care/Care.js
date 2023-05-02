
import {Row, Col} from 'antd';
import PatientList from './PatientList';
import CareNote from './CareNote';
import PatientInfo from './PatientInfo';

function Care() {
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
          </Col>
          <Col span={9}>
            <h1>환자정보, 진료 기록</h1>
            <PatientInfo />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Care;
