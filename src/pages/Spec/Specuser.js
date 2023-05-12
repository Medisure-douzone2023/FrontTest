import {React} from 'react';
import { Descriptions } from 'antd';

function Specuser(props) {
    
    return (
        <>
        <Descriptions title="환자 정보" className='description'>
        <Descriptions.Item label="환자등록번호">{props.userno}</Descriptions.Item>
        <Descriptions.Item label="성별">{props.gender}</Descriptions.Item>
        <Descriptions.Item label="나이">{props.age}</Descriptions.Item>
        <Descriptions.Item label="주민등록번호">{props.birthdate}</Descriptions.Item>
        <Descriptions.Item label="전화번호">{props.contact}</Descriptions.Item>
        <Descriptions.Item label="보험유형">{props.userinsurance}</Descriptions.Item>
      </Descriptions>
      <br/><br/>
        </>
    );
}

export default Specuser;