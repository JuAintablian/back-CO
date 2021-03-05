const db = require("../config/database");


// ==> Método responsável por obter a lista de Vendas:

exports.getOrdersList = async (req, res) => {
  const response = await db.query(
    `SELECT orders.*, pf.name as paymentFormName 
    FROM orders JOIN paymentForm as pf ON pf.id = orders.paymentForm 
    WHERE Extract(month from date) >= Extract(month from Now()) AND Extract(month from date) <= Extract(month from Now() + Interval \'20 day\') 
    ORDER BY date DESC`
  );
  res.status(200).send(response.rows);
};

// ==> Método responsável por obter a lista de Vendas por periodo:

exports.getOrdersListByPeriod = async (req, res) => {
  const dateStart = parseInt(req.params.start);
  const dateEnd = parseInt(req.params.end);

  const response = await db.query(`SELECT * FROM orders where date between $1 and $2 ORDER BY date DESC`, [dateStart, dateEnd]);

  res.status(200).send(response.rows);
};

// ==> Método responsável por obter uma Venda por Id:

exports.getOrderById = async (req, res) => {
  const orderId = parseInt(req.params.id);

  const orders = await db.query(`SELECT * FROM orders WHERE id = $1`, [orderId]);

  const products = await db.query(
    `SELECT po.qtd, pd.name, pd.price, (pd.price * po.qtd) as totalValue 
    FROM productsorder as po 
    INNER JOIN product as pd 
    ON po.idProduct = pd.id 
    WHERE po.idorder = $1`, [orderId]);

  const paymentForm = await db.query(
    `SELECT pf.id, pf.name 
    FROM orders 
    INNER JOIN paymentForm as pf 
    ON orders.paymentform = pf.id 
    WHERE orders.id = $1`, [orderId]);
  
  res.status(200).send({
    orders: orders.rows,
    products: products.rows,
    paymentForm: paymentForm.rows
  });
};

// ==> Método responsável por criar uma nova 'Venda':

exports.createOrder = async (req, res) => {
  const { date, paymentForm, products, total } = req.body;

  await db.query(
    `INSERT INTO orders (date, paymentForm, value) VALUES ($1, $2, $3)`,
    [date, paymentForm, total]
  );

  const idorder = await db.query(
    `SELECT max(id) FROM orders`
  );

  products.map(async(item) => {
    const qttCurr = await db.query('SELECT quantity FROM product WHERE id = $1', [item.id]);
    const sum = qttCurr.rows[0].quantity - item.quantity
    
    await db.query(
      `INSERT INTO productsorder (idProduct, idorder, qtd, date, category) VALUES ($1, $2, $3, $4, $5)`,
      [item.id, idorder.rows[0].max, item.quantity, date, item.category]
    )
    
    
    await db.query(
      "UPDATE product SET quantity = $1 WHERE id = $2",
      [sum, item.id]
      )
    }
  
  );

  res.status(201).send({
    message: "Product added successfully!"
  });
};
