// ERP
import { router as routerERPPublic } from "./app/erp/public/router"
import { router as routerERPUsers } from "./app/erp/users/router";
import { router as routerERPRegistrations } from "./app/erp/registrations/router" 
import { router as routerERPAccounting } from "./app/erp/accounting/router"
import { router as routerERPFinancial } from "./app/erp/financial/router"
import { router as routerPayments } from "./app/erp/payments/router"
import { router as routerERPCloud } from "./app/erp/cloud/router";

// constructions
import { router as routerERPOcurrences } from "./app/erp/occurrences/router";
import { router as routerERPFiles } from "./app/erp/files/router";
import { router as routerERPMaterials } from "./app/erp/materials/router";
import { router as routerERPConstructions } from "./app/erp/constructions/router";


// CLIENTS
import { router as routerClientAuth } from "./app/client/auth/router"
import { router as routerClientInstallments } from "./app/client/installments/router"

// Função que carrega todas as rotas
export default function loadersRoutes(app) {
    // ERP
    // Rota que é responsavel por todas as obras cadastras
    app.use("/erp/constructions", routerERPConstructions);
    app.use("/erp/constructions", routerERPOcurrences)
    app.use("/erp/materials/", routerERPMaterials)
    // Rota resposanvel por usuarios
    app.use("/erp/", routerERPUsers)
    // Rota usada para pagina publica
    app.use('/erp/', routerERPPublic ); 
    // files
    app.use('/erp/files', routerERPFiles); 
    // CLOUD    
    app.use('/erp/', routerERPCloud ); 
    // accounting
    app.use("/erp/accounting", routerERPAccounting)
    app.use("/erp/financial", routerERPFinancial)
    // registrations 
    app.use("/erp/registrations", routerERPRegistrations)
    app.use('/erp/payments', routerPayments );
    
    // account for clients
    // CLIENTS
    app.use("/client", routerClientAuth)
    app.use("/client", routerClientInstallments)
}
