let sequelize = require("sequelize");
let Server = require("../api/models/server");

let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("Servers", () => {
	beforeEach(done => {
		Server.remove({}, err => {
			done();
		});
	});
});

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

describe("/POST server", () => {
	it("it should post a new server with all his fields corrects", done => {
		let server = {
			id: "123",
			_rev: "prueba",
			createdBy: "Ivan Bacigaluppo",
			name: "Test server"
		};

		chai.request(app)
			.post("/server")
			.send(server)
			.end((err, res) => {
				res.should.have.status(201);
				done();
			});
	});

	it("it should not post a server withot a name", done => {
		let server = {
			id: "123",
			_rev: "prueba",
			createdBy: "Ivan Bacigaluppo"
		};

		chai.request(app)
			.post("/server")
			.send(server)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.a("array");
				res.body.message[0].should.eql('"name" is required');
				done();
			});
	});

	it("it should not post a server withot created by", done => {
		let server = {
			id: "123",
			_rev: "prueba",
			name: "Server de prueba"
		};

		chai.request(app)
			.post("/server")
			.send(server)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.a("array");
				res.body.message[0].should.eql('"createdBy" is required');
				done();
			});
	});

	it("it should not post a server withot a rev", done => {
		let server = {
			id: "123",
			createdBy: "Ivan Bacigaluppo",
			name: "Server de prueba"
		};

		chai.request(app)
			.post("/server")
			.send(server)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.a("array");
				res.body.message[0].should.eql('"_rev" is required');
				done();
			});
	});
});
