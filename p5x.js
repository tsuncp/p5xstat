const fs = require('fs');
const axios = require('axios');

const apiUrl = '';
const authKey = '';

async function fetchData(type) {
  let page = 1;
  let data = [];

  while (true) {
    try {
      const response = await axios.get(apiUrl, {
        params: {
          gachaType: type,
          page,
          size: 15,
          authKey,
        },
      });

      const { list, pages } = response.data.data;

      data = data.concat(list);

      if (page === pages) {
        break;
      }

      page++;
    } catch (error) {
      console.error('Error fetching data:', error);
      break;
    }
  }

  return data;
}

function convertTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toString();
}

var specialArray = [{ "id": 1231, "name": "美波" }, { "id": 1011, "name": "龍司" }, { "id": 1111, "name": "YUI" }, { "id": 1191, "name": "杏" }, { "id": 1261, "name": "Joker" }, { "id": 1281, "name": "陽菜" }, { "id": 1021, "name": "貓" }, { "id": 1091, "name": "玲" }];

async function main() {
  console.log("普通");
  const normal = await fetchData(1);
  //save normal as csv
  fs.writeFileSync('normal.csv', normal.map(item => `${convertTimestamp(item.t)},${item.aas}`).join('\n'));
  normal.reverse();
  displayData(listSpecialData(normal))
  console.log("");
  console.log("特殊");
  const special = await fetchData(2);
  special.reverse();
  displayData(listSpecialData(special))
}
function listSpecialData(data) {
  const specialData = [];
  console.log("總共抽了 " + data.length + " 次");
  for (let i = 0; i < data.length; i++) {
    if (specialArray.some(special => special.id === data[i].aas)) {
      data[i].index = i;
      //the diff between last index
      if (specialData.length > 0) {
        data[i].diff = data[i].index - specialData[specialData.length - 1].index;
      } else {
        data[i].diff = data[i].index
      }
      data[i].name = specialArray.find(special => special.id === data[i].aas).name;
      data[i].time = convertTimestamp(data[i].t);
      specialData.push(data[i]);
    }
  }
  return specialData;
}

function convertTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toString();
}

function displayData(data) {
  for (let i = 0; i < data.length; i++) {
    console.log("總共第 " + data[i].index + " 抽 角色 : " + data[i].name + " 時間 : " + data[i].time + (data[i].diff ? "  上次抽角色的差異為 : " + data[i].diff + " 抽" : ""));
  }
  //total count
  console.log("總共抽了 5星 " + data.length + " 次");
  //average diff
  console.log("平均差異為 : " + (data.reduce((a, b) => a + b.diff, 0) / data.length) + " 抽");
  //max diff
  console.log("最大差異為 : " + data.reduce((a, b) => Math.max(a, b.diff), 0) + " 抽");
  //min diff
  console.log("最小差異為 : " + data.reduce((a, b) => Math.min(a, b.diff), data[0].diff) + " 抽");
}

