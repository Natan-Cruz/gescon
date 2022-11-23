import "regenerator-runtime/runtime.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import loadersRoutes from "./loadersRoutes";
import path from "path";
// import morganMiddleware from "./midlewares/morganMiddleware";

const app = express()

const port = process.env.PORT || 3000;

// Desabilita o cors
app.use(cors());
// Força para que todas as rotas permitam o no-cors
app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header(
    "Permissions-Policy",
    "geolocation=(), interest-cohort=()"
  );

  next();
})

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/payments/webhook')) {
    next();
  } else {
    express.json()(req, res, next);
    express.urlencoded({ extended: true})
  }
});

// Protege a entrada dos "headers"
app.use(helmet());
// Comprime a saida "g-zip"
app.use(compression());
// 
// app.use(morganMiddleware)


app.use('/icons',express.static(path.join(__dirname, 'public/icons')));

// Carrega as rotas
loadersRoutes(app)
// Sobe servidor
app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`)
})