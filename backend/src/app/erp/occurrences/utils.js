export function defineStatusNames( status ){
    const statusCode = status.status_code;
    switch(statusCode){
        case 1:
            status.status_name = "Ocorrência criada";
            break
        case 2:
            status.status_name = "Vizualizado pela construtora";
            break;
        case 3:
            status.status_name = "Notificação enviada para terceira parte";
            break;
        case 4:
            status.status_name = "Vizualizada pela terceira parte";
            break
        case 5:
            status.status_name = "Em progresso";
            break
        case 6:
            status.status_name = "Finalizado por parte do terceiro";
            break
        case 7:
            status.status_name = "Finalizado por parte da construtora"
            break
        case 8:
            status.status_name = "Ocorrência encerrada"

    }
    return status
}