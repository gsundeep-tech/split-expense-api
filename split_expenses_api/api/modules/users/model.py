from sqlalchemy import Table, Column, String
from sqlalchemy import select
from split_expenses_api.api.database import get_metadata

class UserModel:
    def __init__(self, conn, additional_cols: list = []):
        metadata = get_metadata()
        self.conn = conn
        self.table_name = "users"
        self.table = Table(self.table_name, metadata,
                           Column("username", String(64), nullable=False),
                           Column("phone_number", String(13)),
                           Column("email", String(64))
                           )
        if len(additional_cols) > 0:
            for col in additional_cols:
                self.table.append_column(col)
        self.table.create(bind=self.conn, checkfirst=True)

    def get_user_by_id(self, user_id):
        stmt = select([self.table]).where(self.table.c.username == user_id)
        result = self.conn.execute(stmt).fetchone()
        return {
            "username": result[0],
            "phone_number": result[1],
            "email": result[2]
        }

    def get_users(self):
        stmt = select([self.table])
        results = self.conn.execute(stmt).fetchall()
        response = list()
        for row in results:
            response.append({"username": row[0], "phone_number": row[1], "email": row[2]})
        return response

    def insert_user(self, username, phone_number, email):
        record = {
            "username": username,
            "phone_number": phone_number,
            "email": email
        }
        stmt = self.table.insert(record)
        self.conn.execute(stmt)
        return True

    def delete_user(self, username):
        stmt = self.table.delete(self.table.c.username == username)
        result = self.conn.execute(stmt)
        return result.rowcount