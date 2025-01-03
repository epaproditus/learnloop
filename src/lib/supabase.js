"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.ensureArray = ensureArray;
exports.ensureNonNullable = ensureNonNullable;
exports.assertType = assertType;
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
var supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'learnloop-auth',
        flowType: "pkce",
    },
});
// Helper functions for type casting
function ensureArray(data) {
    if (Array.isArray(data))
        return data;
    if (data === null)
        return [];
    return [data];
}
function ensureNonNullable(data) {
    if (data === null)
        throw new Error("Unexpected null value");
    return data;
}
// Type assertion helper for Supabase responses
function assertType(data) {
    // This is a type assertion function that does nothing at runtime
    // It's used to tell TypeScript that a value is of a certain type
}
