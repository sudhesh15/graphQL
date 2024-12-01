const express = require('express');
const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');
const PORT = 8000;

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                name: String!
                username: String!
                email: String!
                phone: String!
            },
            type Todo {
                id: ID!
                title: String!
                completed: Boolean
                user: User
            },
            type Query{
                getTodos: [Todo]
                getUserDetails: [User]
                getUserById(id: ID!) : User
            }
        `,
        resolvers: {
            Todo:{
                user: async (todo) => {
                    try {
                        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`);
                        return response.data;
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                        throw new Error("Failed to fetch user data");
                    }
                },
            },
            Query: {
                getTodos: async ()=> (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getUserDetails: async ()=> (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
                getUserById: async (parent, {id})=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            }
        },
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use('/graphql', expressMiddleware(server));
    app.listen(PORT, ()=>{
        console.log(`Listening to PORT ${PORT}`);
    });
}

startServer();