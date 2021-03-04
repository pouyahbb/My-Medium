exports.typeDefs = `

  type Query {
    hello : String!
  }

  type Post {
    postId : ID!
    sharedUser : ID!  
    image : String!
    createdAt : String!
    description : String!
    likes : [String]!
    comments : [Comment]
  }

  
  type Comment {
    userId : ID!
    text : String!
    createdAt : String!
  }
  
  type User {
    _id : ID!
    name : String!
    nickName : String!
    email : String!
    password : String!
    passwordConfirm : String!
    profileImage : String
    sexually : String
    followers : [String]!
    followings : [String]!
    posts : [Post]!
    joinDate : String
  }
  
  type Token {
    token : String!
  }

  type Mutation {
    signup( name :String! , nickName : String! , email : String! , password : String! , passwordConfirm : String! , profileImage : String , sexually : String) : Token
  }

`