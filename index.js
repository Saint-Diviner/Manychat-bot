'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.token,
  channelSecret: process.env.secret,
};
// "YfOU5GHeOuLQ8328H12Ze7NL0V5IjNA9ayO88iKUBUeJxjoDI+hs+Ox1t9+Nwd76TpZ8c/YQMwaUlR5Zo92gEsogTlnt5fLgmRkn7oIojKw65LlqDhlTR6og8YjZgQcSGnUpDQibNh3XdaykrHyzYwdB04t89/1O/w1cDnyilFU=",
// "3767de218c799e46388977a200e29164"
// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json("result"))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};
// event handler
function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    return console.log("Test hook recieved: " + JSON.stringify(event.message));
  }
  console.log("event is ", event.type)
  switch (event.type) {
    case 'join':
      return replyText(event.replyToken, {
        type: 'template',
        altText: 'Confirm alt text',
        template: {
          type: 'confirm',
          text: 'Hi, I am your hotel booking assisstant.Do you want to book room?',
          actions: [
            { label: 'Yes', type: 'message', text: 'Yes!' },
            { label: 'No', type: 'message', text: 'No!' },
          ],
        },
      });
    // return client.replyMessage(event.replyToken, `Joined ${event.source.type}`);
    // create a echoing replyMessage message
    case 'follow':
      return client.replyMessage(event.replyToken, {
        type: 'template',
        altText: 'Confirm alt text',
        template: {
          type: 'confirm',
          text: 'Hi, I am your hotel booking assisstant.Do you want to book room?',
          actions: [
            { label: 'Yes', type: 'message', text: 'Yes!' },
            { label: 'No', type: 'message', text: 'No!' },
          ],
        },
      });
    // return client.replyMessage(event.replyToken, 'Got followed event');
    case 'message':
      const message = event.message;
      console.log("msg type: ", message.type)
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken, event.source);
        default:
      }
  }
}

function handleText(message, replyToken, source) {
  console.log("text is :", message.text)
  switch (message.text) {
    case 'Yes!':
      return client.replyMessage(replyToken, {
        type: "text",
        text: "Please select type of room",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "Economy",
                "text": "Economy"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "Standard",
                "text": "Standard"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "VIP",
                "text": "VIP"
              }
            }
          ]
        }
      })
    case 'No!':
      return replyText(replyToken, "No problem come again when you planned for booking!");
    case 'Economy':
    case 'Standard':
    case 'VIP':
      return client.replyMessage(replyToken, {
        type: "text",
        text: "Please tell me number of rooms",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "1",
                "text": "one room"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "2",
                "text": "two rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "3",
                "text": "three rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "4",
                "text": "four rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "5",
                "text": "five rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "6",
                "text": "six rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "7",
                "text": "seven rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "8",
                "text": "eight rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "9",
                "text": "nine rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "10",
                "text": "ten rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "11",
                "text": "eleven rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "12",
                "text": "twelve rooms"
              }
            },
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "13th",
                "text": "Thirteen rooms"
              }
            }
          ]
        }
      })
    default:
      return replyText(replyToken, "Thanks for using our services. We will proceed your booking request to concerned dept");

  }
}
// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
