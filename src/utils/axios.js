import axios from "axios";

export const baseURL = process.env.NODE_ENV === 'development' ? "/" : "/api/";

const instance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

const whiteList = ['/user/verifyEmail'];

instance.interceptors.request.use(
    (config) => {
        if (config.url.startsWith('/user') && !whiteList.includes(config.url) && window.localStorage.getItem('isVerify')) {
            document.location.href = '/verify';
        }
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        const { code } = response.data;
        if (code !== 200) {
            if (code === 401) {
                localStorage.removeItem ('userInfo');
                document.location.href = '/login';
            }
            if (code === 402) {
                document.location.href = '/verify';
                localStorage.setItem('isVerify', '1');
            }
            return Promise.reject(response.data);
        }

        return response.data;
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default instance;