import AWS, { AWSError } from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION,
});
const recognition = new AWS.Rekognition();
const ses = new AWS.SES();
const s3 = new AWS.S3({ region: process.env.REGION });

const getTitle = async (imgUrl: string) => {
  console.log("in get title");
  const fileBuffer = fs.readFileSync(imgUrl);
  const params = {
    Image: {
      Bytes: fileBuffer,
    },
  };
  recognition.detectText(params, async (err, data) => {
    if (err) {
      console.error("Error analyzing image:", err);
      throw "error analyzing image";
    }

    console.log("text detected:", data.TextDetections);

    return data;
  });
};

const putImage = async (
  imgUrl: string,
  bookId: number,
  bucketName = "books-express-gsg"
) => {
  try {
    console.log("In put Image");
    // await createBucketIfNonExistent(bucketName);
    console.log("After create bucket");
    const res = await uploadImageToS3(bucketName, String(bookId), imgUrl);
    console.log("Image uploaded successfully.");
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const createBucketIfNonExistent = async (bucketName: string) => {
  try {
    console.log("In create bucket");
    await s3.headBucket({ Bucket: bucketName }).promise();
  } catch (err) {
    let error: AWSError = err as AWSError;
    if (error?.statusCode === 404) {
      await s3.createBucket({ Bucket: bucketName }).promise();
    } else {
      throw error;
    }
  }
};

const uploadImageToS3 = async (
  bucketName: string,
  imageKey: string,
  imageFile: string
) => {
  const params = {
    Bucket: bucketName,
    Key: imageKey,
    Body: imageFile,
  };

  return s3.upload(params).promise();
};

const sendEmail = async (
  recipient: string | string[],
  subject: string,
  message: string
) => {
  const params = {
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: process.env.AWS_VERIFIED_SENDER as string,
  };
  console.log(params.Destination.ToAddresses);

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
    throw "error";
  }
};

export { getTitle, putImage, sendEmail };
