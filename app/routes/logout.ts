import { ActionFunctionArgs } from "@remix-run/node";
import { destroyUserSession } from "~/data/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    if(request.method==='post'){
        throw new Error("Invalid Request!");
    }
    return await destroyUserSession(request)
}