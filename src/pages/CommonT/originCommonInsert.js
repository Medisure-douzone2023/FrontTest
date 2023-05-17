import { Table, Space, Button, Select, Row, Col, Input, Modal, Form } from "antd";
import axios from 'axios'
import { useState } from "react";


function CommonInsert({ token, isModalOpen,setIsModalOpen,options }) {
     const [size, setSize] = useState('middle');
    const layout = {
        labelCol: { span: 2 },
        wrapperCol: { offset: 1, span: 20 },
      };

    const [insertKey, setInsertKey] = useState(null);
    const [insertGcode, setInsertGcode] = useState('');
    const [insertCodename, setInsertCodename] = useState('');
    const [insertPrice, setInsertPrice] = useState('');
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const clearInputs = () => {
        setInsertKey(null)
        setInsertGcode("");
        setInsertCodename("");
        setInsertPrice("");
    }
    const [insertForm] = Form.useForm();
    const validateMessages = {
        required: '${label} is required!',
    };
    
    const handleOk = (e) => {
        insertForm.validateFields()
            .then((values) => {
                console.log("values", values)
                /*
              values:
                {
                  username: 'username',
                  password: 'password',
                }
              */
            })
            .catch((errorInfo) => {
                console.log("errorInfo", errorInfo)
                /*
                errorInfo:
                  {
                    values: {
                      username: 'username',
                      password: 'password',
                    },
                    errorFields: [
                      { name: ['password'], errors: ['Please input your Password!'] },
                    ],
                    outOfDate: false,
                  }
                */
            });
        // setIsModalOpen(false);

        // const insertParameters = { gkey: insertKey.value, keyname: insertKey.label, gcode: insertGcode, codename: insertCodename, price: insertPrice }
        // setDataSource([insertParameters, ...dataSource])
        // axios.post("/api/common", insertParameters, {
        //   headers: {
        //     "Authorization": token,
        //   },
        // })
        //   .then((response) => {
        //     alert("공통코드 생성이 완료되었습니다.")
        //     clearInputs()
        //   }).catch((e) => {
        //     console.log("error", e);
        //     alert("올바르지 않은 요청입니다. 다시 시도해 주시기 바랍니다.");
        //   });
    };
    return (
        <div className ="hi">
            <Modal title="신규등록" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={insertForm}  {...layout} validateMessages={validateMessages}>
                    <Form.Item label="Select" rules={[{ required: true }]}>
                        <Select size={size} placeholder="구분명을 선택하여주세요" onChange={(label, value) => { setInsertKey(value) }}
                            style={{ width: '100%' }}
                            options={options.filter(option => option.value !== null)}
                            value={insertKey}>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="공통코드" rules={[{ required: true }]}>
                        <Input placeholder="공통코드를 입력해주세요" value={insertGcode} onChange={(e) => { setInsertGcode(e.target.value) }} />
                    </Form.Item>
                    <Form.Item label="구분명" rules={[{ required: true }]}>
                        <Input placeholder="구분명을 입력해주세요" value={insertCodename} onChange={(e) => { setInsertCodename(e.target.value) }} />
                    </Form.Item>
                    <Form.Item label="금액" rules={[{ required: true }]}>
                        <Input placeholder="금액을 입력해주세요" value={insertPrice} onChange={(e) => { setInsertPrice(e.target.value) }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
export default CommonInsert;
