import express from 'express';
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithbLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from '../controllers/userController';
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from '../views/middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter
  .route('/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single('avatar'), postEdit);
userRouter
  .route('/change-password')
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get('/github/start', publicOnlyMiddleware, startGithbLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);

userRouter.get('/:id', see);

export default userRouter;
