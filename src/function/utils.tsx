import React, {FC} from 'react';
import {useCallback, useState} from 'react';
import NumberFormat from "react-number-format"

interface Props {
    initialState: boolean
}

export const useToggle: FC<Props> = (initialState = false) => {
    // Initialize the state
    const [state, setState] = useState(initialState);
    // Define and memorize toggler function in case we pass down the component,
    // This function change the boolean value to it's opposite value
    const toggle = useCallback(() => setState(state => !state), []);
    return [state, toggle]
}

export const CostsFormat = (props) => {
    return (
        <NumberFormat
            value={props.value}
            thousandSeparator={' '}
            prefix={'€ '}
            displayType={'text'}
        />
    )
}

export const EffortFormat = (props) => {
    return (
        <NumberFormat
            value={props.value}
            thousandSeparator={' '}
            displayType={'text'}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    )
}