import { Button, Space, Table } from 'antd';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const columns = [
    {
      title: '환자명',
      dataIndex: 'pname',
      key: 'pname',
    }, {
      title: '성별',
      dataIndex: 'gender',
      key: 'gender',
    }, {
        title: '나이',
        dataIndex: 'age',
        key: 'age',
    }, {
      title: '증상',
      dataIndex: 'rcondition',
      key: 'rcondition',
    }, {
        title: '상태',
        dataIndex: 'status',
        key: 'status',
    }, {
        title: '환자번호',
        dataIndex: 'pno',
        key: 'pno',
        hidden: true
    },{
        title: '접수번호',
        dataIndex: 'rno',
        key: 'rno',
        hidden: true
    },
    
].filter(column => !column.hidden);
function PatientList() {
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState();
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onButtonClick = () => {
        if(selectedRowKeys && selectedRowKeys.length !==0){
            //환자 상태 변경 & 환자 정보, 진료 기록 가져오기 진료중인 환자가 없어야함
        } else{
            alert("진료하실 환자를 선택하세요");
            console.log(selectedRowKeys.length);
        }
    }
    useEffect(() => {
        setPatient(null);
        const fetchUsers = async () => {
            try{
                setLoading(true);
                const response = await axios.get(
                    '/api/receipt/list', {
                        headers: {
                            "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4Mjk4NTIyNiwiZXhwIjoxNjgzMjg1MjI2fQ.2CpvMAsbnCssjovVWFDOeVpZ0Gy4fx22YYGHKzJ9i-Y"
                        }
                    }
                );
                if(response.data.result === "success") {
                    setPatient(response.data.data);
                }
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }
        fetchUsers();
    },[]);
    useEffect(() => {
        return () => setLoading(false);
    }, []);
    return (
        <div>
            <Table rowSelection={rowSelection} rowKey="rno" pagination={false} dataSource={patient} columns={columns} />
            <Space
                direction="vertical"
                style={{
                width: '100%',
                }}
            >
                <Button block onClick={onButtonClick}>환자 호출</Button>
            </Space>
        </div>
    );
}

export default PatientList;