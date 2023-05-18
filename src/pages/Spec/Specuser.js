import {React} from 'react';
import { Descriptions, Card } from 'antd';

function Specuser(props) {
    
    return (
        <Card className="patientInfo" hoverable="true" bordered layout="vertical"> 
        <Descriptions title={`${props.userinfo[0] === undefined ? "" : props.userinfo[0]+"님 "}환자 정보`} className='custom-descriptions'>
        <Descriptions.Item label="환자등록번호">{props.userinfo[1]}</Descriptions.Item>
        <Descriptions.Item label="성별">{props.userinfo[2]}</Descriptions.Item>
        <Descriptions.Item label="나이">{props.userinfo[3]}</Descriptions.Item>
        <Descriptions.Item label="주민등록번호">{props.userinfo[4]}</Descriptions.Item>
        <Descriptions.Item label="전화번호">{props.userinfo[5]}</Descriptions.Item>
        <Descriptions.Item label="보험유형">{props.userinfo[6]}</Descriptions.Item>
      </Descriptions>
      </Card>
    );
}

export default Specuser;