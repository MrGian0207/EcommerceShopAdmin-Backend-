import { Router, Request, Response } from 'express';
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';

const googleRouter = Router();

// Initialize Passport
googleRouter.use(passport.initialize());

const GoogleStrategy = passportGoogle.Strategy;

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/auth/google/callback',
      scope: ['email', 'profile'],
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      return done(null, { accessToken, ...profile });
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

googleRouter.get('/auth/login/success', (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({
      message: 'Successfully Loged In',
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: 'Not Authorized' });
  }
});

// Routes
googleRouter.get('/login/failed', (req: Request, res: Response) => {
  res.status(401).json({
    error: true,
    message: 'Log in failure',
  });
});

googleRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

googleRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: '/auth/login/failed',
  }),
);

googleRouter.get('/logout', (req, res) => {
    // req.logout(done());
  res.redirect('/');
});

export default googleRouter;
