import axios from "axios";
import config from "./endpoints";
import Swal from "sweetalert2";

export const getUsers = () => {
  const url = config["baseUsersURL"];
  return axios
    .get(url)
    .then(function (response) {
      let users = response.data;
      for (let i = 0; i < users.length; i++) {
        users[i]["id"] = i + 1;
      }
      console.log(users);
      return users;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Error while fetching users data",
        icon: "error",
        confirmButtonText: "Ok",
      });
    });
};

export const postUsers = (payload) => {
  const url = config["baseUsersURL"];
  const { userName, emailId, phoneNumber } = payload;
  const form = new FormData();
  form.append('username', userName);
  form.append('email', emailId);
  form.append('phone_number', phoneNumber);
  
  return axios
    .post(url, form)
    .then(function (response) {
      const responseMsg = response.data;
      Swal.fire({
        title: "Good job!",
        text: responseMsg,
        icon: "success",
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Error while posting users data",
        icon: "error",
        confirmButtonText: "Ok",
      });
    });
};
