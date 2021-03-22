from sqlalchemy import Table, Column, String, Float, Integer
from split_expenses_api.api.database import get_metadata
from sqlalchemy import select


class ProductsModel:
    def __init__(self, conn, additional_cols: list = []):
        metadata = get_metadata()
        self.table_name = "products"
        self.conn = conn
        self.table = Table(self.table_name, metadata,
                           Column("product_id", Integer, primary_key=True,
                                  autoincrement=True),
                           Column("product_name", String(128), nullable=False),
                           Column("price", Float, nullable=False),
                           Column("quantity", Integer))

        if len(additional_cols) > 0:
            for col in additional_cols:
                self.table.append_column(col)

        self.table.create(bind=self.conn, checkfirst=True)

    def get_product_by_id(self, product_id):
        stmt = select([self.table]).where(
                                    self.table.c.product_id == product_id)
        result = self.conn.execute(stmt).fetchone()
        if result:
            return {
                "product_id": result[0],
                "product_name": result[1],
                "price": result[2],
                "quantity": result[3]
            }
        return {"error": "No product found"}

    def get_products(self):
        stmt = select([self.table])
        result = self.conn.execute(stmt).fetchall()
        response = list()
        for row in result:
            response.append({
                "product_id": row[0],
                "product_name": row[1],
                "price": row[2],
                "quantity": row[3]
                })
        return response

    def insert_product(self, prodcut_name, price, quantity):
        record = {
            "product_name": prodcut_name,
            "price": price,
            "quantity": quantity
        }
        stmt = self.table.insert(record)
        result = self.conn.execute(stmt).rowcount
        return result

    def delete_product(self, product_id):
        stmt = self.table.delete(self.table.c.product_id == product_id)
        result = self.conn.execute(stmt).rowcount
        return result
