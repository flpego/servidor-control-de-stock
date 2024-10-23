
CREATE TABLE roles (
    RID SERIAL PRIMARY KEY,
    NAME VARCHAR(64) NOT NULL UNIQUE CHECK (NAME IN('ADMIN', 'EMPLOYEE'))
)

CREATE TABLE USERS (
	UID SERIAL PRIMARY_KEY,
	EMAIL VARCHAR(64) NOT NULL UNIQUE,
	PASSWORD VARCHAR(32) NOT NULL,
	USERNAME VARCHAR(64),
    ROLE_ID INT REFERENCES ROLES(RID) 
)


CREATE TABLE PRODUCTS (
    PRODUCT_ID SERIAL PRIMARY KEY,  -- Identificador único del producto
    NAME VARCHAR(128) NOT NULL,  -- Nombre del producto
    DESCRIPTION TEXT,  -- Descripción opcional del producto
    PRICE DECIMAL(10, 2) NOT NULL,  -- Precio del producto
    STOCK INT DEFAULT 0,  -- Cantidad en stock
    CATEGORY VARCHAR(64),  -- Categoría a la que pertenece el producto
    SUPPLIER VARCHAR(64),  -- Proveedor del producto
    MIN_STOCK INT DEFAULT 0,  -- Stock mínimo para alertas
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Fecha de actualización
);

CREATE TABLE ORDERS (
    ORDER_ID SERIAL PRIMARY KEY,  -- Identificador único del pedido
    SUPPLIER VARCHAR(64),  -- Proveedor (ej. Coca-Cola)
    ORDER_DATE DATE NOT NULL,  -- Fecha en que se hace el pedido
    DELIVERY_DATE DATE,  -- Fecha en que se entrega
    TOTAL_AMOUNT DECIMAL(10, 2),  -- Monto total del pedido
    PAYMENT_METHOD VARCHAR(32),  -- Ej. Efectivo, Transferencia
    PAYMENT_AMOUNT DECIMAL(10, 2),  -- Monto abonado
    INVOICE_PATH VARCHAR(255),  -- Ruta al archivo de factura (si se adjunta)
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE ORDER_PRODUCTS (
    ORDER_ID INT REFERENCES ORDERS(ORDER_ID),  -- Clave foránea de la tabla ORDERS
    PRODUCT_ID INT REFERENCES PRODUCTS(PRODUCT_ID),  -- Clave foránea de la tabla PRODUCTS
    QUANTITY INT NOT NULL,  -- Cantidad del producto en el pedido
    PRIMARY KEY (ORDER_ID, PRODUCT_ID)
);
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) -- Ejemplo: efectivo, tarjeta, etc.
);

CREATE TABLE sale_items (
    sale_item_id SERIAL PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_sale NUMERIC(10, 2) NOT NULL, -- Precio al momento de la venta
    CONSTRAINT fk_sale FOREIGN KEY (sale_id) REFERENCES sales(sale_id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);


