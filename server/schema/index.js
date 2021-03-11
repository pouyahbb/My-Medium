exports.typeDefs = `

  type Query {
    getAllUsers : [User]!
    getCurrentUser(_id : ID!) : User
    getAllPosts : [Post]
  }

  type Post {
    _id : ID
    sharedUser : ID
    image : String!
    createdAt : String
    description : String!
    likes : [String]
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
    signin(email : String! , password : String! ) : Token
    updateUserProfile( _id : ID! ,  name : String , nickName : String , email : String , password : String , passwordConfirm : String , profileImage : String , sexually : String) : Token
    deleteUser(_id : ID!) : ID!
    follow(value : String! , currentUserId : ID! , targetUserId : ID!) : [User]
    addPost(sharedUser : ID! , image : String! , description : String! ) : Post
    
  }
  `
