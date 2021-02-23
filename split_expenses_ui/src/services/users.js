import axios from "axios";
import config from "./endpoints";
import Swal from "sweetalert2";

export const getusers = () => {
  const url = config["baseUsersURL"];
  return axios
    .get(url)
    .then(function (response) {
      // handle success
      //   console.log(response.data);
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
