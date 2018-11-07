const RuleEngine = require("json-rules-engine");
const engine = new RuleEngine.Engine();

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
			discount: 100,
			substract: 0,
			recharge: 0,
			message: "El envio es gratis"
		}
	},
	priority: 100, // IMPORTANT!  Set a higher priority so it runs first
	onSuccess: function(event, almanac) {
		almanac.addRuntimeFact("free", true);
	},
	onFailure: function(event, almanac) {
		almanac.addRuntimeFact("free", false);
	}
};

engine.addRule(mailDomainRule);

firsPurchaseRule = {
	conditions: {
		all: [
			{
				fact: "free",
				operator: "equal",
				value: false
			},
			{
				fact: "purchaseQuantity",
				operator: "equal",
				value: 0
			}
		]
	},
	event: {
		// define the event to fire when the conditions evaluate truthy
		type: "firstTripDiscount",
		params: {
			discount: 0,
			substract: 100,
			recharge: 0,
			message: "El costo se reduce en 100ARS"
		}
	}
};

engine.addRule(firsPurchaseRule);

timeDiscountRule = {
	conditions: {
		all: [
			{
				fact: "free",
				operator: "equal",
				value: false
			},
			{
				fact: "day",
				operator: "equal",
				value: 3 // miercoles es el dia 3 de la semana, domingo el 0
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
			discount: 5,
			substract: 0,
			recharge: 0,
			message: "El costo se reduce un 5%"
		}
	}
};

engine.addRule(timeDiscountRule);

purchaseQuantityRule = {
	conditions: {
		all: [
			{
				fact: "free",
				operator: "equal",
				value: false
			},
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
			discount: 5,
			substract: 0,
			recharge: 0,
			message: "El costo se reduce un 5%"
		}
	}
};

engine.addRule(purchaseQuantityRule);

timeRechargeRule = {
	conditions: {
		all: [
			{
				fact: "free",
				operator: "equal",
				value: false
			},
			{
				fact: "day",
				operator: "equal",
				value: 6 // viernes es el dia 6 de la semana (arranca en 0 en el domingo)
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
			discount: 0,
			substract: 0,
			recharge: 10,
			message: "El costo aumenta un 10%"
		}
	}
};

engine.addRule(timeRechargeRule);

highDemandRule = {
	conditions: {
		all: [
			{
				fact: "free",
				operator: "equal",
				value: false
			},
			{
				//TODO: ver si son algun estado particular de los viajes o que se hayan creado 10 pedidos
				fact: "tripsQuantity",
				operator: "greaterThan",
				value: 10
			}
		]
	},
	event: {
		type: "highDemandRecharge",
		params: {
			discount: 0,
			substract: 0,
			recharge: 15,
			message: "El costo aumenta un 15%"
		}
	}
};

engine.addRule(highDemandRule);

module.exports = engine;
