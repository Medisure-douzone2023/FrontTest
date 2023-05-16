import React from 'react';
import { Col, Table, Button } from 'antd';
import axios from 'axios';

function Specbillcare(props) {
  let token = localStorage.getItem("accessToken");
  // 취소 버튼 시 명세서의 status를 미심사로 변경
  const updateCancle = async() => {
    try {
      await axios.put(`/api/spec/${props.bno}`, {
        rno: props.rno,
        status: "취소"
      }, {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      alert("심사가 취소 되었습니다.");
      
      if (props.startDate && props.endDate && props.insurance && props.pno) {
        await props.handleSearch();
      } else {
        await props.fetchSpecificationData();
      }
    } catch(error) {
      console.error(error);
    }
  }

  // 완료 버튼 시 명세서의 status를 완료로 변경
  const updateOk = async () => {
    try {
      await axios.put(`/api/spec/${props.bno}`, {
        rno: props.rno,
        status: "완료"
      }, {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }
      });
      alert("심사가 완료 되었습니다.");
      if (props.startDate && props.endDate && props.insurance && props.pno) {
        await props.handleSearch();
      } else {
        await props.fetchSpecificationData();
      }
    } catch(error) {
      console.error(error);
    }
  }
  // 모달 열기 닫기
  const showModal = () => {
    props.setIsModalOpen(true);
  };

  // billcare 컬럼
  const billcareColumns = [
    {
      title: "no",
      dataIndex: "no",
      key: "no"
    },
    {
      title: "처방코드",
      dataIndex: "tcode",
      key: "tcode",
    },
  
    {
      title: "처방명",
      key: "tname",
      dataIndex: "tname",
    },
    {
      title: "처방금액",
      key: "tprice",
      dataIndex: "tprice",
    },
  ];
    return (
        <>
        <Col span={12}>선택 명세서의 처방 정보
        <Table
                  columns={billcareColumns}
                  dataSource={props.billcareData}
                  pagination={false}
                />
      <Button type="primary" size={'middle'} onClick={updateCancle} className='treatment-btn'>
            취소
          </Button>
      <Button type="primary" size={'middle'} onClick={updateOk} className='treatment-btn'>
            완료
          </Button>
      <Button type="primary" size={'middle'} className='treatment-btn' onClick={showModal} onCancel={props.handleCancel}>
            처방내역
          </Button>
      
      </Col>
      </>
    );
}

export default Specbillcare;