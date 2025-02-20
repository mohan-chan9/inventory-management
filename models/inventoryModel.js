const pool = require('../config/db');

// Add a single inventory item
const addInventoryItem = async (productId, quantity, location) => {
  const query = `
    INSERT INTO inventory (product_id, quantity, location)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [productId, quantity, location];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Add multiple inventory items in bulk
const addInventoryItemsBulk = async (items) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertedItems = [];

    for (const item of items) {
      const query = `
        INSERT INTO inventory (product_id, quantity, location)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const values = [item.productId, item.quantity, item.location];
      const res = await client.query(query, values);
      insertedItems.push(res.rows[0]);
    }

    await client.query('COMMIT');
    return insertedItems;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Get inventory item by product and location
const getInventoryItemByProductAndLocation = async (productId, location) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_id = $1 AND location = $2
  `;
  const values = [productId, location];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Update inventory quantity
const updateInventoryQuantity = async (id, newQuantity) => {
  const query = `
    UPDATE inventory
    SET quantity = $1, last_updated = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const values = [newQuantity, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Get inventory items with optional filters
const getInventoryItems = async (filters) => {
  let query = `
    SELECT i.id, i.quantity, i.location, i.last_updated,
           p.id AS product_id, p.product_name, p.description, p.price,
           s.id AS subcategory_id, s.subcategory_name,
           c.id AS category_id, c.category_name
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    JOIN subcategories s ON p.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
    WHERE 1 = 1
  `;
  const values = [];
  let counter = 1;

  if (filters.category) {
    query += ` AND c.category_name = $${counter++}`;
    values.push(filters.category);
  }
  if (filters.subcategory) {
    query += ` AND s.subcategory_name = $${counter++}`;
    values.push(filters.subcategory);
  }
  if (filters.productName) {
    query += ` AND p.product_name ILIKE $${counter++}`;
    values.push(`%${filters.productName}%`);
  }
  if (filters.location) {
    query += ` AND i.location = $${counter++}`;
    values.push(filters.location);
  }

  const { rows } = await pool.query(query, values);
  return rows;
};

// Update inventory item
const updateInventory = async (id, updates) => {
  const fields = [];
  const values = [];
  let counter = 1;

  if (updates.quantity !== undefined) {
    fields.push(`quantity = $${counter++}`);
    values.push(updates.quantity);
  }
  if (updates.location !== undefined) {
    fields.push(`location = $${counter++}`);
    values.push(updates.location);
  }

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  values.push(id);

  const query = `
    UPDATE inventory
    SET ${fields.join(', ')}, last_updated = CURRENT_TIMESTAMP
    WHERE id = $${counter}
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Adjust inventory quantity (increase or decrease)
const adjustInventory = async (id, quantityChange) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query('SELECT quantity FROM inventory WHERE id = $1 FOR UPDATE', [id]);
    if (rows.length === 0) {
      throw new Error('Inventory item not found');
    }

    const currentQuantity = rows[0].quantity;
    const newQuantity = currentQuantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error('Insufficient stock quantity');
    }

    const updateQuery = `
      UPDATE inventory
      SET quantity = $1, last_updated = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const updateValues = [newQuantity, id];
    const updateResult = await client.query(updateQuery, updateValues);

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};


const generateInventoryReport = async (filters) => {
  const items = await getInventoryItems(filters);
  return items;
};


const generateStockReport = async (filters) => {
  let query = `
    SELECT i.id, i.quantity, i.location, i.last_updated,
           p.id AS product_id, p.product_name, p.description, p.price,
           s.id AS subcategory_id, s.subcategory_name,
           c.id AS category_id, c.category_name
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    JOIN subcategories s ON p.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
    WHERE 1=1
  `;
  const values = [];
  let index = 1;

  if (filters.threshold) {
    query += ` AND i.quantity <= $${index++}`;
    values.push(filters.threshold);
  }
  if (filters.category) {
    query += ` AND c.category_name = $${index++}`;
    values.push(filters.category);
  }
  if (filters.subcategory) {
    query += ` AND s.subcategory_name = $${index++}`;
    values.push(filters.subcategory);
  }

  const { rows } = await pool.query(query, values);
  return rows;
};





module.exports = {
addInventoryItem,
addInventoryItemsBulk,
getInventoryItems,
getInventoryItemByProductAndLocation,
updateInventoryQuantity,
updateInventory,
adjustInventory,
generateInventoryReport,
generateStockReport,
};
