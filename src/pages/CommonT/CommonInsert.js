import { Table, Space, Button, Select, Row, Col, Input, Modal, Form } from "antd";
import axios from 'axios';
import { useCallback, useState } from "react";
import { SizeOnlySource } from "webpack-sources";
import '../../assets/styles/CommonT.css';
import Swal from "sweetalert2";

function CommonInsert({ token, isModalOpen, setIsModalOpen, options, dataSource, setDataSource, onSearch }) {
  const [size, setSize] = useState('middle');
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { offset: 1, span: 20 },
  };
  const handleSearch = () => {
   onSearch(); // 전달받은 함수 실행
  };
  const [insertKey, setInsertKey] = useState(null);
  const [insertGcode, setInsertGcode] = useState('');
  const [insertCodename, setInsertCodename] = useState('');
  const [insertPrice, setInsertPrice] = useState('');
  const [isClassificationSelected, setIsClassificationSelected] = useState(false);

  const handleCancel = () => {
    clearInputs();
    setIsModalOpen(false);
  };

  const validateClassification = (_, value) => {
    return value ? Promise.resolve() : Promise.reject('classification');
  };

  const [insertForm] = Form.useForm();

  const validateMessages = {
    required: '${label}은 필수 항목입니다.',
    types: {
      classification: '구분명을 먼저 선택하세요!',
    },
  };

  const clearInputs = () => {
    insertForm.resetFields();
    setInsertKey(null);
    setInsertGcode('');
    setInsertCodename('');
    setInsertPrice('');
  };

  const handleOk = (e) => {
    insertForm.validateFields().then((values) => {
      setIsModalOpen(false);
      
      const insertParameters = {
        gkey: insertKey.value,
        keyname: insertKey.label,
        gcode: insertGcode,
        codename: insertCodename,
        price: insertPrice,
      };

      axios
        .post("/api/common", insertParameters, {
          headers: {
            "Authorization": token,
          },
        })
        .then((response) => {
          custom.fire( {icon: 'success',html: '공통코드 생성이 완료되었습니다.'});
          clearInputs();
        })
        .catch((e) => {
          console.log("error", e);
          custom.fire( {icon: 'error',html: '올바르지 않은 요청입니다. 다시 시도해 주시기 바랍니다.'});
        });
    }).catch((errorInfo) => {
      console.log("errorInfo", errorInfo);
    });
  };

  const checkDuplicatedCode = () => {
    if (insertForm.getFieldError('공통코드').length === 0 && insertForm.getFieldValue('공통코드')) {
      const param = { gkey: insertKey.value, gcode: insertForm.getFieldValue('공통코드') };

      axios
        .get("/api/common/check", { headers: { "Authorization": token }, params: param })
        .then((response) => {
          if (response.data.data.length > 0) {
            insertForm.setFields([
              {
                name: '공통코드',
                errors: ['사용중인 공통코드 입니다.'],
              },
            ]);
          }

          return response.data.data.length > 0;
        })
        .catch((error) => {
          console.error("Error checking code duplication:", error);
          return true;
        });
    }
  };

  const checkDuplicated = (e) => {
    setInsertGcode(e.target.value);

    if (!isClassificationSelected) {
      insertForm.setFields([
        {
          name: '구분명',
          errors: ['구분명 선택은 필수입니다.'],
        },
      ]);
      return;
    }

    checkDuplicatedCode();
  };

  const validateGcode = (_, value) => {
    if (!value) {
      return Promise.reject('공통코드는 필수 항목입니다.');
    }
    return Promise.resolve();
  };
  const custom = Swal.mixin({
    confirmButtonText: '확인',
    confirmButtonColor: '#3085d6',
  })
  return (
    <div className="commonInsert">
      <Modal title="신규등록" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} className="inserModal" footerProps={{ style: { textAlign: 'center', }, }}>
        <Form form={insertForm} labelCol={{ span: 4 }}
    wrapperCol={{ span: 16, offset : 2 }} validateMessages={validateMessages}>
          <Form.Item label="구분명" name="구분명" rules={[{ required: true }]}>
            <Select
              size={size}
              placeholder="구분명을 선택하여주세요"
              onChange={(label, value) => {
                setInsertKey(value);
                setIsClassificationSelected(true);
              }}
              style={{ width: '100%' }}
              options={options.filter((option) => option.value !== null)}
              value={insertKey}
            >
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="공통코드" name="공통코드" rules={[{ required: true, validator: validateGcode }]}>
            <Input style={{height:'33px'}} placeholder="공통코드를 입력해주세요" value={insertGcode} onChange={checkDuplicated} />
          </Form.Item>
          <Form.Item label="코드명" name="코드명" rules={[{ required: true }]}>
            <Input style={{height:'33px'}} placeholder="코드명을 입력해주세요" value={insertCodename} onChange={(e) => { setInsertCodename(e.target.value) }} />
          </Form.Item>
          <Form.Item label="금액" name="금액">
            <Input style={{height:'33px'}} placeholder="금액을 입력해주세요" value={insertPrice} onChange={(e) => { setInsertPrice(e.target.value) }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CommonInsert;