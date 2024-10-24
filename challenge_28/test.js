let objectsRetrieved = [{approved:true, }]//req.body;
const objectsToBeCreated = [];
let objectCount = 0;
let exclusiveObjectCount = 0;
let exclusiveUnapprovedObjectCount = 0;

const EXCLUSIVE_PASSCODE = "abc"

function createObjects(objects) { 
  // code to save the custom object in the database 
}
function createExclusiveObjects(objects) { 
  // code to save the exclusive object in the database
}

try {
    for(const object of objectsRetrieved) {
        if(object.type === 'exclusive') {
            if(object.exclusivePasscode === EXCLUSIVE_PASSCODE/*process.env.EXCLUSIVE_PASSCODE*/) {
                objectsToBeCreated.push(Object.assign({approved: true}, object));
            } else {
                //res.send
                console.log('Invalid passcode');
                return;
            }
        } else {
            objectsToBeCreated.push(Object.assign({approved: false}, object));
        }
    }
    for(const object of objectsToBeCreated) {
        if(object.type === 'exclusive' && object.approved) {
            exclusiveObjectCount++;
            createExclusiveObjects(object);
        } else if(object.type === 'exclusive') {
            exclusiveUnapprovedObjectCount++;
        } else {
            objectCount++;
            createObjects(object);
        }
    }

    //res.send
    console.log(`Successfully created ${exclusiveObjectCount} exclusive objects,` + 
             `${exclusiveUnapprovedObjectCount} exclusive objects pending approval and ` + 
             `${objectCount} standard objects`);

} catch(e) {
    console.log(e);
    //res.send(e.message);
}