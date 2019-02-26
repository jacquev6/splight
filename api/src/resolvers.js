module.exports = {
  Query: {
    viewer (_, __, { viewer }) {
      if (viewer) {
        return {
          authenticated: {
            name: viewer
          }
        }
      } else {
        return {
        }
      }
    }
  },
  Mutation: {
  },
  Artist: {
  }
}
