import { ServerClient } from "postmark";

const postMarkClient = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

export default postMarkClient;
