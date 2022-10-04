import mongoose from 'mongoose';

const ProjectsSchema = new mongoose.Schema({

	// 	* "ProjectID": "Company # - Div # - JobCode",
	// 	* "ProjectName" : "string",
	// 	* "Div":  "int",
	// 	* "CompanyNo" : "int",
	// 	* "JobCode": "string",
	// 	"ProjectDirectory": "string",
	// 	* "City": "string",
	//  * "State" : "string"
	//  "Builder": string
	//  Builder Job Number: int or string?????
	// 	"Project Manager" : "string",
	// 	"Subjob": [{
	// 	"StartDate" : "Date",
	// 	"Lot": [{
// 		"LotNo": "string",
	//	"Address": "string",
	// "Garage Orientation": "string",
	//		"Subjob #": "string",
	// 		"Plan": "string",
	// 		"Elevation": "string",
	// 		"FND_Price" : "float",
	// 		"FW_Price" : "float",
	// 		"ContractRevNo": "int",
	//      "Type": "String"
	// 		"Options": [{
	// 			"Option": "string",
	// 			"OptionCode": "string",
	// 			"Description": "string",
	// 			"FND_Price" : "float",
	// 			"FW_Price" : "float"
	// 		}]
		// 	}]
		// }]

	jobId: {
		type: String, 
		required: true
	},
	projectName: {
		type: String,
		required: true
	},
	div: {
		type: Number,
		required: true,
	},
	companyNo: {
		type: Number,
		required: true
	},
	jobCode: {
		type: String,
		trim: true,
		required: 'Job code required.',
		maxLength: 6
	},
	projectDirectory: {
		type: String
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	builder: {
		type: String,
		required: true
	},
	builderJobNo: {
		type: String
	},
	builderName: {
		type: String
	},	
	projectManager: {
		type: String
	},
	lot: [{
		lot: String,
		address: String,
		startDate : Date,
		subJob: String,
		orientation: String,
		plan: String,
		elevation: {
			type: String,
			trim: true,
			// enum: ['A','B','C','D','E','F','G','OPT']
		},
		options: [{
			option: String,
			optionCode: String,
			description: String,
		}],
		fndTotal : Number,
		fwTotal : Number,

		// The current contract revision number
		contractNo: Number,
		purchaseOrder: [{
			poNumber: orderNumber,
			orderId: orderID,
			orderPrice: PO_Price,
		}],
		settled: {
			type: Boolean,
			default: false
		},
	}],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	updated: Date
});


ProjectsSchema.path('jobCode').validate(function(value){
	if(this.jobCode && this.jobCode.length < 6){
		this.invalidate('jobCode', 'jobCode must be 6 characters.');
	}
	if(this.isNew && !this.jobCode){
		this.invalidate('jobCode', 'jobCode is required.');
	}
}, null);

export default mongoose.model('Projects', ProjectsSchema);

