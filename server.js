const mqtt = require('mqtt');

const broker = 'mqtt://3.7.47.131:1883';
const options = {
  username: 'Sarayu',
  password: 'IOTteam@123'
};

const companies = ['companyone', 'companytwo', 'companythree', 'companyfour', 'companyfive', 'companysix', 'companyseven', 'companyeight','companynine','companyten', 'companyeleven', 'companytwelve', 'companythirteen', 'companyfourteen', 'companyfifteen', 'companysixteen', 'companyseventeen', 'companyeighteen', 'companynineteen', 'companytwenty', 'companytwentyone', 'companytwentytwo', 'companytwentythree', 'companytwentyfour', 'companytwentyfive', 'companytwentysix', 'companytwentyseven', 'companytwentyeight', 'companytwentynine', 'companythirty', 'companythirtyone', 'companythirtytwo', 'companythirtythree', 'companythirtyfour', 'companythirtyfive', 'companythirtysix', 'companythirtyseven', 'companythirtyeight', 'companythirtynine', 'companyfourty', 'companyfourtyone', 'companyfourtytwo', 'companyfourtythree', 'companyfourtyfour', 'companyfourtyfive'];

const topics = [];
companies.forEach(company => {
  for (let i = 1; i <= 25; i++) {
    topics.push(`${company}/d1/topic${i}|m/s`);
  }
});

// Initialize state for each topic
const topicState = {};
const STEP = 5;          // How much to increase or decrease per cycle
const MIN = 0;
const MAX = 100;

topics.forEach(topic => {
  topicState[topic] = {
    value: MIN,
    increasing: true
  };
});

const client = mqtt.connect(broker, options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  setInterval(() => {
    topics.forEach(topic => {
      const state = topicState[topic];

      // Update value based on direction
      if (state.increasing) {
        state.value += STEP;
        if (state.value >= MAX) {
          state.value = MAX;
          state.increasing = false;
        }
      } else {
        state.value -= STEP;
        if (state.value <= MIN) {
          state.value = MIN;
          state.increasing = true;
        }
      }

      const payload = state.value.toString();
      client.publish(topic, payload, { qos: 0 }, (err) => {
        if (err) {
          console.error(`Error publishing to ${topic}:`, err);
        } else {
          console.log(`Published ${payload} to ${topic}`);
        }
      });
    });
  }, 30000); // Every 30 seconds
});

client.on('error', (err) => {
  console.error('Connection error:', err);
});

client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});
