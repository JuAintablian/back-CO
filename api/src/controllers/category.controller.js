const db = require("../config/database");

// ==> Método responsável por criar uma nova 'Categoria':

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const { rows } = await db.query(
    "select * from category"
  );

  res.status(201).send({
    message: "Category added successfully!",
    body: {
       rows
    },
  });
};