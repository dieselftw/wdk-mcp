import { z } from "zod";
import { type Tool } from "fastmcp";

export interface WdkMcpTool<T extends z.ZodSchema> {
    name: string;
    description: string;
    parameters: T;
    execute: (args: z.infer<T>) => Promise<any>;
}

/**
 * Converts a WdkMcpTool to a FastMCP Tool, automatically stringifying the return value
 */
export function toFastMcpTool<T extends z.ZodSchema>(tool: WdkMcpTool<T>): Tool<any, any> {
    return {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        execute: async (args: any) => {
            const result = await tool.execute(args);
            
            // Convert result to string always because the FastMCP Tool interface expects a string ._.
            if (typeof result === 'string') {
                return result;
            } else if (typeof result === 'object') {
                return JSON.stringify(result, null, 2);
            } else {
                return String(result);
            }
        }
    };
}