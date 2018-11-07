const RuleEngine = require("json-rules-engine");
const engine = new RuleEngine.Engine();

const minPriceRule = {
	conditions: {
		all: [
			{
				fact: "price",
				operator: "lessThan",
				value: 50
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "minPrice",
		params: {
			code: 400,
			message: "El valor de compra minima para el envio es de 50ARS"
		}
	}
};

engine.addRule(minPriceRule);

negativeScoreRule = {
	conditions: {
		all: [
			{
				fact: "userScore",
				operator: "lessThan",
				value: 0
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "userScoreNegative",
		params: {
			code: 402,
			message: "No se le puede hacer envios si tiene puntaje negativo"
		}
	}
};

engine.addRule(negativeScoreRule);

timeDiscountRule = {
	conditions: {
		all: [
			{
				fact: "day",
				operator: "equal",
				value: "wednesday"
			},
			{
				fact: "hour",
				operator: "greaterThanInclusive",
				value: 15
			},
			{
				fact: "hour",
				operator: "lessThan",
				value: 16
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "timeDiscount",
		params: {
			code: 200,
			cost: "-5%",
			message: "El costo se reduce un 5%"
		}
	}
};

engine.addRule(timeDiscountRule);

firstTripRule = {
	conditions: {
		all: [
			{
				fact: "firstTrip",
				operator: "equal",
				value: true
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "firstTripDiscount",
		params: {
			code: 200,
			cost: "-100",
			message: "El costo se reduce en 100ARS"
		}
	}
};

engine.addRule(firstTripRule);

timeRechargeRule = {
	conditions: {
		all: [
			{
				fact: "day",
				operator: "equal",
				value: "friday"
			},
			{
				fact: "hour",
				operator: "greaterThanInclusive",
				value: 17
			},
			{
				fact: "hour",
				operator: "lessThan",
				value: 19
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "timeRecharge",
		params: {
			code: 200,
			cost: "10%",
			message: "El costo aumenta un 10%"
		}
	}
};

engine.addRule(timeRechargeRule);

highDemandRule = {
	conditions: {
		all: [
			{
				fact: "tripsQuantity",
				operator: "greaterThan",
				value: 10
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "highDemandRecharge",
		params: {
			code: 200,
			cost: "15%",
			message: "El costo aumenta un 15%"
		}
	}
};

engine.addRule(highDemandRule);

mailDomainRule = {
	conditions: {
		all: [
			{
				fact: "mailDomain",
				operator: "equal",
				value: "comprame.com"
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "mailDomainFree",
		params: {
			code: 200,
			cost: "free",
			message: "El envio es gratis"
		}
	}
};

engine.addRule(mailDomainRule);

purchaseQuantityRule = {
	conditions: {
		all: [
			{
				fact: "purchaseQuantity",
				operator: "greaterThanInclusive",
				value: 10
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "purchaseQuantityDiscount",
		params: {
			code: 200,
			cost: "-5%",
			message: "El costo se reduce un 5%"
		}
	}
};

engine.addRule(purchaseQuantityRule);

let facts = {
	price: 50,
	day: "friday",
	hour: 18,
	firstTrip: true,
	tripsQuantity: 15,
	mailDomain: "comprame.com",
	userScore: -10,
	purchaseQuantity: 10
};

// Run the engine to evaluate
engine.run(facts).then(events => {
	// run() returns events with truthy conditions
	events.map(event =>
		console.log(event.params.code + " " + event.params.message)
	);
});

module.exports = engine;
