export interface CommandConfig {
    name: string;
    aliases?: string[];
    description?: string;
    usage?: string;
    cooldown?: number;
    ownerOnly?: boolean;
    category?: string;
}
