CREATE TABLE IF NOT EXISTS categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

DROP TABLE IF EXISTS catalogo;

CREATE TABLE IF NOT EXISTS producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  categoria_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado ENUM('pendiente', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente'
);

CREATE TABLE IF NOT EXISTS item_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedido(id)
    ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES producto(id)
);

INSERT INTO categoria (nombre, descripcion) VALUES
  ('Electrónica', 'Dispositivos y accesorios electrónicos'),
  ('Ropa', 'Prendas de vestir'),
  ('Hogar', 'Artículos para el hogar');

INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id) VALUES
  ('Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido', 45.99, 20, 1),
  ('Camiseta básica', 'Camiseta de algodón 100%', 12.50, 50, 2),
  ('Lámpara de escritorio', 'Lámpara LED regulable', 22.00, 15, 3),
  ('Cargador USB-C', 'Cargador rápido 20W', 15.75, 3, 1);