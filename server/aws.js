const aws = require("aws-sdk");
const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION } = process.env;

const s3 = new aws.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

const getSignedUrl = ({ key }) => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: "limu-image-uploader",
        Fields: {
          key,
        },
        Expires: 60,
        Conditions: [
          ["Content-length-range", 0, 50 * 1000 * 1000],
          ["starts-with", "$Content-Type", "image/"],
        ],
      },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
};

module.exports = { s3, getSignedUrl };
