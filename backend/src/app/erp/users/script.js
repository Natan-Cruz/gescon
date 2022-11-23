import knex from "../../../database/database.knex"
import nanoid from "../../../utils/nanoid"

const permissions = [
    {
        name: "page.construction.services",
        display_name: "Página de serviços da obra"
    },
    {
        name: "page.construction.materials",
        display_name: "Página de materiais da obra"
    },
    {
        name: "page.construction.diarys",
        display_name: "Página de diário da obra"
    },
    {
        name: "page.construction.cloud",
        display_name: "Página de diário da obra"
    }
]

;(async () => {
    await knex("user_scheme.permissions").insert(permissions.map( ({ name, display_name }) => {
        return {
            id: nanoid(),
            name,
            display_name
        }
    }))
})