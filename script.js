const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";
const apiPath = "wayne";
const productsApiUrl = `${baseUrl}${apiPath}/products`;
const cartsApiUrl = `${baseUrl}${apiPath}/carts`;
const ordersApiUrl = `${baseUrl}${apiPath}/orders`;

let productsData = [];
let cartsData = [];
let finalTotal = 0;

const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const shoppingCartTableBody = document.querySelector(".shoppingCart-table tbody");
const shoppingCartTotalPrice = document.getElementById("total-price");
const discardAllBtn = document.querySelector(".discardAllBtn");
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerEmail = document.getElementById("customerEmail");
const customerAddress = document.getElementById("customerAddress");
const tradeWay = document.getElementById("tradeWay");
const orderInfoForm = document.querySelector(".orderInfo-form");

orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  customerName.nextElementSibling.style.display = "none";
  customerPhone.nextElementSibling.style.display = "none";
  customerEmail.nextElementSibling.style.display = "none";
  customerAddress.nextElementSibling.style.display = "none";
  const name = customerName.value.trim();
  const tel = customerPhone.value.trim();
  const email = customerEmail.value.trim();
  const address = customerAddress.value.trim();
  const payment = tradeWay.value;

  let isError = false;

  if (!name) {
    console.log("請輸入姓名");
    customerName.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!tel) {
    console.log("請輸入電話");
    customerPhone.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!email) {
    console.log("請輸入email");
    customerEmail.nextElementSibling.style.display = "block";
    isError = true;
  }
  if (!address) {
    console.log("請輸入地址");
    customerAddress.nextElementSibling.style.display = "block";
    isError = true;
  }

  if (!isError) {
    const formData = {
      data: {
        user: {
          name,
          tel,
          email,
          address,
          payment,
        },
      },
    };
    submitOrder(formData);
  }
});

shoppingCartTableBody.addEventListener("click", (e) => {
  e.preventDefault();
  const id = e.target.dataset.id;
  if (id) {
    deleteCart(id);
  }
});

discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deletCarts();
});

productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  const id = e.target.dataset.id;
  if (id) {
    addCart(id);
  }
});
// 篩選產品
productSelect.addEventListener("change", () => {
  if (productSelect.value === "全部") {
    renderProducts(productsData);
  } else {
    const filteredProducts = productsData.filter((product) => product.category === productSelect.value);
    renderProducts(filteredProducts);
  }
});
// get products data and render on screen
function getProducts() {
  axios
    .get(productsApiUrl)
    .then((res) => {
      productsData = res.data.products;
      renderProducts(productsData);
    })
    .catch((err) => {
      console.log(err);
    });
}
// 渲染產品列表
function renderProducts(data) {
  let productList = ``;
  data.forEach((product) => {
    const imageUrl = Array.isArray(product.images) ? product.images[0] : product.images;
    productList += `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${imageUrl}" alt="" />
            <a href="#" class="addCardBtn" data-id="${product.id}">加入購物車</a>
            <h3>${product.title}</h3>
            <del class="originPrice">NT$${product.origin_price}</del>
            <p class="nowPrice">NT$${product.price}</p>
          </li>`;
  });
  productWrap.innerHTML = productList;
}

// 取得購物車列表
function getCarts() {
  axios
    .get(cartsApiUrl)
    .then((res) => {
      cartsData = res.data.carts;
      finalTotal = res.data.finalTotal;
      renderCarts();
    })
    .catch((err) => {
      console.log(err);
    });
}
// 渲染購物車列表
function renderCarts() {
  let cartList = "";
  cartsData.forEach((cart) => {
    cartList += ` <tr>
              <td>
                <div class="cardItem-title">
                  <img src="${cart.product.images}" alt="" />
                  <p>${cart.product.title}</p>
                </div>
              </td>
              <td>NT$${cart.product.origin_price}</td>
              <td>${cart.quantity}</td>
              <td>NT$${cart.product.price}</td>
              <td class="discardBtn">
                <a href="#" class="material-icons" data-id="${cart.id}"> clear </a>
              </td>
            </tr>`;
  });
  shoppingCartTableBody.innerHTML = cartList;
  shoppingCartTotalPrice.textContent = `NT$${finalTotal}`;

  if (!cartsData.length) {
    orderInfoBtn.setAttribute("disabled", true);
  } else {
    orderInfoBtn.removeAttribute("disabled");
  }
}

// 加入購物車
function addCart(id) {
  const data = {
    data: {
      productId: id,
      quantity: 1,
    },
  };
  axios
    .post(cartsApiUrl, data)
    .then((res) => {
      cartsData = res.data.carts;
      finalTotal = res.data.finalTotal;
      renderCarts();
    })
    .catch((err) => {
      console.log(err);
    });
}
// 刪除全部購物車
function deletCarts() {
  axios
    .delete(cartsApiUrl)
    .then((res) => {
      cartsData = res.data.carts;
      finalTotal = res.data.finalTotal;
      renderCarts();
    })
    .catch((err) => {
      console.log(err);
    });
}
// 刪除指定購物車
function deleteCart(id) {
  axios
    .delete(`${cartsApiUrl}/${id}`)
    .then((res) => {
      cartsData = res.data.carts;
      finalTotal = res.data.finalTotal;
      renderCarts();
    })
    .catch((err) => {
      console.log(err);
    });
}

function submitOrder(formData) {
  axios
    .post(ordersApiUrl, formData)
    .then((res) => {
      console.log(res.data);
      orderInfoForm.reset();
      getCarts();
    })
    .catch((err) => {
      console.log(err);
    });
}

function init() {
  getProducts();
  getCarts();
}
init();
