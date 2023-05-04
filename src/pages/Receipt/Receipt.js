import React from 'react';
import { Select, Space } from 'antd';
import axios from 'axios';
const { Option } = Select;

// const handleChange = (value) => {
//   console.log(`selected ${value}`);
// };
// let result = [];
// const param = { gkey: "DD", keyword: '' };
// const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzA5NTg2MiwiZXhwIjoxNjgzMzk1ODYyfQ.t_d2TTHdJZjC7reBG7ME1mMg3tmCYMh7vU-gP0w1Xe0';
// axios.get("/api/common", { headers: { "Authorization": token }, params: param })
//   .then((e) => {
//     console.log(e)
//     console.log(e.data.data)
//     result = e.data.data;
//     console.log("result", result);
//   }).catch(() => {
//     console.log('실패함')
//   })
function Receipt(props) {
  return (
    <div>
      접수 / 수납 페이지
{/* 
      <Select
        mode="multiple"
        style={{
          width: '100%',
        }}
        placeholder="select one country"
        defaultValue={[]}
        onChange={handleChange}
        optionLabelProp="label"
      >
        <Option value="china" label="China">
          <Space>
            <span role="img" aria-label="China">
              812d
            </span>
            China  중국 가나다라 마바사 아자차카 (中国)
          </Space>
        </Option>

        {
          result.map(function (item) {
            console.log("item",item)
            console.log("codename",item.codename)
            return (
              <Option value="china" label="China">
          <Space>
            <span role="img" aria-label="China">
              812d
            </span>
            China  중국 가나다라 마바사 아자차카 (中国)
          </Space>
        </Option>
              )
          })
        }

        <Option value="usa" label="USA">
          <Space>
            <span role="img" aria-label="USA">
              🇺🇸
            </span>
            USA 벚덧다지닾찿(美国)
          </Space>
        </Option>
        <Option value="japan" label="Japan">
          <Space>
            <span role="img" aria-label="Japan">
              🇯🇵
            </span>
            Japan 아닷탘스슫즙(日本)
          </Space>
        </Option>
        <Option value="korea" label="Korea">
          <Space>
            <span role="img" aria-label="Korea">
              🇰🇷
            </span>
            세뎆뱓밥 (韩国)
          </Space>
        </Option>
      </Select> */}
    </div>
  );
}

export default Receipt; 