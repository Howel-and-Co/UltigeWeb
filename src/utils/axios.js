import axios from 'axios';
import Cookies from "js-cookie";

const token = Cookies.get("token");

axios.defaults.headers.common = {
    "Client-ID": 'bc1bc16f819a0b9574b20a6512028710',
    'Authorization': token ? `${token}` : ""
}

export default axios;