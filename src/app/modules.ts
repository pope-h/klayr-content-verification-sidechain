/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'klayr-sdk';
import { ContentVerifierModule } from "./modules/content_verifier/module";

export const registerModules = (_app: Application): void => {

    _app.registerModule(new ContentVerifierModule());
};