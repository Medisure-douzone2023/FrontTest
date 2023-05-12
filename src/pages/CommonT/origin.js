import { Table, Space, Button, Select, Row, Col, Input, Modal } from "antd";
import axios from 'axios'
import { useState } from "react";

let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYWEiLCJwb3NpdGlvbiI6ImFkbWluIiwiaWF0IjoxNjgzNjEzOTA2LCJleHAiOjE2ODM5MTM5MDZ9.lpN8FdqrNtbhWRIXPzP_GPftVvLI9TZgEr0A7rWqGaU';

function CommonT() {

  const options = [{ value: 'RR', label: '접수' }, { value: 'PP', label: '환자' }, { value: 'DD', label: '상병' }, { value: 'TT', label: '처방' }];
  const [keyname, setKeyname] = useState('접수');
  const [size, setSize] = useState('middle');
  const [gcode, setGCode] = useState('')
  const [codename, setCodename] = useState('')
  
  const columns = [
    {
      title: '구분',
      dataIndex: 'gkey',
      key: 'gkey',
      hidden: 'true'
    },
    {
      title: '구분명',
      dataIndex: 'keyname',
      key: 'keyname',
    },
    {
      title: '공통코드',
      dataIndex: 'gcode',
      key: 'gcode',
      render: (text) => <a onClick ={test}>{text}</a>,
    },
    {
      title: '코드명',
      dataIndex: 'codename',
      key: 'codename',
    },
    {
      title: '금액',
      dataIndex: 'gprice',
      key: 'gprice',
    }
  ];

  let [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const test = (e) =>{
    console.log("ho",e.target.text)
  }
  const search = () => {
    const param = { gkey: keyname, gcode: gcode, codename: codename };
    axios.get("/api/common", { headers: { "Authorization": token }, params: param }
    ).then((response) => {
      const result = response.data.data;
      for (let i = 0; i < result.length; i++) {
        result[i].key = i;
      }
      setDataSource(result);
    }).catch((e) => {
      console.log("error", e);
    });
  }

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const deleteCode = () => {
    if (selectedRows.length > 0) {
      let apiParameters = [];
      let copy = [...selectedRows];
      setSelectedRows('');
      setSelectedRowKeys('');
  
      const result = dataSource.filter(data => !copy.some(apry => data.key === apry.key));
      setDataSource(result)

      for (let i = 0; i < copy.length; i++) {
        apiParameters.push({ gkey: copy[i].gkey, gcode: copy[i].gcode });
      }
      axios.delete("/api/common", { data: apiParameters, headers: { "Authorization": token } })
        .then((response) => {
          alert("삭제가 완료되었습니다.")
        }).catch((e) => {
          console.log("error", e);
          alert("올바르지 않은 요청입니다. 다시 시도해 주시기 바랍니다.");
          setDataSource(copy);
        });
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const [insertKey, setInsertKey] = useState(null);
  const [insertGcode, setInsertGcode] = useState('');
  const [insertCodename, setInsertCodename] = useState('');
  const [insertPrice, setInsertPrice] = useState('');

  const handleOk = () => {
    setIsModalOpen(false);

    const insertParameters = { gkey: insertKey.value, keyname: insertKey.label, gcode: insertGcode, codename: insertCodename, price: insertPrice }
    axios.post("/api/common", insertParameters, {
      headers: {
        "Authorization": token,
      },
    })
      .then((response) => {
        alert("공통코드 생성이 완료되었습니다.")
        clearInputs()
      }).catch((e) => {
        console.log("error", e);
        alert("올바르지 않은 요청입니다. 다시 시도해 주시기 바랍니다.");
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const clearInputs = () => {
    setInsertKey(null)
    setInsertGcode("");
    setInsertCodename("");
    setInsertPrice("");
  }

  return (
    <div>
      <h4> 공통테이블 검색 </h4>
      <Row>
        <Col>
          <Space direction="horizontal" size={12}>
            <Select
              size={size}
              placeholder="구분명을 선택해주세요"
              onChange={(e) => { setKeyname(e) }}
              style={{ width: 200 }}
              options={options}
            />
            <Input placeholder="구분코드를 입력해주세요" onChange={(e) => { setGCode(e.target.value) }} />
            <Input placeholder="코드명을 입력해주세요" onChange={(e) => { setCodename(e.target.value) }} />
            <Button type="primary" ghost onClick={search}>검색</Button>
            <Button type="primary" onClick={showModal}>신규등록</Button>
            <Modal title="신규등록" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
              <Select
                size={size}
                placeholder="구분명을 선택하여주세요"
                onChange={(label, value) => { setInsertKey(value) }}
                style={{ width: '100%' }}
                options={options}
                value={insertKey}
              />
              <Input placeholder="구분코드를 입력해주세요" value={insertGcode} onChange={(e) => { setInsertGcode(e.target.value) }} />
              <Input placeholder="구분명을 입력해주세요" value={insertCodename} onChange={(e) => { setInsertCodename(e.target.value) }} />
              <Input placeholder="금액을 입력해주세요" value={insertPrice} onChange={(e) => { setInsertPrice(e.target.value) }} />
            </Modal>
          </Space>
        </Col>
      </Row>
      <br />
      <br />
      <h4> 공통테이블 조회 </h4>
      <br />
      <div>
        <div
          style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <span
            style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
      </div>
      <Button type="primary" ghost onClick={deleteCode} disabled={!hasSelected}>삭제</Button>
    </div>
  );
}
export default CommonT;