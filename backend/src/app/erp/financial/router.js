import { Router } from "express";
import auth from "../../../midlewares/auth";

import * as controllersPayroll from "./controllers/payroll"
import * as controllerAccounts from "./controllers/bankAccounts";
import * as controllerBankTransfers from "./controllers/bankTransfers"
import * as controllerBankReconciliations from "./controllers/bankReconciliations"
import * as controllerBankTransactions from "./controllers/bankTransactions"
import * as controllerCostCenter from "./controllers/costCenter"
import * as controllerChartAccounts from "./controllers/chartAccounts"

const router = Router();

// payroll 
router.get("/payroll", auth, controllersPayroll.getAllPayroll)
router.get("/payroll/:id", auth, controllersPayroll.getOnePayroll)
router.post("/payroll", auth, controllersPayroll.createNewPayroll)
router.put("/payroll", auth, controllersPayroll.editPayroll)
// router.delete("/financial/payroll", auth, controllersPayroll.createNewPayroll)

// banks accounts
router.get("/bank/accounts", auth, controllerAccounts.getAllBankAccountsOrCreditCards)
router.get("/bank/accounts/:id", auth, controllerAccounts.getOneBankAccount)
router.post("/bank/accounts", auth, controllerAccounts.createBankAccount)
router.put("/bank/accounts", auth, controllerAccounts.editBankAccount)
router.delete("/bank/accounts/:id", auth, controllerAccounts.deleteBankAccount)

router.get("/bank/credit-cards/:id", auth, controllerAccounts.getOneCreditCard)
router.post("/bank/credit-cards", auth, controllerAccounts.createCreditCard)
router.put("/bank/credit-cards", auth, controllerAccounts.editCreditCard)
// router.delete("/bank/credit-cards", auth, controllerAccounts.deleteCreditCard)

// bank transfers
router.get("/bank/transfers", auth, controllerBankTransfers.getAllTransfers)
router.get("/bank/transfers/:id", auth, controllerBankTransfers.getOneTransfers)
router.post("/bank/transfers", auth, controllerBankTransfers.createBankTransfer)
router.put("/bank/transfers", auth, controllerBankTransfers.editBankTransfer)
router.delete("/bank/transfers/:id", auth, controllerBankTransfers.deleteBankTransfer)

// bank transactions
router.get("/bank/transactions", auth, controllerBankTransactions.getAllTransactions)
router.get("/bank/transactions/:id", auth, controllerBankTransactions.getOneTransaction)
router.get("/bank/transactions/:id/show", auth, controllerBankTransactions.getOneTransactionShow)
router.post("/bank/transactions", auth, controllerBankTransactions.createTransaction)
router.put("/bank/transactions", auth, controllerBankTransactions.editTransaction)
router.delete("/bank/transactions/:id", auth, controllerBankTransactions.deleteTransaction)

// bank reconciliations
router.get("/bank/reconciliations", auth, controllerBankReconciliations.getAllBankReconciliations)
router.get("/bank/reconciliations/:id", auth, controllerBankReconciliations.getOneBankReconciliation)
router.post("/bank/reconciliations", auth, controllerBankReconciliations.createBankReconciliation)
router.put("/bank/reconciliations/:id", auth, controllerBankReconciliations.editBankReconciliation)
router.delete("/bank/reconciliations/:id", auth, controllerBankReconciliations.deleteBankReconciliation)

// centro de custos
router.get("/cost-center/full-path/:path", auth, controllerCostCenter.getFullPathName)

router.get("/cost-center", auth, controllerCostCenter.getAllRegisters)
router.post("/cost-center", auth, controllerCostCenter.createRegister)
router.put("/cost-center", auth, controllerCostCenter.editRegister)
router.delete("/cost-center/:id", auth, controllerCostCenter.deleteRegister)

router.put("/cost-center/sort-items", auth, controllerCostCenter.editOrder)

// plano de contas
router.get("/chart-accounts", auth, controllerChartAccounts.getAllRegisters)
router.post("/chart-accounts", auth, controllerChartAccounts.createRegister)
router.put("/chart-accounts/", auth, controllerChartAccounts.editRegister)
router.delete("/chart-accounts/:id", auth, controllerChartAccounts.deleteRegister)

export { router };
