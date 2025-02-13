document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('product-form');
  const productList = document.getElementById('product-list');
  const orderForm = document.getElementById('order-form');
  const orderList = document.getElementById('order-list');
  const selectedOrder = document.getElementById('selected-order');

  let products = JSON.parse(localStorage.getItem('products')) || [];
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  let selectedOrderIndex = null;

  // Função para salvar produtos no Local Storage
  function saveProducts() {
      localStorage.setItem('products', JSON.stringify(products));
  }

  // Função para salvar comandas no Local Storage
  function saveOrders() {
      localStorage.setItem('orders', JSON.stringify(orders));
  }

  // Função para renderizar produtos
  function renderProducts() {
      productList.innerHTML = '';
      products.forEach((product, index) => {
          const li = document.createElement('li');
          li.textContent = `${product.name} - R$ ${product.price.toFixed(2)}`;
          productList.appendChild(li);
      });
  }

  // Função para renderizar comandas
  function renderOrders() {
      orderList.innerHTML = '';
      orders.forEach((order, index) => {
          const div = document.createElement('div');
          div.textContent = `Comanda ${index + 1} - Cliente: ${order.customerName} - Mesa: ${order.tableNumber} - Total: R$ ${order.total.toFixed(2)}`;
          div.addEventListener('click', () => selectOrder(index));
          orderList.appendChild(div);
      });
  }

  // Função para selecionar uma comanda
  function selectOrder(orderIndex) {
      selectedOrderIndex = orderIndex;
      showOrderDetails(orderIndex);
  }

  // Função para mostrar detalhes da comanda selecionada
  function showOrderDetails(orderIndex) {
      const order = orders[orderIndex];
      selectedOrder.innerHTML = `
          <h3>Comanda ${orderIndex + 1} - Cliente: ${order.customerName} - Mesa: ${order.tableNumber}</h3>
          <ul>
              ${order.items.map(item => `
                  <li class="order-item">
                      ${item.name} - R$ ${item.price.toFixed(2)}
                      <button onclick="removeItemFromOrder(${orderIndex}, ${order.items.indexOf(item)})">Remover</button>
                  </li>
              `).join('')}
          </ul>
          <p>Total: R$ ${order.total.toFixed(2)}</p>
          <form id="add-item-form">
              <select id="product-select">
                  ${products.map(product => `
                      <option value="${products.indexOf(product)}">${product.name} - R$ ${product.price.toFixed(2)}</option>
                  `).join('')}
              </select>
              <button type="submit">Adicionar Item</button>
          </form>
          <button id="close-order-button" onclick="closeOrder(${orderIndex})">Fechar Comanda</button>
      `;

      // Adicionar item à comanda
      document.getElementById('add-item-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const productIndex = parseInt(document.getElementById('product-select').value);
          const product = products[productIndex];
          addItemToOrder(orderIndex, product);
      });
  }

  // Função para adicionar item à comanda
  function addItemToOrder(orderIndex, product) {
      orders[orderIndex].items.push(product);
      orders[orderIndex].total += product.price;
      saveOrders();
      showOrderDetails(orderIndex);
      renderOrders();
  }

  // Função para remover item da comanda
  window.removeItemFromOrder = function(orderIndex, itemIndex) {
      const item = orders[orderIndex].items[itemIndex];
      orders[orderIndex].total -= item.price;
      orders[orderIndex].items.splice(itemIndex, 1);
      saveOrders();
      showOrderDetails(orderIndex);
      renderOrders();
  }

  // Função para fechar comanda
  window.closeOrder = function(orderIndex) {
      if (orders[orderIndex].items.length === 0) {
          alert("A comanda está vazia. Adicione itens antes de fechar.");
          return;
      }
      alert(`Comanda ${orderIndex + 1} fechada! Total: R$ ${orders[orderIndex].total.toFixed(2)}`);
      orders.splice(orderIndex, 1);
      saveOrders();
      renderOrders();
      selectedOrder.innerHTML = '';
  }

  // Adicionar produto
  productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const productName = document.getElementById('product-name').value;
      const productPrice = parseFloat(document.getElementById('product-price').value);

      if (!productName || isNaN(productPrice)) {
          alert("Preencha o nome e o preço do produto corretamente.");
          return;
      }

      products.push({ name: productName, price: productPrice });
      saveProducts();
      renderProducts();

      productForm.reset();
  });

  // Criar comanda
  orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.getElementById('customer-name').value;
      const tableNumber = parseInt(document.getElementById('table-number').value);

      if (!customerName || isNaN(tableNumber)) {
          alert("Preencha o nome do cliente e o número da mesa corretamente.");
          return;
      }

      orders.push({
          customerName,
          tableNumber,
          items: [],
          total: 0
      });
      saveOrders();
      renderOrders();

      orderForm.reset();
  });

  // Renderizar produtos e comandas ao carregar a página
  renderProducts();
  renderOrders();
});