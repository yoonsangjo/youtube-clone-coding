import Video from '../models/Video';
import User from '../models/User';

// export const home = (req, res) => {
//   Video.find({})
//     .then((videos) => {
//       console.log('videos', videos);
//       return res.render('home', { pageTitle: 'Home', videos });
//     })
//     .catch((error) => {
//       console.log('errors', error);
//     });
// };
export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: 'desc' }).populate('owner');
  // console.log(videos);

  return res.render('home', { pageTitle: 'Home', videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate('owner');

  if (!video) {
    return res.render('404', { pageTitle: 'Video not found.' });
  }
  return res.render('watch', { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect('/');
  }
  res.render('edit', { pageTitle: `Edit : ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash('error', 'You are not the owner of the video.');
    return res.status(403).redirect('/');
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash('success', 'Changes saved.');
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  console.log(req.files);
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path.replace(/[\\]/g, '/'),
      thumbUrl: thumb[0].path.replace(/[\\]/g, '/'),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect('/');
  } catch (error) {
    return res
      .status(400)
      .render('upload', { pageTitle: 'Upload Video', errorMessage: error._message });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);

  if (!video) {
    return res.render('404', { pageTitle: 'Video not found.' });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect('/');
  }
  await Video.findByIdAndDelete(id);
  return res.redirect('/');
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    // search
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    }).populate('owner');
  }
  return res.render('search', { pageTitle: 'Search', videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};
