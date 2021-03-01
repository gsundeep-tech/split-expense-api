from abc import  ABC, abstractmethod
import tabula

class ParserInterface(ABC):

    def __init__(self, file_path, file_type):
        if file_type == 'pdf':
            self.tables = tabula.read_pdf(file_path, pages='all', multiple_tables=True)
        else:
            raise Exception("Only Supporting PDF files")


    @abstractmethod
    def extract(self):
        pass