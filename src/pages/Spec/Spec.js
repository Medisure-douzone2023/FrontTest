import React from 'react';
import { Row } from 'antd';
import '../../assets/styles/Spec.css';
import Specsearch from './Specsearch';

const Spec = (props) => {
  return (
    <div>
      <Row gutter={[28, 16]} >
        <Specsearch />
      </Row>
    </div>
  );
}
export default Spec;