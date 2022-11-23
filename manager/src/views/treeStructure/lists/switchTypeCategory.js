export default function switchTypeCategory(type_category){
    let c;
    switch(type_category){
        case "company": c = "Empresa"; break
        case "construction": c = "Obra"; break
        case "local": c = "Local"; break
        case "asset": c = "Ativo"; break
        case "service": c = "Serviço"; break
        default: c = ""
    }
    return c
}