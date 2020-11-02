export interface CommandConfig {
    name: string;
    aliases?: string[];
    description?: string;
    cooldown?: number;
    category?: string;
}
