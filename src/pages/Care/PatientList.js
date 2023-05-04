import { Button, Space, Table } from 'antd';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Column from 'antd/lib/table/Column';

const columns = [
    {title: '환자명', dataIndex: 'pname', key: 'pname'}
    , {title: '성별', dataIndex: 'gender',key: 'gender'}
    , {title: '나이', dataIndex: 'age', key: 'age'}
    , {title: '증상', dataIndex: 'rcondition', key: 'rcondition'}
    , {title: '상태', dataIndex: 'status', key: 'status'}
    , {title: '환자번호', dataIndex: 'pno', key: 'pno', hidden: 'true'}
    , {title: '접수번호', dataIndex: 'rno', key: 'rno', hidden: 'true'}
].filter(column => !column.hidden);

function PatientList(props) {
    const [patient, setPatient] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState();
    const [selectedRowPno, setSelectedRowPno] = useState();
    const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        // console.log('newSelectedRows',newSelectedRows[0].pno);
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRowPno(newSelectedRows[0].pno);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    

    const onButtonClick = async() => {
        if(selectedRowKeys && selectedRowKeys.length !==0){
            if(selectedRowKeys.length ===1){
                if(window.confirm("환자 호출하기")){
                    alert("환자 호출");
                    const response = await fetch(`/api/receipt/${selectedRowKeys}/진료중`,{
                        method: 'put',
                        headers: {
                                "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzE4OTMyNSwiZXhwIjoxNjgzNDg5MzI1fQ.olDzzZ4Ipo8zQHGGw10doh7LB03ZV4iY6tR5LEgXo6k",
                                'Accept': 'application/json'
                            }
                    })
                    const json = await response.json();
                    if(json.result !== 'success') {
                        throw new Error(`${json.result} ${json.message}`)
                    }
                    const newPatient = patient.filter((p) => p.rno !== json.data);
                    setPatient(newPatient);
                    //진료중인 환자 상태 관리 만들어서 json.data 로 변경하고 데이터 가져오기~~
                    // props.setPno(selectedRowKeys);
                    props.setRno(selectedRowKeys);
                    props.setPno(selectedRowPno);
                }else{
                    alert("환자 호출 취소");
                }
            }else {
                alert("환자 한 명만 선택");
            }
        } else{
            alert("진료하실 환자를 선택하세요");
        }
    }
    const fetchUsers = async () => {
        try{
            const response = await axios.get(
                '/api/receipt/list', {
                    headers: {
                        "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzE4OTMyNSwiZXhwIjoxNjgzNDg5MzI1fQ.olDzzZ4Ipo8zQHGGw10doh7LB03ZV4iY6tR5LEgXo6k"
                    }
                }
            );
            if(response.data.result === "success") {
                setPatient(response.data.data);
                // console.log(response.data.data);
            }
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        fetchUsers();
    },[]);
    return (
        <div>
            <Table rowSelection={rowSelection} rowKey="rno" pagination={false} dataSource={patient} columns={columns} >
                <Column title="pno" dataIndex="pno" key="pno"/>
                <Column title="rno" dataIndex="rno" key="rno"/>
                <Column title="환자명" dataIndex="pname" key="pname" />
                <Column title="성별" dataIndex="gender" key="gender" />
                <Column title="나이" dataIndex="age" key="age" />
                <Column title="증상" dataIndex="rcondition" key="rcondition" />
                <Column title="접수상태" dataIndex="status" key="status" />
            </Table>
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