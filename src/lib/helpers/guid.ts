export class Guid {

    public static get newGuid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
        }

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }

    public static get empty(): string {
        return "00000000-0000-0000-0000-000000000000";
    }

    private readonly value: string;

    constructor(data?: string) {
        if (data) {
            const reg = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            if (!reg.test(data)) {
                throw new Error(`Invalid GUID format: ${data}`);
            }
            this.value = data;
        }
    }

    public toString(): string {
        return this.value;
    }

    public get isEmpty() {
        return this.value === Guid.empty;
    }
}
