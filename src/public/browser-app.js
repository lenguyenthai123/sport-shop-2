let loginButton = document.querySelector("#login");
let signUpButtom = document.querySelector("#signup");
let usernameDom = document.querySelector("#username");
let passwordDom = document.querySelector("#password");
let formDom = document.querySelector("form");

const instance = axios.create({
    baseURL: 'http://localhost:8080/',

});
// formDom.addEventListener("submit", async (e) => {
//     let username = usernameDom.value;
//     let password = passwordDom.value;

//     try {

//         const { data } = await axios.post("login", {
//             username,
//             password
//         });

//         alert(data);
//         // Clear data;
//         username = "";
//         password = "";

//         let { successfully } = data;
//         console.log(data);
//         if (successfully) {

//             // await axios.get('/dashboard', {
//             //     headers: {
//             //         'Authorization': `Bearer ${token}`
//             //     }
//             // })
//             //     .then(response => {
//             //         // Xử lý trang dashboard
//             //         console.log(response.data);

//             //         // Chuyển hướng người dùng sang trang Dashboard (nếu cần)
//             //         // window.location.href = '/dashboard';
//             //     })
//             //     .catch(error => {
//             //         console.error('Lỗi:', error);
//             //     });

//         }
//         else {
//             e.preventDefault();

//             alert("Incorrect password or username!");
//         }
//         // token = "";
//         // successfully = "";

//     } catch (error) {
//         alert(error);
//     }
// });
