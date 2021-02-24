# About

A website to split expenses based on invoice

# Local setup

Application is built using python & flask-restplus as the backend and react for the front end. following are the steps required to setup the application in local computer

## Backend setup

Backend application uses postgres as the dependency, follow the steps to install the postgres through docker

### Application dependencies setup

1. install docker in your computer
2. pull the postgress image using the following command

   `docker pull postgres`

3. create the postgres container using the following command

   `docker run --name postgres-container-with-persistence -p 5432:5432 -v docker_postgres_dbdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=password -d postgres`

4. Download the DB Viewer application to connect and view database tables. Link: https://dbeaver.io/
5. Create a new connection in the dbeaver application, adding the following details

   `host: localhost port: 5432 Database: devdb username: postgres password: password`
   ![Dbeaver Database connectionn](./documentation/pictures/db_connection.png "Dbeaver Database connection")

### Installation of Application library Requirements

Application requirements can be install current system python runtime or we can create a virtual environment. In this local setup we will be using the anaconda environment for our setup

1. Install anaconda(individual edition) using link: https://www.anaconda.com/products/individual
2. create virtual environment using the following command

   `conda create -n expense python=3.7`

3. activate the environment using the conda activate method

   `conda activate expense`

4. navigate to split_expense_api and install the requirement.txt libraries using the following command

   `pip -r requirements.txt`

### Configuring the pycharm

1. Download and install pycharm(community edition) application using link: https://www.jetbrains.com/pycharm/download/
2. open the split-expense project in the pycharm
3. Change the interpreter settings by going to preferences -> project: split-expense -> python interpreter -> click on gear icon and select add interpreter -> select conda environment -> select exisiting environment and choose 'expense' from list.

### Executing the application

run the application by executing the file server.py

## Frontend setup
