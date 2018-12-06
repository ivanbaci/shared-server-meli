let sequelize = require("../api/models/db");

let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../app");
let should = chai.should();

chai.use(chaiHttp);

describe("/GET delivery/estimate", () => {
    let deliveryMail = {
        value: 100,
        userscore: 20,
        distance: 50,
        mail: "ivanbac@comprame.com",
        purchaseQuantity: 2
    };

    it("the delivery should be free for @comprame domain", done => {
        chai.request(app)
            .post("/delivery/estimate")
            .send(deliveryMail)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.cost.value.should.be.eql(0);
                done();
            });
    });

    let deliveryFirstPurchase = {
        value: 100,
        userscore: 20,
        distance: 10,
        mail: "ivanbac@gmail.com",
        purchaseQuantity: 0
    };

    it("the delivery should have 100ars discount in first purchase", done => {
        chai.request(app)
            .post("/delivery/estimate")
            .send(deliveryFirstPurchase)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.cost.value.should.be.eql(50);
                done();
            });
    });

    let deliveryTenPurchase = {
        value: 100,
        userscore: 20,
        distance: 20,
        mail: "ivanbac@gmail.com",
        purchaseQuantity: 11
    };

    it("the delivery should have 5% discount after 10 purchases ", done => {
        chai.request(app)
            .post("/delivery/estimate")
            .send(deliveryTenPurchase)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.cost.value.should.be.eql(285);
                done();
            });
    });
});
