import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:3001",

  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default server;
