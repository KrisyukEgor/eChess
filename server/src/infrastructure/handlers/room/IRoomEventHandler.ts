import { ClientMeta } from "../../value-objects/clientMeta"

export interface IRoomEventHandler<Payload> {
    handle(meta: ClientMeta, payload: Payload): void;
}