import axios from 'axios';
import Cookies from "js-cookie";

const token = Cookies.get("token");

axios.defaults.headers.common = {
    "Client-ID": 'db3b00c9066d8fc6d9b97a97bb7018d74e448871',
    'Authorization': token ? `${token}` : ""
}

export default axios;