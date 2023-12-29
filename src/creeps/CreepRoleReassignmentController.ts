import { TickRunnable } from "types/TickRunnable";
import { CreepRole } from "types/creeps/CreepRole";

export class CreepRoleReassignmentController implements TickRunnable {
    private room: Room;
    private roleToCreeps: Map<CreepRole, Creep[]>;

    constructor(room: Room, creeps: Creep[], roleToCreeps: Map<CreepRole, Creep[]> = new Map()) {
        this.room = room;
        this.roleToCreeps = roleToCreeps;
        for (const creep of creeps) {
            const role = creep.memory.role as CreepRole;
            if (!this.roleToCreeps.has(role)) {
                this.roleToCreeps.set(role, []);
            }
            this.roleToCreeps.get(role)?.push(creep);
        }
    }

    public run(): void {
        this.reassignBuilders();
    }

    private reassignBuilders(): void {
        const constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);
        const constructionSiteCount = constructionSites.length;
        const builders = this.roleToCreeps.get(CreepRole.Builder) ?? [];
        if (constructionSiteCount === 0) {
            for (const builder of builders) {
                builder.memory.actingRole = CreepRole.Upgrader;
            }
        }
        else {
            for (const builder of builders) {
                builder.memory.actingRole = undefined;
            }
        }
    }

}
