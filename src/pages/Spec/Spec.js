import React from 'react';
import { Row } from 'antd';
import '../../assets/styles/Spec.css';
import Specsearch from './Specsearch';


function Spec(props) {
  return (
    <div>
      <Row gutter={[24, 16]} >
        <Specsearch />
      </Row>
    </div>
  );
}

export default Spec;