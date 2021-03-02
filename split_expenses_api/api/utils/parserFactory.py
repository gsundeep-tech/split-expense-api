from split_expenses_api.api.constants import CompanyInvoices, ReceiptFormat
from split_expenses_api.api.utils.parsers.LazadaParser import LazadaParser

class ParserFactory:

    def __init__(self, file_path, invoice_company='lazada_redmart', file_type='pdf'):
        self.file_path = file_path
        self.invoice_company = invoice_company
        self.file_type = file_type


    def extract(self):

        if self.invoice_company == CompanyInvoices.LAZADA_REDMART and self.file_type == ReceiptFormat.PDF:
            parser = LazadaParser(self.file_path, self.file_type)
            return parser.extract()
        else:
            raise Exception("Remaining formats are not yet supported")

if __name__ == "__main__":
    import os

    pdf_dir_path = os.path.dirname(__file__) + '/../../tests/resources/lazada_redmart/'
   
    _files = os.listdir(pdf_dir_path)
    for _file in _files:
        file_path = pdf_dir_path + _file
        pdf_parser = ParserFactory(file_path=file_path)
        header_items_values, line_item_values, validation_status = pdf_parser.extract()

        print('**************************')
        print(header_items_values)
        print(line_item_values)
        print(validation_status)
        print()
