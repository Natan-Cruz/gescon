
export async function getAllOccurrenceForGenerateReport(constructionID){
    const occurrences = await knex("occurrences as o")
        .select('o.*', "os.createdAt as createdAt")
        .innerJoin("occurrenceStatus as os", "os.id", function() {
            this.select("id")
                .from("occurrenceStatus")
                .where("occurrenceID", knex.raw("o.id"))
                .orderBy("createdAt", "desc")
                .limit(1)
        })
        .where({ 
            "o.constructionID": constructionID,
            "o.scope": "external"
        })
        .whereIn("os.statusCode", [1, 2])
        .orderBy("createdAt", "asc")
        
    const occurrencesThirdPartyCompanies = await knex("occurrences as o")
        .select('tpc.*', 'o.id as occurrenceID')
        .innerJoin("occurrenceStatus as os", "os.id", function() {
            this.select("id")
                .from("occurrenceStatus")
                .where("occurrenceID", knex.raw("o.id"))
                .orderBy("createdAt", "desc")
                .limit(1)
        })
        .innerJoin("construction_scheme.occurrence_entities as otpc", "otpc.occurrenceID", "o.id")
        .innerJoin("thirdPartycompanies as tpc", "tpc.id", "otpc.thirdPartyCompanyID")
        .where({ 
            "o.constructionID": constructionID,
            "o.scope": "external"
        })
        .whereIn("os.statusCode", [1,2])
        .orderBy("createdAt", "asc") 

    return occurrences.map( occur => {
        occur.thirdPartyCompanies = []
        occurrencesThirdPartyCompanies.forEach( otpc => {
            if(otpc.occurrenceID === occur.id)
                occur.thirdPartyCompanies.push(otpc)
        })

        return occur
    })
}