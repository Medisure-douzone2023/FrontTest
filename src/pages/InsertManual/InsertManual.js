import { Table, DatePicker, Space, Button, Select, Row, Col } from "antd";
import axios from 'axios'
import { useState } from "react";
import '../../assets/styles/InsertManual.css';

let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM1MTAwNTksImV4cCI6MTY4MzgxMDA1OX0.4jXsvwp3Kfw-JFE3-chMiNKZtlQxXXoOR7VHDST5KH4';

function InsertManual() {

  const options = [{ value: '건강보험', labe: '건강보험' }, { value: '의료급여', labe: '의료급여' }];
  const { RangePicker } = DatePicker;
  const [date, setDate] = useState('');
  const [insurance, setInsurance] = useState('건강보험');
  const [size, setSize] = useState('middle');

  const columns = [
    {
      title: '환자명',
      dataIndex: 'pname',
      key: 'pname',
    },
    {
      title: '나이',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '성별',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '보험유형',
      dataIndex: 'insurance',
      key: 'insurance',
    },
    {
      title: '진료기간',
      dataIndex: 'rdate',
      key: 'rdate',
    },
    {
      title: '본인부담금',
      dataIndex: 'fprice',
      key: 'fprice',
    },
    {
      title: '청구금액',
      dataIndex: 'totalprice',
      key: 'totalprice',
    },
    {
      title: '초진여부',
      dataIndex: 'visit',
      key: 'visit',
    }, {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
    }
  ];

  let [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const selectDate = (value, dateString) => {
    setDate(dateString);
  }
  const handleChange = (value) => {
    setInsurance(value);
  };

  const search = () => {
    const param = { startDate: date[0], endDate: date[1], insurance: insurance };
    axios.get("/api/receipt/insertManual", { headers: { "Authorization": token }, params: param }
    ).then((response) => {
      const result = response.data.data;
      for (let i = 0; i < result.length; i++) {
        result[i].key = i;
      }
      setDataSource(result);
    }).catch((e) => { console.log("error", e); });
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

  const apiParam = () => {
    if (selectedRows.length > 0) {
      let apiParameters = [];
      const result = dataSource.filter(data => !selectedRows.some(apry => data.key === apry.key));
      setDataSource(result)
      for (let i = 0; i < selectedRows.length; i++) {
        apiParameters.push([selectedRows[i].rno, selectedRows[i].pno])
      }
      setSelectedRows('');
      setSelectedRowKeys('');
      axios.post("/api/bill/manualInsert", apiParameters, {
        headers: {
          "Authorization": token,
        },
      })
        .then((response) => {
          alert("수동생성이 완료되었습니다.")
        }).catch((e) => { console.log("error", e); });
    }
  }

  return (
    <div>
      <h4> 진료 검색 </h4>
      <Row>
        <Col>
          <Space direction="horizontal" size={12}>
            <RangePicker onChange={selectDate} />
            <Select
              size={size}
              defaultValue="건강보험"
              onChange={handleChange}
              style={{ width: 200 }}
              options={options}
            />
            <Button type="primary" ghost onClick={search}>검색</Button>
          </Space>
        </Col>
      </Row>
      <br />
      <br />
      <h4> 진료 조회 </h4>
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
      <Button type="primary" ghost onClick={apiParam} disabled={!hasSelected}>수동생성</Button>
    </div>
  );
}
export default InsertManual;
