import axios from 'axios';
import Cookies from "js-cookie";

const token = Cookies.get("token");

axios.defaults.headers.common = {
    "Client-ID": '8572d3838a0e2b9b4de63e6c72e3ab5d',
    'Authorization': token ? `${token}` : ""
}

export default axios;