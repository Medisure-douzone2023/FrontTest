import {React} from 'react';
import { Descriptions, Card } from 'antd';

function Specuser(props) {
    
    return (
        <Card className="patientInfo" hoverable="true" bordered layout="vertical"> 
        <Descriptions title={`${props.username === undefined ? "" : props.username+"님 "}환자 정보`} className='custom-descriptions'>
        <Descriptions.Item label="환자등록번호">{props.userno}</Descriptions.Item>
        <Descriptions.Item label="성별">{props.gender}</Descriptions.Item>
        <Descriptions.Item label="나이">{props.age}</Descriptions.Item>
        <Descriptions.Item label="주민등록번호">{props.birthdate}</Descriptions.Item>
        <Descriptions.Item label="전화번호">{props.contact}</Descriptions.Item>
        <Descriptions.Item label="보험유형">{props.userinsurance}</Descriptions.Item>
      </Descriptions>
      </Card>
    );
}

export default Specuser;