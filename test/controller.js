import Projects from '../models/projects.model.js';
import Builders from '../models/builders.model';

import config from '../../config/config.js';

import {getErrorMessage,getUniqueError} from '../helpers/mongoErrorHandler.js';
import redis from 'redis';

const redisClient = redis.createClient(config.redisPort);
await redisClient.connect();
redisClient.on('error', (error) => {
	console.log(error);
});

// The data will be pushed from Hyphen to Redis. The data will be in a JSON format.
//{
// 	"header": {
// 		"id": 22053346,
// 		"builderOrderNumber": "92592013-000",
// 		"supplierOrderNumber": null,
// 		"issueDate": "2022-04-13T00:00:00",
// 		"accountNumber": "NCA-1277535",
// 		"accountCode": null,
// 		"accountCode2": null,
// 		"accountCode3": null,
// 		"purpose": "Original",
// 		"orderType": "PurchaseOrder",
// 		"orderCurrency": "USD",
// 		"orderLanguage": "en",
// 		"orderHeaderNote": null,
// 		"additionalReferenceNumber": null,
// 		"supplierReferenceNumber": null,
// 		"buyerStatus": null,
// 		"ticketId": null,
// 		"warrantyRequestedStartTime": null,
// 		"warrantyRequestedEndTime": null,
// 		"deliveryType": "Null",
// 		"crewId": "-1",
// 		"storeMapNumber": null,
// 		"startDate": "2022-10-11T00:00:00",
// 		"endDate": "2022-10-11T00:00:00",
// 		"builder": {
// 			"id": "22B466A4-0AC4-4DB8-BC99-18158643261E",
// 			"address": {
// 				"name": "MDC Holdings, Inc - Northern California Div.- Rich",
// 				"street": "One Harbor Center, Suite 100",
// 				"streetSupplement": null,
// 				"city": "Suisun City",
// 				"stateCode": "USCA",
// 				"postalCode": "94525"
// 			},
// 			"primaryContacts": {
// 				"name": "Josh Sahner",
// 				"phone": "(999) 000-0000",
// 				"email": "sbctest@hyphensolutions.com",
// 				"eDestinationEmailAddress": "sbctest@hyphensolutions.com",
// 				"bidConnectEmailAddress": "sbctest@hyphensolutions.com",
// 				"purchasingEmailAddress": null,
// 				"purchasingCcEmailAddress": null,
// 				"accountingEmailAddress": "sbctest@hyphensolutions.com",
// 				"warrantyEmailAddress": "sbctest@hyphensolutions.com"
// 			}
// 		},
// 		"supplier": {
// 			"id": "D7149390-65F2-470C-96E1-0B8612A992BB",
// 			"address": {
// 				"name": "CONCRETE VALUE CORP",
// 				"street": "530 BERCUT DRIVE SUITE G",
// 				"streetSupplement": null,
// 				"city": "SACRAMENTO",
// 				"stateCode": "USCA",
// 				"postalCode": "95811"
// 			},
// 			"primaryContacts": {
// 				"name": "Order Processing",
// 				"phone": "(555) 555-5555",
// 				"email": "sgarcia@concretevalue.com"
// 			}
// 		},
// 		"shippingInformation": {
// 			"address": {
// 				"name": "27250081 - 360 Lexington Court - 81/21",
// 				"street": "360 Lexington Court",
// 				"streetSupplement": null,
// 				"city": "Lincoln",
// 				"stateCode": "USCA",
// 				"postalCode": "95648"
// 			},
// 			"primaryContacts": {
// 				"name": "Andrew Mullikin",
// 				"phone": "00-0000",
// 				"email": "sbctest@hyphensolutions.com"
// 			}
// 		},
// 		"billingInformation": {
// 			"address": {
// 				"name": "Revere at Independence",
// 				"street": "1 Harbor Center, Ste 100",
// 				"streetSupplement": null,
// 				"city": "Suisun City",
// 				"stateCode": "USCA",
// 				"postalCode": "94585"
// 			},
// 			"primaryContacts": {
// 				"name": null,
// 				"phone": "9494672600",
// 				"email": "Nicole.Dozier@mdch.com"
// 			}
// 		},
// 		"task": {
// 			"taskNum": "21",
// 			"name": "Concrete Pour Slab [1277535 - 92592013-000 - 43255][ON]",
// 			"description": null
// 		},
// 		"job": {
// 			"jobNum": "124287",
// 			"name": "27250081 - 360 Lexington Court - 81/21",
// 			"street": "360 Lexington Court",
// 			"streetSupplement": null,
// 			"city": "Lincoln",
// 			"stateCode": "USCA",
// 			"postalCode": "95648",
// 			"subdivision": "Revere at Independence",
// 			"phase": "Phase 1",
// 			"lot": "81",
// 			"block": "21",
// 			"plan": "N617",
// 			"elevation": "A",
// 			"swing": "L",
// 			"permitNumber": "BLD22-01193",
// 			"startDate": "5/9/2022",
// 			"endDate": "5/9/2022",
// 			"colorPackage": null,
// 			"jioId": "0",
// 			"primaryFirstName": "Andrew",
// 			"primaryLastName": "Mullikin",
// 			"primaryPhoneNumber": "00-0000",
// 			"primaryFaxNumber": "9999999999",
// 			"primaryEmailAddress": "sbctest@hyphensolutions.com",
// 			"communityId": "0",
// 			"communityCode": null,
// 			"communityCode2": null,
// 			"communityCode3": null,
// 			"groupDescription": "Default"
// 		},
// 		"options": [
// 		]
// 	},
// 	"items": [
// 	],
// 	"summary": {
// 		"numberOfLines": 0,
// 		"taxAmount": 0,
// 		"orderSubTotal": 13278.4,
// 		"orderTotal": 13278.4
// 	}
// }

//We are trying to push a PO into the system and match them up to a lot number.
const postOrder = async (req, res) => {
    try {
        // Pulling the lot information from the hyphen Post Request
        let projectInfo = {
            builderName = req.header.job.subdivision

        }

        let lotInfo = {
            lot: req.header.job.lot,
            address: req.header.job.address,
            startDate: req.header.job.startDate,
            endDate: req.header.job.endDate,
            subjob: req.header.job.phase,
            lotPlan: req.header.job.plan,
            Elevation: elevation,
            garageOrientation: swing,
            lotPO: [{
                orderNumber: req.header.builderOrderNumber,
                orderID: req.header.id,
                orderPrice: req.summary.orderTotal,
                orderStartDate: projectedStartDate
            }],
            options = []
        }
        
        let builderInfo = {
            builderName: req.header.builder.address.name,
            address: {   
                street: req.header.builder.address.street,
                street2: req.header.builder.address.streetSupplement,
                city: req.header.builder.address.city,
                state: req.header.builder.address.stateCode.split('US')[1],
                zip: req.header.builder.address.postalCode,
            },
            contacts: {
                name: req.header.builder.primaryContacts.name,
                phone: req.header.builder.primaryContacts.phone,
                email: req.header.builder.primaryContacts.email
            },
            hypenID: req.header.builder.id,
        }



        // Pulling the PO information from the hyphen Post Request




       
        let projectedStartDate = req.header.startDate;
        let projectName = req.header.job.subdivision;
        let elevation = req.header.job.elevation;
        let swing = req.header.job.swing;
        let PO_Price = req.summary.orderTotal;
        
        // Pulling the options from the request
        if (req.header.options) {
            req.header.options.forEach(option => {
                options.push({
                    optionCode: option.id,
                    optionName: option.name,
                    optionDescription: option.description
                });
            });
        }

        // Check the builder table to see if the builder exists. If not create a new entry. Then check if the project exists.
        // If not create a new entry. If it does, then update the project file to contain the lot.
        let builder = await Builder.findOne({ hyphenID: builderID });
        let project = await Project.findOne({ builderName: projectName });

        
        // 4 cases:
        // 1. Builder and Project exist
        // 2. Builder exists, Project does not exist
        // 3. Builder does not exist, Project exists
        // 4. Neither exist

        // Case 1: Builder and Project exist
        // We will check if the lot number exists in the project. If it does, we will compare the lot with the new information.
        if (builder && project) {
            // Two Cases:
            // 1. Lot exists
            // 2. Lot does not exist

            // Case 1: Lot exists
            project.forEach(lot => {
                if (lotInfo.lotNo === subjob.lotNo) {
                    // Check if the PO exists
                    lotInfo.lotPO.forEach(po => {
                        if (po.orderNumber === lot.lotPO.orderNumber) {
                            // PO exists, update the PO
                            lot.lotPO = po;
                        } else {
                            // PO does not exist, add the PO
                            lot.lotPO.push(po);
                        }
                    });
                } else {
                    // Case 2: Lot does not exist
                    // Add the lot to the project
                    project.subjob.forEach(
                        lot => {
                            if (lot.)
                            lot.push(lotInfo);
                        } 
                    );
                }

            // Check if street address is the same
            // Push the lot information into the project
            }


        // Case 2: Builder exists, Project does not exist
        } else if (builder && !project) {
            // Create a new project
            let newProject = new Project({
                projectName: projectName,
                projectAddress: street,
                projectPhase: phase,
                Subjob: [{
                        subjob: phase,
                        lotNumber: lot,
                        lotPlan: plan,
                        lotElevation: elevation,
                        lotSwing: swing,
                        lotPO: [{
                                orderNumber: orderNumber,
                                orderID: orderID,
                                orderPrice: PO_Price,
                                orderOptions: options,
                                orderStartDate: projectedStartDate
                            }]
                }]
            });
            await newProject.save();
        }

        // Case 3: Builder does not exist, Project exists
        if (!builder && project) {
            // Check if the names of builders from ouir tables match or are a substring of the builder name from the request
            // Create a new builder

            // 2 cases:
            // 1. Builder name is null
            // 2. Builder name is a substring

            // Case 1: Builder name is null
            if (project.builder === null) {
                // Create a new builder
                let newBuilder = new Builder({
                    // Temporary id, need to automatically generate
                    builderID: -1,
                    builderName: req.header.builder.address.name,
                    address: {   
                        street: req.header.builder.address.street,
                        street2: req.header.builder.address.streetSupplement,
                        city: req.header.builder.address.city,
                        state: req.header.builder.address.stateCode.split('US')[1],
                        zip: req.header.builder.address.postalCode,
                    },
                });

                newBuilder.projects.append(project.projectID)
                await newBuilder.save();               
            }

            // Case 2: Builder name is a substring
            else if (project.builder !== null) {
                if (req.header.builder.address.name.includes(project.builder)) {
                    // Set that builders hyphen ID to the builder ID from the request
                    let builder = await Builder.findOne({ builderName: project.builder });
                    builder.hyphenID = builderID;
                    await builder.save();
                }
            }


        }

        // Case 4: Neither exist
        if (!builder && !project) {
            // Create a new builder
            let newBuilder = new Builder({
                // Temporary id, need to automatically generate
                builderID: -1,
                builderName: req.header.builder.address.name,
                address: {   
                    street: req.header.builder.address.street,
                    street2: req.header.builder.address.streetSupplement,
                    city: req.header.builder.address.city,
                    state: req.header.builder.address.stateCode.split('US')[1],
                    zip: req.header.builder.address.postalCode,
                },
            });
            await newBuilder.save();
            
            // Create a new project
            let newProject = new Project({
                projectName: projectName,
                projectAddress: street,
                projectPhase: phase,
                Subjob: [{
                    subjob: phase,
                    lotNumber: lot,
                    lotPlan: plan,
                    lotElevation: elevation,
                    lotSwing: swing,
                    lotPO: [{
                            orderNumber: orderNumber,
                            orderID: orderID,
                            orderPrice: PO_Price,
                            orderOptions: options,
                            orderStartDate: projectedStartDate
                    }]
                }]
            });
        }


        return res.status(200).json({lotInfo});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
}
