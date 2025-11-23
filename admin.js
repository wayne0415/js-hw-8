// C3.js
let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});

const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin/";
const apiPath = "wayne";
const ordersApiUrl = `${baseUrl}${apiPath}/orders`;
const config = {
  headers: {
    Authorization: "Kj8TCylc4Fa6FzKw2Dzcl4HMnfH3",
  },
};

const orderPageTableBody = document.querySelector(".orderPage-table tbody");

let orders = [];

function renderOrders() {
  let orderList = "";
  orders.forEach((item) => {
    const orderDate = new Date(item.createdAt * 1000).toISOString().slice(0, 10).replaceAll("-", "/");
    const products = item.products.map((p) => `<p>${p.title} × ${p.quantity}</p>`).join("");
    orderList += `<tr>
      <td>${item.id}</td>
      <td>
        <p>${item.user.name}</p>
        <p>${item.user.tel}</p>
      </td>
      <td>${item.user.address}</td>
      <td>${item.user.email}</td>
      <td>${products}</td>
      <td>${orderDate}</td>
      <td class="orderStatus">
        <a href="#" data-id="${item.id}">
          ${item.paid ? "已處理" : "未處理"}
        </a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}" />
      </td>
    </tr>`;
  });
  orderPageTableBody.innerHTML = orderList;
}
// 取得訂單
function getOrders() {
  axios
    .get(ordersApiUrl, config)
    .then((res) => {
      orders = res.data.orders;
      console.log(orders);
      renderOrders();
    })
    .catch((err) => {
      console.log(err);
    });
}

getOrders();
