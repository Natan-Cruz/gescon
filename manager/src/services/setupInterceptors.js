import axiosInstance from "./api";
import { getLocalAccessToken } from "../auth/Session"
import { useStore } from "../store/user"

const setup = () => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = getLocalAccessToken();
            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            console.error(err)
            const originalConfig = err.config;
             // Access Token was expired
            if (originalConfig.url !== "/users/authenticate" && err.response) {
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;

                    try {
                        // const rs = await axiosInstance.post("/users/refresh-token", {
                        //     refreshToken: getLocalRefreshToken()
                        // });

                        // const { accessToken } = rs.data;

                        const store = useStore();
                        store.closeSession()

                        return axiosInstance(originalConfig);
                    } catch (_error) {
                        return Promise.reject(_error);
                    }
                }
            }
            return Promise.reject(err)
            // if (err.response) {
            //     if(err.response.data.name === "GesconError")
            //         return Promise.reject(err.response.data.message);
            //     else
            //         return Promise.reject("Ops, ocorreu um problema")
            // }else if (err.request) {
            //     if (err.message === "Network Error") 
            //         return Promise.reject('Ops, problema com a conexão com a internet, por favor tente novamente!')
                
            //     return Promise.reject('Ops, deu um problema, por favor tente novamente!')            
            // } else {
            //     return Promise.reject(err.message)
            // }
        }
    );
};

export default setup;