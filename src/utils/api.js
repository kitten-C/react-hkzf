import { axios } from "axios";

import { BASE_URL } from "./url";

 const API = axios.create({
  baseUrl: BASE_URL
})

export API