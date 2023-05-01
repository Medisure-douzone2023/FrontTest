import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
} from "antd";
import axios from 'axios'

import { ToTopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import '../../assets/styles/InsertManual.css';
import { useState } from "react";
const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns1 = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

function Billing() {
  return (
    
    <div>
      <Table dataSource={dataSource} columns={columns1} />
      <button onClick={()=>{
        const param = {startDate:'20230401', endDate:'20230430'};

      axios.get('/api/receipt/insertManual',param).then((결과)=>{
        console.log(결과);
        
      })
      .catch(()=>{
        console.log('실패함')
      })
    }}>버튼</button>
    </div>
  );
}

export default Billing;
