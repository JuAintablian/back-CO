const db = require("../config/database");


// ==> Método responsável por obter a lista de categorias:

exports.getCategoryList = async (req, res) => {
  const response = await db.query('SELECT * FROM category ORDER BY id ASC');

  res.status(200).send(response.rows);
};

// ==> Método responsável por obter uma categoria por Id:

exports.getCategoryById = async (req, res) => {
  const categoryId = parseInt(req.params.id);

  const response = await db.query('SELECT * FROM category WHERE id = $1', [categoryId]);
  res.status(200).send(response.rows);
};

// ==> Método responsável por criar uma nova 'Categoria':

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const actions = true;
  
  await db.query(
    "INSERT INTO category (name, actions) VALUES ($1, $2)",
    [name, actions]
  );

  res.status(201).send({
    message: "Category added successfully!",
    body: {
      category: name
    },
  });
};

// ==> Método responsável por atualizar uma 'Categoria' pelo 'Id':

exports.updateCategory = async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const { name } = req.body;

  await db.query(
    "UPDATE category SET name = $1 WHERE id = $2",
    [name, categoryId]
  );

  res.status(200).send({ message: "Category Updated Successfully!" });
};

// ==> Método responsável por excluir uma 'Categoria' pelo 'Id':

exports.deleteCategory = async (req, res) => {
  const categoryId = parseInt(req.params.id);

  const hasCategory = await db.query('SELECT * FROM category WHERE id = $1', [categoryId]);
  const hasProduct = await db.query('SELECT * FROM product WHERE category = $1', [categoryId]);

  if (hasCategory.rows.length < 1) {
    return res.status(500).send({ message: 'Não foi encontrada nenhuma categoria', categoryId });
  }
  
  if (hasProduct.rows.length > 0) {
      await db.query(
        "UPDATE product SET category = 15 WHERE category = $1",
        [categoryId]
      )
  }

  await db.query('DELETE FROM category WHERE id = $1', [
    categoryId
  ]);

  res.status(200).send({ message: 'Category deleted successfully!', categoryId });

};