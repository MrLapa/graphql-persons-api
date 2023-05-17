const { ApolloServer, gql } = require("apollo-server");

const persons = [
  {
    name: "Carlos",
    phone: "319-999999",
    street: "novena",
    city: "Bogota",
    id: "111",
  },
  {
    name: "Isis",
    phone: "317-777777",
    street: "Cero",
    city: "Cucuta",
    id: "222",
  },
  {
    name: "Jesus",
    street: "septima",
    city: "Cali",
    id: "333",
  },
];

const typeDefs = gql`
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (parent, args) => {
      const { name } = args;
      return persons.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      );
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
