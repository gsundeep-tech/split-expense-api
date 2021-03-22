from sqlalchemy import Table, Column, String, Integer
from sqlalchemy import select
from split_expenses_api.api.database import get_metadata


class UserModel:
    def __init__(self, conn, additional_cols: list = []):
        metadata = get_metadata()
        self.conn = conn
        self.table_name = "users"
        self.table = Table(self.table_name, metadata,
                           Column("user_id", Integer, primary_key=True,
                                  autoincrement=True),
                           Column("user_name", String(64), nullable=False),
                           Column("phone_number", String(13)),
                           Column("email", String(64))
                           )
        if len(additional_cols) > 0:
            for col in additional_cols:
                self.table.append_column(col)
        self.table.create(bind=self.conn, checkfirst=True)

    def get_user_by_id(self, user_id):
        stmt = select([self.table]).where(self.table.c.user_id == user_id)
        result = self.conn.execute(stmt).fetchone()
        if result:
            return {
                "user_id": result[0],
                "user_name": result[1],
                "phone_number": result[2],
                "email": result[3]
            }
        return {"error": "No users found"}

    def get_users(self):
        stmt = select([self.table])
        results = self.conn.execute(stmt).fetchall()
        response = list()
        for row in results:
            response.append({"user_id": row[0],
                             "user_name": row[1],
                             "phone_number": row[2],
                             "email": row[3]})
        return response

    def insert_user(self, username, phone_number, email):
        record = {
            "user_name": username,
            "phone_number": phone_number,
            "email": email
        }
        stmt = self.table.insert(record)
        self.conn.execute(stmt)
        return True

    def delete_user(self, user_id):
        stmt = self.table.delete(self.table.c.user_id == user_id)
        result = self.conn.execute(stmt)
        return result.rowcount
