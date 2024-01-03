import { APIApplicationCommandPermissionsConstant, CommandInteraction } from "discord.js";
import { Jot } from "../../interfaces/jot.interface";
import { descriptionQuestion, dueDateQuestion, isExamQuestion, subjectQuestion } from "./question";

const jot = async (interaction: CommandInteraction) => {
    try {
        const msg_input = {} as Jot;
        await subjectQuestion( msg_input, interaction, true );
        await descriptionQuestion( msg_input, interaction, true );
        await dueDateQuestion( msg_input, interaction, true );
        await isExamQuestion( msg_input, interaction, true );

        await interaction.editReply('Jot created!');
    
        console.log(msg_input)

    } catch (e) {
        console.log(e);
    } 
};

export default jot;