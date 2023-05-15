import React from "react";
import { Card, Descriptions, Collapse } from "antd";
const { Panel } = Collapse;

function PatientInfo({ patient }) {
  //진료기록 데이터 파티션이나 다른거 생각해보기 *
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <>
      <Card className="patientInfo">
        {patient.patientvo && (
          <Descriptions title="환자 정보">
            <Descriptions.Item label="이름">{patient.patientvo.pname}</Descriptions.Item>
            <Descriptions.Item label="주민등록번호">
              {patient.patientvo.birthdate}
            </Descriptions.Item>
            <br />
            <Descriptions.Item label="성별">
              {patient.patientvo.gender === "m" ? "남자" : "여자"}
            </Descriptions.Item>
            <Descriptions.Item label="나이">{patient.patientvo.age}</Descriptions.Item>
            <br />
            <Descriptions.Item label="보험유형">{patient.patientvo.insurance}</Descriptions.Item>
            <Descriptions.Item label="비고">{patient.patientvo.etc}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
      <h1>진료기록</h1>
      <Collapse onChange={onChange} defaultActiveKey={0}>
        {patient &&
          patient.carevo &&
          patient.carevo.map((vo, index) => (
            <Panel header={vo.rdate} key={index}>
              <Card>
                <p>진료 메모: {vo.memo}</p>
                <p>
                  처방 :
                  {patient.diseasevo
                    .filter((disease) => vo.rno === disease.rno)
                    .map((disease, index) =>
                      patient.diseasevo.filter((disease) => vo.rno === disease.rno).length - 1 !==
                      index ? (
                        <span key={index}>
                          {disease.dname}[{disease.dcode}, {disease.dmain}],{" "}
                        </span>
                      ) : (
                        <span key={index}>
                          {disease.dname}[{disease.dcode}, {disease.dmain}]{" "}
                        </span>
                      )
                    )}
                </p>
                <p>
                  상병 :
                  {patient.treatmentvo
                    .filter((treat) => vo.rno === treat.rno)
                    .map((treat, index) =>
                      patient.treatmentvo.filter((treat) => vo.rno === treat.rno).length - 1 !==
                      index ? (
                        <span key={index}>
                          {treat.tname}[{treat.tcode}],{" "}
                        </span>
                      ) : (
                        <span key={index}>
                          {treat.tname}[{treat.tcode}]
                        </span>
                      )
                    )}
                </p>
              </Card>
            </Panel>
          ))}
      </Collapse>
    </>
  );
}

export default PatientInfo;
