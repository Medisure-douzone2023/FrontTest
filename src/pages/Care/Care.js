import { Row, Col, Card, Table, Button } from "antd";
import React, { useState, useEffect, useRef, useCallback } from "react";
import PatientList from "./PatientList";
import CareNote from "./CareNote";
import axios from "axios";
import PatientInfo from "./PatientInfo";
import "../../assets/styles/Care.css";
import Modal from "antd/lib/modal/Modal";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const Swal = require('sweetalert2');
function Care(props) {
  const [pno, setPno] = useState(0);
  const [rno, setRno] = useState(0);
  const [patient, setPatient] = useState({});
  const [isVisited, setIsVisited] = useState();
  const [countPatient, setCountPatient] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const [patienCareList, setPatientCareList] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const patientCare = [
    { title: "환자명", dataIndex: "pname", key: "pname" },
    { title: "나이", dataIndex: "age", key: "age" },
    { title: "성별", dataIndex: "gender", key: "gender" },
    { title: "접수번호", dataIndex: "rno", key: "rno", hidden: "true" },
    { title: "환자번호", dataIndex: "pno", key: "pno", hidden: "true" },
  ].filter((column) => !column.hidden);
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length === 0) {
      setSelectedRow();
      setSelectedRowKeys();
    }
    if (newSelectedRowKeys.length === 1) {
      console.log("newSelectedRow", newSelectedRows[0]);
      setSelectedRow(newSelectedRows[0]);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  let token = props.token;
  const Toast = Swal.mixin({
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })
  const handleModalClose = async() => {
    if (!selectedRowKeys) {
      Toast.fire({
        html: "진료하실 환자를 선택해주세요.",
        icon: 'warning',
      })
      return;
    }
    if (selectedRowKeys.length > 1) {
      Toast.fire({
        html: "진료하실 환자를 1명만 선택해주세요.",
        icon: 'warning',
      })
      setSelectedRowKeys();
      return;
    }
    const result = await Swal.fire({
      html: selectedRow.pname + "(" + selectedRow.age + "세) 환자의 진료를 시작하시겠습니까?",
      icon: 'question',
      showCancelButton: true,
      showconfirmButton: true
    })
    if (result.isConfirmed) {
      fetchPatientInfo(selectedRow.pno);
      setRno(selectedRow.rno);
      setIsVisited(selectedRow.visit);
      setIsModal(false);
    } else {
      setSelectedRowKeys();
      return;
    }
  };
  const fetchPatientInfo = async (pno) => {
    if (pno === 0) {
      return;
    }
    const response = await axios({
      method: "GET",
      url: `/api/care/${pno}`,
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });
    if (response.data.result !== "success") {
      throw new Error(`${response.data.result} ${response.data.message}`);
    }
    console.log("patient info", response.data.data);
    setPatient(response.data.data);
  };
  const fetchCarePatient = async () => {
    const response = await axios({
      method: "GET",
      url: `/api/receipt/status`,
      headers: {
        Authorization: token,
      },
      params: {
        status: "진료중",
      },
    });
    if (response.data.result !== "success") {
      Toast.fire({
        title: "진료중 환자 가져오는데 오류 발생",
        icon: "error"
      })
      return;
    }
    console.log("진료중인 환자", response.data.data);
    if (response.data.data.length === 0) {
      Toast.fire({
        html: "진료중인 환자가 없습니다. <br/>" +
        "환자를 호출하세요.",
        icon: 'warning',
      });
      return;
    }
    if (response.data.data.length > 1) {
      const newPatientCareList = response.data.data.map((p) => {
        return { ...p, gender: p.gender === "m" ? "남" : "여" };
      });
      setPatientCareList(newPatientCareList);
      setIsModal(true);
      return;
    }
    fetchPatientInfo(response.data.data[0].pno);
    setRno(response.data.data[0].rno);
    setIsVisited(response.data.data[0].visit);
  };
  useEffect(() => {
    fetchPatientInfo(pno);
    fetchCarePatient();
  }, [pno]);
  
//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

const connectWebSocket = () => {
  const socket = new SockJS('/websocket');
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log('Connected to WebSocket');
    console.log("시간 : ", new Date());

    stompClient.subscribe('/topic/greetings', (result) => {
      console.log("greet",result)
      console.log("시간 : ", new Date());
      console.log("greeting.body",result.body)  
      // 메시지 처리 로직 추가
    });
  });
};

connectWebSocket();

    
  return (
      <Card className="care">
        <Modal
          className="patientModal"
          title="진료중인 환자목록"
          visible={isModal}
          onOk={handleModalClose}
          closable={false}
          footer={[
            <Button
              className="modalBtn"
              key="ok"
              onClick={handleModalClose}
              type="primary"
              ghost
              style={{ width: "95%", display: "block", margin: "0 auto" }}
            >
              확인
            </Button>,
          ]}
        >
          <p>진료중인 환자가 여러명입니다. 진료하실 환자를 선택해주세요.</p>
          <Table
            className="patientCareList"
            rowSelection={rowSelection}
            rowKey="rno"
            pagination={false}
            dataSource={patienCareList}
            columns={patientCare}
          />
        </Modal>
        <Row gutter={[24, 0]}>
          <Col span={8}>
            <h1 className="patientListText">접수 환자 목록</h1>
            {countPatient && countPatient > 0 ? (
              <p>환자 {countPatient}명 대기중</p>
            ) : (
              <p>대기중인 환자 없음</p>
            )}
            <PatientList
              setPno={setPno}
              setRno={setRno}
              patient={patient}
              setIsVisited={setIsVisited}
              token={token}
              setCountPatient={setCountPatient}
            />
          </Col>
          <Col span={8}>
            <CareNote
              rno={rno}
              setPatient={setPatient}
              isVisited={isVisited}
              setIsVisited={setIsVisited}
              token={token}
            />
          </Col>
          <Col span={8}>
            <PatientInfo patient={patient} token={token} />
          </Col>
        </Row>
        {/* <p> {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}</p> */}
      </Card>
  );
}

export default Care;
