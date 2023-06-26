import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    challengeDateTime: { type: Date },
    status: { type: String },
    requestDateTime: { type: Date },
    responseDateTime: { type: Date },
    //requester: {type: mongoose.Schema.Types.ObjectId, ref: "Player"},
    requester: { type: mongoose.Schema.Types.ObjectId },
    //category: {type: String },
    category: { type: mongoose.Schema.Types.ObjectId },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        //ref: "Player"
      },
    ],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
