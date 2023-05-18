import { Table, Space, Button, Select, Row, Col, Form, Input, Typography, Popconfirm } from "antd";
import axios from 'axios'
import { useEffect, useState } from "react";
import CommonInsert from "./CommonInsert";

function CommonT(props) {

  useEffect(() => {
    search();
  }, []);

  let token = props.token
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const options = [{ value: null, label: '미선택' }, { value: 'RR', label: '접수' }, { value: 'PP', label: '환자' }, { value: 'DD', label: '상병' }, { value: 'TT', label: '처방' }];
  const [keyname, setKeyname] = useState();
  const [size, setSize] = useState('middle');
  const [gcode, setGCode] = useState()
  const [codename, setCodename] = useState()

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
    },
    {
      title: '코드명',
      dataIndex: 'codename',
      key: 'codename',
      editable: true,
    },
    {
      title: '금액',
      dataIndex: 'gprice',
      key: 'gprice',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  let [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const search = () => {
    const param = { gkey: keyname, gcode: gcode, codename: codename };
    axios.get("/api/common", { headers: { "Authorization": token }, params: param }
    ).then((response) => {
      const result = response.data.data;
      for (let i = 0; i < result.length; i++) {
        result[i].key = i;
      }
      setDataSource(result);
      setEditingKey('');
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

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey('');
      }
      const updatedItem = newData.find((item) => key === item.key);
      axios.put("/api/common", updatedItem, {
        headers: {
          "Authorization": token,
        },
      }).then((response) => {
        alert("수정이 완료되었습니다.")
      }).catch((e) => {
        console.log("error", e);
      });
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
            <Input placeholder="공통코드를 입력해주세요" onChange={(e) => { setGCode(e.target.value) }} />
            <Input placeholder="코드명을 입력해주세요" onChange={(e) => { setCodename(e.target.value) }} />
            <Button type="primary" ghost onClick={search}>검색</Button>
            <Button type="primary" onClick={showModal}>신규등록</Button>
            <CommonInsert token={token} isModalOpen = {isModalOpen} setIsModalOpen = {setIsModalOpen} options = {options}dataSource={dataSource} setDataSource={setDataSource} />
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
        <Form form={form} component={false}>
          <Table components={{
            body: {
              cell: EditableCell,
            },
          }} bordered rowSelection={rowSelection} rowClassName="editable-row" pagination={{
            onChange: cancel,
          }} columns={mergedColumns} dataSource={dataSource} />
          
        </Form>
      </div>
      <Button type="primary" ghost onClick={deleteCode} disabled={!hasSelected}>삭제</Button>
    </div>
  );
}
export default CommonT;
