const db = require("../config/database");

// ==> Método responsável por obter a lista de Produtos:

exports.getProductList = async (req, res) => {
  const response = await db.query(
    `SELECT product.*, category.name as categoryName
    FROM product 
    JOIN category 
    ON category.id = product.category
    WHERE product.visible = true 
    ORDER BY id ASC`
  );

  res.status(200).send(response.rows);
};

// ==> Método responsável por obter uma Produto por Id:

exports.getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);

  const response = await db.query(
    `SELECT product.*, category.name as categoryName
    FROM product 
    JOIN category 
    ON category.id = product.category
    WHERE product.id = $1`, [productId]);

  res.status(200).send(response.rows);
};

// ==> Método responsável por obter a lista de produtos que precisam de reposição:

exports.getProductRepo = async (req, res) => {
  const quantity = parseInt(req.params.qtt);

  const response = await db.query(
    `SELECT product.*, category.name as categoryName
    FROM product 
    JOIN category 
    ON category.id = product.category
    WHERE product.quantity <= $1`, [quantity]);

  res.status(200).send(response.rows);
};

// ==> Método responsável por obter a lista de produtos mais vendidos:

exports.getProductBestSeller = async (req, res) => {
  const dateStart = parseInt(req.params.start);
  const dateEnd = parseInt(req.params.end);

  const response = await db.query(
    `SELECT po.*, category.name as categoryName
    FROM productsorder as po
    JOIN category 
    ON category.id = po.category
    WHERE po.date between $1 and $2 
    ORDER BY po.qtd DESC`, [dateStart, dateEnd]);

  res.status(200).send(response.rows);
};

// ==> Método responsável por criar uma nova 'Produto':

exports.createProduct = async (req, res) => {
  const { name, price, category, quantity } = req.body;
  const visible = true;
  const { rows } = await db.query(
    "INSERT INTO product (name, price, category, quantity, visible) VALUES ($1, $2, $3, $4, $5)",
    [name, price, category, quantity, visible]
  );

  res.status(201).send({
    message: "Product added successfully!",
    body: {
      product: { name, price, category, quantity }
    },
  });
};

// ==> Método responsável por adicionar mais quantidade a um 'Produto':

exports.addMoreQttProduct = async (req, res) => {
  const { id, quantity } = req.body;

  const atual = await db.query('SELECT quantity FROM product WHERE id = $1', [id]);
  const sum = atual.rows[0].quantity + quantity

  const { rows } = await db.query(
    "UPDATE product SET quantity = $1 WHERE id = $2",
    [sum, id]
  );

  res.status(200).send({
    message: "Product added successfully!"
  });
};

// ==> Método responsável por atualizar uma 'Produto' pelo 'Id':

exports.updateProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, price, category, quantity } = req.body;

  const response = await db.query(
    "UPDATE product SET name = $1, price = $2, category = $3, quantity = $4 WHERE id = $5",
    [name, price, category, quantity, productId]
  );

  res.status(200).send({ message: "Product Updated Successfully!" });
};

// ==> Método responsável por excluir uma 'Produto' pelo 'Id':

exports.deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  
  const hasProduct = await db.query('SELECT * FROM product WHERE id = $1', [productId]);

  if (hasProduct.rows.length < 1) {
    return res.status(500).send({ message: 'Não foi encontrada nenhum Produto', productId });
  } 

    await db.query('UPDATE product SET visible = false WHERE id = $1', [
      productId
    ]);
  
    res.status(200).send({ message: 'Product deleted successfully!', productId });
  
  
};