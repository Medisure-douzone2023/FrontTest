import {React, useState} from 'react';
import { Col, Table, Button } from 'antd';
import axios from 'axios';

function Specbilldisease(props) {
  const [nos, setNos] = useState([]);
  const [SelectedRowKeys, setSelectedRowKeys] = useState([]);
  let token = localStorage.getItem("accessToken");

  // 청구 상병 삭제 통신
  const billdiseasedelete = async (nos) => {
    try {
      const response = await axios.delete('/api/billdisease/delete', {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        },
        data: nos
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  // 삭제 버튼 처리
  const deletebutton = async () => {
    try{
      await billdiseasedelete(nos);
      await props.handleRowClick(props.record);
      setSelectedRowKeys([]);
    } catch(error){
      console.error(error);
    }
  };

  // 명세서 상병 데이터에서 선택 된 데이터 정보 삭제할때 사용
  const rowSelection = {
    selectedRowKeys : SelectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      const newSelectDatas = selectedRows.map((row,i) => {
        const pno = row.pno;
        const rno = row.rno;
        const dno = row.dno;
        return {pno, rno, dno}
      })
      setNos(newSelectDatas)
      setSelectedRowKeys(selectedRowKeys)
    }
  };
  // 모달 창 열기
  const diseaseModal = () => {
    props.setModalOpen(true);
  };

  // billdisease 컬럼
  const diseaseColumns = [
    {
      title: 'no',
      dataIndex: 'no',
    },
    {
      title: '주/부',
      dataIndex: 'dmain',
    },
    {
      title: '상병코드',
      dataIndex: 'dcode',
    },
    {
      title: '상병명',
      dataIndex: 'disease'
    }
  ];
  
    return (
        <>
        <Col span={12} >선택 명세서의 상병 정보
      <Table 
        style={{width: "95%"}}
        rowSelection={{
          type: props.selectionType,
           ...rowSelection,
         }}
        columns={diseaseColumns}
        dataSource={props.billdiseaseData}
        pagination={false}
      /> 
      <Button danger ghost size={'middle'} onClick={deletebutton}className='disease-btn'>
            삭제
          </Button>
      <Button type="primary" ghost size={'middle'} onClick={diseaseModal} onCancel={props.diseasehandleCancel} className='disease-btn'>
            추가
          </Button>
      </Col>
      </>
    );
}

export default Specbilldisease;