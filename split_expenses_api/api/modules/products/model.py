from sqlalchemy import Table, Column, String, Float, Integer
from split_expenses_api.api.database import get_metadata
from sqlalchemy import select

class ProductsModel:
    def __init__(self, conn, additional_cols: list = []):
        metadata = get_metadata()
        self.table_name = "products"
        self.conn = conn
        self.table = Table(self.table_name, metadata,
                           Column("product_name", String(128), nullable=False),
                           Column("price", Float, nullable=False),
                           Column("quantity", Integer))

        if len(additional_cols) > 0:
            for col in additional_cols:
                self.table.append_column(col)

        self.table.create(bind=self.conn, checkfirst=True)

    def get_product_by_id(self, product_id):
        stmt = select([self.table]).where(self.table.c.product_name == product_id)
        result = self.conn.execute(stmt).fetchone()
        return {
            "product_name": result[0],
            "price": result[1],
            "quantity": result[2]
        }

    def get_products(self):
        stmt = select([self.table])
        result = self.conn.execute(stmt).fetchall()
        response = list()
        for row in result:
            response.append({
                "product_name": row[0],
                "price": row[1],
                "quantity": row[2]
                })
        return response

    def insert_product(self, prodcut_id, price, quantity):
        record = {
            "product_name": prodcut_id,
            "price": price,
            "quantity": quantity
        }
        stmt = self.table.insert(record)
        result = self.conn.execute(stmt).rowcount
        return result

    def delete_product(self, product_id):
        stmt = self.table.delete(self.table.c.product_name == product_id)
        result = self.conn.execute(stmt).rowcount
        return result
