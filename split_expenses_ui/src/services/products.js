import axios from 'axios';
import config from './endpoints';
import Swal from 'sweetalert2';
import FormData from 'form-data';

export const getProducts = () => {
  const url = config['baseProductsURL'];
  return axios
    .get(url)
    .then(function(response) {
      // handle success
      //   console.log(response.data);
      let products = response.data;
      for (let i = 0; i < products.length; i++) {
        products[i]['id'] = i + 1;
      }
      console.log(products);
      return products;
    })
    .catch(function(error) {
      // handle error
      console.log(error);
      Swal.fire({
        title: 'Error!',
        text: 'Error while fetching products data',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    });
};

export const getProductsFromInvoice = _file => {
  const url = config['baseProductsURL'] + '/upload';

  const form = new FormData();
  form.append('file', _file);

  return axios
    .post(url, form)
    .then(function(response) {
      let products = response.data;
      for (let i = 0; i < products.length; i++) {
        products[i]['id'] = i + 1;
      }
      // console.log(products);
      return products;
    })
    .catch(function(error) {
      // handle error
      console.log(error);
      Swal.fire({
        title: 'Error!',
        text: 'Error while fetching products data',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    });
};

export const postProducts = payload => {
  const url = config['baseProductsURL'];
  const { product_name, product_price, product_qty } = payload;
  const form = new FormData();
  form.append('product_name', product_name);
  form.append('price', product_price);
  form.append('quantity', product_qty);

  return axios
    .post(url, form)
    .then(function(response) {
      const responseMsg = response.data;
      Swal.fire({
        title: 'Good job!',
        text: responseMsg,
        icon: 'success',
      });
    })
    .catch(function(error) {
      // handle error
      console.log(error);
      Swal.fire({
        title: 'Error!',
        text: 'Error while posting product data',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    });
};
