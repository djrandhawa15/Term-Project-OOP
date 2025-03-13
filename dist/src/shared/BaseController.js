import { createFactory } from "hono/factory";
export class BaseController {
    router;
    factory = createFactory();
    constructor() {
        this.router = this.factory.createApp();
    }
}
//# sourceMappingURL=BaseController.js.map