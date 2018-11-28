let sequelize = require("sequelize");
let Server = require("../api/models/server");

let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("Servers", () => {
    beforeEach((done) => {
        Server.remove({}, (err) => {
            done();
        })
    }
})

describe("/GET server", () => {
	it("it should get all the servers", done => {
		chai.request(app)
			.get("/server")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a("array");
				res.body.length.should.be.eql(0);
				done();
			});
	});
});
