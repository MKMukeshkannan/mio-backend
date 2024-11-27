import express from 'express';
import institutionRoute from './routes/InstitutionsRoute.js';
import error_handler from './middleware/ErrorHandler.js';
import credentials, { corsOptions } from './middleware/CredentialMiddleware.js';
import cors from 'cors'
import { PORT } from './utils/config.js';

const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/institutions", institutionRoute);

app.get("/test", (_, res) => {
  res.send("YO KO SO !!!");
});

app.use(error_handler);

app.listen(PORT, () => {
  console.log(`Listening on port 🚀 : ${PORT}`);
});
