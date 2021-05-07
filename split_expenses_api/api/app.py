from flask import Flask, Blueprint
from flask_restplus import Api
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix


def create_app():

    app = Flask(__name__)
    CORS(app)
    app.wsgi_app = ProxyFix(app.wsgi_app)

    app.config['DEBUG'] = True

    blueprint = Blueprint("api", __name__, url_prefix="/api")

    api = Api(blueprint, version="1.0", title="Split Expenses",
              description="API for splitting the expenses")

    from split_expenses_api.api.modules.users import \
        controller as UserController
    api.add_namespace(UserController.namespace, path="/user")

    from split_expenses_api.api.modules.products import \
        controller as ProdcutsController
    api.add_namespace(ProdcutsController.namespace, path="/product")

    create_db()

    app.register_blueprint(blueprint)
    return app


def create_db():

    from sqlalchemy import DDL
    from sqlalchemy import event
    from split_expenses_api.api.database import Base, \
        db_engine, get_default_schema

    default_schema = get_default_schema()
    event.listen(Base.metadata, 'before_create',
                 DDL("CREATE SCHEMA IF NOT EXISTS {}".format(default_schema)),
                 once=True)
    Base.metadata.create_all(db_engine)
