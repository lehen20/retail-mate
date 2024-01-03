import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw23I01bbKQQO3Opfs4jzw1v&ust=1704359220028000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCIC1y4DvwIMDFQAAAAAdAAAAABAE"
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;