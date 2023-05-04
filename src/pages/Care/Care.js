
import { Select, Space } from 'antd';
import axios from 'axios';


// const options = [];
// const param = { gkey: "DD", keyword: '' };
// const token ='eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlZWUiLCJwb3NpdGlvbiI6ImRvY3RvciIsImlhdCI6MTY4MzA5NTg2MiwiZXhwIjoxNjgzMzk1ODYyfQ.t_d2TTHdJZjC7reBG7ME1mMg3tmCYMh7vU-gP0w1Xe0';
// axios.get("/api/common", { headers: { "Authorization": token }, params: param })
//   .then((e) => {
//     console.log(e)
//     console.log(e.data.data)
//     let result = e.data.data;
//     for (let i = 10; i < result.length; i++) {
//       options.push({
//         value: result[i].gcode + " " + result[i].codename,
//         label: result[i].gcode + " " + result[i].codename,
//       });
//     }
//   }).catch(() => {
//     console.log('실패함')
//   })



const handleChange = (value) => {
  console.log(`selected ${value}`);
};
function Care() {

  return (
    <>
      {/* <Select
        mode="tags"
        style={{
          width: '100%',
        }}
        placeholder="Tags Mode"
        onChange={handleChange}
        options={options}
      />
      <div className="tabled">
        <h1>진료페이지</h1>
      </div> */}
    </>
  );
}

export default Care;
