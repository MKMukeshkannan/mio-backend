import express from 'express';
import institution_routes from './routes/InstitutionsRoute.js';
import auth_routes from './routes/AuthRoute.js';
import error_handler from './middleware/ErrorHandler.js';
import credentials, { corsOptions } from './middleware/CredentialMiddleware.js';
import cors from 'cors'
import { PORT } from './utils/config.js';
import cookie_parser from 'cookie-parser';

const app = express();

app.use(credentials);
app.use(cookie_parser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/institutions", institution_routes);
app.use("/api/v1/auth", auth_routes);

app.get("/test", (_, res) => {
  res.send("YO KO SO !!!");
});

app.use(error_handler);

app.listen(PORT, () => {
  console.log(`Listening on port 🚀 : ${PORT}`);
});
