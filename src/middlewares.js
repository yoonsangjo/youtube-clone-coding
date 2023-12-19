import multer from 'multer';

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = 'Wetube';
  res.locals.loggedInUser = req.session.user || {};
  next();
};

// const isServer = process.env.NODE_ENV === 'production';

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash('error', 'Log in first.');
    return res.redirect('/login');
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash('error', 'Not authorized');
    return res.redirect('/');
  }
};

const avatarStorage = multer.diskStorage({
  destination(req, file, cb) {
    console.log(file);
    cb(null, 'uploads/avatars/');
  },
  filename(req, file, cb) {
    cb(null, new Date().valueOf() + file.originalname);
  },
});

export const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 3000000,
  },
});

const videoStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/videos/');
  },
  filename(req, file, cb) {
    cb(null, new Date().valueOf() + file.originalname);
  },
});

export const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000,
  },
});
