const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

async function main() {

    //Create a new linnk
    const newLink = await prisma.createLink({
        url: 'www.prisma.io',
        description: 'Prisma replaces traditional ORMs',
    })
    console.log(`Created new link: ${newLink.url} (ID: ${newLink.id})`)

    //Read all the links from the database and print them to the console
    const allLinks = await prisma.links()
    console.log(allLinks)
}
main().catch(e => console.log.error(e))

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: (root, args, context, info) => {
            return context.prisma.links()
        }
    },
    Mutation: {
        post: (root, args, context) => {
            return context.prisma.createLink({
                url: args.url,
                description: args.description
            })
        }
    },
    /*Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url
    }*/
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: { prisma }
})
server.start(() => console.log(`Server is running on http://localhost:4000`))