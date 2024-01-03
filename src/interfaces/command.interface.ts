export interface Command {
    name: string,
    description: string,
    cooldown?: number,
    options?: {
        name: string,
        description: string,
        type: number,
        required?: boolean,
        choices?: {
            name: string,
            value: string
        }[]
    }[]
}