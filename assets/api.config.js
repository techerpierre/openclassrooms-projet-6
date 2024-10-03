const ApiConfig = {
    baseUrl: "http://localhost:5678/api",
    routes: {
        users: {
            path: "/users",
            login: {
                path: "/users/login"
            }
        },
        categories: {
            path: "/categories"
        },
        works: {
            path: "/works"
        }
    }
}

export default ApiConfig
