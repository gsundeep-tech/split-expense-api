from flask_restplus import Namespace, Resource
from split_expenses_api.api.database import db_engine
from split_expenses_api.api.modules.users.model import UserModel

namespace = Namespace("users", description="API to manage users")

user_parser = namespace.parser()
user_parser.add_argument("user_name", type=str, required=True, location='form', help='User name')
user_parser.add_argument("phone_number", type=str, required=False, location='form', help="Enter the phone number with country code")
user_parser.add_argument("email", type=str, required=False, location='form', help='Enter the email address')

@namespace.route("")
class UsersListController(Resource):
    def get(self):
        with db_engine.begin() as conn:
            user_model = UserModel(conn)
            users = user_model.get_users()
            return users, 200

    @namespace.expect(user_parser, validate=False)
    def post(self):
        args = user_parser.parse_args()
        username = args.get("user_name")
        phone_number = args.get("phone_number")
        email = args.get("email")
        with db_engine.begin() as conn:
            user_model = UserModel(conn)
            user_model.insert_user(username, phone_number, email)
            return "User {} Saved successfully".format(username), 201


@namespace.route("/<string:user_id>")
class UserController(Resource):
    def get(self, user_id):
        with db_engine.begin() as conn:
            user_model = UserModel(conn)
            response = user_model.get_user_by_id(user_id)
            return response, 200

    def delete(self, user_id):
        with db_engine.begin() as conn:
            user_model = UserModel(conn)
            row_count = user_model.delete_user(user_id)
            if row_count > 0:
                return "deleted user with id {}".format(user_id), 200
            return "User not found", 404