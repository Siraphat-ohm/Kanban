import { CommandInteraction, GuildMemberRoleManager } from "discord.js";

const verifyRoles = (c: CommandInteraction, roles: string[]) => {
    const member = c.member?.roles as GuildMemberRoleManager;
    const userRoles = member.cache.map( r => r.name );
    if ( userRoles.some( r => roles.includes(r) ) ) return true;
    else return false;
}

export default verifyRoles;