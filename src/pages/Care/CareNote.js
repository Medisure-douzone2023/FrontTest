import { Input,  Select, Space, Button, Radio, Table, Dropdown, Menu} from 'antd';
import React, { useState} from 'react';
import axios from 'axios';
import Column from 'antd/lib/table/Column';
const { Option } = Select;
const { TextArea } = Input;

const handleTTChange = (value) => {
  console.log(`selected ${value}`);
};


function CareNote(props) {
  const [options, setOptions] = useState([]);
  const [DKeyword, setDKeyword] = useState();
  const [treats, setTreats] = useState([]);
  const [TKeyword, setTKeyword] = useState();
  const [selectDD, setSelectDD] = useState([]);
  //진료데이터: memo(상태관리), rno(props), cuserid(나중에 토큰에서 가져오기)
  const [memo, setMemo] = useState("");
  const onMemoChange = (e) => {
    // console.log('Change:', e.target.value);
    setMemo(e.target.value);
  }
  const onButtonClick = () => {
    console.log(selectDD);
    console.log("진료완료 rno 0이면 진료하고 있는 환자 없는거");
    console.log(memo);
    if(props.rno === 0){
      alert("진료중인 환자가 없습니다. 환자를 호출하세요.");
    }
    // post 추가하기
    // 상병추가 #{cno }, #{dname }, #{dcode }, #{dmain }
    // 처방추가 #{cno }, #{tname }, #{tcode }, #{tprice }
    // 진료추가 #{rno }, #{memo }, #{cuserid }
   }
    const onDDKeywordChange = async(e) => {
      setOptions([]);
      if(e.key ==='Enter'){
        setDKeyword(e.target.value);
        setOptions([]);
        const keyword = e.target.value;
        const response = await axios({
          method: 'get',
          url: `/api/common/care?keyword=${keyword}&gkey=DD`,
          headers: {
            "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE",
            'Accept': 'application/json'
          }
        });
        setOptions(response.data.data);
        console.log(response.data.data);
        setDKeyword();
      }
    }
    const onTTKeywordChange = async (e) => {
      if(e.key ==='Enter'){
        e.preventDefault();
        const keyword = e.target.value;
        setTKeyword(e.target.value);
        const response = await axios.get(
          '/api/common/care', {
            headers: {
                "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzUwNDgyMiwiZXhwIjoxNjgzODA0ODIyfQ.Ot5n4Y_Gq2TkpwxXHhWVrUYFg1CDdSjJAVorT9KtCVE"
            }
            , params: {
              "gkey" : 'TT',
              "keyword": keyword 
            }
          }
        )
        setTreats(response.data.data);
        setTKeyword();
        console.log(response.data.data);
        }
    }

    const handleDDChange = (value) => {
      console.log(`상병 변경: ${value}`);
      setSelectDD(selectDD.filter((dd)=> value.includes(dd.dcode)));
    };
    
    const handleDDSelect = (value, option) => {
      const updatedSelectDD = [...selectDD, { dcode: value, dname: option.label }];
      setSelectDD(updatedSelectDD);
    };

    const handleTTChange = (value) => {
      console.log(`처방 변경: ${value}`);
      // setSelectDD(selectTT.filter((dd)=> value.includes(dd.dcode)));
    };
    
    const handleTTSelect = (value, option) => {
      console.log(`selected ${value} ${option.label} ${option}`);
      // const updatedSelectDD = [...selectDD, { dcode: value, dname: option.label }];
      // setSelectDD(updatedSelectDD);
    };

    const handleMainChange = (value, record) => {
      console.log('Selected:', value, 'Record:', record);
      // 선택한 값과 레코드를 처리하는 로직을 구현하세요.
    };
    return (
        <>
            <h1>상병</h1>
            <Select mode="multiple" style={{width: '100%'}} 
                    optionLabelProp="label" placeholder="상병 검색" 
                    placement="bottomLeft" dropdownMatchSelectWidth={false} 
                    searchValue={DKeyword}
                    onChange={handleDDChange}
                    onInputKeyDown ={onDDKeywordChange}
                    onSelect={handleDDSelect}
                    optionFilterProp="label"
                    >
                {(options).map((option,index) => (
                  <Option value={option.gcode} label={option.codename} key={index} style={{width: '100%'}}>
                      <Space>
                        <span role="img" aria-label={option.gcode}>
                          {option.gcode}
                        </span>
                        {option.codename}
                      </Space>
                  </Option>)
                  )}
            </Select>
            <Table  rowKey="rno" pagination={false} dataSource={selectDD} >
              <Column title="주/부" key="main" dataIndex="dcode" render={(text, record) => (
                <Radio.Group onChange={(e) => handleMainChange(e.target.value, record)}  defaultValue='n'>
                  <Radio.Button value="y">주</Radio.Button>
                  <Radio.Button value="n">부</Radio.Button>
                </Radio.Group>
              )} />
              <Column title="코드명" dataIndex="dcode" key="dcode" />
              <Column title="상병이름" dataIndex="dname" key="dname" />
            </Table>


            <h1>처방</h1>
            <Select mode="multiple" style={{width: '100%'}} 
                  optionLabelProp="label" placeholder="상병 검색" 
                  placement="bottomLeft" dropdownMatchSelectWidth={false} 
                  searchValue={TKeyword}
                  onChange={handleTTChange} 
                  onInputKeyDown ={onTTKeywordChange}
                  onSelect={handleTTSelect}>
                  {treats !== [] && treats.map((treat,index) => 
                    <Option value={[treat.gcode, treat.gprice]} label={treat.codename} key={index} style={{width: '100%'}}>
                      <Space>
                        <span role="img" aria-label={treat.gcode}>
                          {treat.gcode}
                        </span>
                        {treat.codename}
                        {treat.gprice}
                      </Space>
                    </Option>)
                  }
            </Select>
            <h1>진료메모</h1>
            <TextArea showCount maxLength={100} onChange={onMemoChange} style={{width: '100%', height: '200px'}} />
            <Button type="primary" ghost onClick={onButtonClick}>진료 완료</Button>
            <Button danger onClick={onButtonClick}>진료 취소</Button>
        </>
    );
}
export default CareNote;