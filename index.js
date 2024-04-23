const im = require("imagemagick");
const fs = require("fs");
const os = require("os");
const uuidv4 = require("uuid/v4");
const { promisify } = require("util");
const AWS = require("aws=sdk");

const resizeAsync = promisify(im.resize);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

// region where lambda function is created in AWS
AWS.config.update({ reqion: "us-west-2" });
const s3 = new AWS.S3();

exports.handler = async (event) => {
  event.Records.map(async (record) => {
    let bucket = record.s3.bucket.name;
    let filename = record.s3.object.key;

    // Get file from S3
    var params = {
      Bucket: bucket,
      Key: filename,
    };
    let inputData = s3.getObject(params).promise();

    //  Resize the file
    let tempFile = os.tmpdir() + "/" + uuidv4() + ".jpg";
    let resizeArgs = {
      srcData: inputData.Body,
      dstPath: tempFile,
      width: 150,
    };
    await resizeAsync(resizeArgs);

    // Read the resized file
    let resizedData = await readFileAsync(tempFile);

    // Upload the new file to s3
    let targetFileName =
      filename.substring(0, filename.lastIndexOf(".")) + "-small.jpg";

    //note: this var overwrites the older assigning of the var above
    var params = {
      Bucket: bucket + "-dest",
      Key: targetFileName,
      //new Buffer(argument...) is already depreciated
      Body: Buffer.from(resizedData),
      ContentType: "image/jpeg",
    };
    await s3.putObject(params).promise();

    return await unlinkAsync(tempFile);
  });

  await Promise.all(filesProcessed);
  console.log("done");
  return "done";
};
