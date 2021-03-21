import json
import tabula
import pandas as pd

from split_expenses_api.api.utils.parsers.parserInterface import ParserInterface
from split_expenses_api.api.constants import LazadaRedmartConstants, InvoiceKeywords


REDMART_HEADER_TABLE_IDENTIFICATION_KEYWORD = "Redmart Subtotal"
REDMART_LINE_ITEM_TABLE_IDENTIFICATION_KEYWORD = "S/N"


class LazadaParser(ParserInterface):
    
    def __init__(self, file_path, file_type):

        if file_type == 'pdf':
            self.tables = tabula.read_pdf(file_path, pages='all', multiple_tables=True)
            if len(self.tables) == 0:
                return {"error": "tables are not extracted"}
        else:
            raise Exception("Lazada Parser only Supports PDF files")

        """
        Only total, delivery fee, discount and net amount paid are displayed. 
        Subtotal is not being displayed as there can be different types of subtotal and 
        we are only concerned with total
        """
        self.redmart_header_keywords_map = {
            LazadaRedmartConstants.REDMART_DELIVERY_FEE: InvoiceKeywords.DELIVERY_FEE,
            LazadaRedmartConstants.REDMART_TOTAL: InvoiceKeywords.TOTAL,
            LazadaRedmartConstants.REDMART_DISCOUNT: InvoiceKeywords.DISCOUNT,
            LazadaRedmartConstants.REDMART_NET_AMOUNT: InvoiceKeywords.NET_AMOUNT
        }

    def extract(self):

        # Extract the header item values
        header_items_values = self.__get_redmart_header_item_values()

        # Extract the line item values
        line_item_values = self.__get_redmart_line_items_values()

        # validating the retrieved headers and line items
        validation_status = self.validate(header_items_values, line_item_values)

        return header_items_values, line_item_values, validation_status


    def validate(self, header_item_values, line_item_values):

        messages = []
        messages.append(self.__validate_net_amount(header_item_values))
        messages.append(self.__validate_total(header_item_values, line_item_values))
        return " ; ".join(messages)

    def __validate_net_amount(self, header_item_values):
        if header_item_values[InvoiceKeywords.NET_AMOUNT] == header_item_values[InvoiceKeywords.TOTAL] - header_item_values[InvoiceKeywords.DISCOUNT]:
            return "Net Amount & Total Amount is correct"
        return "Net Amount is wrong"

    def __validate_total(self, header_item_values, line_item_values):
        total = header_item_values[InvoiceKeywords.TOTAL]
        line_item_total = 0
        for _row in line_item_values:
            line_item_total += _row['price']
            line_item_total = float("{:.2f}".format(line_item_total))

        if total == line_item_total:
            return "All products sum equal to total"
        return "All product sum not equal to total value, header total: {}, line_item_total: {}, difference: {:.2f}".format(total, line_item_total, abs(total-line_item_total))

    def __get_table_index(self, identification_keyword, stop=True):
        idx = 0
        table_indexes = []
        for table in self.tables:
            content = table.values[0][0]
            if identification_keyword in content:
                table_indexes.append(idx)
                if stop:
                    break
            idx += 1
        return table_indexes


    def __get_redmart_header_item_values(self):
        """
        returns: json having the header items
        """

        table_indexes = self.__get_table_index(identification_keyword=REDMART_HEADER_TABLE_IDENTIFICATION_KEYWORD)
        if len(table_indexes) > 0:
            idx = table_indexes[0]
        else:
            return {}

        content = self.tables[idx][0][0]
        rows = content.split('\r')

        # Extracting the header items
        header_items_json = {}
        for key in self.redmart_header_keywords_map.keys():
            price = self.__get_header_items_price(rows, key)
            if price == "FREE":
                price = 0
            if price is None:
                continue
            header_items_json[self.redmart_header_keywords_map[key]] = float(price)

        # check if discount is returned
        if InvoiceKeywords.DISCOUNT not in header_items_json:
            header_items_json[InvoiceKeywords.DISCOUNT] = 0
        else:
            header_items_json[InvoiceKeywords.DISCOUNT] = abs(header_items_json[InvoiceKeywords.DISCOUNT])

        # check if net amount is returned
        # if net amount is not present then assigning total to net amount
        if InvoiceKeywords.NET_AMOUNT not in header_items_json:
            header_items_json[InvoiceKeywords.NET_AMOUNT] = header_items_json[InvoiceKeywords.TOTAL]
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
        table_indexes = self.__get_table_index(identification_keyword=REDMART_LINE_ITEM_TABLE_IDENTIFICATION_KEYWORD,
                                               stop=False)
        if len(table_indexes) == 0:
            return []

        complete_items_table = pd.DataFrame(columns=['S/N', 'Description', 'Qty', 'Unit Price', 'Total Price'])
        for idx in table_indexes:
            items_table = self.tables[idx]
            items_table.columns = items_table.iloc[0]
            # Removing the first row as it is a header
            items_table = items_table[1:]
            # Removing the last row as it contains the value
            items_table = items_table[:-1]
            complete_items_table = complete_items_table.append(items_table, ignore_index=True)

        rows_json = [json.loads(row) for row in complete_items_table.to_json(orient='records', lines=True).splitlines()]
        idx = 1
        for _row in rows_json:
            values = _row['Total Price'].split('SGD')
            _row['price'] = float(values[-1])
            _row['id'] = idx
            _row['product_name'] = _row['Description']
            _row['quantity'] = _row['Qty']
            _row['totalPrice'] = _row['Total Price']
            _row['unitPrice'] = _row['Unit Price']
            del _row['Description']
            del _row['Qty']
            del _row['Total Price']
            del _row['Unit Price']
            del _row['S/N']
            idx += 1
        return rows_json
