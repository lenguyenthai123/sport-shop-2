let loginButton = document.querySelector("#login");
let signUpButtom = document.querySelector("#signup");
let usernameDom = document.querySelector("#username");
let passwordDom = document.querySelector("#password");
let formDom = document.querySelector("form");

const instance = axios.create({
    baseURL: 'http://localhost:8080/',

});
formDom.addEventListener("submit", async (e) => {
    let username = usernameDom.value;
    let password = passwordDom.value;
    e.preventDefault();

    try {

        const { data } = await axios.post("login", {
            username,
            password
        });

        // Clear data;
        username = "";
        password = "";

        let { successfully, token } = data;
        console.log(token);
        console.log("hahaha");
        if (successfully) {

            localStorage.setItem("token", token);
            await axios.get('/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    // Xử lý trang dashboard
                    console.log(response.data);

                    // Chuyển hướng người dùng sang trang Dashboard (nếu cần)
                    // window.location.href = '/dashboard';
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                });


            alert("Login successfully!");
            window.location.href = '/dashboard';

        }
        else {
            alert("Incorrect password or username!");


        }
        // token = "";
        // successfully = "";

    } catch (error) {
        localStorage.removeItem("token");
        alert("Error");
    }
});
