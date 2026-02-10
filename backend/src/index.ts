import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs";
import { marginResolvers } from "./resolvers/marginResolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers: marginResolvers,
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`Server ready at ${url}`);
}

main();
