import { ApolloServer, UserInputError, gql } from "apollo-server";
import { v4 as uuidv4 } from "uuid";

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
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String!
      street: String!
      city: String!
    ): Person
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
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(({ name }) => name === args.name)) {
        throw new UserInputError("Name must be unique", {
          InvalidArgs: args.name,
        });
      }

      const person = { ...args, id: uuidv4() };
      persons.push(person);

      return person;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
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
