// For filtering out/format mongoose error messages
module.exports = {
    normalizeErrors: function(errors){
        //Will gather properties and its details in this array
        let normalizeErrors = []; 
        //searches for properties of errors 
        for (let property in errors){
            // if found,
            if (errors.hasOwnProperty(property)){
                 //gathers title and details in the array
                normalizeErrors.push({title: property,detail: errors[property].message});
            }
        }// then displays them in error message handler
        return normalizeErrors;
    }
}