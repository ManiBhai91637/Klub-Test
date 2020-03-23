
class AppConfig {
	config

	constructor() {
		this.config = {
			secret: {
				key: 'klub-secret-2019'
			},
			port: 3000
		}
	}


}

export default new AppConfig().config;
