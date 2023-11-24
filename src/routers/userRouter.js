import express from 'express';
import {
  edit,
  logout,
  see,
  startGithbLogin,
  finishGithubLogin,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.get('/edit', edit);
userRouter.get('/github/start', startGithbLogin);
userRouter.get('/github/finish', finishGithubLogin);
userRouter.get(':id', see);

export default userRouter;
