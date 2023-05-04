import React from 'react';
import { Card, Descriptions, Table} from 'antd';
const { Column} = Table;

function PatientInfo({patient}) {
    //진료기록 데이터 파티션이나 다른거 생각해보기 *
    return (
        <>
            <Card style={{width: '90%'}}>   
            {patient.patientvo &&
                <Descriptions title="환자 정보">
                    <Descriptions.Item label="이름">{patient.patientvo.pname}</Descriptions.Item>
                    <Descriptions.Item label="주민등록번호">{patient.patientvo.birthdate }</Descriptions.Item>
                    <Descriptions.Item label="성별">{patient.patientvo.gender === 'm' ? '남자' : '여자'}</Descriptions.Item>
                    <Descriptions.Item label="나이">{patient.patientvo.age}</Descriptions.Item>
                    <Descriptions.Item label="비고">{patient.patientvo.etc}</Descriptions.Item>
                </Descriptions>
            }
            </Card>
            <Table dataSource={patient.carevo} pagination={false} style={{width: '90%'}} rowKey="rno">
                <Column title="진료날짜" dataIndex="cdate" key="cdate" />
                <Column title="진료메모" dataIndex="memo" key="memo" />
            </Table>
            <Table dataSource={patient.treatmentvo} pagination={false} style={{width: '90%'}} rowKey="tno">
                <Column title="처방명" dataIndex="tname" key="tname" />
                <Column title="처방코드" dataIndex="tcode" key="tcode" />
            </Table>
            <Table dataSource={patient.diseasevo} pagination={false} style={{width: '90%'}} rowKey="dno">
                <Column title="상병명" dataIndex="dname" key="dname" />
                <Column title="상병코드" dataIndex="dcode" key="dcode" />
            </Table>
            
        </>
    );
}

export default PatientInfo;