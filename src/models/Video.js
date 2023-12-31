import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, retuires: true },
  thumbUrl: { type: String, retuires: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, requires: true, ref: 'Comment' }],
  owner: { type: mongoose.Schema.Types.ObjectId, requires: true, ref: 'User' },
});

videoSchema.static('formatHashtags', function (hashtags) {
  return hashtags.split(',').map((word) => (word.startsWith('#') ? word : `#${word}`));
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
