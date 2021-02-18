const db = require("../config/database");


// ==> Método responsável por obter a lista de formas de pagamento:

exports.getPaymentFormList = async (req, res) => {
  const response = await db.query('SELECT * FROM paymentForm where visible = true ORDER BY id ASC');

  res.status(200).send(response.rows);
};

// ==> Método responsável por obter uma forma de pagamento por Id:

exports.getPaymentFormById = async (req, res) => {
  const paymentFormId = parseInt(req.params.id);

  const response = await db.query('SELECT * FROM paymentForm WHERE id = $1', [paymentFormId]);
  res.status(200).send(response.rows);
};

// ==> Método responsável por criar uma nova 'Forma de Pagamento':

exports.createPaymentForm = async (req, res) => {
  const { name } = req.body;
  const visible = true
  
  await db.query(
    "INSERT INTO paymentForm (name, visible) VALUES ($1, $2)",
    [name, visible]
  );

  res.status(201).send({
    message: "PaymentForm added successfully!",
    body: {
      paymentForm: name
    },
  });
};

// ==> Método responsável por atualizar uma 'Forma de Pagamento' pelo 'Id':

exports.updatePaymentForm = async (req, res) => {
  const paymentFormId = parseInt(req.params.id);
  const { name } = req.body;

  await db.query(
    "UPDATE paymentForm SET name = $1 WHERE id = $2",
    [name, paymentFormId]
  );

  res.status(200).send({ message: "PaymentForm Updated Successfully!" });
};

// ==> Método responsável por excluir uma 'Forma de Pagamento' pelo 'Id':

exports.deletePaymentForm = async (req, res) => {
  const paymentFormId = parseInt(req.params.id);

  const hasPaymentForm = await db.query('SELECT * FROM paymentForm WHERE id = $1', [paymentFormId]);

  if (hasPaymentForm.rows.length < 1) {
    return res.status(500).send({ message: 'Não foi encontrada nenhuma forma de pagamento', paymentFormId });
  }

  await db.query('UPDATE paymentForm SET visible = false WHERE id = $1', [
    paymentFormId
  ]);

  res.status(200).send({ message: 'PaymentForm deleted successfully!', paymentFormId });

};