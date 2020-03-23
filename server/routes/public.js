import express from 'express'

class CaseRoute {
    router
	
	constructor() {
		this.router = express.Router();
		this.routing()
	}

	routing() {
		
	}
}

export default new CaseRoute().router;