export default class GesconError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = "GesconError"; // (2)
    }
}