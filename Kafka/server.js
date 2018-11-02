var connection = new require("./kafka/connection.js");
//topics files
//var signin = require('./services/signin.js');
var NewUser = require("./services/register-user.js");
var PropList = require("./services/prop-list.js");
var PropDetails = require("./services/prop-details.js");
var AddProp = require("./services/add_prop.js");
var TDash = require("./services/traveler-dash");
var ODash = require("./services/owner-dash");
var BookProp = require("./services/book-prop.js");
function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function(message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function(err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res
          }),
          partition: 0
        }
      ];
      producer.send(payloads, function(err, data) {
        console.log(data);
      });
      return;
    });
  });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("create_user", NewUser);
handleTopicRequest("property_list", PropList);
handleTopicRequest("property_details", PropDetails);
handleTopicRequest("add_property", AddProp);
handleTopicRequest("travel_dash", TDash);
handleTopicRequest("owner_dash", ODash);
handleTopicRequest("book_prop", BookProp);
