export const TRIGGER_EVENT = "@@RD2/TRIGGER_EVENT";
export const RELOAD_EVENT = "@@RD2/RELOAD_EVENT";

export const setTriggerEvent = (timestamp) => ({
    type : TRIGGER_EVENT,
    payload : timestamp
});

export const setReloadEvent = (timestamp) => ({
    type : RELOAD_EVENT,
    payload : timestamp
});
