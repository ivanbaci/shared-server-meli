let Server = require("../api/models/server");
let sequelize = require("../api/models/db");

let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();

chai.use(chaiHttp);

before(done => {
	Server.sync({ force: true }).then(() => done());
});

describe("/GET server", () => {
	before(done => {
		Server.destroy({
			where: {},
			truncate: true
		}).then(() => done());
	});

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

describe("/GET/:id server", () => {
	before(done => {
		console.log("Server: ");
		console.log(Server);
		Server.destroy({
			where: {},
			truncate: true
		}).then(() => {
			console.log("Done destroying");
			done();
		});
	});

	it("it should get a server by the given id", done => {
		let server = {
			id: "1412",
			_rev: "21af323fas3",
			createdBy: "Ivan",
			name: "prueba",
			lastConnection: Date.now()
		};

		Server.create(server).then(() => {
			chai.request(app)
				.get("/server/" + server.id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("object");
					res.body.should.have.property("_rev");
					res.body.should.have.property("createdBy");
					res.body.should.have.property("name");
					res.body.should.have.property("lastConnection");
					res.body.should.have.property("id").eql(server.id);
					done();
				});
		});
	});
});

describe("/POST server", () => {
	before(done => {
		Server.destroy({
			where: {},
			truncate: true
		}).then(() => done());
	});

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

describe("/PUT server", () => {
	before(done => {
		Server.destroy({
			where: {},
			truncate: true
		});
		let server = {
			id: "1412",
			_rev: "21af323fas3",
			createdBy: "Ivan",
			name: "prueba",
			lastConnection: Date.now()
		};
		Server.create(server).then(newServer => {
			done();
		});
	});

	it("it should put a new server with all his fields corrects", done => {
		let server = {
			id: "1412",
			_rev: "prueba",
			createdBy: "Ivan Bacigaluppo",
			name: "Test server"
		};

		chai.request(app)
			.put("/server/" + server.id)
			.send(server)
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});

	it("it should not put a server withot a name", done => {
		let server = {
			id: "1412",
			_rev: "prueba",
			createdBy: "Ivan Bacigaluppo"
		};

		chai.request(app)
			.put("/server/" + server.id)
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

	it("it should not put a server withot created by", done => {
		let server = {
			id: "1412",
			_rev: "prueba",
			name: "Server de prueba"
		};

		chai.request(app)
			.put("/server/" + server.id)
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

	it("it should not put a server withot a rev", done => {
		let server = {
			id: "1412",
			createdBy: "Ivan Bacigaluppo",
			name: "Server de prueba"
		};

		chai.request(app)
			.put("/server/" + server.id)
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

after(done => {
	sequelize.close().then(() => done());
});
