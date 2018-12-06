let PaymentMethod = require("../api/models/db");
let Payment = require("../api/models/payment");
let sequelize = require("../api/models/db");

let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();

chai.use(chaiHttp);

before(done => {
    PaymentMethod.sync({ force: true }).then(() => {
        Payment.sync({ force: true }).then(() => done());
    });
});

describe("/GET payment", () => {
    before(done => {
        Payment.destroy({
            where: {},
            truncate: true
        }).then(() => done());
    });

    beforeEach(done => {
        Payment.sync({ force: true }).then(() => done());
    });

    it("it should get all the payments", done => {
        chai.request(app)
            .get("/payment")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.be.eql(0);
                done();
            });
    });
});

describe("/GET/:id payment", () => {
    before(done => {
        Payment.destroy({
            truncate: true
        }).then(() => {
            done();
        });
    });

    beforeEach(done => {
        Payment.sync({ force: true }).then(() => done());
    });

    it("it should get a payment by the given id", done => {
        let method = {
            method: "Credit card"
        };

        let payment = {
            transaction_id: "1407afc98u23",
            currency: "USD",
            value: 150,
            status: "Pago pendiente de aprobacion",
            paymentMethod: method
        };

        Payment.create(payment)
            .then(() => {
                chai.request(app)
                    .get("/payment/" + payment.transaction_id)
                    .then(res => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have.property("currency");
                        res.body.should.have.property("value");
                        res.body.should.have.property("status");
                        res.body.should.have
                            .property("transaction_id")
                            .eql(payment.transaction_id);
                        done();
                    })
                    .catch(err => {
                        console.log(err);
                        done();
                    });
            })
            .catch(err => {
                console.log(err);
                done();
            });
    });
});
/* 
describe("/POST payment", () => {
	before(done => {
		Payment.destroy({
			where: {},
			truncate: true
		}).then(() => done());
	});

	beforeEach(done => {
		Payment.sync({ force: true }).then(() => done());
	});

	it("it should post a new payment with all his fields corrects", done => {
		let payment = {
			id: "123",
			_rev: "prueba",
			createdBy: "Ivan Bacigaluppo",
			name: "Test payment"
		};

		chai.request(app)
			.post("/payment")
			.send(payment)
			.end((err, res) => {
				res.should.have.status(201);
				done();
			});
	});

	it("it should not post a payment withot a name", done => {
		let payment = {
			id: "123",
			_rev: "prueba",
			createdBy: "Ivan Bacigaluppo"
		};

		chai.request(app)
			.post("/payment")
			.send(payment)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.a("array");
				res.body.message[0].should.eql('"name" is required');
				done();
			});
	});

	it("it should not post a payment withot created by", done => {
		let payment = {
			id: "123",
			_rev: "prueba",
			name: "Payment de prueba"
		};

		chai.request(app)
			.post("/payment")
			.send(payment)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.a("array");
				res.body.message[0].should.eql('"createdBy" is required');
				done();
			});
	});

	it("it should not post a payment withot a rev", done => {
		let payment = {
			id: "123",
			createdBy: "Ivan Bacigaluppo",
			name: "payment de prueba"
		};

		chai.request(app)
			.post("/payment")
			.send(payment)
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

describe("/PUT payment", () => {
	before(done => {
		Payment.destroy({
			where: {},
			truncate: true
		});
		let payment = {
			id: "1412",
			_rev: "21af323fas3",
			createdBy: "Ivan",
			name: "prueba",
			lastConnection: Date.now()
		};
		Payment.create(payment).then(newPayment => {
			done();
		});
	});

	beforeEach(done => {
		Payment.sync({ force: false }).then(() => done());
	});

	it("it should put a new payment with all his fields corrects", done => {
		let payment = {
			id: "1412",
			_rev: "prueba",
			createdBy: "Ivan Bacigaluppo",
			name: "Test payment"
		};

		chai.request(app)
			.put("/payment/" + payment.id)
			.send(payment)
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});

	it("it should not put a payment withot a name", done => {
		let payment = {
			id: "1412",
			_rev: "prueba",
			createdBy: "Ivan Bacigaluppo"
		};

		chai.request(app)
			.put("/payment/" + payment.id)
			.send(payment)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.a("array");
				res.body.message[0].should.eql('"name" is required');
				done();
			});
	});

	it("it should not put a payment withot created by", done => {
		let payment = {
			id: "1412",
			_rev: "prueba",
			name: "Payment de prueba"
		};

		chai.request(app)
			.put("/payment/" + payment.id)
			.send(payment)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a("object");
				res.body.should.have.property("message");
				res.body.message.should.be.a("array");
				res.body.message[0].should.eql('"createdBy" is required');
				done();
			});
	});

	it("it should not put a payment withot a rev", done => {
		let payment = {
			id: "1412",
			createdBy: "Ivan Bacigaluppo",
			name: "payment de prueba"
		};

		chai.request(app)
			.put("/payment/" + payment.id)
			.send(payment)
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

describe("/DELETE/:id payment", () => {
	before(done => {
		Payment.destroy({
			truncate: true
		}).then(() => {
			done();
		});
	});

	beforeEach(done => {
		Payment.sync({ force: true }).then(() => done());
	});

	it("it should delete a payment by the given id", done => {
		let payment = {
			id: "1412",
			_rev: "21af323fas3",
			createdBy: "Ivan",
			name: "prueba",
			lastConnection: Date.now()
		};

		payment.create(payment)
			.then(() => {
				chai.request(app)
					.delete("/payment/" + payment.id)
					.then(res => {
						res.should.have.status(204);
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			})
			.catch(err => {
				console.log(err);
				done();
			});
	});
});

after(done => {
	sequelize.close().then(() => done());
});
 */
