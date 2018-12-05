let Tracking = require("../api/models/tracking");
let sequelize = require("../api/models/db");

let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();

chai.use(chaiHttp);

before(done => {
    Tracking.sync({ force: true }).then(() => done());
});

describe("/GET tracking", () => {
    before(done => {
        Tracking.destroy({
            where: {},
            truncate: true
        }).then(() => done());
    });

    beforeEach(done => {
        Tracking.sync({ force: true }).then(() => done());
    });

    it("it should get all the trackings", done => {
        chai.request(app)
            .get("/tracking")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.length.should.be.eql(0);
                done();
            });
    });
});

describe("/GET/:id tracking", () => {
    before(done => {
        Tracking.destroy({
            truncate: true
        }).then(() => {
            done();
        });
    });

    beforeEach(done => {
        Tracking.sync({ force: true }).then(() => done());
    });

    it("it should get a server by the given id", done => {
        let tracking = {
            id: "1321dsadas123",
            status: "Entrega pendiente"
        };

        Tracking.create(tracking)
            .then(() => {
                chai.request(app)
                    .get("/tracking/" + tracking.id)
                    .then(res => {
                        res.should.have.status(200);
                        res.body.should.be.a("object");
                        res.body.should.have.property("status");
                        res.body.should.have.property("id").eql(tracking.id);
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

describe("/POST tracking", () => {
    before(done => {
        Tracking.destroy({
            where: {},
            truncate: true
        }).then(() => done());
    });

    beforeEach(done => {
        Tracking.sync({ force: true }).then(() => done());
    });

    it("it should post a new tracking with all his fields corrects", done => {
        let tracking = {
            id: "24312ASAS23",
            status: "Entrega realizada"
        };

        chai.request(app)
            .post("/tracking")
            .send(tracking)
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });

    it("it should not post a tracking withot a status", done => {
        let tracking = {
            id: "321asd3124"
        };

        chai.request(app)
            .post("/tracking")
            .send(tracking)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have.property("message");
                res.body.message.should.be.a("array");
                res.body.message[0].should.eql('"status" is required');
                done();
            });
    });
});

describe("/PUT tracking", () => {
    before(done => {
        Tracking.destroy({
            where: {},
            truncate: true
        });
        let tracking = {
            id: "123456",
            status: "Entrega pendiente"
        };
        Tracking.create(tracking).then(() => {
            done();
        });
    });

    beforeEach(done => {
        Tracking.sync({ force: false }).then(() => done());
    });

    it("it should put a new tracking with all his fields corrects", done => {
        let tracking = {
            id: "123456",
            status: "Entrega realizada"
        };

        chai.request(app)
            .put("/tracking/" + tracking.id)
            .send(tracking)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it("it should not put a tracking without a status", done => {
        let tracking = {
            id: "123456"
        };

        chai.request(app)
            .put("/tracking/" + tracking.id)
            .send(tracking)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a("object");
                res.body.should.have.property("message");
                res.body.message.should.be.a("array");
                res.body.message[0].should.eql('"status" is required');
                done();
            });
    });
});
