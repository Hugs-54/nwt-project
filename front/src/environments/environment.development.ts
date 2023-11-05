export const environment = {
    production: true,
    backend: {
        protocol: 'http',
        host: 'localhost',
        port: '3000',
        endpoints: {
            allQuiz: '/quiz',
            createQuiz: '/quiz',
            oneQuiz: '/quiz/:id',
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout',
            myQuiz: '/quiz/my-quiz',
        },
    },
};
