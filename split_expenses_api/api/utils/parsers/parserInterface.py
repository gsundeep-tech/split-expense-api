from abc import  ABC, abstractmethod

class ParserInterface(ABC):

    @abstractmethod
    def extract(self):
        pass