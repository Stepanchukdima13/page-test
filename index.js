const pipedrive = require('pipedrive');


const defaultClient = new pipedrive.ApiClient();

let apiToken = defaultClient.authentications.api_key;
apiToken.apiKey = '06019c1eda56cbb147a21cc752aef3ba59ecbfde';


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const port= process.env.PORT || 8080;



app.use(express.static(path.join(__dirname, 'views')))

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

app.post('/send-object', (req, res) => {
    let receivedData = req.body;
    console.log(receivedData)
    updatePerson(receivedData)
    updatingCustomFieldValue(receivedData)
    res.json({ message: 'Everything is ok' });
    });

    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    });

async function updatingCustomFieldValue(objData) {
    try {
        console.log('Sending request...');

        const DEAL_ID = 2;
        const fieldsApi = new pipedrive.DealFieldsApi(defaultClient);
        const dealsApi = new pipedrive.DealsApi(defaultClient);
        const dealFields = await fieldsApi.getDealFields();

        function findFieldKey(fieldName) {
            const field = dealFields.data.find(field => field.name === fieldName);
            return field ? field.key : undefined;
        }
        const updates = Object.keys(objData).reduce((acc, fieldName) => {
            const key = findFieldKey(fieldName);
            if (key) {
                acc[key] = objData[fieldName];
            }
            return acc;
        }, {});
        const updatedDeal = await dealsApi.updateDeal(DEAL_ID, updates);

        console.log('The value of the custom field was updated successfully!', updatedDeal);
    } catch (err) {
        const errorToLog = err.context?.body || err;

        console.log('Updating failed', errorToLog);
    }
}

async function updatePerson(objData) {
    try {
        console.log('Sending request...');
        const api = new pipedrive.PersonsApi(defaultClient);

        const PERSON_ID = 1 ;
        const data = {
            first_name: objData.firstName,
            last_name:objData.lastName,
            owner_id: 1,
            org_id: 2,
            email: [
                {
                    value: objData.Email,
                    primary: true,
                    label: "Email"
                }
            ],
            phone: [
                {
                    value: objData.Phone,
                    primary: true,
                    label: "Phone"
                },
            ],
            visible_to: "3"
        }
        const response = await api.updatePerson(PERSON_ID, data);

        console.log(`Person updated successfully!`, response);
    } catch (err) {
        const errorToLog = err.context?.body || err;

        console.log('Person update failed', errorToLog);
    }
}

