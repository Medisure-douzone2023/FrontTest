import { Button, Space, Table } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";

const columns = [
  { title: "환자명", dataIndex: "pname", key: "pname" },
  { title: "성별", dataIndex: "gender", key: "gender" },
  { title: "나이", dataIndex: "age", key: "age" },
  { title: "증상", dataIndex: "rcondition", key: "rcondition" },
  { title: "상태", dataIndex: "status", key: "status" },
  { title: "환자번호", dataIndex: "pno", key: "pno", hidden: "true" },
  { title: "접수번호", dataIndex: "rno", key: "rno", hidden: "true" },
  { tilte: "visit", dataIndex: "visit", key: "visit", hidden: "true" },
].filter((column) => !column.hidden);

function PatientList(props) {
  let token = props.token;
  const [patient, setPatient] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    console.log("newSelectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length !== 0) {
      console.log("newSelectedRow", newSelectedRows[0]);
      setSelectedRow(newSelectedRows[0]);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onButtonClick = async () => {
    if (selectedRowKeys && selectedRowKeys.length !== 0) {
      if (selectedRowKeys.length === 1) {
        if (window.confirm("환자 호출하기")) {
          alert("환자 호출");
          const response = await fetch(`/api/receipt/${selectedRowKeys}/진료중`, {
            method: "put",
            headers: {
              Authorization: token,
              Accept: "application/json",
            },
          });
          const json = await response.json();
          if (json.result !== "success") {
            throw new Error(`${json.result} ${json.message}`);
          }
          const newPatient = patient.filter((p) => p.rno !== json.data);
          setPatient(newPatient);
          console.log("newPatient: ", newPatient);
          //진료중인 환자 상태 관리 만들어서 json.data 로 변경하고 데이터 가져오기~~
          // props.setPno(selectedRowKeys);
          console.log("selectedRow", selectedRow);
          props.setRno(selectedRowKeys);
          props.setPno(selectedRow.pno);
          props.setIsVisited(selectedRow.visit);
          console.log("병원 온 적 있?", selectedRow.visit);
          setSelectedRowKeys();
        } else {
          alert("환자 호출 취소");
        }
      } else {
        alert("환자 한 명만 선택");
      }
    } else {
      alert("진료하실 환자를 선택하세요");
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/receipt/list", {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.result === "success") {
        setPatient(response.data.data);
        console.log("진료 대기 환자: ", response.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.patient]);
  return (
    <div>
      <Table
        className="patientList"
        rowSelection={rowSelection}
        rowKey="rno"
        pagination={false}
        dataSource={patient}
        columns={columns}
      />
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Button className="callPatient" block onClick={onButtonClick}>
          환자 호출
        </Button>
      </Space>
    </div>
  );
}

export default PatientList;
