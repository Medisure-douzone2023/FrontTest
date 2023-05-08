import { Table, DatePicker, Space, Button } from "antd";
import axios from 'axios'
import { useState } from "react";
import '../../assets/styles/InsertManual.css';

function Billing() {
  const { RangePicker } = DatePicker;
  let [dataSource, setDataSource] = useState([]);
  let apiArray = {};

  const apiParam = () => {
    let apiParameters = [];
    for (let i = 0; i < apiArray.length; i++) {
      apiParameters.push([apiArray[i].rno, apiArray[i].pno ])
    }
    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODM1MDQ2MjQsImV4cCI6MTY4MzgwNDYyNH0.ishfC37fiyigb6H59LfHmUpgsMQnzV9JT18hccoVFVU';
    axios.post("/api/bill/manualInsert",apiParameters, {
      headers: {
        "Authorization": token,
      },
    })
    .then((response) => {
      const result = dataSource.filter(data => !apiArray.some(apry => data.key === apry.key));
      setDataSource(result)
      alert("수동생성이 완료되었습니다.")
    }).catch((error) => {});
  }

const [selectedRowKeys, setSelectedRowKeys] = useState([]);
const [loading, setLoading] = useState(false);
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

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      apiArray = selectedRows;
      },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <h4> 진료 검색 </h4>
      <Space direction="vertical" size={12}>
        <RangePicker onChange={(value, dateString) => {
          const param = { startDate: dateString[0], endDate: dateString[1] };
          let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwicG9zaXRpb24iOiJvZmZpY2UiLCJpYXQiOjE2ODMxOTAzMTMsImV4cCI6MTY4MzQ5MDMxM30.eTGjLxJITDxQ_L38jY2WpsF_lSy_rST3t1ikFsuNRAc';
          axios.get("/api/receipt/insertManual", { headers: { "Authorization": token }, params: param }
          ).then((response) => {
            const result = response.data.data;
            for (let i = 0; i < result.length; i++) {
              result[i].key = i;
            }
            setDataSource(result);
          }).catch((error) => {});
        }} />
      </Space>
      <br />
      <br />
      <h4> 결과 조회 </h4>
      <br />
      <div>
        <div
          style={{ marginBottom: 16}}>
          <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <span
            style={{marginLeft: 8}}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
      </div>
      <Button type="primary" ghost onClick={apiParam}>수동생성</Button>
    </div>
  );
}
//분할,css
export default Billing;
