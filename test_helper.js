var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var s = require('sleep');
function checkForGoodResponse(err, res) {
	expect(err).to.be.null;
	expect(res).to.have.status(200);
}

function sendMoveRequest(url, requestBody, responseHandler) {
	s.sleep(1);
	chai.request(url)
		.post('/move')
		.send(requestBody)
		.end(function(err,res){
			console.log(res.text);
			responseHandler(err,res);
	});

}

function getUrl() {
	const host = process.env.npm_config_host;
	const port = process.env.npm_config_port;

	var url = 'http://' + host;
	if (port) {
		url += ':' + port;
	}

	return url;
}

module.exports = {
   checkForGoodResponse: checkForGoodResponse,
   sendMoveRequest: sendMoveRequest,
   getUrl: getUrl
}
