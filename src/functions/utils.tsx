import React from 'react';
import {NumericFormat} from "react-number-format"


/******************    CostsFormat BEGIN   ******************/
interface CostsFormatProps {
    showPrefix?: boolean,
    showSuffix?: boolean,
    children: number | null,
}

export const CostsFormat = ({showPrefix, showSuffix, children}: CostsFormatProps) => {

    if (children === null || children === 0.0) {
        return null;
    }

    return (
        <NumericFormat
            className={'font-monospace'}
            value={children / 1000}
            thousandSeparator={' '}
            prefix={showPrefix ? 'k€ ' : ''}
            suffix={showSuffix ? ' k€' : ''}
            displayType={'text'}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    )
}

/******************    CostsFormat END   ******************/


/******************    EffortFormat BEGIN   ******************/
interface EffortFormatProps {
    showPrefix?: boolean,
    showSuffix?: boolean,
    children: number | null
}

export const EffortFormat = ({showPrefix, showSuffix = true, children}: EffortFormatProps) => {

    if (children === null || children === 0.0) {
        return null;
    }

    return (
        <NumericFormat
            value={children}
            className={'font-monospace'}
            thousandSeparator={','}
            prefix={showPrefix ? 'PY ' : ''}
            suffix={showSuffix ? ' PY' : ''}
            displayType={'text'}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    )
}