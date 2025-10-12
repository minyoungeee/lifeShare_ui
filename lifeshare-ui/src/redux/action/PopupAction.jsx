export const STAGE_CHANGE = "@@RD2/STAGE_CHANGE";
export const SET_MULTI_POPUP = "@@RD2/SET_MULTI_POPUP";

export const onStageChange = (state) => ({
    type : STAGE_CHANGE,
    payload : state
});

export const setMultiPopup = (state) => ({
    type : SET_MULTI_POPUP,
    payload : state
});
