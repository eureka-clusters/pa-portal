import React, {FC} from 'react';
import NumberFormat from "react-number-format"

interface Props {
    value?: number
}

export const CostsFormat: FC<Props> = (props) => {
    return (
        <NumberFormat
            value={props.value}
            thousandSeparator={' '}
            prefix={'€ '}
            displayType={'text'}
        />
    )
}

export const EffortFormat: FC<Props> = (props) => {
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

export function __delay__(timer: number | undefined) {
    return new Promise<void>(resolve => {
        timer = timer || 2000;
        setTimeout(function () {
            resolve();
        }, timer);
    });
};

