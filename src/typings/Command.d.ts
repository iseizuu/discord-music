export interface CommandConfig {
    name: string;
    aliases?: string[];
    description?: string;
    cooldown?: number;
    ownerOnly?: boolean;
    category?: string;
}
