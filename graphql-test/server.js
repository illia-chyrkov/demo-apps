const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphql = require('graphql')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const todos = [
	{
		id: 0,
		text: 'lorem',
		author: 0
	},
	{
		id: 1,
		text: 'ipsum',
		author: 1
	},
	{
		id: 2,
		text: 'dolor',
		author: 0
	}
]

const users = [
	{
		id: 0,
		name: 'admin',
		todos: [0, 2],
		password: crypto
			.createHash('md5')
			.update('admin')
			.digest('hex')
	},
	{
		id: 1,
		name: 'user',
		todos: [1],
		password: crypto
			.createHash('md5')
			.update('password')
			.digest('hex')
	}
]

const todoType = new graphql.GraphQLObjectType({
  name: "ToDo",
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    text: { type: graphql.GraphQLString },
    author: {
      type: userType,
      resolve: ({ author }) => {
        return users
          .filter(user => user.id === author)
          .map(user => ({ id: user.id, name: user.name }))[0];
      }
    }
  })
});

const userType = new graphql.GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    todos: {
      type: new graphql.GraphQLList(todoType),
      resolve: ({ id }) => {
        return todos
          .filter(todo => todo.author === id)
          .map(todo => ({
            id: todo.id,
            text: todo.text,
            author: todo.author
          }));
      }
    }
  })
});

const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    todo: {
      type: todoType,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
      },
      resolve: (_, { id }, { user }) => {
        if (!user) throw new Error("401 Unauthorized Error");
        return todos
          .filter(todo => todo.id === id && todo.author === user.id)
          .map(todo => ({
            id: todo.id,
            text: todo.text,
            author: todo.author
          }))[0];
      }
    },
    todos: {
      type: new graphql.GraphQLList(todoType),
      args: {
        first: { type: graphql.GraphQLInt },
        offset: { type: graphql.GraphQLInt }
      },
      resolve: (_, { first = todos.length, offset = 0 }, { user }) => {
        if (!user) throw new Error("401 Unauthorized Error");
        return todos
          .filter(
            (todo, i) =>
              i >= offset && i < first + offset && todo.author === user.id
          )
          .map(todo => ({
            id: todo.id,
            text: todo.text,
            author: todo.author
          }));
      }
    },
    user: {
      type: userType,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
      },
      resolve: (_, { id }) => {
        return users
          .filter(user => user.id === id)
          .map(user => ({ id: user.id, name: user.name }))[0];
      }
    }
  }
});

const mutationType = new graphql.GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTodo: {
      type: todoType,
      args: {
        text: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, { text }, { user }) => {
        if (!user) throw new Error("401 Unauthorized Error");
        const id = todos[todos.length - 1]
          ? todos[todos.length - 1].id + 1
          : todos.length;
        todos.push({ id, text, author: user.id });
        return { id, text, author: user.id };
      }
    },
    editTodo: {
      type: todoType,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        text: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: (_, { id, text }, { user }) => {
        if (!user) throw new Error("401 Unauthorized Error");

        const todo = todos
          .filter(todo => todo.id === id && todo.author === user.id)
          .map(todo => ({
            id: todo.id,
            text: todo.text,
            author: todo.author
          }))[0];

        if (!!todo) {
          todos.map(todo => {
            if (todo.id === id) todo.text = text;
          });
          return { id, text, author: user.id };
        }
      }
    },
    removeTodo: {
      type: todoType,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
      },
      resolve: (_, { id }, { user }) => {
        if (!user) throw new Error("401 Unauthorized Error");

        const todo = todos
          .filter(todo => todo.id === id && todo.author === user.id)
          .map(todo => ({
            id: todo.id,
            text: todo.text,
            author: todo.author
          }))[0];

        if (!!todo) return todos.splice(id, 1)[0];
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

passport.use(
	new LocalStrategy((username, password, done) => {
		users.forEach(user => {
			if (
				user.name === username &&
				user.password ===
					crypto
						.createHash('md5')
						.update(password)
						.digest('hex')
			)
				done(null, user)
		})
		done(null, false)
	})
)

passport.use(
	'signup',
	new LocalStrategy((username, password, done) => {
		let newUser = {
			id: users.length,
			name: username,
			password: crypto
				.createHash('md5')
				.update(password)
				.digest('hex')
		}
		users.push(newUser)
		done(null, newUser)
	})
)

passport.serializeUser((user, done) => {
	done(null, user)
})
passport.deserializeUser((user, done) => {
	done(null, user)
})

const app = express()
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
	session({
		secret: 'secret',
		saveUninitialized: true,
		resave: true
	})
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/login', passport.authenticate('local'), (req, res) => {
	res.send({ id: req.user.id, name: req.user.name })
})
app.use('/signup', passport.authenticate('signup'), (req, res) => {
	res.send({ id: req.user.id, name: req.user.name })
})
app.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

app.use(
	graphqlHTTP(req => ({
		schema,
		graphiql: true,
		context: { user: req.user }
	}))
)

app.listen(8000, () => {
	console.log('App listening on port 8000')
})
