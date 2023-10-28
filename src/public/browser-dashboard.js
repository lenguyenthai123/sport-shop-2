const { default: axios } = require("axios");

const token = localStorage.getItem('token');


const instance = axios.create({
    baseURL: 'http://localhost:8080/',

});

const getDataSecret = async () => {
    const data = await instance.get("dashboard", {
        headers:
        {
            Authorization: `Bearer ${token}`,
        }
    })
    document.innerHTML += `<p> ${data}`;
}
getDataSecret();
