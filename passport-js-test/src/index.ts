import * as express from "express";
import * as bodyParser from "body-parser";
// import * as session from "express-session";
// import * as cookieParser from "cookie-parser";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
// import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { UserRepository } from "./user.repository";
import { User } from "user.interface";

const app = express();
const userRepository = new UserRepository();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(
//   session({
//     secret: "dsybpfxnjytljuflftntcm",
//     resave: true,
//     saveUninitialized: true,
//   })
// );
app.use(passport.initialize());
// app.use(passport.session());

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: User["id"], done) => {
  const user = await userRepository.findOne({ id });
  done(null, user);
});

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "dsybpfxnjytljuflftntcm",
    },
    async (payload, done) => {
      const user = await userRepository.findOne({ id: payload.id });

      done(null, user);
    }
  )
);

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       const user = await userRepository.signIn({ email, password });
//       done(null, user);
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "484946857183-8hioe8pr5t55pkroi7ebk1pa2k1o6tbk.apps.googleusercontent.com",
      clientSecret: "pqR6L3jvkX87TDecgDoKxdxc",
      callbackURL: "http://localhost:3000/sign-in/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await userRepository.findOne({
        email: profile.emails[0].value,
      });

      done(null, user);
    }
  )
);

app.post("/sign-up", async (req, res, next) => {
  try {
    const user = await userRepository.signUp(req.body);
    // Для локальной стратегии
    // req.logIn(user, () => {
    //   res.send(user);
    // })

    const token = jwt.sign(user, "dsybpfxnjytljuflftntcm");
    res.send({ token });
  } catch (err) {
    next(err.message);
  }
});

app.post(
  "/sign-in",
  // passport.authenticate("local", { session: false }),
  async (req, res) => {
    const user = await userRepository.signIn(req.body);

    const token = jwt.sign(user, "dsybpfxnjytljuflftntcm");
    res.send({ token });
  }
);

app.get(
  "/sign-in/google",
  passport.authenticate("google", { scope: ["email"] })
);

app.get(
  "/sign-in/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    const token = jwt.sign(req.user, "dsybpfxnjytljuflftntcm");
    res.send({ token });
  }
);

app.get("/profile", passport.authenticate("jwt"), (req, res) => {
  res.send({ user: req.user });
});

app.use((err, req, res, next) => {
  res.status(500).send({
    error: err || "Internal server error",
  });
});

app.listen(3000);
