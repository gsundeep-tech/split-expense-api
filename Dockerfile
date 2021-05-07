FROM python:3.7.10-alpine

RUN apk update \
  && apk upgrade \
  && apk add --no-cache openjdk8-jre

WORKDIR /home/expense

COPY split_expenses_api ./split_expenses_api

WORKDIR /home/expense/split_expenses_api

ENV PYTHONPATH "${PYTHONPATH}:/home/expense/"
ENV JAVA_HOME="/usr/lib/jvm/java-1.8-openjdk"

# psycopg2 is a py2.x library so we need to install it explicity
RUN apk update \
  && apk add --virtual build-deps gcc python3-dev musl-dev \
  && apk add postgresql-dev \
  && pip install psycopg2 \
  && apk del build-deps

# Following line is required for building the numpy and pandas 
RUN apk --no-cache --update-cache add gcc gfortran build-base wget freetype-dev libpng-dev openblas-dev

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "server.py"]