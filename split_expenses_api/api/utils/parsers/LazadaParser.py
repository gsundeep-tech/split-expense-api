"""
TODO:
1. Currently extracting the first table even though we are reading all pages, Supporting of extraction of all pages
2. Creating a factory method to support the other invoices as well
3. Better logging functionality
4. Constants
"""

import os
import json

from split_expenses_api.api.utils.parsers.parserInterface import ParserInterface
from split_expenses_api.api.constants import LazadaRedmartConstants, InvoiceKeywords


header_items_map = {
    "Redmart Subtotal": "redmart_subtotal",
    "Delivery Fee": "delivery_fee",
    "Total": "total",
    "**Lazada Discount": "lazada_discount",
    "Nett Amount Paid": "nett_amount_paid"
}

class LazadaParser(ParserInterface):
    
    def __init__(self):
        super(LazadaParser, self).__init__()
        self.table_visited = [False] * len(self.tables)
        self.useful_table = [False] * len(self.tables)

    def extract(self):

        # Extract the header item values
        header_items_values = self.__get_redmart_header_item_values()

        # Extract the line item values
        line_item_values = self.__get_redmart_line_items_values()

        return header_items_values, line_item_values

    def __get_table_index(self, keyword):
        idx = 0
        for table in self.tables:
            content = table[0][0]
            if keyword in content:
                break
            idx += 1
        return idx


    def __get_redmart_header_item_values(self):

        # Identifying the table which contains the header
        # items information
        idx = self.__get_table_index(keyword="Redmart Subtotal")
        content = self.tables[idx][0][0]
        rows = content.split('\r')

        # Extracting the header items
        header_items_json = {}
        for key in header_items_map.keys():
            price = self.__get_header_items_price(rows, key)
            if price == "FREE":
                price = 0
            if price is None:
                continue
            header_items_json[header_items_map[key]] = float(price)
        return header_items_json

    def __get_header_items_price(self, rows, key):

        try:
            for _row in rows:
                if key in _row:
                    subtotal_with_sgd = _row.split(key)
                    price_values = subtotal_with_sgd[-1].split('SGD')
                    price = price_values[-1]
                    return price
            return None
        except:
            print("Exception while parsing the data")

    def __get_redmart_line_items_values(self):
        idx = self.__get_table_index(keyword="S/N")
        items_table = self.tables[idx]
        items_table.columns = items_table.iloc[0]
        # Removing the first row as it is a header
        items_table = items_table[1:]
        # Removing the last row as it contains the value
        items_table = items_table[:-1]

        rows_json = [json.loads(row) for row in items_table.to_json(orient='records', lines=True).splitlines()]
        for _row in rows_json:
            values = _row['Total Price'].split('SGD')
            _row['price'] = float(values[-1])
        return rows_json

if __name__ == "__main__":
    # _file = 'lazada.pdf'
    # pdf_dir_path = os.path.dirname(__file__) + '/tmp/'
    # file_path = pdf_dir_path + _file

    file_path = '/Users/I329382/Documents/Github/Split-Expenses/split_expenses_api/tmp/lazada.pdf'
    pdf_parser = LazadaParser(file_path)
    header_items_values, line_item_values = pdf_parser.extract()

    print(header_items_values)
    print(line_item_values)

