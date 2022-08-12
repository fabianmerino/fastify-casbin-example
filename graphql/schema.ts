export const schema = `
  type ResultChange {
    operation: String
    prev: Int
    current: Int
  }
  type Query {
    result: Int
  }
  type Mutation {
    add(num: Int): Int
    subtract(num: Int): Int
  }
  type Subscription {
    onResultChange: ResultChange
  }
`
