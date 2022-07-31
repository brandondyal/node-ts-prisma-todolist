import { app } from './app';

const port = Number(process.env.PORT ?? 8080);

app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at http://localhost:${port}`);
});
