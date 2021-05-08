import os
import tempfile
from flask import request
from flask_restplus import Namespace, Resource
from werkzeug.datastructures import FileStorage
from werkzeug import secure_filename

from split_expenses_api.api.database import db_engine
from split_expenses_api.api.modules.products.model import ProductsModel
from split_expenses_api.api.utils.parserFactory import ParserFactory

namespace = Namespace("products", description="API to manage products")

product_parser = namespace.parser()
product_parser.add_argument("product_name", str, required=True,
                            location='form',
                            help='Product name')
product_parser.add_argument("price", float, required=False, location='form',
                            help='product price')
product_parser.add_argument("quantity", float, required=False, location='form',
                            help='product quantity')

invoice_parser = namespace.parser()
invoice_parser.add_argument('file', type=FileStorage, required=True,
                            location='files',
                            help='Lazada pdf invoice')


@namespace.route("")
class ProductsController(Resource):
    def get(self):
        with db_engine.begin() as conn:
            products_model = ProductsModel(conn)
            results = products_model.get_products()
            return results, 200

    @namespace.expect(product_parser, validate=False)
    def post(self):
        return "service disabled temporarily", 201
        args = product_parser.parse_args()
        with db_engine.begin() as conn:
            products_model = ProductsModel(conn)
            result = products_model.insert_product(args.get('product_name'),
                                                   args.get('price'),
                                                   args.get('quantity'))
            if result > 0:
                message = "product {} saved successfully".format(
                    args.get('product_name'))
                return message, 201


@namespace.route("/<string:product_id>")
class ProductController(Resource):
    def get(self, product_id):
        with db_engine.begin() as conn:
            products_model = ProductsModel(conn)
            result = products_model.get_product_by_id(product_id)
            return result, 200

    def delete(self, product_id):
        return "service disabled temporarily", 200
        with db_engine.begin() as conn:
            products_model = ProductsModel(conn)
            result = products_model.delete_product(product_id)
            if result > 0:
                return "product id {} deleted".format(product_id), 200
            return "no product found", 404


@namespace.route("/upload")
class ProductsInvoiceUpload(Resource):
    @namespace.expect(invoice_parser, validate=False)
    def post(self):
        _file = request.files.get('file')
        filename = secure_filename(_file.filename)
        with tempfile.TemporaryDirectory() as tmpdir:
            tmp_file_path = os.path.join(tmpdir, filename)
            _file.save(tmp_file_path)
            pdf_parser = ParserFactory(tmp_file_path)
            header_items_values, line_item_values, \
                validation_status = pdf_parser.extract()
            response = {
                "header": header_items_values,
                "products": line_item_values
            }
            return response, 200
