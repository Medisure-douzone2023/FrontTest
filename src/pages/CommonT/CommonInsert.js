import { Table, Space, Button, Select, Row, Col, Input, Modal, Form } from "antd";
import axios from 'axios'
import { useCallback, useState } from "react";


function CommonInsert({ token, isModalOpen,setIsModalOpen,options,dataSource,setDataSource }) {
     const [size, setSize] = useState('middle');
    const layout = {
        labelCol: { span: 2 },
        wrapperCol: { offset: 1, span: 20 },
      };

    const [insertKey, setInsertKey] = useState(null);
    const [insertGcode, setInsertGcode] = useState('');
    const [insertCodename, setInsertCodename] = useState('');
    const [insertPrice, setInsertPrice] = useState('');
    const [isClassificationSelected, setIsClassificationSelected] = useState(false);
    const handleCancel = () => {
        clearInputs()
        setIsModalOpen(false);
    };
    
    const validateClassification = (_, value) => {
        return value ? Promise.resolve() : Promise.reject('classification');
      };
    const [insertForm] = Form.useForm();
    const validateMessages = {
        required: '${label}는 필수 항목 입니다.',
        types: {
            classification: '구분명을 먼저 선택하세요!',
          }
    };
    const clearInputs = () => {
        insertForm.resetFields();
        setInsertKey(null)
        setInsertGcode('');
        setInsertCodename('');
        setInsertPrice('');
      }
    const handleOk = (e) => {
        insertForm.validateFields()
            .then((values) => {
                setIsModalOpen(false);

                const insertParameters = { gkey: insertKey.value, keyname: insertKey.label, gcode: insertGcode, codename: insertCodename, price: insertPrice }
                setDataSource([insertParameters, ...dataSource])
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
            })
            .catch((errorInfo) => {
                console.log("errorInfo", errorInfo)

            });

    };
    const validateNickname = useCallback((_, value) => {
        return Promise.resolve();
      }, []);

    //   const onBlurNickname = useCallback(() => {
      const checkDuplicatedCode = () => {
        if (insertForm.getFieldError('공통코드').length === 0 && insertForm.getFieldValue('공통코드')) {
            const param = { gkey: insertKey.value, gcode: insertForm.getFieldValue('공통코드') };
            axios
            .get("/api/common/check", { headers: { "Authorization": token }, params: param })
            .then((response) => {
                console.log("response",response)
                console.log("response.data.data.length",response.data.data.length)
                if (response.data.data.length > 0) {
                    insertForm.setFields([{
                      name: '공통코드',
                      errors: ['사용중인 공통코드 입니다.'],
                    }]);
                  }
              return response.data.data.length > 0;
            })
            .catch((error) => {
              console.error("Error checking code duplication:", error);
              return true;
            });
        }
      };
      const checkDuplicated = (e) =>{
        setInsertGcode(e.target.value)
        if (!isClassificationSelected) {
            insertForm.setFields([
              {
                name: '구분명',
                errors: ['구분명 선택은 필수입니다.'],
              },
            ]);
            return;
          }
        checkDuplicatedCode()
      }
    return (
        <div className ="hi">
            <Modal title="신규등록" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={insertForm} validateMessages={validateMessages}>
                    <Form.Item label="구분명" name="구분명" rules={[{ required: true }]}>
                        <Select size={size} placeholder="구분명을 선택하여주세요" onChange={(label, value) => {setInsertKey(value); setIsClassificationSelected(true);}}
                            style={{ width: '100%' }}
                            options={options.filter(option => option.value !== null)}
                            value={insertKey}>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="공통코드" name="공통코드"  rules={[{ validator: validateNickname }]}>
                        <Input placeholder="공통코드를 입력해주세요" value={insertGcode} onChange={checkDuplicated} />
                    </Form.Item>
                    <Form.Item label="코드명" name="코드명" rules={[{ required: true }]}>
                        <Input placeholder="코드명을 입력해주세요" value={insertCodename} onChange={(e) => { setInsertCodename(e.target.value) }} />
                    </Form.Item>
                    <Form.Item label="금액" name="금액" rules={[{ required: true }]}>
                        <Input placeholder="금액을 입력해주세요" value={insertPrice} onChange={(e) => { setInsertPrice(e.target.value) }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
export default CommonInsert;
