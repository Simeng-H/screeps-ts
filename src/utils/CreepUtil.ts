export default class CreepUtil {
    static calculateBodyCost(body: BodyPartConstant[]): number {
        return body.reduce((total, part) => total + BODYPART_COST[part], 0);
    }
}
