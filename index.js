// exports.handler = (event, context, callback) => {
//     ...callback

// returning result
//     callback(null, result);
//     return result;
// }

// exports.handler = async (event, context) => {
//   const data = event.data;
//   let newImage = await resizeImage();

//   return newImage;
// };

// const resizeImage = (data) =>
//   new Promise((resolve, reject) => {
//     if (error) {
//       reject(error);
//     } else {
//       resolve(result);
//     }

//cloudwatch implementation
// console.log("A log message");
// console.error("An Error Occured");
// console.info("An Informative Message");
// console.warn("Warning message");
//throw new Error("This is a random error!");
// });

// new topic - parameters
// www.sample.com/pathparams?queryparams1=value&queryparams2=value

const moment = require("moment");

const greeting = {
  en: "Hello",
  fr: "Bonjour",
  hi: "Namaste",
  es: "Hola",
  pt: "Ola",
  ur: "Assalamo aleikum",
  it: "Ciao",
  de: "Hallo",
};

exports.handler = async (event) => {
  let name = event.pathParameters.name;
  let { lang, ...info } = event.queryStringParameters;

  let message = `${greeting[lang] ? greeting[lang] : greeting["en"]} ${name}`;
  // default response for AWS
  let response = {
    message: message,
    info: info,
    timestamp: moment().unix(),
  };
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
