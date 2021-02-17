const db = require("../config/database");


// ==> Método responsável por obter a lista de Produtos:

exports.getProductList = async (req, res) => {
  const response = await db.query('SELECT * FROM product ORDER BY id ASC');

  res.status(200).send(response.rows);
};

// ==> Método responsável por obter uma Produto por Id:

exports.getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);

  const response = await db.query('SELECT * FROM product WHERE id = $1', [productId]);
  res.status(200).send(response.rows);
};

// ==> Método responsável por obter a lista de produtos que precisam de reposição:

exports.getProductRepo = async (req, res) => {
  const quantity = parseInt(req.params.qtt);

  const response = await db.query('SELECT * FROM product WHERE quantity <= $1', [quantity]);
  res.status(200).send(response.rows);
};

// ==> Método responsável por criar uma nova 'Produto':

exports.createProduct = async (req, res) => {
  const { name, price, category, quantity } = req.body;
  const { rows } = await db.query(
    "INSERT INTO product (name, price, category, quantity) VALUES ($1, $2, $3, $4)",
    [name, price, category, quantity]
  );

  res.status(201).send({
    message: "Product added successfully!",
    body: {
      product: { name, price, category, quantity }
    },
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

  if(hasProduct.rows.length < 1) {
    return res.status(500).send({ message: 'Não foi encontrada nenhum Produto', productId });
  } else {
    await db.query('DELETE FROM product WHERE id = $1', [
      productId
    ]);
  
    res.status(200).send({ message: 'Product deleted successfully!', productId });
  }
  
};