const defaultModules = [{ module_name: "registrations" }, { module_name: "system" }]

function viewer(accessControl, moduleName){
    if(moduleName === undefined || !moduleName) 
        return true

    if(!accessControl || !Object.entries(accessControl).length) 
        return false

    const moduleWasHired = accessControl.modules_contracted_company.concat(defaultModules).findIndex( elem => elem.module_name === moduleName)
    if(moduleWasHired === -1)
        return false

    const userHasPermission = accessControl.permissions.findIndex( elem => elem.name === moduleName )
    if(userHasPermission === -1)
        return false

    return true
}

export default viewer;