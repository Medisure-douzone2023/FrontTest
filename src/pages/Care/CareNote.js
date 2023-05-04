import { Input,  Select, Space, Button} from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
const { Option } = Select;
const { TextArea } = Input;

const handleDDChange = (value) => {
  console.log(`selected ${value}`);
};
const handleTTChange = (value) => {
  console.log(`selected ${value}`);
};


function CareNote(props) {
  const [options, setOptions] = useState([]);
  const [DKeyword, setDKeyword] = useState();
  const [treats, setTreats] = useState([]);
  const [TKeyword, setTKeyword] = useState();
  //진료데이터: memo(상태관리), rno(props), cuserid(나중에 토큰에서 가져오기)
  const [memo, setMemo] = useState("");
  const onMemoChange = (e) => {
    // console.log('Change:', e.target.value);
    setMemo(e.target.value);
  }
  const onButtonClick = () => {
    // console.log("진료완료 rno 0이면 진료하고 있는 환자 없는거");
    // console.log(memo);
    // console.log(props.rno);
    //post 추가하기
  }
    const onDDKeywordChange = async(e) => {
      if(e.key ==='Enter'){
        setDKeyword(e.target.value);
        setOptions([]);
        const keyword = e.target.value;
        const response = await axios({
          method: 'get',
          url: `/api/common/care?keyword=${keyword}&gkey=DD`,
          headers: {
            "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzE4OTMyNSwiZXhwIjoxNjgzNDg5MzI1fQ.olDzzZ4Ipo8zQHGGw10doh7LB03ZV4iY6tR5LEgXo6k",
            'Accept': 'application/json'
          }
        });
        setOptions(response.data.data);
        // console.log(response.data.data);
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
                "Authorization" : "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzE4OTMyNSwiZXhwIjoxNjgzNDg5MzI1fQ.olDzzZ4Ipo8zQHGGw10doh7LB03ZV4iY6tR5LEgXo6k"
            }
            , params: {
              "gkey" : 'TT',
              "keyword": keyword 
            }
          }
        )
        setTreats(response.data.data);
        setTKeyword();
        // console.log(treats);
        }
    }

    return (
        <>
            <h1>상병</h1>
            <Select mode="multiple" style={{width: '100%'}} 
                    optionLabelProp="label" placeholder="상병 검색" 
                    placement="bottomLeft" dropdownMatchSelectWidth={false} 
                    searchValue={DKeyword}
                    onChange={handleDDChange}
                    onInputKeyDown ={onDDKeywordChange}>
                {(options).map((option,index) => (
                    <Option value={option.gcode} label={option.codename} key={index} style={{width: '100%'}}>
                      <Space>
                        <span role="img" aria-label={option.gcode}>
                          {option.gcode}
                        </span>
                        {option.codename}
                      </Space>
                    </Option>)
                  ) }
            </Select>
            <h1>처방</h1>
            <Select mode="multiple" style={{width: '100%'}} 
                  onKeyDown={onTTKeywordChange} optionLabelProp="label" 
                  placeholder="상병 검색" placement="bottomLeft" 
                  dropdownMatchSelectWidth={false} 
                  onChange={handleTTChange} searchValue={TKeyword}>
                  {treats !== [] && treats.map((treat,index) => 
                    <Option value={treat.gcode} label={treat.codename} key={index} style={{width: '100%'}}>
                      <Space>
                        <span role="img" aria-label={treat.gcode}>
                          {treat.gcode}
                        </span>
                        {treat.codename}
                      </Space>
                    </Option>)
                  }
            </Select>
            <h1>진료메모</h1>
            <TextArea showCount maxLength={100} onChange={onMemoChange} style={{width: '100%', height: '200px'}} />
            <Button type="primary" ghost onClick={onButtonClick}>진료 완료</Button>
            <Button danger onClick={onButtonClick}>진료 취소</Button>
            {/* <Table  rowKey="rno" pagination={false} dataSource={options} /> */}
        </>
    );
}
export default CareNote;