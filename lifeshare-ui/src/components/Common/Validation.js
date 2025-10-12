import {useCallback, useEffect} from 'react';
import {Input, Error} from "@progress/kendo-react-all";

export const RegExpTypes = Object.freeze({
    ID: new RegExp(/^[a-z][a-z0-9]{3,11}$/),
    PW: new RegExp(/^([a-z]+)([a-z0-9]){4,15}$/),
    NUMBER: new RegExp(/[^0-9]/, "g"),
    EMAIL_DOMAIN: new RegExp(/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/, "i"),
    KOREAN: new RegExp(/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/, "g")
});

/**
 * @className : CommonValidator
 * @description : validate를 실행한다.
 * @param value : 값
 * @param pattern : RegExp 정규식
 * @param message : string 에러메시지
 * @date : 2021-05-17 오후 5:32
 * @author : parksujin
 * @version : 1.0.0
 * @see
 * @history :
 **/
export const CommonValidator = (value, pattern, message) => pattern.test(value) && value ? "" : message;

/**
 * @className : CommonValidatedInput
 * @description : 커스텀 Input
 * @date : 2021-05-17 오후 5:33
 * @author : parksujin
 * @version : 1.0.0
 * @see
 * @history :
 **/
export const CommonValidatedInput = (FieldRenderProps) => {

    const {validationMessage, visited, name, value, defaultValue, flag, ...others} = FieldRenderProps;

    //useCallback : deps안의 state의 변경이 있을때만 실행된다.
    const onValueChange = useCallback(
        (event) => {
            FieldRenderProps.onChange(event.target.value)
        },
        [FieldRenderProps.onChange]
    );

    useEffect(() => {
        if (FieldRenderProps.formref) {
            FieldRenderProps.formref.current
                ? FieldRenderProps.formref.current.valueSetter(name, defaultValue)
                : FieldRenderProps.formref.valueSetter(name, defaultValue);
        }
    }, [FieldRenderProps.defaultValue]);

    return (
        <div>
            <Input
                name={name}
                value={defaultValue !== undefined && defaultValue !== "" ? defaultValue : value}
                onChange={onValueChange}
                {...others}/>
            {
                visited && flag && value &&
                (<Error>{validationMessage}</Error>)
            }
        </div>
    );
};

/**
 * @className : EngKrValidatedInput
 * @description : 한글 또는 영소문자만 유효한 커스텀 Input ex)구성원이름
 * @date : 2022-03-02 오후 1:33
 * @author : parksujin
 * @version : 1.0.0
 * @see
 * @history :
 **/
export const EngKrValidatedInput = (value) => {
    const regEng = /^[a-z]+$/;
    const regKr = /^[가-힣]+$/;
    if(regEng.test(value) || regKr.test(value) || value===""){
        return true;
    }
}

/**
 * @className : EngKrValidatedInput
 * @description : 영소문자+숫자 또는 영소문자만 유효한 커스텀 Input ex)아이디
 * @date : 2022-03-03 오후 12:11
 * @author : parksujin
 * @version : 1.0.0
 * @see
 * @history :
 **/
export const EngNumValidatedInput = (value) => {
    const regEng = /^[a-z]+$/;
    const regEngNum = /^(?=.*[a-z])(?=.*\d)[a-z\d]+$/; //영소문자 또는 숫자가 각각 1개이상 들어가야함
    if(regEng.test(value) || regEngNum.test(value)){
        return true;
    }
}

/**
 * @className : EngNumSpecValidatedInput
 * @description : 영소문자+숫자 또는 영소문자+숫자+특수문자만 유효한 커스텀 Input ex)비밀번호
 * @date : 2022-03-10 오전 10:11
 * @author : parksujin
 * @version : 1.0.0
 * @see
 * @history :
 **/
export const EngNumSpecValidatedInput = (value) => {
    const regEngNum = /^(?=.*[a-z])(?=.*\d)[a-z\d]+$/; //영소문자, 숫자가 각각 1개이상 들어가야함
    const regEngNumSpec = /^(?=.*[a-z])(?=.*\d)(?=.*[!@$&*])[a-z\d!@$&*]+$/; //영소문자, 숫자, 특수문자 각각 1개이상 들어가야함
    if(regEngNum.test(value) || regEngNumSpec.test(value)){
        return true;
    }
}